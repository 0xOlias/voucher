// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

struct Voucher {
    address sender;
    address recipient;
    address token;
    uint256 limit;
    bool revoked;
    bool redeemed;
}

contract ERC721Voucher is ReentrancyGuard {
    // // Config
    address private immutable reservoir =
        0x8005488FF4f8982D2D8c1D602e6d747b1428dd41;

    // Storage
    uint256 private voucherId = 0;
    mapping(uint256 => Voucher) private vouchers;

    // Events
    event VoucherCreated(
        uint256 indexed voucherId,
        address indexed sender,
        address indexed recipient,
        address token,
        uint256 limit
    );
    event VoucherRevoked(uint256 indexed voucherId);
    event VoucherRedeemed(
        uint256 indexed voucherId,
        uint256 spent,
        uint256 tokenId
    );

    // Errors
    error VoucherNotOwned();
    error VoucherAlreadyRevoked();
    error VoucherAlreadyRedeemed();
    error PaymentFailed();
    error PurchaseFailed();
    error TokenAlreadyOwned();
    error TokenNotTransferred();

    function createVoucher(address recipient, address token) external payable {
        vouchers[voucherId] = Voucher(
            msg.sender,
            recipient,
            token,
            msg.value,
            false,
            false
        );

        emit VoucherCreated(voucherId, msg.sender, recipient, token, msg.value);
        voucherId++;
    }

    function revokeVoucher(uint256 _voucherId) external nonReentrant {
        if (vouchers[_voucherId].sender != msg.sender) revert VoucherNotOwned();
        if (vouchers[_voucherId].revoked) revert VoucherAlreadyRevoked();
        if (vouchers[_voucherId].redeemed) revert VoucherAlreadyRedeemed();

        (bool success, ) = msg.sender.call{value: vouchers[_voucherId].limit}(
            ""
        );
        if (!success) revert PaymentFailed();

        emit VoucherRevoked(_voucherId);
        vouchers[_voucherId].revoked = true;
    }

    function redeemVoucher(
        uint256 _voucherId,
        uint256 tokenId,
        uint256 fillPrice,
        address reservoirRouterAddress,
        bytes calldata reservoirRouterCalldata
    ) external {
        Voucher memory voucher = vouchers[_voucherId];
        if (voucher.recipient != msg.sender) revert VoucherNotOwned();
        if (voucher.revoked) revert VoucherAlreadyRevoked();
        if (voucher.redeemed) revert VoucherAlreadyRedeemed();

        if (IERC721(voucher.token).ownerOf(tokenId) == msg.sender)
            revert TokenAlreadyOwned();

        (bool success, ) = reservoirRouterAddress.call{value: fillPrice}(
            reservoirRouterCalldata
        );
        if (!success) revert PurchaseFailed();

        if (IERC721(voucher.token).ownerOf(tokenId) != msg.sender)
            revert TokenNotTransferred();

        emit VoucherRedeemed(_voucherId, fillPrice, tokenId);
        vouchers[_voucherId].redeemed = true;
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {SeaportInterface} from "seaport/contracts/interfaces/SeaportInterface.sol";

struct Voucher {
    address sender;
    address recipient;
    address token;
    uint256 limit;
    bool revoked;
    bool redeemed;
}

contract ERC721Voucher is ReentrancyGuard {
    // Config
    SeaportInterface private immutable seaport =
        SeaportInterface(0x00000000006c3852cbEf3e08E8dF289169EdE581);

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

    function redeemVoucher(uint256 _voucherId, uint256 tokenId) external {
        if (vouchers[_voucherId].recipient != msg.sender)
            revert VoucherNotOwned();
        if (vouchers[_voucherId].revoked) revert VoucherAlreadyRevoked();
        if (vouchers[_voucherId].redeemed) revert VoucherAlreadyRedeemed();

        // Call seaport? kek
        uint256 spent = 0;

        emit VoucherRedeemed(_voucherId, spent, tokenId);
        vouchers[_voucherId].redeemed = true;
    }
}

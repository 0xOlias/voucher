// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ERC721Voucher.sol";

contract ERC721VoucherTest is Test {
    ERC721Voucher private voucher;

    address public constant alice = address(1);
    address public constant bob = address(2);
    address public constant charlie = address(3);

    address public constant saudis = 0xe21EBCD28d37A67757B9Bc7b290f4C4928A430b1;
    uint256 public constant tokenId = 2867;

    // Contract events, repeated
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

    function setUp() public {
        voucher = new ERC721Voucher();
    }

    function testCreateVoucher() public {
        vm.startPrank(alice);
        deal(alice, 2e18);

        vm.expectEmit(false, false, false, true, address(voucher));
        emit VoucherCreated(0, alice, bob, saudis, 1e18);
        voucher.createVoucher{value: 1 ether}(bob, saudis);
    }

    function testRedeem() public {
        vm.startPrank(alice);
        deal(alice, 2e18);
        voucher.createVoucher{value: 1 ether}(bob, saudis);
        vm.stopPrank();

        vm.startPrank(bob);
        voucher.redeemVoucher(0, tokenId);
    }
}

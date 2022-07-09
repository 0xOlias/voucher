// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ERC721Voucher.sol";

contract ERC721VoucherTest is Test {
    ERC721Voucher private voucher;

    function setUp() public {
        voucher = new ERC721Voucher();
    }

    // function testTrue() public {
    //     assertEq(0, 0);
    // }
}

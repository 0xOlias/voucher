// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MinimalRouterProxy is ReentrancyGuard {
    // Errors
    error PurchaseFailed();
    error TokenAlreadyOwned();
    error TokenNotTransferred();

    function fillOrderProxy(
        address tokenAddress,
        uint256 tokenId,
        uint256 fillPrice,
        address reservoirRouter,
        bytes memory reservoirRouterData
    ) external {
        // if (IERC721(tokenAddress).ownerOf(tokenId) == msg.sender)
        //     revert TokenAlreadyOwned();

        (bool success, ) = reservoirRouter.call{value: fillPrice}(
            reservoirRouterData
        );
        if (!success) revert PurchaseFailed();

        // if (IERC721(tokenAddress).ownerOf(tokenId) != msg.sender)
        //     revert TokenNotTransferred();
    }
}

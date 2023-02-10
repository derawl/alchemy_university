// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public owner;
    uint256 public costPerCredit;

    constructor() ERC721("AIGEN", "AIG") {
        owner = msg.sender;
        costPerCredit = 0.0003 ether;
    }

    function mint(string memory tokenURI) public {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
    }

    function changeCostPerCredit(uint256 newAmount) public {
        require(msg.sender == owner, "Only onwer allowed");
        costPerCredit = newAmount;
    }

    function changeOwner(address newOwner) public {
        require(msg.sender == owner, "Only onwer allowed");
        owner = newOwner;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function withdraw() public {
        require(msg.sender == owner);
        (bool success, bytes memory data) = owner.call{
            value: address(this).balance
        }("");
        require(success);
    }

    function buyCredits(uint256 number) public payable {
        require(number > 0, "");
        require(
            msg.value >= (number * costPerCredit),
            "Higher amount required"
        );
        emit CreditsPurchased(
            block.timestamp,
            (number * costPerCredit),
            number
        );
    }

    event CreditsPurchased(
        uint256 timestamp,
        uint256 indexed cost,
        uint256 indexed number
    );
    event PriceChange(uint256 cost, uint256 timestamp);
}

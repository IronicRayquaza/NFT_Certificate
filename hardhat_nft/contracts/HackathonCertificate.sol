// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HackathonCertificate is ERC721URIStorage, Ownable {
    uint256 private _tokenIds; 

    
    constructor() ERC721("HackathonCertificate", "HACKCERT") Ownable(msg.sender) {}

   
    function mintCertificate(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }
}

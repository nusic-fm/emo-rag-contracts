// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/Strings.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AIVoiceNFT.sol";


contract AIVoiceNFTFactory is Ownable{
    event AIVoiceNFTDeployed(address _contractAddress, address _owner, string _voiceName, string _name, string _symbol);
    
    address public manager = address(0x07C920eA4A1aa50c8bE40c910d7c4981D135272B);

    modifier onlyOwnerOrManager() {
        require((owner() == msg.sender) || (manager == msg.sender), "Caller needs to be Owner or Manager");
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner){
    }

    function deployAIVoiceNFT(address initialOwner, string memory _voiceName, string memory _name, 
        string memory _symbol, string memory _baseUri) external returns (address) {

        AIVoiceNFT nft = new AIVoiceNFT(initialOwner, _voiceName, _name, _symbol, _baseUri);
        emit AIVoiceNFTDeployed(address(nft), msg.sender, _voiceName, _name, _symbol);
        return address(nft);
    }

    function setManager(address _manager) public onlyOwnerOrManager {
        manager = _manager;
    }
}
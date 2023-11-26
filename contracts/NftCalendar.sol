// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC721/ERC721.sol)

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC721/ERC721.sol";

contract NftCalendar is ERC721{

    uint256 public NORMAL=0;
    uint256 public SPECIAL=1;
    uint256 public PRO=2;
    mapping (uint256 => uint256) public amount_e_round;
    mapping (uint256 => uint256) public amount_n_round;
    mapping (uint256 => uint256) public amount_p_round;
    uint256 public rounds;
    mapping (uint256 => uint256) public borderType;
    mapping (uint256 => mapping(address => uint256)) public claimedPerRound;
    mapping (uint256 => mapping(address => bool)) public hasClaimed;
    mapping (uint256 => string) public ipfsRound;
    mapping (uint256 => uint256) public tokenInRound;
    uint256 public toClaim;
    uint256 public totalSupply;
    uint256 public lastDate;
    uint256 preDateRounds;

    constructor(string memory name_, string memory symbol_, uint256 _pdr) ERC721(name_, symbol_){
        preDateRounds = _pdr;
    }

    function claim() public {
        uint256 claimRound = rounds - 1;
        claim(claimRound);
    }

    function claim(uint256 claimRound) public {
        require(amount_n_round[claimRound]+amount_e_round[claimRound]+amount_p_round[claimRound] > 0, "no tokens available");
        require(hasClaimed[claimRound][msg.sender] == false,"Already claimed");
        hasClaimed[claimRound][msg.sender] = true;
        uint256 rarity = block.timestamp % 10;
        if (rarity < 6 && amount_n_round[claimRound] > 0) {
            borderType[toClaim]=NORMAL;
            amount_n_round[claimRound] -= 1;
        } else if (rarity < 9 && amount_e_round[claimRound] > 0) {
            borderType[toClaim]=SPECIAL;
            amount_e_round[claimRound] -= 1;
        } else if (amount_p_round[claimRound] > 0) {
            borderType[toClaim]=PRO;
            amount_p_round[claimRound] -= 1;
        } else if (amount_e_round[claimRound] > 0) {
            borderType[toClaim]=SPECIAL;
            amount_e_round[claimRound] -= 1;
        } else {
            borderType[toClaim]=NORMAL;
            amount_n_round[claimRound] -= 1;
        }
        tokenInRound[toClaim]=claimRound;
        claimedPerRound[claimRound][msg.sender]=toClaim;
        ERC721._transfer(address(this), msg.sender, toClaim);
        toClaim += 1;
    }

    function mintRound(uint256 _amount_n, uint256 _amount_e, uint256 _amount_p, string memory _ipfs) public {
        require(rounds < 25, "no more rounds");
        amount_n_round[rounds] = _amount_n;
        amount_e_round[rounds] = _amount_e;
        amount_p_round[rounds] = _amount_p;
        uint256 amount = _amount_n+_amount_e+_amount_p+totalSupply;
        for (uint256 i=totalSupply; i<amount; i++) {
            ERC721._mint(address(this),i);
        }
        ipfsRound[rounds] = _ipfs;
        totalSupply = amount;
        lastDate = block.timestamp;
        rounds += 1;
        if(preDateRounds > 0) {
            preDateRounds -= 1;
        }
    }

    function borderToken (uint256 tokenId) public view returns(uint256) {
        return borderType[tokenId];
    }

    function canClaim (address owner) public view returns(bool) {
        bool claimable = false;
        if (claimedPerRound[rounds][owner] != 0) {
            claimable = true;
        }
        return claimable;
    }

    function claimed (uint256 round, address owner) public view returns(bool) {
        bool claimable = false;
        if (claimedPerRound[round][owner] != 0) {
            claimable = true;
        }
        return claimable;
    }

    function availableRoundSupply () public view returns(uint256) {
        return amount_e_round[rounds] + amount_n_round[rounds] + amount_p_round[rounds];
    }

    function amount_e () public view returns(uint256) {
        return amount_e_round[rounds-1];
    }

    function amount_n () public view returns(uint256) {
        return amount_n_round[rounds-1];
    }

    function amount_p () public view returns(uint256) {
        return amount_p_round[rounds-1];
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://api.ipfsbrowser.com/ipfs/get.php?hash=";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);
        string memory baseURI = _baseURI();
        string memory ipfs = ipfsRound[tokenInRound[tokenId]];
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, ipfs)) : "";
    }

    function roundURI(uint256 round) public view returns (string memory) {
        string memory baseURI = _baseURI();
        string memory ipfs = ipfsRound[round];
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, ipfs)) : "";
    }
   
}

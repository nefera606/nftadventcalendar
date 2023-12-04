// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC721/ERC721.sol)

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/utils/Strings.sol";

contract NftCalendar is ERC721, Ownable {

    using Strings for uint256;

    uint256 public COMMON=0;
    uint256 public SPECIAL=1;
    uint256 public PRO=2;
    struct Round {
        uint256 amount_c;
        uint256 amount_s;
        uint256 amount_p;
        uint256 roundSupply;
        string imageUri;
    }
    // 24 for christmas
    mapping (uint256 => Round) public roundInfo;
    // Available rounds
    uint256 public rounds;
    // Account information
    mapping (uint256 => mapping(address => uint256)) public claimedPerRound;
    mapping (uint256 => mapping(address => bool)) public hasClaimed;
    // Token Id related information
    mapping (uint256 => uint256) public tokenInRound;
    mapping (uint256 => uint256) public borderType;
    // Next NFT to be claimed
    uint256 public toClaim;
    uint256 public totalSupply;
    uint256 preMinted;


    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_){
        // 1st december
        _mintRound(60,30,10,"https://criptoadviento.net/api/token/");
        preMint(0,0x03Eb8F20f063add818DA0D2A5A3D9f57E983704B,0);
        preMint(1,0x56E3b31E6531FA1f3f7f122b31C47B5Fbc5582F7,0);
        preMint(1,0x72e857D8EB183e598866Bb61Ac82744F976a659D,0);
        // 2nd december
        _mintRound(60,30,10,"https://criptoadviento.net/api/token/");
        preMint(2,0x03Eb8F20f063add818DA0D2A5A3D9f57E983704B,1);
        preMint(2,0x72e857D8EB183e598866Bb61Ac82744F976a659D,1);
        // 3rd december
        _mintRound(60,30,10,"https://criptoadviento.net/api/token/");
        preMint(0,0x72e857D8EB183e598866Bb61Ac82744F976a659D,2);
        // 4th december
        _mintRound(60,30,10,"https://criptoadviento.net/api/token/");
        // 5th december
        _mintRound(60,30,10,"https://criptoadviento.net/api/token/");
    }

    // Moved to new contract
    function preMint(uint256 _border, address _to, uint256 _round) public onlyOwner {
        require(roundInfo[_round].roundSupply > 0, "Round not exists");
        _claimWithBorder(_round, _to, _border);
    }

    // Simplified calls
    function claim() public {
        uint256 claimRound = rounds - 1;
        _claim(claimRound, msg.sender);
    }

    function claim(uint256 claimRound) public {
        _claim(claimRound, msg.sender);
    }

    function claim(uint256 claimRound, address to) public {
        _claim(claimRound, to);
    }

    // Main interaction, gives a border by chance, if given border is not available, gives next level
    function _claim(uint256 claimRound, address to) internal {
        Round storage round = roundInfo[claimRound];  
        uint256 rarity = block.timestamp % 10;
        uint256 _border;
        if (rarity < 6 && round.amount_c > 0) {
            _border=COMMON;
        } else if (rarity < 9 && round.amount_s > 0) {
            _border=SPECIAL;
        } else if (round.amount_p > 0) {
            _border=PRO;
        } else if (round.amount_s > 0) {
            _border=SPECIAL;
        } else {
            _border=COMMON;
        }
        _claimWithBorder(claimRound, to, _border);
    }

    function _claimWithBorder(uint256 claimRound, address to, uint256 border) internal {
        Round storage round = roundInfo[claimRound];
        require(round.roundSupply > 0, "no tokens available in round");
        require(hasClaimed[claimRound][to] == false,"Already claimed");
        hasClaimed[claimRound][to] = true;
        borderType[toClaim]=border;
        if(border == COMMON) {
            round.amount_c -= 1;
        }
        if(border == SPECIAL) {
            round.amount_s -= 1;
        }
        if(border == PRO) {
            round.amount_p -= 1;
        }
        round.roundSupply -= 1;
        tokenInRound[toClaim]=claimRound;
        claimedPerRound[claimRound][to]=toClaim;
        totalSupply += 1;
        ERC721._mint(to, toClaim);
        toClaim += 1;
    }

    
    function mintBaseRound(string memory _ipfs) public onlyOwner {
        _mintRound(60,30,10,_ipfs);
    }

    function _mintRound(uint256 _amount_c, uint256 _amount_s, uint256 _amount_p, string memory _ipfs) internal onlyOwner {
        require(rounds < 24, "Christmas");
        require(_amount_c + _amount_s + _amount_p == 100, "100 tokens per round");
        roundInfo[rounds] = Round(_amount_c, _amount_s, _amount_p, _amount_c + _amount_s + _amount_p, _ipfs);
        rounds += 1;
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

    // Info retrieve, missmatch for compatibility
    function availableRoundSupply () public view returns(uint256) {
        return roundInfo[rounds-1].roundSupply;
    }

    function amount_e () public view returns(uint256) {
        return roundInfo[rounds-1].amount_s;
    }

    function amount_n () public view returns(uint256) {
        return roundInfo[rounds-1].amount_c;
    }

    function amount_p () public view returns(uint256) {
        return roundInfo[rounds-1].amount_p;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);
        string memory baseURI = _baseURI();
        string memory uri = string(abi.encodePacked(roundURI(tokenInRound[tokenId]), tokenId.toString()));
        return uri;
    }

    function roundURI(uint256 round) public view returns (string memory) {
        string memory baseURI = _baseURI();
        string memory ipfs = roundInfo[round].imageUri;
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, ipfs)) : ipfs;
    }
   
}

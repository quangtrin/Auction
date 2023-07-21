// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract AuctionContract is ERC1155, Ownable, Pausable, ERC1155Supply {
    uint256 public publicPrice = 0.01 ether;

    mapping(uint256 => string) private _uris;
    mapping(uint256 => uint8) private exitsTokenId;
    mapping(uint256 => uint256) private limitAmount;
    mapping(uint256 => uint256) private existsAuctionForToken;
    mapping(uint256 => Token) private tokens;
    mapping(string => uint8) private existsUri;
    uint256[] private tokenIds;
    uint256 private idCount = 0;
    mapping(uint256 => Auction) public auctions;
    uint256 public idAuctionsCount = 0;

    struct Auction {
        uint256 id;
        uint256 tokenId;
        uint256 amount;
        address owner;
        uint256 currentCost;
        address currentBidder;
        uint256 timeStart;
        uint256 timeLimit;
        uint256 timeEnd;
        address[] bidder;
        uint256[] biddingPrice;
        uint8 isEnd;
        mapping(address => uint256) deposits;
    }

    struct Token {
        string name;
        string description;
        string uri;
        uint256 limit;
    }

    constructor() ERC1155("https://ipfs.infura.io:5001") {}

    function totalSupply(
        uint256 id
    ) public view virtual override returns (uint256) {
        uint256 total = super.totalSupply(id);
        for (uint i = 0; i < idAuctionsCount; i++) {
            if (auctions[i].tokenId == id && auctions[i].isEnd == 0) {
                total += auctions[i].amount;
            }
        }
        return total;
    }

    function createAuction(
        uint256 tokenId,
        uint256 amount,
        uint256 currentCost,
        uint256 timeLimitDuration,
        uint256 timeEndDuration
    ) public payable {
        require(exitsTokenId[tokenId] == 1, "Not exits this tokenId");
        require(amount == 1, "amount is not valid");
        require(
            balanceOf(msg.sender, tokenId) > 0,
            "This token does not exist in your wallet"
        );
        require(
            existsAuctionForToken[tokenId] == 0,
            "An auction for this token already exists"
        );
        uint256 currentTime = block.timestamp;
        Auction storage newAuction = auctions[idAuctionsCount];
        _burn(msg.sender, tokenId, amount);
        newAuction.id = idAuctionsCount;
        newAuction.tokenId = tokenId;
        newAuction.amount = amount;
        newAuction.owner = msg.sender;
        newAuction.currentCost = currentCost;
        newAuction.currentBidder = address(0);
        newAuction.timeLimit = currentTime + timeLimitDuration;
        newAuction.timeEnd = currentTime + timeEndDuration;
        newAuction.timeStart = block.timestamp;
        newAuction.isEnd = 0;
        idAuctionsCount++;
        existsAuctionForToken[tokenId] = 1;
    }

    function bid(uint256 idAuction) public payable {
        require(auctions[idAuction].isEnd == 0, "Auction has ended");
        require(
            msg.value > auctions[idAuction].currentCost,
            "Have to pay a higher price"
        );
        require(idAuction < idAuctionsCount, "This auction does not exist");
        require(
            block.timestamp < auctions[idAuction].timeEnd,
            "Auction has ended"
        );
        Auction storage auction = auctions[idAuction];
        refundDeposits(idAuction);
        auction.currentCost = msg.value;
        auction.currentBidder = msg.sender;
        auction.bidder.push(msg.sender);
        auction.biddingPrice.push(msg.value);
        auction.deposits[msg.sender] = msg.value;
    }

    function endAuction(uint256 auctionId) public payable {
        require(auctionId < idAuctionsCount, "Auction does not exist");
        require(auctions[auctionId].isEnd == 0, "This auction has ended");
        require(
            block.timestamp > auctions[auctionId].timeLimit,
            "The minimum time has not been reached to end"
        );
        Auction storage auction = auctions[auctionId];
        require(msg.sender == auction.owner, "You are not owner of this token");
        address winner = auction.currentBidder;
        uint256 winningBid = auction.currentCost;
        if (auction.currentBidder == address(0)) {
            _mint(msg.sender, auction.tokenId, auction.amount, "");
        } else {
            _mint(winner, auction.tokenId, auction.amount, "");
            payable(auction.owner).transfer(winningBid);
        }
        auction.isEnd = 1;
        existsAuctionForToken[auction.tokenId] = 0;
    }

    function refundDeposits(uint256 auctionId) internal {
        Auction storage auction = auctions[auctionId];
        for (uint256 i = 0; i < auction.bidder.length; i++) {
            address bidder = auction.bidder[i];
            uint256 depositAmount = auction.deposits[bidder];
            if (depositAmount > 0) {
                auction.deposits[bidder] = 0;
                payable(bidder).transfer(depositAmount);
            }
        }
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_uris[tokenId]);
    }

    function setTokenUri(
        uint256 tokenId,
        string memory url
    ) internal onlyOwner {
        require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice");
        _uris[tokenId] = url;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function addMint(uint256 id, uint256 amount) public payable onlyOwner {
        require(
            msg.value >= publicPrice * amount,
            "WRONG, Not enough money sent"
        );
        require(exitsTokenId[id] == 1, "Not exits token");
        require(
            totalSupply(id) + amount <= limitAmount[id],
            "You have created more than allowed amount"
        );
        _mint(msg.sender, id, amount, "");
    }

    function newMint(
        uint256 amount,
        uint256 _limit,
        string memory _uri,
        string memory name,
        string memory description
    ) public payable onlyOwner {
        require(
            msg.value >= publicPrice * amount,
            "WRONG, Not enough money sent"
        );
        require(exitsTokenId[idCount] == 0, "Exited token");
        require(amount < _limit, "You have created more than allowed amount");
        require(bytes(_uri).length > 0, "Please add data to this nft");
        require(existsUri[_uri] == 0, "Image existed");
        _mint(msg.sender, idCount, amount, "");
        tokenIds.push(idCount);
        exitsTokenId[idCount] = 1;
        limitAmount[idCount] = _limit;
        setTokenUri(idCount, _uri);
        tokens[idCount].name = name;
        tokens[idCount].description = description;
        tokens[idCount].uri = _uri;
        tokens[idCount].limit = _limit;
        existsUri[_uri] = 1;
        idCount++;
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function getAllTokenId() external view returns (uint256[] memory) {
        return tokenIds;
    }

    function getToken(uint256 tokenId) external view returns (Token memory) {
        return tokens[tokenId];
    }

    function getBidder(
        uint256 auctionId
    ) external view returns (address[] memory) {
        return auctions[auctionId].bidder;
    }

    function getBiddingPrice(
        uint256 auctionId
    ) external view returns (uint256[] memory) {
        return auctions[auctionId].biddingPrice;
    }
}

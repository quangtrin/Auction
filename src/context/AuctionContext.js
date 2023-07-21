import React, { useState, useEffect, useContext } from 'react'
import Web3Modal from "web3modal"
import { ethers } from 'ethers'
// import Router from "next/router"
import axios from 'axios'
import { Buffer } from 'buffer'
import { create as ipfsHttpClient } from 'ipfs-http-client'

import { AuctionContractAddress, AuctionABI } from "./constants"
const auth =
    'Basic ' +
    Buffer.from(
        process.env.REACT_APP_INFURIA_PID + ':' + process.env.REACT_APP_INFURIA_API,
    ).toString('base64')
const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
})

// --- FETCHING SMART CONTRACT
const fetchContract = (signerOfProvider) =>
    new ethers.Contract(
        AuctionContractAddress,
        AuctionABI,
        signerOfProvider
    )

// -- CONNECTING WITH SMART CONTRACT

const connectingWithSmartContract = async () => {
    try {
        const web3Modal = new Web3Modal();
        await web3Modal.connect();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = fetchContract(signer);
        return contract;
    } catch (error) {
        console.log(error);
    }
}

export const AuctionContext = React.createContext();

export const AuctionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const tittle = "hello2"

    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) return console.log("Install MetaMask");
            const accounts = await window.ethereum.request({ method: "eth_accounts", })
            if (accounts.length) {
                setCurrentAccount(accounts[0])
            } else {
                console.log("No Account Found");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // -- CONNECT WALLET
    const connectWallet = async () => {
        try {
            if (!window.ethereum) return console.log("Install MetaMask");
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts", })

            setCurrentAccount(accounts[0])
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
    // -- check owner
    const checkIsOwner = async () => {
        const contract = await connectingWithSmartContract();
        const owner = await contract?.owner();
        setIsOwner(owner.toLowerCase() === currentAccount);
        return owner.toLowerCase() === currentAccount;
    }
    // -- Create new token
    const createToken = async (file, name, amount, limit, description) => {
        const created = await client.add(file)
        const metadataURI = `https://ipfs.io/ipfs/${created.path}`
        const contract = await connectingWithSmartContract();
        const transitions = await contract.newMint(amount, limit, metadataURI, name, description, {
            value: ethers.parseEther("" + (amount * 0.01))
        });
        await transitions.wait();
        window.location.reload();
    }
    // -- Get All Token
    const getAllToken = async () => {
        let allToken = [];
        const contract = await connectingWithSmartContract();
        const allIdToken = await contract.getAllTokenId();
        await Promise.all(
            await allIdToken.map(async (tokenId) => {
                const tokenArray = await contract.getToken(tokenId);
                const tokenOject = {
                    name: tokenArray[0],
                    description: tokenArray[1],
                    uri: tokenArray[2],
                    limit: tokenArray[3],
                    tokenId
                }
                return allToken.push(tokenOject);
            })
        )
        return allToken;
    }
    // -- Get total supply
    const getTotalSupply = async (tokenId) => {
        const contract = await connectingWithSmartContract();
        const total = await contract.totalSupply(tokenId)
        return total
    }
    // -- Add token
    const addToken = async (tokenId, amount) => {
        const contract = await connectingWithSmartContract();
        const transitions = await contract.addMint(tokenId, amount, {
            value: ethers.parseEther("" + (amount * 0.01))
        });
        await transitions.wait();
        window.location.reload();
    }
    // -- Get balance of account
    const getBalanceOf = async (account, tokenId) => {
        const contract = await connectingWithSmartContract();
        const total = await contract.balanceOf(account, tokenId);
        return total;
    }
    // -- Create new auction
    const createAuction = async (tokenId, amount, currentCost, timeLimitDuration, timeEndDuration) => {
        const contract = await connectingWithSmartContract();
        const currentCostFormatEther = ethers.parseEther(currentCost)
        const transitions = await contract.createAuction(tokenId, amount, currentCostFormatEther, timeLimitDuration, timeEndDuration)
        await transitions.wait();
        window.location.reload();
    }
    // -- Get all auction
    const getAllAuction = async () => {
        const contract = await connectingWithSmartContract();
        const length = await contract.idAuctionsCount();
        const auctions = [];
        for (let i = 0; i < length; i++) {
            const auctionArray = await contract.auctions(i);
            const bidder = await contract.getBidder(i);
            const biddingPrice = await contract.getBiddingPrice(i);
            const biddingPriceETH = biddingPrice.map((price) => ethers.formatEther(price));
            const tokenArray = await contract.getToken(auctionArray[1]);
            const tokenOject = {
                name: tokenArray[0],
                description: tokenArray[1],
                uri: tokenArray[2],
                limit: tokenArray[3],
                tokenId: auctionArray[1]
            }
            const auctionOject = {
                id: auctionArray[0],
                amount: auctionArray[2],
                owner: auctionArray[3],
                currentCost: ethers.formatEther(auctionArray[4]),
                currentBidder: auctionArray[5],
                timeStart: Number(auctionArray[6].toString()) * 1000,
                timeLimit: Number(auctionArray[7].toString() * 1000),
                timeEnd: Number(auctionArray[8].toString() * 1000),
                isEnd: auctionArray[9],
                bidder: bidder,
                biddingPrice: biddingPriceETH,
                token: tokenOject
            }
            auctions.push(auctionOject)
        }
        return auctions;
    }
    // -- bid
    const bid = async (auctionId, cost) => {
        const contract = await connectingWithSmartContract();
        const transitions = await contract.bid(auctionId, {
            value: ethers.parseEther(cost)
        })
        await transitions.wait();
        window.location.reload()
    }
    // --End Auction
    const endAuction = async (auctionId) => {
        const contract = await connectingWithSmartContract();
        const transitions = await contract.endAuction(auctionId);
        await transitions.wait();
        window.location.reload();
    }

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    useEffect(() => {
        if (currentAccount) checkIsOwner();
    }, [currentAccount]);

    return (
        <AuctionContext.Provider
            value={{
                tittle,
                checkIfWalletConnected,
                currentAccount,
                isOwner,
                connectWallet,
                checkIsOwner,
                createToken,
                getAllToken,
                getTotalSupply,
                addToken,
                getBalanceOf,
                createAuction,
                getAllAuction,
                bid,
                endAuction
            }}
        >
            {children}
        </AuctionContext.Provider>
    )
}
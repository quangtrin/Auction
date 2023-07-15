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
            const accounts = await window.ethereum.request({ method: "eth_requestAccount", })

            setCurrentAccount(accounts[0])
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
    // -- 

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    return (
        <AuctionContext.Provider
            value={{
                tittle,
                checkIfWalletConnected
            }}
        >
            {children}
        </AuctionContext.Provider>
    )
}
import React, {useState, useEffect, useContext} from 'react'
import web3Modal from "web3modal"
import { ethers } from 'ethers'
// import Router from "next/router"

import {AuctionContractAddress, AuctionABI} from "./constants"

export const AuctionContext = React.createContext();

export const AuctionProvider = ({children}) => {
    const tittle = "hello2"
    return (
        <AuctionContext.Provider value={{tittle}}>
            {children}
        </AuctionContext.Provider>
    )
}
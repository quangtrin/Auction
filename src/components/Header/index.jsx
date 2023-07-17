import React, { useState, useContext } from "react";
import { HeaderStyles } from "./style";
import { Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";

import logo from "../../imgs/logo.jpg";
import { AuctionContext } from "../../context/AuctionContext";

const Header = () => {
  const navigation = useNavigate();
  const { currentAccount, connectWallet } = useContext(AuctionContext);
  const [current, setCurrent] = useState("auctions");
  const items = [
    {
      label: "Auctions",
      key: "auctions",
    },
    {
      label: "History",
      key: "history",
    },
    {
      label: "My collection",
      key: "myCollection",
    },
  ];
  const classes = HeaderStyles();

  const menuChange = (e) => {
    navigation("/" + e.key);
    setCurrent(e.key)
  }
  return (
    <div className={classes.layoutHeader}>
      <div className={classes.layoutLogo}>
        <img src={logo} alt="" width={"40px"} />
        <span style={{ margin: "10px", fontWeight: "800", fontSize: "19px" }}>
          Auction collection
        </span>
      </div>
      <div className={classes.layoutMenu}>
        <Menu
          onClick={menuChange}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
      </div>
      <div className={classes.layoutBtnConnect}>
        {currentAccount ? (
          <div className={classes.currentAccount}>{currentAccount}</div>
        ) : (
          <Button onClick={() => connectWallet()} type="primary">
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;

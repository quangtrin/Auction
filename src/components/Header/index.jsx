import React, { useState, useContext, useEffect } from "react";
import { HeaderStyles } from "./style";
import { Button, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import logo from "../../imgs/logo.jpg";
import { AuctionContext } from "../../context/AuctionContext";
import { truncate } from "../../Global";

const Header = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const { currentAccount, connectWallet, isOwner } =
    useContext(AuctionContext);
  const [current, setCurrent] = useState("auctions");
  // const [isOwner, setIsOwner] = useState(false);
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
  const itemsAdmin = [
    {
      label: "All Token",
      key: "allToken",
    },
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
    setCurrent(e.key);
  };
  useEffect(() => {
    if (location.pathname === "/auctions") {
      setCurrent("auctions");
    } else if (location.pathname === "/myCollection") {
      setCurrent("myCollection");
    } else if (location.pathname === "/allToken") {
      setCurrent("allToken");
    }
  }, [location]);
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
          items={isOwner ? itemsAdmin : items}
          style={{justifyContent: "end"}}
        />
      </div>
      <div className={classes.layoutBtnConnect}>
        {currentAccount ? (
          <div className={classes.currentAccount}>{truncate(currentAccount, 5,5,13)}</div>
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

import React, { useState } from "react";
import { HeaderStyles } from "./style";
import { Menu } from "antd";

const Header = () => {
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
  return (
    <div className={classes.layoutHeader}>
      <div className={classes.layoutLogo}>
        abc
      </div>
      <div className={classes.layoutMenu}>
        <Menu selectedKeys={[current]} mode="horizontal" items={items} />
      </div>
    </div>
  );
};

export default Header;

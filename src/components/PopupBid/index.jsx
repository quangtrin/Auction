import React, { useState, useContext } from "react";
import { Input, Button } from "antd";
import { AuctionContext } from "../../context/AuctionContext";
import { messageSwal } from "../../Global";

const PopupBid = ({ auction }) => {
  const { bid } = useContext(AuctionContext);
  const [price, setPrice] = useState();
  const handleOk = async () => {
    try {
      await bid(auction.id, price);
      messageSwal("Successlly bided", true);
    } catch (error) {
      messageSwal(error.reason, false);
    }
  };
  return (
    <div style={{ display: "flex" }}>
      <Input
        placeholder="Price"
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        style={{ marginRight: "5px" }}
      />
      <Button onClick={handleOk} type="primary">
        OK
      </Button>
    </div>
  );
};

export default PopupBid;

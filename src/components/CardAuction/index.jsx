import React, { useContext, useState, useEffect } from "react";
import { Card, Tooltip, Popover } from "antd";
import { RiseOutlined, SendOutlined, MenuOutlined } from "@ant-design/icons";
import { CardAuctionStyles } from "./style";
import { truncate, formatDate } from "../../Global";
import PopupBid from "../PopupBid";
import { AuctionContext } from "../../context/AuctionContext";
import { messageSwal } from "../../Global";
import ModalHistoryBid from "../ModalHistoryBid";

const CardAuction = ({ auction, isOwner, isEdit }) => {
  const { endAuction } = useContext(AuctionContext);
  const classes = CardAuctionStyles();
  const [isOpenHistoryBid, setIsOpenHistoryBid] = useState(false);
  const [historyBid, setHistoryBid] = useState([]);
  const handleEnd = async () => {
    try {
      await endAuction(auction.id);
      messageSwal("Ended", true);
    } catch (error) {
      messageSwal(error.reason, false);
    }
  };
  const fetchData = () => {
    const bidder = auction.bidder;
    const biddingPrice = auction.biddingPrice;
    const length = auction.bidder.length;
    const historyBid = [];
    for (let i = 0; i < length; i++) {
      historyBid.push({ bidder: bidder[i], biddingPrice: biddingPrice[i] });
    }
    setHistoryBid(historyBid.reverse());
  };
  useEffect(() => {
    if (auction) fetchData();
  }, [auction]);
  const myAuctionsCardAction = [
    <Popover content={<PopupBid auction={auction} />} trigger={"click"}>
      <Tooltip title="Bid">
        <RiseOutlined key={"bid"} />
      </Tooltip>
    </Popover>,
    <Tooltip title="Price closing">
      <SendOutlined key={"end"} onClick={handleEnd} />
    </Tooltip>,
    <Tooltip title="History bided">
      <MenuOutlined
        key={"historyBid"}
        onClick={() => setIsOpenHistoryBid(true)}
      />
    </Tooltip>,
  ];
  const otherAuctionCardAction = [
    <Popover content={<PopupBid auction={auction} />} trigger={"click"}>
      <Tooltip title="Bid">
        <RiseOutlined key={"bid"} />
      </Tooltip>
    </Popover>,
    <Tooltip title="History bided">
      <MenuOutlined
        key={"historyBid"}
        onClick={() => setIsOpenHistoryBid(true)}
      />
    </Tooltip>,
  ];
  const notEditCardAction = [
    <Tooltip title="History bided">
      <MenuOutlined
        key={"historyBid"}
        onClick={() => setIsOpenHistoryBid(true)}
      />
    </Tooltip>,
  ];
  return (
    <>
      <div>
        <Card
          hoverable
          style={{
            width: 280,
            cursor: "auto",
            marginBottom: "20px",
          }}
          cover={<img alt={auction.token.name} src={auction.token.uri} />}
          actions={
            isEdit
              ? isOwner
                ? myAuctionsCardAction
                : otherAuctionCardAction
              : notEditCardAction
          }
        >
          <div className={classes.owner}>
            <span style={{ fontWeight: "600" }}>Owner: </span>
            {truncate(auction.owner, 4, 4, 11)}
          </div>
          <div className={classes.currentBidder}>
            <span style={{ fontWeight: "600" }}>Current highest bidder: </span>
            {truncate(auction.currentBidder, 4, 4, 11)}
          </div>
          <div className={classes.currentCost}>
            <span style={{ fontWeight: "600" }}>Current highest cost: </span>
            {auction.currentCost} ETH
          </div>
          <div className={classes.timeStart}>
            <span style={{ fontWeight: "600" }}>Start: </span>
            {formatDate(new Date(Number(auction.timeStart.toString())))}
          </div>
          <div className={classes.timeLimit}>
            <span style={{ fontWeight: "600" }}>Time limit: </span>
            {formatDate(new Date(Number(auction.timeLimit.toString())))}
          </div>
          <div
            className={classes.timeEnd}
            style={
              Date.now() > Number(auction.timeEnd.toString())
                ? { color: "red" }
                : null
            }
          >
            <span style={{ fontWeight: "600" }}>Time end: </span>
            {formatDate(new Date(Number(auction.timeEnd.toString())))}
          </div>
        </Card>
      </div>
      {isOpenHistoryBid && (
        <ModalHistoryBid
          isOpen={isOpenHistoryBid}
          setIsOpen={setIsOpenHistoryBid}
          historyBid={historyBid}
        />
      )}
    </>
  );
};

export default CardAuction;

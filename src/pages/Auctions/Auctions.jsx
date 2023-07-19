import React, { useContext, useEffect, useState } from "react";
import CardAuction from "../../components/CardAuction";
import { Row, Col, Button } from "antd";
import { AuctionContext } from "../../context/AuctionContext";

const Auctions = () => {
  const { getAllAuction, currentAccount } = useContext(AuctionContext);
  const [auctions, setAuctions] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  const [otherAuctions, setOtherAuctions] = useState([]);
  const [myAuctionCountMax, setMyAuctionCountMax] = useState(4);
  const [otherAuctionCountMax, setOtherAuctionCountMax] = useState(4);
  const getAuctions = async () => {
    const auctions = await getAllAuction();
    const myAuctions = auctions.filter(
      (auction) =>
        currentAccount === auction.owner.toLowerCase() &&
        Number(auction.isEnd) === 0
    );
    const otherAuctions = auctions.filter(
      (auction) =>
        currentAccount !== auction.owner.toLowerCase() &&
        Number(auction.isEnd) === 0
    );
    setAuctions(auctions);
    setMyAuctions(myAuctions.reverse());
    setOtherAuctions(otherAuctions.reverse());
  };
  useEffect(() => {
    if (currentAccount) getAuctions();
  }, [currentAccount]);
  return (
    <div>
      <h2
        style={{
          background:
            "linear-gradient(to right, rgb(189, 195, 199), rgb(247 247 247))",
          padding: "5px 10px",
          borderRadius: "2px",
        }}
      >
        My auctions
      </h2>
      <Row gutter={[16, 24]}>
        {myAuctions.map((auction, index) => {
          if (index < myAuctionCountMax)
            return (
              <Col key={auction.id} span={6}>
                <CardAuction auction={auction} isOwner={true} isEdit={true} />
              </Col>
            );
        })}
      </Row>
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          onClick={() => setMyAuctionCountMax(myAuctionCountMax + 4)}
        >
          See more
        </Button>
      </div>
      <h2
        style={{
          background:
            "linear-gradient(to right, rgb(189, 195, 199), rgb(247 247 247))",
          padding: "5px 10px",
          borderRadius: "2px",
        }}
      >
        Other auctions
      </h2>
      <Row gutter={[16, 24]}>
        {otherAuctions.map(
          (auction, index) =>
            index < otherAuctionCountMax && (
              <Col key={auction.id} span={6}>
                <CardAuction auction={auction} isOwner={false} isEdit={true} />
              </Col>
            )
        )}
      </Row>
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          onClick={() => setOtherAuctionCountMax(otherAuctionCountMax + 4)}
        >
          See more
        </Button>
      </div>
    </div>
  );
};

export default Auctions;

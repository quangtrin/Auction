import React, { useContext, useEffect, useState } from "react";
import CardAuction from "../../components/CardAuction";
import { Row, Col } from "antd";
import { AuctionContext } from "../../context/AuctionContext";

const History = () => {
  const { getAllAuction, currentAccount } = useContext(AuctionContext);
  const [auctions, setAuctions] = useState([]);
  const getAuctions = async () => {
    const auctions = await getAllAuction();
    setAuctions(auctions.reverse());
  };
  useEffect(() => {
    if (currentAccount) getAuctions();
  }, [currentAccount]);
  return (
    <div>
      <Row gutter={[16, 24]}>
        {auctions.map(
          (auction) =>
            Number(auction.isEnd) === 1 && (
              <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
                <CardAuction auction={auction} isEdit={false}/>
              </Col>
            )
        )}
      </Row>
    </div>
  );
};

export default History;

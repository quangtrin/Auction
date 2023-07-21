import React, { useState, useContext, useEffect } from "react";
import CardToken from "../../components/CardToken";
import { Row, Col } from "antd";
import { AuctionContext } from "../../context/AuctionContext";

const MyCollection = () => {
  const { getAllToken, getBalanceOf, currentAccount } =
    useContext(AuctionContext);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const getDataToken = async () => {
    setLoading(true);
    const allToken = await getAllToken();
    const allTokenAndTotal = [];
    await Promise.all(
      await allToken.map(async (token) => {
        const total = await getBalanceOf(currentAccount, token.tokenId);
        allTokenAndTotal.push({ ...token, total });
      })
    );
    setTokens(allTokenAndTotal);
    setLoading(false);
  };
  useEffect(() => {
    if (currentAccount) getDataToken();
  }, [currentAccount]);
  return (
    !loading && (
      <div>
        <Row gutter={[16, 24]}>
            {tokens?.map((token, index) => {
              if(Number(token.total.toString()) > 0)
              return (
                <Col key={index} span={6} style={{ display: 'flex', justifyContent: 'center' }}>
                  <CardToken token={token} isOwner={false} />
                </Col>
              );
            })}
        </Row>
      </div>
    )
  );
};

export default MyCollection;

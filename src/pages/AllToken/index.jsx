import React, { useState, useContext, useEffect } from "react";
import CardToken from "../../components/CardToken";
import { Row, Col, Button } from "antd";
import { AllTokenStyles } from "./style";
import ModalCreateToken from "../../components/ModalCreateToken";
import { AuctionContext } from "../../context/AuctionContext";
import { useNavigate } from "react-router-dom";

const AllToken = () => {
  const classes = AllTokenStyles();
  const navigation = useNavigate();
  const { getAllToken, getTotalSupply, currentAccount, checkIsOwner } =
    useContext(AuctionContext);
  const [isOpen, setIsOpen] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDataToken = async () => {
    setLoading(true);
    const allToken = await getAllToken();
    const allTokenAndTotal = [];
    await Promise.all(
      await allToken.map(async (token) => {
        const total = await getTotalSupply(token.tokenId);
        allTokenAndTotal.push({ ...token, total });
      })
    );
    setTokens(allTokenAndTotal);
    setLoading(false);
  };
  

  const checkOwner = async () => (await checkIsOwner())
  useEffect(() => {
    if (currentAccount) {
      getDataToken();
      if (!checkOwner()) {
        navigation("/auctions");
      }
    }
  }, [currentAccount]);
  return (
    !loading && (
      <div>
        <div className={classes.btnNewToken}>
          <Button onClick={() => setIsOpen(true)} type="primary">
            Create new token
          </Button>
          {isOpen && <ModalCreateToken isOpen={isOpen} setIsOpen={setIsOpen} />}
        </div>
        <Row gutter={[16, 8]}>
          {tokens?.map((token, index) => {
            return (
              <Col key={index} span={6} style={{ display: 'flex', justifyContent: 'center' }}>
                <CardToken token={token} isOwner={true} />
              </Col>
            );
          })}
        </Row>
      </div>
    )
  );
};

export default AllToken;

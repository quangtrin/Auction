import React from "react";
import CardAuction from "../../components/CardAuction";
import { Row, Col } from "antd";

const Auctions = () => {
  return (
    <div>
      <Row gutter={[16, 24]}>
        <Col span={6}>
          <CardAuction />
        </Col>
        <Col span={6}>
          <CardAuction />
        </Col>
        <Col span={6}>
          <CardAuction />
        </Col>
        <Col span={6}>
          <CardAuction />
        </Col>
        <Col span={6}>
          <CardAuction />
        </Col>
        <Col span={6}>
          <CardAuction />
        </Col>
        <Col span={6}>
          <CardAuction />
        </Col>
        <Col span={6}>
          <CardAuction />
        </Col>
        <Col span={6}>
          <CardAuction />
        </Col>
      </Row>
    </div>
  );
};

export default Auctions;

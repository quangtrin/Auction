import React from "react";
import { Card, Popover, Tooltip } from "antd";
import { CardTokenStyles } from "./style";
import { PlusOutlined, DollarOutlined } from "@ant-design/icons";
import PopupAddToken from "../PopupAddToken";
import PopupCreateAution from "../PopupCreateAuction";

const { Meta } = Card;

const CardToken = ({ token, isOwner }) => {
  const classes = CardTokenStyles();
  return (
    <div>
      <Card
        hoverable
        style={{ width: 260, cursor: "auto" }}
        cover={<img alt={token.name} src={token.uri} />}
        bodyStyle={{ padding: "15px" }}
        actions={[
          isOwner ? (
            <Popover
              content={<PopupAddToken token={token} />}
              trigger={"click"}
            >
              <Tooltip title="Add this token">
                <PlusOutlined key="addAmount" />
              </Tooltip>
            </Popover>
          ) : (
            <Popover
              content={<PopupCreateAution token={token} />}
              trigger={"click"}
            >
              <Tooltip title="Sell and create new auction">
                <DollarOutlined key="sell" />
              </Tooltip>
            </Popover>
          ),
        ]}
      >
        <div className={classes.tokenName}>{token.name}</div>
        <div className={classes.amount}>
          <span style={{ fontWeight: "700" }}>Amount: </span>
          {token.total.toString()}
        </div>
        <div className={classes.limitAmount}>
          <span style={{ fontWeight: "700" }}>Limit: </span>
          {token.limit.toString()}
        </div>
        <Tooltip title={token.description} placement="right" trigger={"click"}>
          <div className={classes.tokenDes}>{token.description}</div>
        </Tooltip>
      </Card>
    </div>
  );
};

export default CardToken;

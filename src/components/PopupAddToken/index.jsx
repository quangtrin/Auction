import React, { useContext, useState } from "react";
import { Input, Button, Tooltip } from "antd";
import { AuctionContext } from "../../context/AuctionContext";
import { messageSwal } from "../../Global";

const formatNumber = (value) => new Intl.NumberFormat().format(value);
const NumericInput = (props) => {
  const { value, onChange } = props;
  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
  };

  const title = value ? (
    <span className="numeric-input-title">
      {value !== "-" ? formatNumber(Number(value)) : "-"}
    </span>
  ) : (
    "Input a number"
  );
  return (
    <Tooltip
      trigger={["focus"]}
      title={title}
      placement="topLeft"
      overlayClassName="numeric-input"
    >
      <Input
        {...props}
        onChange={handleChange}
        placeholder="Enter the amount you want to add"
        maxLength={16}
        type="number"
      />
    </Tooltip>
  );
};

const PopupAddToken = ({ token }) => {
  const { addToken } = useContext(AuctionContext);
  const [amount, setAmount] = useState();
  const handleOk = async () => {
    try {
      await addToken(token.tokenId, amount);
      messageSwal("Successlly added", true);
    } catch (error) {
      messageSwal(error.reason, false);
    }
  };
  return (
    <div style={{ display: "flex" }}>
      <NumericInput
        onChange={setAmount}
        value={amount}
        style={{ marginRight: "10px" }}
      />
      <Button type="primary" onClick={handleOk}>
        OK
      </Button>
    </div>
  );
};

export default PopupAddToken;

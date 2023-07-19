import React, { useContext, useState } from "react";
import { Button, Form, Input } from "antd";
import { AuctionContext } from "../../context/AuctionContext";
import { messageSwal } from "../../Global";
function parseAuctionDuration(durationString) {
  const pattern = /(\d+)([wdhm])/g;
  const results = [];
  let match;
  while ((match = pattern.exec(durationString))) {
    const value = parseInt(match[1]);
    const unit = match[2];
    let duration;
    switch (unit) {
      case "w":
        duration = value * 7 * 24 * 60 * 60;
        break;
      case "d":
        duration = value * 24 * 60 * 60;
        break;
      case "h":
        duration = value * 60 * 60;
        break;
      case "m":
        duration = value * 60;
        break;
      default:
        duration = 0;
        break;
    }
    results.push(duration);
  }
  const totalDuration = results.reduce((acc, cur) => acc + cur, 0);
  return totalDuration;
}

function isValidAuctionDuration(durationString) {
  const pattern = /^(\d+[wdhm],?\s?)+$/;
  if (!pattern.test(durationString)) {
    return false;
  }
  const shorthandPattern = /(\d+)([wdhm])/g;
  let match;
  while ((match = shorthandPattern.exec(durationString))) {
    const value = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
      case "w":
      case "d":
      case "h":
      case "m":
        if (value <= 0) {
          return false;
        }
        break;
      default:
        return false;
    }
  }
  return true;
}

const PopupCreateAution = ({ token }) => {
  const { createAuction } = useContext(AuctionContext);
  const [form] = Form.useForm();
  const [loading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    const timeEnd = form.getFieldValue("timeEnd");
    const timeLimit = form.getFieldValue("timeLimit");
    const cost = form.getFieldValue("defaultCost");
    if (!isValidAuctionDuration(timeEnd)) {
      messageSwal("time end is not valid", false);
      return;
    }
    if (!isValidAuctionDuration(timeLimit)) {
      messageSwal("time limit is not valid", false);
      return;
    }
    if (cost < 0) {
      messageSwal("default cost is not valid", false);
      return;
    }
    const timeEndDuration = parseAuctionDuration(timeEnd);
    const timeLimitDuration = parseAuctionDuration(timeLimit);
    try {
      await createAuction(
        token.tokenId,
        1,
        cost,
        timeLimitDuration,
        timeEndDuration
      );
      messageSwal("Successlly created", true);
    } catch (error) {
      messageSwal(error.reason, false);
    }
    setIsLoading(false);
  };
  return (
    <div>
      <Form form={form}>
        <Form.Item
          label="Default cost"
          name="defaultCost"
          rules={[{ required: true, message: "Please input default cost" }]}
        >
          <Input placeholder="Default cost" type="number" />
        </Form.Item>
        <Form.Item
          label="Time limit"
          name="timeLimit"
          rules={[{ required: true, message: "Please input time limit" }]}
        >
          <Input placeholder="Example: 1d, 1w, 1h" />
        </Form.Item>
        <Form.Item
          label="Time end"
          name="timeEnd"
          rules={[{ required: true, message: "Please input time end" }]}
        >
          <Input placeholder="Example: 1d, 1w, 1h" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PopupCreateAution;

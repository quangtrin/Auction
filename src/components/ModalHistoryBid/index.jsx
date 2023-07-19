import React, { useEffect, useState } from "react";
import { List, Modal } from "antd";

const ModalHistoryBid = ({ isOpen, setIsOpen, historyBid }) => {
  return (
    <div>
      <Modal
        title="History bided"
        onCancel={() => setIsOpen(false)}
        open={isOpen}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        style={{paddingBottom: 0}}
      >
        <List
          bordered
          dataSource={historyBid}
          renderItem={(item) => (
            <List.Item>{`${item.bidder} ( ${item.biddingPrice} ETH )`}</List.Item>
          )}
          pagination={{
            pageSize: 5,
          }}
        />
      </Modal>
    </div>
  );
};

export default ModalHistoryBid;

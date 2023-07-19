import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AuctionContext } from "../../context/AuctionContext";
import { messageSwal } from "../../Global";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ModalCreateToken = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { createToken } = useContext(AuctionContext);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [file, setFile] = useState();
 
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    setIsOpen(false);
  };
  const handleChange = (info) => {
    setFileList(info.fileList);
  };
  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const submitForm = async (e) => {
    setLoading(true)
    const tokenName = form.getFieldValue("tokenName")
    const amount = form.getFieldValue("amount");
    const amountLimit = form.getFieldValue("amountLimit")
    const description = form.getFieldValue("description")
    try {
      await createToken(file, tokenName, amount, amountLimit, description);
    } catch (error) {
      messageSwal(error.reason, false)
    }
    setLoading(false)
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        title="Create token"
        open={isOpen}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
        style={{ top: 20 }}
      >
        <Form
          name="createToken"
          layout="vertical"
          form={form}
          onFinish={submitForm}
        >
          <Form.Item
            label="Image"
            name="tokenImage"
            rules={[{ required: true, message: "Please input token image" }]}
          >
            <div style={{ textAlign: "center" }}>
              <Upload
                listType="picture-card"
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImage}
                />
              </Modal>
            </div>
          </Form.Item>
          <Form.Item
            label="Token name"
            name="tokenName"
            rules={[{ required: true, message: "Please input token name" }]}
          >
            <Input placeholder="Token name" />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please input amount" }]}
          >
            <Input placeholder="Amount" />
          </Form.Item>
          <Form.Item
            label="Amount limit"
            name="amountLimit"
            rules={[{ required: true, message: "Please input amount limit" }]}
          >
            <Input placeholder="This value will not be changed in the future" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModalCreateToken;

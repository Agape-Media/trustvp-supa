import React, { useState } from "react";
import { states } from "../../utils/selections";
import { TrustButton } from "../pageUtils";

import { Form, Modal, Input, Select, AutoComplete } from "antd";

const { Option } = Select;

export default function NewLocationModal({
  visible,
  onOk,
  onCancel,
  newLocationSubmit,
}) {
  return (
    <>
      <Modal
        // title="New Location"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        footer={null}
        preserve={false}
        destroyOnClose={true}
      >
        <Form
          requiredMark={true}
          layout="vertical"
          name="newLocation"
          onFinish={newLocationSubmit}
        >
          <p className="text-2xl font-bold">New Location</p>

          <div className="w-full mt-5">
            <Form.Item
              label={<Label>Location Name</Label>}
              name="name"
              rules={[{ required: true, message: "Enter Location Name." }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="w-full mt-5">
            <Form.Item
              label={<Label>Street Address</Label>}
              name="street"
              rules={[{ required: true, message: "Enter Street Name." }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="col-span-1">
              <Form.Item
                label={<Label>City</Label>}
                name="city"
                rules={[{ required: true, message: "Enter City." }]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item
                label={<Label>State</Label>}
                name="state"
                rules={[
                  {
                    required: true,
                    message: "Select State.",
                  },
                ]}
              >
                <Select showSearch optionFilterProp="children">
                  {states.map((state, i) => (
                    <Option key={i} value={state.name}>
                      {state.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item
                label={<Label>Zip</Label>}
                name="zip"
                rules={[{ required: true, message: "Enter Zip." }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <TrustButton
              htmlType="submit"
              label="Save"
              buttonClass="bg-trustBlue mx-auto w-80 h-12 mt-4"
            />
          </Form.Item>
        </Form>{" "}
      </Modal>
    </>
  );
}

const Label = ({ children }) => (
  <p className="text-sm text-medium font-bold">{children}</p>
);

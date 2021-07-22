import React, { useState, useEffect } from "react";
import { Modal, Divider, Skeleton, Form, InputNumber, Button } from "antd";
import { TrustButton } from "../pageUtils";
import Pin from "../Icons/Pin";
import Calendar from "../Icons/Calendar";
import numeral from "numeral";
import moment from "moment";
import { useRouter } from "next/router";

export default function SlotInfoModal({
  visible,
  onCancel,
  activeSlot,
  event,
}) {
  const router = useRouter();
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    setSlot(activeSlot);
  }, [activeSlot]);

  const onFinish = (values) => {
    console.log(values);

    const createCheckoutSession = async () => {
      var quantity = values.quantity;

      // The account selected in the UI and the one that we'll pass as the
      // Stripe-Account header on the server side.
      // var account = document.querySelector("#enabled-accounts-select").value;
      const account = "acct_1JG8ClR17Mj2hTvI";

      const result = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          price: slot?.price,
          account,
          eventID: "950a356b-86d2-4114-931f-6de91a8a70b1",
          website: "websitehere",
        }),
      });

      const { session } = await result.json();
      router.push(session.url);

      return { session, account };
    };
    createCheckoutSession();
  };
  return (
    <>
      <Modal
        destroyOnClose={true}
        className="rounded-xl"
        visible={visible}
        onCancel={onCancel}
        footer={null}
        closable={false}
      >
        {slot?.id && event?.id ? (
          <>
            <div className="px-4 bg-gray-100s">
              <Divider />
              <div className="flex justify-between text-trustBlue text-xl">
                <p>{event?.name}</p>
                <p>{numeral(slot?.price).format("$0,0.00")}</p>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex items-center">
                  <Pin className="-ml-1 w-5 h-5 text-gray-600" />
                  <TicketInfo info={event?.locations.name} />
                </div>
                <div className="flex items-center">
                  <TicketInfo
                    info={`${moment(slot?.startTime, "HH:mm").format(
                      "h:mm a"
                    )} -
                  ${moment(slot?.endTime, "HH:mm").format("h:mm a")}`}
                  />
                </div>
                <div className="flex items-center">
                  <Calendar className="text-gray-600" />
                  <TicketInfo info={moment(slot?.date).format("D MMM, YYYY")} />
                </div>
              </div>
            </div>
            <Divider />

            <Form
              name="rsvp-tickets"
              onFinish={onFinish}
              preserve={false}
              requiredMark={false}
              // action="/api/create-checkout-session"
              // method="POST"
            >
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber min={1} max={slot?.occupants} className="w-full" />
              </Form.Item>

              <TrustButton
                form={{ type: "primary", htmlType: "submit" }}
                buttonClass="bg-trustBlue w-48 mx-auto hover:opacity-80 transition duration-300 ease-in-out mt-8"
                label="Buy Now!"
              />
            </Form>
          </>
        ) : (
          <Skeleton active />
        )}
      </Modal>
    </>
  );
}

const TicketInfo = ({ info }) => (
  <p className="text-gray-600 text-sm">{info}</p>
);

import React, { useState, useEffect } from "react";
import { Modal, Divider, Skeleton } from "antd";
import { TrustButton } from "../pageUtils";
import Pin from "../Icons/Pin";
import Calendar from "../Icons/Calendar";
import numeral from "numeral";
import moment from "moment";

export default function SlotInfoModal({
  visible,
  onCancel,
  activeSlot,
  event,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    setSlot(activeSlot);
  }, [activeSlot]);
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
            <TrustButton
              buttonClass="bg-trustBlue w-48 mx-auto hover:opacity-80 transition duration-300 ease-in-out mt-8"
              label="Buy Now!"
            />
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

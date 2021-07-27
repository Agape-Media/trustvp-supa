import React from "react";
import { TrustButton } from "../pageUtils";

import { Modal } from "antd";

export default function DeleteLocationsModal({
  visible,
  onCancel,
  deleteEvent,
  data,
}) {
  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={null}
        preserve={false}
        destroyOnClose={true}
      >
        <p>
          Are you sure you want to delete{" "}
          <span className="font-bold">
            {data?.name || data?.newEventForm?.name}
          </span>{" "}
          from your events?
        </p>
        <div className="flex items-center space-x-4">
          <TrustButton
            onClick={onCancel}
            label="Cancel"
            buttonClass="bg-trustBlue mx-auto w-80 h-12 mt-4"
          />
          <TrustButton
            onClick={() => deleteEvent(data.id)}
            label="Delete Event"
            buttonClass="bg-red-600 mx-auto w-80 h-12 mt-4"
          />
        </div>
      </Modal>
    </>
  );
}

const Label = ({ children }) => (
  <p className="text-sm text-medium font-bold">{children}</p>
);

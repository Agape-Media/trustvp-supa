import React from "react";
import { TrustButton } from "../pageUtils";

import { Modal } from "antd";

export default function DeleteLocationsModal({
  visible,
  onCancel,
  deleteLocation,
  selectedLocation,
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
          <span className="font-bold">{selectedLocation?.name}</span> from your
          locations?
        </p>
        <div className="flex items-center space-x-4">
          <TrustButton
            onClick={onCancel}
            label="Cancel"
            buttonClass="bg-trustBlue mx-auto w-80 h-12 mt-4"
          />
          <TrustButton
            onClick={() => deleteLocation(selectedLocation.id)}
            label="Delete Location"
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

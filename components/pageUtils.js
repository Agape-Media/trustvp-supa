import React, { forwardRef } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const TrustButton = forwardRef(
  ({ onClick, href, label, buttonClass, disabled }, ref) => {
    return (
      <button
        disabled={disabled}
        href={href}
        onClick={onClick}
        ref={ref}
        className={`px-4 py-2 rounded-lg shadow-sm focus:outline-none text-white text-sm flex items-center justify-center ${buttonClass}`}
      >
        {label}
      </button>
    );
  }
);

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const Card = ({ children }) => <div>{children}</div>;

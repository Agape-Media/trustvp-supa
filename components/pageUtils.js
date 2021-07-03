import React, { forwardRef } from "react";

export const TrustButton = forwardRef(
  ({ onClick, href, label, buttonClass }, ref) => {
    return (
      <button
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

export const Card = ({ children }) => <div>{children}</div>;

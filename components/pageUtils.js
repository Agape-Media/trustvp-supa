import React, { forwardRef } from "react";

export const TrustButton = forwardRef(
  ({ onClick, href, label, buttonClass, disabled, form }, ref) => {
    return (
      <button
        {...form}
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

export const Panel = ({ children }) => (
  <div className="w-full bg-white rounded-2xl px-8 py-16">
    <div className="grid place-items-center space-y-2">{children}</div>
  </div>
);

export const Card = ({ children }) => <div>{children}</div>;

export const Spinner = () => {
  return (
    <div className="grid h-screen place-items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400" />
    </div>
  );
};

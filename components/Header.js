import React from "react";

const Header = ({ title, subtitle }) => {
  return (
    <div className="mx-4 flex items-center justify-between mb-12">
      <div>
        <p className="text-base">{subtitle}</p>
        <p className="text-3xl md:text-4xl font-medium text-trustDark">
          {title}
        </p>
      </div>
    </div>
  );
};

export default Header;

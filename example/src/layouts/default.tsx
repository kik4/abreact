import React from "react";

export default ({ children }) => {
  return (
    <div className="default-layout">
      <div>This is default layout.</div>
      {children}
    </div>
  );
};

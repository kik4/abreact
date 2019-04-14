import React from "react";

export default ({ children }) => {
  return (
    <div className="a-layout">
      <div>This is A layout.</div>
      {children}
    </div>
  );
};

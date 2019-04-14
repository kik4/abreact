import React from "react";

export default ({ children }) => {
  return (
    <div className="nest-layout-layout">
      <div>This is Nested layout.</div>
      {children}
    </div>
  );
};

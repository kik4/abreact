import React from "react";
import Abreact from "@kik4/abreact";

export default () => {
  const hc = React.useContext(Abreact.HistoryContext);
  return (
    <div className="nest-page-page">
      <h1>This is Nested page.</h1>
      <button onClick={() => hc.push("/")}>index</button>
    </div>
  );
};

export const pageConfig = {
  layout: "nest/layout"
};

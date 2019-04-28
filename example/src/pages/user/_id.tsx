import React from "react";
import Abreact from "@kik4/abreact";

export default () => {
  const hc = React.useContext(Abreact.HistoryContext);
  const num = Number(hc.params.id);
  return (
    <div className="user-id-page">
      <h1>Your ID is {num}</h1>
      <button onClick={() => hc.push(`/user/${num + 1}`)}>id++</button>
      <button onClick={() => hc.push("/")}>index</button>
    </div>
  );
};

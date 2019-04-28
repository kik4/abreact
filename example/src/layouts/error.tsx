import React from "react";
import Abreact from "@kik4/abreact";

export default () => {
  return (
    <Abreact.HistoryContext.Consumer>
      {hc => (
        <div className="error-page">
          <h1>This is Error Page!</h1>
          <button onClick={() => hc.push("/")}>index</button>
          <div>{hc.error && hc.error.status}</div>
        </div>
      )}
    </Abreact.HistoryContext.Consumer>
  );
};

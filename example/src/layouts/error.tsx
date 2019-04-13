import React from "react";
import Abreact from "abreact";

export default () => {
  return (
    <Abreact.HistoryContext.Consumer>
      {hc => (
        <>
          <h1>This is Error Page!</h1>
          <button onClick={() => hc.push("/")}>index</button>
          <div>{hc.error!.status}</div>
        </>
      )}
    </Abreact.HistoryContext.Consumer>
  );
};

import React from "react";
import abreact from "abreact";

export default () => {
  return (
    <div>
      <abreact.HistoryContext.Consumer>
        {hc => (
          <>
            <h1>This is Error Page!</h1>
            <button onClick={() => hc.push("/")}>index</button>
            <div>{hc.error.status}</div>
          </>
        )}
      </abreact.HistoryContext.Consumer>
    </div>
  );
};

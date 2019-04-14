import React from "react";
import Abreact from "abreact";

class Test extends React.Component {
  static contextType = Abreact.HistoryContext;
  render() {
    const { push } = this.context;
    return (
      <div className="test-page">
        <h1>This is Test Page.</h1>
        <button onClick={() => push("/")}>index</button>
      </div>
    );
  }
}

export default Test;

import React from "react";
import Abreact from "abreact";

class Test extends React.Component {
  static contextType = Abreact.HistoryContext;
  render() {
    const { push } = this.context;
    return (
      <div>
        <div>
          <h1>This is Test Page2.</h1>
          <button onClick={() => push("/")}>index</button>
        </div>
      </div>
    );
  }
}

export default Test;

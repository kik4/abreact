import * as React from "react";
//@ts-ignore
import HistoryContext from "@abreact/HistoryContext";

class Test extends React.Component {
  static contextType = HistoryContext;
  render() {
    const { push } = this.context;
    return (
      <div>
        <div>
          <h1>This is Test Page.</h1>
          <button onClick={() => push("/")}>index</button>
        </div>
      </div>
    );
  }
}

export default Test;

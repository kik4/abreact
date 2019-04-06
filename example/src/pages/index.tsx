import * as React from "react";
//@ts-ignore
import HistoryContext from "@abreact/HistoryContext";

class Index extends React.Component {
  static contextType = HistoryContext;
  render() {
    const { push } = this.context;
    return (
      <div>
        <div>
          <h1>Hello, World!</h1>
          <button onClick={() => push("/test")}>test</button>
        </div>
      </div>
    );
  }
}

export default Index;

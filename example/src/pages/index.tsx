import React from "react";
import abreact from "abreact";

class Index extends React.Component {
  static contextType = abreact.HistoryContext;
  render() {
    const { push } = this.context;
    return (
      <div>
        <div>
          <h1>Hello, World!</h1>
          <button onClick={() => push("/test")}>test</button>
          <button onClick={() => push("/test2")}>test2</button>
        </div>
      </div>
    );
  }
}

export default Index;

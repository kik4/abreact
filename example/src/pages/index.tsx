import React from "react";
import Abreact from "abreact";

class Index extends React.Component {
  static contextType = Abreact.HistoryContext;
  render() {
    const { push } = this.context;
    return (
      <div className="index-page">
        <h1>Hello, World!</h1>
        <button onClick={() => push("/test")}>test</button>
        <button onClick={() => push("/test2")}>test2</button>
        <button onClick={() => push("/nest/page")}>Nested Page</button>
        <button onClick={() => push("/user/1")}>Dynamic Page</button>
        <button onClick={() => push("/any-where")}>error</button>
      </div>
    );
  }
}

export default Index;

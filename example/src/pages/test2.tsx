import React from "react";
import Abreact from "@kik4/abreact";

class Test extends React.Component {
  static contextType = Abreact.HistoryContext;
  render() {
    const { push } = this.context;
    return (
      <div className="test2-page">
        <h1>This is Test Page2.</h1>
        <button onClick={() => push("/")}>index</button>
      </div>
    );
  }
}

export default Test;

export const pageConfig = {
  layout: "layout-not-found"
};

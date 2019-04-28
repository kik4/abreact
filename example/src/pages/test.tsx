import React from "react";
import Abreact from "@kik4/abreact";
import { Helmet } from "react-helmet";

class Test extends React.Component {
  static contextType = Abreact.HistoryContext;
  render() {
    const { push } = this.context;
    return (
      <div className="test-page">
        <Helmet>
          <title>Test</title>
        </Helmet>
        <h1>This is Test Page.</h1>
        <button onClick={() => push("/")}>index</button>
      </div>
    );
  }
}

export default Test;

export const pageConfig = {
  layout: "a-layout"
};

import * as React from "react";
import { hot } from "react-hot-loader/root";
//@ts-ignore
import Page from "user/Page";

class App extends React.Component<{}, { Page: React.Component }> {
  constructor(props) {
    super(props);
    this.state = { Page: null };
  }

  render() {
    return (
      <div className="App">
        <Page />
      </div>
    );
  }
}

export default hot(App);

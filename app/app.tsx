import * as React from "react";
import { hot } from "react-hot-loader/root";
//@ts-ignore
import Page from "user/Page";

class App extends React.Component {
  constructor(props) {
    super(props);
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

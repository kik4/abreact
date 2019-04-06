import * as React from "react";
const Page = require(process.env.USER_SCRIPT_ROOT + "/Page").default;

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

export default App;

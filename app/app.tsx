import * as React from "react";
import { hot } from "react-hot-loader/root";
//@ts-ignore
const Page = React.lazy(() => import("user/Page"));

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <React.Suspense fallback={<div>Loading...</div>}>
          <Page />
        </React.Suspense>
      </div>
    );
  }
}

export default hot(App);

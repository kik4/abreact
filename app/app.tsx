import * as React from "react";
import { hot } from "react-hot-loader/root";
import UniversalRouter from "universal-router";
//@ts-ignore
import routes from "user/routes";
const router = new UniversalRouter(routes);

class App extends React.Component<{}, { action: any }> {
  constructor(props) {
    super(props);
    this.state = {
      action: null
    };
  }

  componentDidMount() {
    window.addEventListener("popstate", this.popstate);
    this.popstate();
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.popstate);
  }

  popstate() {
    router.resolve(document.location.pathname).then(async action => {
      this.setState({ action });
    });
  }

  render() {
    const OtherComponent = React.lazy(this.state.action);
    return (
      <div className="App">
        {this.state.action && (
          <React.Suspense fallback={<div>Loading...</div>}>
            <OtherComponent />
          </React.Suspense>
        )}
      </div>
    );
  }
}

export default hot(App);

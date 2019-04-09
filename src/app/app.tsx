import * as React from "react";
import { hot } from "react-hot-loader/root";
import UniversalRouter from "universal-router";
//@ts-ignore
import routes from "__user/routes";
const router = new UniversalRouter(routes);
import HistoryContext from "./HistoryContext";

class App extends React.Component<{}, { action: any }> {
  constructor(props) {
    super(props);
    this.state = {
      action: null
    };
  }

  eventHandler: any;

  componentDidMount() {
    this.eventHandler = this.popstate.bind(this);
    window.addEventListener("popstate", this.eventHandler);
    this.eventHandler();
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.eventHandler);
  }

  popstate() {
    router.resolve(document.location.pathname).then(async action => {
      this.setState({ action });
    });
  }

  pushstate(pathname: string) {
    history.pushState(null, "", pathname);
    this.popstate();
  }

  render() {
    const OtherComponent = React.lazy(this.state.action);
    return (
      <HistoryContext.Provider
        value={{ route: location.pathname, push: this.pushstate.bind(this) }}
      >
        <div className="App">
          {this.state.action && (
            <React.Suspense fallback={<div>Loading...</div>}>
              <OtherComponent />
            </React.Suspense>
          )}
        </div>
      </HistoryContext.Provider>
    );
  }
}

export default hot(App);

import React from "react";
import { hot } from "react-hot-loader/root";
import UniversalRouter from "universal-router";
//@ts-ignore
import routes from "../tmp/routes";
const router = new UniversalRouter(routes);
import HistoryContext from "./HistoryContext";

class App extends React.Component<{}, { page: any }> {
  constructor(props) {
    super(props);
    this.state = {
      page: null
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
      const module = await action();
      this.setState({ page: module.default });
    });
  }

  pushstate(pathname: string) {
    router.resolve(document.location.pathname).then(async action => {
      await action();
      history.pushState(null, "", pathname);
      this.popstate();
    });
  }

  render() {
    return (
      <HistoryContext.Provider
        value={{ route: location.pathname, push: this.pushstate.bind(this) }}
      >
        <div className="App">
          {this.state.page && React.createElement(this.state.page)}
        </div>
      </HistoryContext.Provider>
    );
  }
}

export default hot(App);

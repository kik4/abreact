import React from "react";
import { hot } from "react-hot-loader/root";
import UniversalRouter from "universal-router";
//@ts-ignore
import routes, { errorPage } from "../tmp/routes";
const router = new UniversalRouter(routes, {
  errorHandler(error, context) {
    return {
      page: errorPage,
      error,
      context
    };
  }
});
import HistoryContext, { HistoryContextParams } from "./HistoryContext";

class App extends React.Component<
  {},
  { action?: any; historyContextParam?: HistoryContextParams }
> {
  constructor(props) {
    super(props);
    this.state = {
      action: undefined,
      historyContextParam: undefined
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
      const module = await action.page;
      this.setState({
        action: {
          page: module.default
        },
        historyContextParam: {
          path: action.context.path,
          error: action.error,
          params: action.context.params
        } as HistoryContextParams
      });
    });
  }

  pushstate(pathname: string) {
    router.resolve(document.location.pathname).then(async action => {
      await action.page;
      history.pushState(null, "", pathname);
      this.popstate();
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.action && (
          <HistoryContext.Provider
            value={{
              push: this.pushstate.bind(this),
              ...this.state.historyContextParam
            }}
          >
            {React.createElement(this.state.action.page)}
          </HistoryContext.Provider>
        )}
      </div>
    );
  }
}

export default hot(App);

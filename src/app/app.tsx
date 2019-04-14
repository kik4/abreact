import React from "react";
import { hot } from "react-hot-loader/root";
import UniversalRouter from "universal-router";
//@ts-ignore
import routes, { errorPage, defaultLayout } from "../tmp/routes";
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
  { action?: any; layout?: any; historyContextParams: HistoryContextParams }
> {
  constructor(props) {
    super(props);
    this.state = {
      action: undefined,
      layout: undefined,
      historyContextParams: {}
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
      const layout = await defaultLayout;
      this.setState({
        action: {
          page: module.default
        },
        layout: layout.default,
        historyContextParams: {
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
              ...this.state.historyContextParams
            }}
          >
            {React.createElement(this.state.layout, {}, [
              React.createElement(this.state.action.page, {
                key: "__abreact_page"
              })
            ])}
          </HistoryContext.Provider>
        )}
      </div>
    );
  }
}

export default hot(App);

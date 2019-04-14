import React from "react";
import { oc } from "ts-optchain";
import { hot } from "react-hot-loader/root";
import UniversalRouter from "universal-router";
//@ts-ignore
import routes, { layouts } from "../tmp/routes";
const router = new UniversalRouter(routes, {
  errorHandler(error, context) {
    if (!layouts.error) {
      console.error(`Abreact: error component is not found.`);
    }
    return {
      page: layouts.error,
      error,
      context
    };
  }
});
import HistoryContext, { HistoryContextParams } from "./HistoryContext";

class App extends React.Component<
  {},
  { page?: any; layout?: any; historyContextParams: HistoryContextParams }
> {
  constructor(props) {
    super(props);
    this.state = {
      page: undefined,
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
      const page = await action.page;
      const layoutName = (oc(page) as any).pageConfig.layout("default");
      const layout = await layouts[layoutName]();
      if (!layout) {
        console.warn(`Abreact: layout '${layoutName}' is not found.`);
      }

      this.setState({
        page: page ? page.default : undefined,
        layout: layout ? layout.default : undefined,
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
    const page = React.createElement(
      this.state.page ? this.state.page : "div",
      {
        key: "__abreact_page"
      }
    );
    const layoutPage = this.state.layout
      ? React.createElement(this.state.layout, {}, [page])
      : page;
    return (
      <div className="App">
        {this.state.page && (
          <HistoryContext.Provider
            value={{
              push: this.pushstate.bind(this),
              ...this.state.historyContextParams
            }}
          >
            {layoutPage}
          </HistoryContext.Provider>
        )}
      </div>
    );
  }
}

export default hot(App);

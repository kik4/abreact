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
      page: layouts.error(),
      error,
      context
    };
  }
});
import HistoryContext, { HistoryContextParams } from "./HistoryContext";
import { AbreactRouteAction, ReactComponent } from "./types";

class App extends React.Component<
  {},
  {
    page?: ReactComponent;
    layout?: ReactComponent;
    historyContextParams: HistoryContextParams;
  }
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

  async updateRoute(action: AbreactRouteAction) {
    const page = await action.page;
    const layoutName = oc(page).pageConfig.layout("default");
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
  }

  popstate() {
    const pathname = document.location.pathname;
    router.resolve(pathname).then(this.updateRoute.bind(this));
  }

  pushstate(pathname: string) {
    router.resolve(pathname).then(async (action: AbreactRouteAction) => {
      const update = this.updateRoute.bind(this);
      await update(action);
      history.pushState(null, "", pathname);
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

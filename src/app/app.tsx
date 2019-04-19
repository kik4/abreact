import React from "react";
import { oc } from "ts-optchain";
import { hot } from "react-hot-loader/root";
import UniversalRouter from "universal-router";
//@ts-ignore
import * as routeData from "../tmp/routes";
const router = new UniversalRouter(routeData.routes, {
  errorHandler(error, context) {
    if (!routeData.layouts.error) {
      console.error(`Abreact: error component is not found.`);
    }
    return {
      page: routeData.layouts["error"],
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
    page?: any;
    layout?: any;
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
    const page = await routeData.modules[action.page]();
    const layoutName = routeData.layouts[oc(page).pageConfig.layout("default")];
    const layout = await routeData.modules[layoutName]();
    if (!layout) {
      console.warn(`Abreact: layout '${layoutName}' is not found.`);
    }

    this.setState({
      page: action.page,
      layout: layoutName,
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
    const Page =
      this.state.page && React.lazy(routeData.modules[this.state.page]);
    const Layout = this.state.layout
      ? React.lazy(routeData.modules[this.state.layout])
      : undefined;

    return (
      <div className="App">
        {this.state.page && (
          <HistoryContext.Provider
            value={{
              push: this.pushstate.bind(this),
              ...this.state.historyContextParams
            }}
          >
            <React.Suspense fallback={<div>Loading...</div>}>
              {Layout ? (
                <Layout>
                  <Page />
                </Layout>
              ) : (
                <Page />
              )}
            </React.Suspense>
          </HistoryContext.Provider>
        )}
      </div>
    );
  }
}

export default hot(App);

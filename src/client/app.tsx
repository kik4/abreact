import React from "react";
import { oc } from "ts-optchain";
import { hot } from "react-hot-loader/root";
import UniversalRouter, { Route, Options } from "universal-router";
//@ts-ignore
import * as IntermediateData from "../tmp/client";
import HistoryContext, { HistoryContextParams } from "./HistoryContext";
import { AbreactPage } from "../types";

type RouteAction = {
  page: string;
  context: any;
  error?: Parameters<NonNullable<Options["errorHandler"]>>[0];
};
type Routes = Route<any, RouteAction>[];
interface IntermediateData {
  modules: { [key: string]: () => Promise<AbreactPage> };
  routes: Routes;
  layouts: { [key: string]: string };
  plugins: { [key: string]: () => any };
}

const router = new UniversalRouter(IntermediateData.routes, {
  errorHandler(error, context) {
    if (!IntermediateData.layouts.error) {
      console.error(`Abreact: error component is not found.`);
    }
    return {
      page: IntermediateData.layouts["error"],
      error,
      context
    };
  }
});

class App extends React.Component<
  {},
  {
    page?: string;
    layout?: string;
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

  async updateRoute(action: RouteAction) {
    const page = await IntermediateData.modules[action.page]();
    const layoutName =
      IntermediateData.layouts[oc(page).pageConfig.layout("default")];
    const layout = await IntermediateData.modules[layoutName]();
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
    router.resolve(pathname).then(async (action: RouteAction) => {
      const update = this.updateRoute.bind(this);
      await update(action);
      history.pushState(null, "", pathname);
    });
  }

  render() {
    const Page = React.lazy(IntermediateData.modules[this.state.page!]);
    const Layout = this.state.layout
      ? React.lazy(IntermediateData.modules[this.state.layout])
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

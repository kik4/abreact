import React from "react";
import { oc } from "ts-optchain";
import { hot } from "react-hot-loader/root";
import UniversalRouter, { Route, Options } from "universal-router/sync";
//@ts-ignore
import * as IntermediateData from "../tmp/server";
//@ts-ignore
import Abreact from "abreact";
const HistoryContext = Abreact.HistoryContext;
type HistoryContextParams = Abreact.HistoryContext.HistoryContextParams;
import { AbreactPage } from "../common/types";

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
  { pathname: string },
  {
    pageComponent?: any;
    layoutComponent?: any;
    historyContextParams: HistoryContextParams;
  }
> {
  constructor(props) {
    super(props);

    const action = router.resolve({
      pathname: this.props.pathname
    }) as RouteAction;
    const page = IntermediateData.modules[action.page]() as AbreactPage;
    const layoutName =
      IntermediateData.layouts[oc(page).pageConfig.layout("default")];
    const layout = IntermediateData.modules[layoutName]();
    if (!layout) {
      console.warn(`Abreact: layout '${layoutName}' is not found.`);
    }
    this.state = {
      pageComponent: page.default,
      layoutComponent: layout ? layout.default : undefined,
      historyContextParams: {
        path: action.context.path,
        error: action.error,
        params: action.context.params
      } as HistoryContextParams
    };
  }

  render() {
    return (
      <div className="App">
        <HistoryContext.Provider
          value={{
            push: () => {},
            ...this.state.historyContextParams
          }}
        >
          {this.state.layoutComponent
            ? React.createElement(
                this.state.layoutComponent,
                {},
                React.createElement(this.state.pageComponent)
              )
            : React.createElement(this.state.pageComponent)}
        </HistoryContext.Provider>
      </div>
    );
  }
}

export default hot(App);

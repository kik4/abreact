import React from "react";
import { oc } from "ts-optchain";
import withStyles from "isomorphic-style-loader/withStyles";
import * as IntermediateData from "../../tmp/server";
import { ResolvedData } from "../app/router";
import { AbreactPage } from "../types";
import * as TmpData from "../../tmp/server";
//@ts-ignore
import Abreact from "abreact"; // this is important because using same object both client and server

class App extends React.Component<
  {
    initialState: ResolvedData;
  },
  {
    page: string;
    layout: string;
    historyContextParams: Abreact.HistoryContextParams;
  }
> {
  constructor(props) {
    super(props);

    this.state = {
      page: this.props.initialState.page,
      layout: this.props.initialState.layout,
      historyContextParams: {
        error: this.props.initialState.error,
        params: this.props.initialState.params,
        pathname: this.props.initialState.pathname
      }
    };
  }

  render() {
    const action = this.props.initialState;
    const page = IntermediateData.modules[action.page]() as AbreactPage;
    const layoutName = oc(page).pageConfig.layout("default");
    const Page = page.default;
    const Layout = IntermediateData.layouts[layoutName]
      ? IntermediateData.layouts[layoutName].default
      : undefined;

    return (
      <div className="App">
        <Abreact.HistoryContext.Provider
          value={{
            push: () => {},
            ...this.state.historyContextParams
          }}
        >
          {Layout ? (
            <Layout>
              <Page />
            </Layout>
          ) : (
            <Page />
          )}
        </Abreact.HistoryContext.Provider>
      </div>
    );
  }
}

export default withStyles(...TmpData.csses)(App);

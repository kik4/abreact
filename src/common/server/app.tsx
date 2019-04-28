import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import { ResolvedData } from "../app/router";
import { AbreactPage } from "../types";
import * as TmpData from "../../tmp/server";
//@ts-ignore
import Abreact from "@kik4/abreact"; // this is important because using same object both client and server

class App extends React.Component<
  {
    initialState: ResolvedData;
  },
  {
    Page: AbreactPage;
    Layout?: AbreactPage;
    historyContextParams: Abreact.HistoryContextParams;
  }
> {
  constructor(props) {
    super(props);

    this.state = {
      Page: this.props.initialState.Page,
      Layout: this.props.initialState.Layout,
      historyContextParams: {
        error: this.props.initialState.error,
        params: this.props.initialState.params,
        pathname: this.props.initialState.pathname
      }
    };
  }

  render() {
    const Page = this.state.Page.default as any;
    const Layout = this.state.Layout && (this.state.Layout.default as any);

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

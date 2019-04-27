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
    const pageComponent = page.default;
    const layoutComponent = (IntermediateData.layouts[layoutName] as any)
      .default;
    const ssrElement = layoutComponent
      ? React.createElement(
          layoutComponent,
          {},
          React.createElement(pageComponent)
        )
      : React.createElement(pageComponent);

    return (
      <div className="App">
        <Abreact.HistoryContext.Provider
          value={{
            push: () => {},
            ...this.state.historyContextParams
          }}
        >
          {ssrElement}
        </Abreact.HistoryContext.Provider>
      </div>
    );
  }
}

export default withStyles(...TmpData.csses)(App);

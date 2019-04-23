import React from "react";
import { oc } from "ts-optchain";
import * as IntermediateData from "../tmp/server";
import { ResolvedData } from "../common/app/router";
import { AbreactPage } from "../common/types";
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
    const layoutName =
      IntermediateData.layouts[oc(page).pageConfig.layout("default")];
    const layout = IntermediateData.modules[layoutName]();
    const pageComponent = page.default;
    const layoutComponent = layout ? layout.default : undefined;
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

export default App;

import React from "react";
import { hot } from "react-hot-loader/root";
const withStyles = require("isomorphic-style-loader/withStyles");
import { HistoryContextParams, HistoryContextValue } from "./HistoryContext";
import router, { ResolvedData } from "./router";
import Abreact, { Page } from "../../export";
import * as TmpData from "@@/.abreact/_tmp";

type Props = {
  initialState: ResolvedData;
};
class App extends React.Component<
  Props,
  {
    Page: Page;
    Layout?: Page;
    historyContextParams: HistoryContextParams;
  }
> {
  constructor(props: Props) {
    super(props);
    this.popstate = this.popstate.bind(this);
    this.pushstate = this.pushstate.bind(this);

    this.state = {
      Page: this.props.initialState.Page,
      Layout: this.props.initialState.Layout,
      historyContextParams: {
        error: this.props.initialState.error,
        params: this.props.initialState.params,
        pathname: this.props.initialState.pathname,
      },
    };
  }

  componentDidMount() {
    window.addEventListener("popstate", this.popstate);
    this.popstate();
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.popstate);
  }

  popstate() {
    const pathname = document.location.pathname;
    router.resolve(pathname).then(data => {
      this.setState({
        Page: data.Page,
        Layout: data.Layout,
        historyContextParams: {
          pathname,
          error: data.error,
          params: data.params,
        },
      });
    });
  }

  pushstate(pathname: string) {
    router.resolve(pathname).then(data => {
      this.setState({
        Page: data.Page,
        Layout: data.Layout,
        historyContextParams: {
          pathname,
          error: data.error,
          params: data.params,
        },
      });
      history.pushState(null, "", pathname);
    });
  }

  render() {
    const Page = this.state.Page.default;
    const Layout = this.state.Layout && this.state.Layout.default;
    const tcValue: HistoryContextValue = {
      push: this.pushstate,
      ...this.state.historyContextParams,
    };
    return (
      <div className="App">
        <Abreact.HistoryContext.Provider value={tcValue}>
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

export default hot(withStyles(...TmpData.csses)(App));

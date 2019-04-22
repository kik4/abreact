import React from "react";
import { hot } from "react-hot-loader/root";
import loadable from "@loadable/component";
import HistoryContext, { HistoryContextParams } from "./HistoryContext";
import router, { ResolvedData } from "../common/app/router";
import * as TmpData from "../tmp/client";

class App extends React.Component<
  {
    initialState: ResolvedData;
  },
  {
    page: string;
    layout: string;
    historyContextParams: HistoryContextParams;
  }
> {
  constructor(props) {
    super(props);
    this.popstate = this.popstate.bind(this);
    this.pushstate = this.pushstate.bind(this);

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
        page: data.page,
        layout: data.layout,
        historyContextParams: {
          pathname,
          error: data.error,
          params: data.params
        }
      });
    });
  }

  pushstate(pathname: string) {
    router.resolve(pathname).then(data => {
      this.setState({
        page: data.page,
        layout: data.layout,
        historyContextParams: {
          pathname,
          error: data.error,
          params: data.params
        }
      });
      history.pushState(null, "", pathname);
    });
  }

  render() {
    const Page = loadable(TmpData.modules[this.state.page] as any);
    const Layout = this.state.layout
      ? loadable(TmpData.modules[this.state.layout] as any)
      : undefined;

    return (
      <div className="App" suppressHydrationWarning={true}>
        {this.state.page && (
          <HistoryContext.Provider
            value={{
              push: this.pushstate,
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
          </HistoryContext.Provider>
        )}
      </div>
    );
  }
}

export default hot(App);

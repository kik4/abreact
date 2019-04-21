import React from "react";
import { hot } from "react-hot-loader/root";
import HistoryContext, { HistoryContextParams } from "./HistoryContext";
import router, { ResolvedData } from "../common/app/router";
import * as TmpData from "../tmp/client";

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
    this.popstate = this.popstate.bind(this);
    this.pushstate = this.pushstate.bind(this);

    this.state = {
      historyContextParams: {}
    };
  }

  eventHandler: any;

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
    const Page = React.lazy(TmpData.modules[this.state.page!] as any);
    const Layout = this.state.layout
      ? React.lazy(TmpData.modules[this.state.layout] as any)
      : undefined;

    return (
      <div className="App">
        {this.state.page && (
          <HistoryContext.Provider
            value={{
              push: this.pushstate,
              ...this.state.historyContextParams
            }}
          >
            <React.Suspense fallback={<div />}>
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

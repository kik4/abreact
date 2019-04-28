import React from "react";
import { hot } from "react-hot-loader/root";
import withStyles from "isomorphic-style-loader/withStyles";
import HistoryContext, {
  HistoryContextParams
} from "../common/app/HistoryContext";
import router, { ResolvedData } from "../common/app/router";
import * as TmpData from "../tmp/client";
import { AbreactPage } from "../common/types";

class App extends React.Component<
  {
    initialState: ResolvedData;
  },
  {
    Page: AbreactPage;
    Layout: AbreactPage;
    historyContextParams: HistoryContextParams;
  }
> {
  constructor(props) {
    super(props);
    this.popstate = this.popstate.bind(this);
    this.pushstate = this.pushstate.bind(this);

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
          params: data.params
        }
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
          params: data.params
        }
      });
      history.pushState(null, "", pathname);
    });
  }

  render() {
    const Page = this.state.Page.default as any;
    const Layout = this.state.Layout && (this.state.Layout.default as any);
    return (
      <div className="App">
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
      </div>
    );
  }
}

export default hot(withStyles(...TmpData.csses)(App));

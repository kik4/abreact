import * as React from "react";

const HistoryContext = React.createContext({
  route: null as string | null,
  push: (pathname: string) => {}
});

export default HistoryContext;

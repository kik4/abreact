import React from "react";

export type HistoryContextParams = {
  path?: string;
  error?: Error & { status?: number };
  params?: any;
};

export type HistoryContextAction = {
  push: (string) => void;
};

const HistoryContext = React.createContext({
  path: undefined as string | undefined,
  error: undefined as any | undefined,
  params: undefined as any | undefined,
  push: (pathname: string) => {}
} as HistoryContextParams & HistoryContextAction);

export default HistoryContext;

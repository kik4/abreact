import React from "react";
import { Options } from "universal-router";

export type HistoryContextParams = {
  pathname?: string;
  error?: Parameters<NonNullable<Options["errorHandler"]>>[0];
  params?: any;
};

export type HistoryContextAction = {
  push: (string) => void;
};

export type HistoryContextValue = HistoryContextParams & HistoryContextAction;

const HistoryContext = React.createContext<HistoryContextValue>({
  pathname: undefined as string | undefined,
  error: undefined as any | undefined,
  params: undefined as any | undefined,
  push: (pathname: string) => {}
});

export default HistoryContext;

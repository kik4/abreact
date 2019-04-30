import React from "react";
import hc from "../common/app/HistoryContext";

export const HistoryContext = hc;

export type Page = {
  default: React.ComponentType;
  pageConfig?: PageConfig;
};

export type PageConfig = {
  layout?: string;
};

export type UserConfig = {
  server?: {
    port?: number;
  };
  head?: {
    titleTemplate?: string;
    defaultTitle?: string;
  };
  css?: string[];
  plugins?: string[];
};

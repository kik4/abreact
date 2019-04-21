import React from "react";
import UniversalRouter, { Route, Options } from "universal-router";

export type AbreactPage = {
  default: React.ComponentType;
  pageConfig?: AbreactPageConfig;
};

export type AbreactPageConfig = {
  layout?: string;
};

export type AbreactUserConfig = {
  plugins?: string[];
};

export type RouteAction = {
  page: string;
  context: any;
  error?: Parameters<NonNullable<Options["errorHandler"]>>[0];
};

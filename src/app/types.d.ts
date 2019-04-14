import React from "react";
import { Module } from "webpack";
import { Options } from "universal-router";

export type ReactComponent = React.ComponentType;

export type AbreactRouteAction = {
  page: Promise<AbreactPage>;
  error?: Parameters<Options["errorHandler"]>[0];
  context: Parameters<Options["errorHandler"]>[1];
};

export type AbreactPage = {
  default: ReactComponent;
  pageConfig?: AbreactPageConfig;
};

export type AbreactPageConfig = {
  layout?: string;
};

export type AbreactUserConfig = {
  plugins?: string[];
};

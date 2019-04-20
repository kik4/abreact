import React from "react";
import { Module } from "webpack";
import { Options } from "universal-router";

type ReactComponent = React.ComponentType;

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

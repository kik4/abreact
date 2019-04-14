import React from "react";
import { Module } from "webpack";

export type AbreactRouteAction = {
  page: Promise<AbreactPage>;
  context: any;
  error?: Error & { status?: number };
};

export type AbreactPage = {
  default: Module;
  pageConfig: AbreactPageConfig;
};

export type AbreactPageConfig = {
  layout: string;
};

export type AbreactUserConfig = {
  plugins?: string[];
};

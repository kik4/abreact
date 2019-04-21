import React from "react";

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

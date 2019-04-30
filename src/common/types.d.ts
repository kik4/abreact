import { UserConfig } from "../types";

export type CommonParams = {
  abreactRoot: string;
  userRoot: string;
  userConfig?: UserConfig;
  isDevelopment: boolean;
};

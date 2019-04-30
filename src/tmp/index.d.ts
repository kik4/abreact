import { Page, RouteAction, UserConfig } from "../types";
import { Route } from "universal-router";
type Routes = Route<any, RouteAction>[];

export declare const modules: {
  [key: string]: () => Promise<Page>;
};
export declare const routes: Routes;
export declare const layouts: { [key: string]: Page };
export declare const plugins: { [key: string]: () => any };
export declare const csses: Array<() => any>;
export declare const config: UserConfig;

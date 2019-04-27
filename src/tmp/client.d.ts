import { AbreactPage, RouteAction, AbreactUserConfig } from "../common/types";
import { Route } from "universal-router";
type Routes = Route<any, RouteAction>[];

export declare const modules: {
  [key: string]: () => Promise<AbreactPage | undefined>;
};
export declare const routes: Routes;
export declare const layouts: { [key: string]: AbreactPage };
export declare const plugins: { [key: string]: () => any };
export declare const csses: Array<() => any>;
export declare const config: AbreactUserConfig;

import { AbreactPage } from "../common/types";
type Routes = Route<any, RouteAction>[];

export declare const modules: {
  [key: string]: () => AbreactPage | undefined;
};
export declare const routes: Routes;
export declare const layouts: { [key: string]: string };
export declare const plugins: { [key: string]: () => any };

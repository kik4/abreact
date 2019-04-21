import UniversalRouter from "universal-router";
import { oc } from "ts-optchain";
import * as TmpData from "../../tmp/client";
import { RouteAction } from "../types";
import { string } from "prop-types";

const universalRouter = new UniversalRouter(TmpData.routes, {
  errorHandler(error, context): RouteAction {
    if (!TmpData.layouts.error) {
      console.error(`Abreact: error component is not found.`);
    }
    return {
      page: TmpData.layouts["error"],
      error,
      context
    };
  }
});

export type ResolvedData = {
  page: string;
  layout: string;
  pathname: string;
  error?: RouteAction["error"];
  params?: any;
};

const resolve = async (pathname: string): Promise<ResolvedData> => {
  const action = (await universalRouter.resolve(pathname)) as RouteAction;
  const page = await TmpData.modules[action.page]();
  const layoutName = TmpData.layouts[oc(page).pageConfig.layout("default")];
  const layout = await TmpData.modules[layoutName]();
  if (!layout) {
    console.warn(`Abreact: layout '${layoutName}' is not found.`);
  }

  return {
    page: action.page,
    layout: layoutName,
    pathname,
    error: action.error,
    params: action.context.params
  };
};

export default {
  resolve
};

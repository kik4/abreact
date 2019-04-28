import UniversalRouter from "universal-router";
import { oc } from "ts-optchain";
import * as TmpData from "../../tmp/client";
import { RouteAction, AbreactPage } from "../types";
import { string } from "prop-types";

const universalRouter = new UniversalRouter(TmpData.routes, {
  errorHandler(error, context): RouteAction {
    if (!TmpData.layouts.error) {
      console.error(`Abreact: error component is not found.`);
    }
    return {
      page: "__error",
      error,
      context
    };
  }
});

export type ResolvedData = {
  Page: AbreactPage;
  Layout?: AbreactPage;
  pathname: string;
  error?: RouteAction["error"];
  params?: any;
};

const resolve = async (pathname: string): Promise<ResolvedData> => {
  const action = (await universalRouter.resolve(pathname)) as RouteAction;
  const Page = await TmpData.modules[action.page]();
  const layoutName = oc(Page).pageConfig.layout("default");
  if (!TmpData.layouts[layoutName]) {
    console.warn(`Abreact: layout '${layoutName}' is not found.`);
  }
  const Layout = TmpData.layouts[layoutName];

  return {
    Page,
    Layout,
    pathname,
    error: action.error,
    params: action.context.params
  };
};

export default {
  resolve
};

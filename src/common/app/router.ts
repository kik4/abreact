import UniversalRouter, { Options } from "universal-router";
import { oc } from "ts-optchain";
import { Page } from "../../export";
import * as TmpData from "@@/.abreact/_tmp";

const universalRouter = new UniversalRouter(TmpData.routes, {
  errorHandler(error, context): RouteAction {
    if (!TmpData.layouts.error) {
      console.error(`[Abreact]: Error page is not found.`);
    }
    return {
      page: "__error",
      error,
      context,
    };
  },
});

export type ResolvedData = {
  Page: Page;
  Layout?: Page;
  pathname: string;
  error?: RouteAction["error"];
  params?: any;
};

export type RouteAction = {
  page: string;
  context: any;
  error?: Parameters<NonNullable<Options["errorHandler"]>>[0];
};

const resolve = async (pathname: string): Promise<ResolvedData> => {
  const action = (await universalRouter.resolve(pathname)) as RouteAction;
  const Page = await TmpData.modules[action.page]();
  const layoutName = oc(Page).pageConfig.layout("default");
  if (!TmpData.layouts[layoutName]) {
    console.warn(`[Abreact]: Layout '${layoutName}' is not found.`);
  }
  const Layout = TmpData.layouts[layoutName] || TmpData.layouts["default"];

  return {
    Page,
    Layout,
    pathname,
    error: action.error,
    params: action.context.params,
  };
};

export default {
  resolve,
};

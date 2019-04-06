const routes = [
  {
    path: "",
    action: () => () => import("./pages/index")
  },
  {
    path: "/test",
    action: () => () => import("./pages/test")
  }
];

export default routes;

import { any } from "prop-types";

declare global {
  interface NodeModule {
    hot: any;
  }
}

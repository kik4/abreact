import { UserConfig } from "@kik4/abreact";

const config: UserConfig = {
  server: {
    port: 8081,
  },
  head: {
    titleTemplate: "%s - Abreact",
    defaultTitle: "Abreact",
  },
  css: ["@/assets/main.css", "@/assets/test.css"],
  plugins: ["@/plugins/global"],
};

module.exports = config;

module.exports = {
  server: {
    port: 8081
  },
  head: {
    titleTemplate: "%s - Abreact",
    defaultTitle: "Abreact"
  },
  css: ["@/assets/main.css", "@/assets/test.css"],
  plugins: ["@/plugins/global"]
};

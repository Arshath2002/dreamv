// https://github.com/michael-ciniawsky/postcss-load-config
const path = require("path");

module.exports = ({ env }) => ({
  plugins: [
    require("autoprefixer")({}),
    require("postcss-pxtorem")({
      rootValue: 50,
      // selectorBlackList: [':after',':before'], // 忽略转换正则匹配项
      propList: ["*", "!border*", "!box-shadow", "!text-shadow"],
      exclude: (file) => {
        file = path.relative(__dirname, file);
        let isVant = /[\\/]vant[\\/]/;
        let isMobile = /[\\/]mobile[\\/]/;
        return !(isVant.test(file) || isMobile.test(file));
      }
    }),
    require("@dsf/cli-core/build/overflowScrollingPlugn")([
      // example optionss
      "hidden",
      "scroll",
      "auto",
      "inherit"
    ])
  ]
})

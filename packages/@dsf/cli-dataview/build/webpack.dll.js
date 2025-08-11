/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2025-02-07 14:06:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-18 14:02:23
 */
const path = require("path");
const pkgInfo = require("../package.json");
const merge = require("@dsf/cli-core/build/merge");
const getGlobalConfig = require("@dsf/cli-core/build/webpack.config");
const common = require("@dsf/cli-core/build/webpack.common");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BUILD = require("@dsf/cli-core/build/env");
const webpack = require("webpack");

let target = "dataview";
let config = {
  target: target,
  inputDir: __dirname,
  pkgInfo,
  transpileDependencies: [/vue-virtual-scroller/, /@turf\/polygon-to-line/, /@turf\/centroid/, /@turf\/simplify/, /@turf\/helpers/],
};
let webPath = `/${BUILD.DIR}/${target}/`;
let result = Object.assign(common(config.inputDir), config);

const argv = process.argv;
const isExtra = argv[argv.length - 1] === "extra";
const entry = isExtra
  ? {
      // 额外项目组件包
      [`${target}.extra.module.pc`]: ["./extra-module/index.pc.js"],
    }
  : {
      // 项目中用到该两个依赖库文件
      [`${target}.common`]: ["./build/index.common.js"],
      [`${target}.pc`]: ["./build/index.pc.js"],
      [`${target}.mobile`]: ["./build/index.mobile.js"],
      [`${target}.designer`]: ["./build/index.designer.js"],

      [`${target}.pc.all`]: ["./build/index.common.js", "./build/index.pc.js"],
      [`${target}.mobile.all`]: ["./build/index.common.js", "./build/index.mobile.js"],
      [`${target}.designer.all`]: ["./build/index.common.js", "./build/index.pc.js", "./build/index.mobile.js", "./build/index.designer.js"],
    };
let build = merge(getGlobalConfig(result), {
  entry: entry,
  resolve: {
    alias: {
      _platform: "@dsf/cli-platform",
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.DATAVIEW_VERSION": JSON.stringify(require("../package.json").version),
      "process.env.PLATFORM_VERSION": JSON.stringify(require("@dsf/cli-core/package.json").version),
      __DSF_DATAVIEW_PATH__: JSON.stringify(webPath),
    }),

    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "../public"),
        to: path.join(result.outputDir, result.assetsDir, BUILD.DIR, target, "static"),
      },
    ]),
  ],
});
module.exports = build;

const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const BUILD = require("@dsf/cli-core/build/env");

const folderPath = path.join(__dirname, "../");
const target = path.basename(folderPath).replace("cli-", "");
const webPath = `/${BUILD.DIR}/${target}/`;

module.exports = {
  path: folderPath,
  distRoot: "",
  webPath: webPath,
  config: ({ config, assetsDir }) => {
    config.resolve.alias.set("_dataview", folderPath);

    config.plugin(path.basename(folderPath) + "-copy").use(CopyPlugin, [
      [
        {
          from: path.join(folderPath, "public"),
          to: path.join(BUILD.DIR, target, assetsDir)
        }
      ]
    ]);

    config.plugin(path.basename(folderPath) + "-static").use(webpack.DefinePlugin, [
      {
        __DSF_DATAVIEW_PATH__: JSON.stringify(webPath)
      }
    ]);

    config.plugin("define").tap((args) => {
      let _base = args[0]["process.env"];
      args[0]["process.env"] = {
        ..._base,
        PLATFORM_VERSION: JSON.stringify(require("@dsf/cli-core/package.json").version),
        DATAVIEW_VERSION: JSON.stringify(require("../package.json").version),
      };
      return args;
    });
  },
};

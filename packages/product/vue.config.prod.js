// 生产环境
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FileManagerWebpackPlugin = require('filemanager-webpack-plugin');
const child_process = require('child_process');
const BUILD = require("@dsf/cli-core/build/env");

module.exports = function () {
  // 有时候打包出来代码不是最新的
  // 打包前删除node_modules/.cache
  const cachePath = path.join(__dirname, 'node_modules/.cache');
  if (fs.existsSync(cachePath)) {
    if (fs.rmSync) {
      fs.rmSync(cachePath, { force: true, recursive: true });
    } else {
      deleteFolderRecursive(cachePath);
    }
  }
  function getAssetPath(filePath) {
    return path.posix.join("./", filePath);
  }
  return {
    productionSourceMap: !BUILD.nomap,
    chainWebpack: config => {
      let sourceMapFilename = getAssetPath(`smap/[filebase].map`);
      config.output.sourceMapFilename(sourceMapFilename);
      //打包后JS的头部描述，加入打包时间，便于查看js是否是最新的
      const buildUserName = child_process.execSync('git config user.name').toString().trim();
      config.plugin('banner').use(webpack.BannerPlugin, [[
        `BuildUser: ${buildUserName}`,
        `BuildTime: ${new Date().toLocaleString()}`
      ].join('\n')]);

      //npm run build --see 启动打包结构视图
      if (BUILD.see) {
        config.plugin('bundleAnalyzer').use(BundleAnalyzerPlugin)
      }

      //npm run build --zip 启动打压缩包
      if (process.env.npm_config_zip) {
        config.plugin('fileManager')
          .use(FileManagerWebpackPlugin, [{ // 需要在 plugins 数组里添加
            onEnd: {
              delete: [
                './dist/project.zip', // 删除之前已经存在的压缩包
              ],
              archive: [
                { source: './dist/', destination: './dist/project.zip' },
              ]
            }
          }]);
      }
    },
    configureWebpack: {
      devtool: BUILD.nomap ? 'none' : 'source-map',
    }
  }
};

/**
 * 此处兼容低版本nodejs无法删除非空目录的情况,所以需要提供递归删除子目录及文件
 * @param dirPath
 */
function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(function(fileName) {
      var curPath = path.join(dirPath, fileName);
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}
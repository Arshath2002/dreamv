const path = require("path");
const lodash = require("lodash");
const CopyPlugin = require("copy-webpack-plugin");
const devConfig = require("./vue.config.dev")();
const prodConfig = require("./vue.config.prod")();
const postCssPlugins = require("./.postcssrc");
const BUILD = require("@dsf/cli-core/build/env");
const pkgInfo = require("./package.json");
const getDsfPkgWebpackConfig = require("./build/dsfPkgWebpackConfig");
//支持组合式api组件的defineOptions函数
const DefineOptions = require("unplugin-vue-define-options/webpack");
const vueServerBuild = require("@dsf/cli-core/build/vueServerBuild");

//获取项目名称参数
const projectFolder = "product";
const projectName = path.join(__dirname, "./src");
//需要加载的扩展包
const dsfPkgWebpackConfig = getDsfPkgWebpackConfig(pkgInfo);
const assetsDir = dsfPkgWebpackConfig.assetsDir;

const getAssetsDir = function (filename) {
  return path.posix.join(assetsDir, filename);
};

//所有静态资源的拷贝，
//1、将scss拷贝到静态资源目录用，为设计器编写页面自定义样式时需要继承这几个基础scss文件
let copyList = [
  {
    from: path.join(projectName, "public"),
    to: assetsDir,
    ignore: [".*", "common/**/*"]
  },
  {
    from: path.join(projectName, "common"),
    to: "./common"
  }
];
// 公共配置在这里
const defaultConfig = {
  // 公共路径
  publicPath: "",
  // 项目打包输出路径
  outputDir: "dist",
  // 静态资源目录
  assetsDir: assetsDir,
  // indexPath: 'index.html',
  lintOnSave: true,
  productionSourceMap: false,
  // JS\CSS文件是否加入hash编码防止缓存
  filenameHashing: false,
  parallel: require("os").cpus().length > 1,
  //入口
  pages: {
    ...dsfPkgWebpackConfig.pages
  },
  chainWebpack: (config) => {
    //重写vue编译时各种资源配置
    vueServerBuild(config, {
      getAssetsDir,
      projectFolder,
      dsfPkgWebpackConfig
    });
    dsfPkgWebpackConfig.chainWebpack({ assetsDir, config });
    config.resolve.alias.set("vue$", "vue/dist/vue.esm.js").set("_project", projectName);
    config.plugin("copy").use(CopyPlugin, [copyList]);
    config.optimization.splitChunks({
      chunks: "all",
      cacheGroups: {
        pc: {
          test: /[\\/]pc[\\/]|\.pc\./,
          name: "dsf-pc",
          priority: 5,
          chunks: "initial",
          minSize: 1,
          //enforce属性为强制分割
          enforce: true,
          reuseExistingChunk: true
        },
        mobile: {
          name: "dsf-mobile",
          test: /[\\/]mobile[\\/]|[\\/]vant[\\/]|[\\/]alloyfinger[\\/]|\.mobile\./,
          priority: 5,
          chunks: "initial",
          minSize: 1,
          //enforce属性为强制分割
          enforce: true,
          reuseExistingChunk: true
        },
        designer: {
          name: "dsf-designer",
          test: /[\\/]designer[\\/]|\.designer\./,
          priority: 5,
          chunks: "initial",
          minSize: 1,
          //enforce属性为强制分割
          enforce: true,
          reuseExistingChunk: true
        },
        // 将公共部分隔离出来
        vendors: {
          name: "dsf-vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: 0,
          chunks: "initial"
        },
        common: {
          name: "dsf-common",
          minChunks: 2,
          priority: -20,
          chunks: "initial",
          reuseExistingChunk: true
        }
      }
    });
  },
  configureWebpack: {
    externals: {
      vue: "Vue",
      vuex: "Vuex",
      vant: "vant",
      "element-ui": "ELEMENT",
      ELEMENT: "ELEMENT",
      jquery: "jQuery",
      lodash: "_"
    },
    performance: {
      hints: false
    },
    plugins: [
     DefineOptions()
    ]
  },
  css: {
    // extract: true,
    extract:
      process.env.NODE_ENV === "production"
        ? {
          ignoreOrder: true,
          filename: getAssetsDir(`css/${projectFolder}/[name].css?_t=${global.timespan}`),
          chunkFilename: getAssetsDir(`css/${projectFolder}/[name].css?_t=${global.timespan}`)
        }
        : {
          ignoreOrder: true,
          filename: getAssetsDir(`css/${projectFolder}/[name].css?_t=${global.timespan}`),
          chunkFilename: getAssetsDir(`css/${projectFolder}/[name].css?_t=${global.timespan}`)
        },
    loaderOptions: {
      postcss: postCssPlugins({
        env: process.env
      }),
      scss: {
        prependData: `
        @use "~_project/assets/styles/common/index.scss" as *;
        `
      }
    }
  },
  pwa: {
    iconPaths: {
      favicon32: "favicon.ico",
      favicon16: "favicon.ico",
      appleTouchIcon: "favicon.ico",
      maskIcon: "favicon.ico",
      msTileImage: "favicon.ico"
    }
  },
  transpileDependencies: [
    /@dsf[\\/]cli-[\w\d]+[\\/](?!dist[\\/])/,
    /tiptap(-.+)?/,
    /highlight\.js/,
    /lowlight/,
    /element-ui/,
    /vue-i18n/,
    /crypto-js/,
    /prosemirror/,
    /sm-crypto/,
    /sockjs-client/
  ]
};

const chainWebpackMap = {
  dev: devConfig.chainWebpack || (() => {}),
  prod: prodConfig.chainWebpack || (() => {}),
  common: defaultConfig.chainWebpack || (() => {})
};

let useConfig = BUILD.isProduction ? prodConfig : devConfig;
let useFn = BUILD.isProduction ? "prod" : "dev";
const vueConfig = lodash.merge(defaultConfig, useConfig, {
  chainWebpack: (config) => {
    chainWebpackMap.common(config);
    chainWebpackMap[useFn](config);
  }
});

module.exports = vueConfig;
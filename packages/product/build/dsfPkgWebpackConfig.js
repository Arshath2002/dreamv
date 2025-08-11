const BUILD = require("@dsf/cli-core/build/env");
const linkTempScript = require("@dsf/cli-core/build/link");
const { getAssetsDir, getModuleDir } = require("@dsf/cli-core/build/libLoader");
const { init } = require("@dsf/cli-core/build/init");
const runType = "product";
const assetsDir = "./static";
const pageDir = BUILD.isProduction ? "" : "./platform/";

/**
 * link:是否使用软连接
 * local:打包时候是否将模块的js、css放入最终打包文件
 * root:打包后在html文件中引用的script节点的src的前缀，默认为/
 * config:模块的配置
 */
const extendLibs = {
  core: {
    link: true,
    local: !BUILD.pem,
    root: "/",
    config: require("@dsf/cli-core/build/webpack.build")
  },
  platform: {
    link: true,
    local: !BUILD.pem,
    root: "/",
    config: require("@dsf/cli-platform/build/webpack.build")
  },
  dataview: {
    link: true,
    local: true,
    root: "/",
    config: require("@dsf/cli-dataview/build/webpack.build")
  },
  iagent: {
    link: true,
    local: true,
    root: "/",
    config: require("@dsf/cli-iagent/build/webpack.build")
  },
  
};
//设置包的快捷访问名称
const dsfPkgWebpackConfig = {
  outputDir: "./dist",
  //打包时的静态目录
  assetsDir,
  pages: {},
  extendLibs,
  chainWebpack: (config) => {}
};

let libJs = [];
let pcLibJs = [];
let pcLibCss = [];
let mobileLibJs = [];
let mobileLibCss = [];
if (BUILD.isProduction) {
  libJs = [getAssetsDir(`${BUILD.DIR}/platform/static`, "js/libs/index.js")];
  pcLibJs = [getAssetsDir(`${BUILD.DIR}/platform/static`, "js/libs/index-pc.min.js")];
  pcLibCss = [getAssetsDir(`${BUILD.DIR}/platform/static`, "js/libs/index-pc.min.css")];
  mobileLibJs = [getAssetsDir(`${BUILD.DIR}/platform/static`, "js/libs/vant/vant.min.js")];
} else {
  libJs = [getAssetsDir(`${BUILD.DIR}/platform/static`, "js/libs/index.js")];
  pcLibJs = [getAssetsDir(`${BUILD.DIR}/platform/static`, "js/libs/index-pc.min.js")];
  pcLibCss = [getAssetsDir(`${BUILD.DIR}/platform/static`, "js/libs/index-pc.min.css")];
  mobileLibJs = [getAssetsDir(`${BUILD.DIR}/platform/static`, "js/libs/vant/vant.min.js")];
}
function getCommonCss(pc, mobile) {
  let css = [
    ...(pc ? pcLibCss : []),
    ...(mobile ? mobileLibCss : [])
  ];
  return css.filter((it) => it);
}
function getCommonJs(pc, mobile) {
  let scripts = [
    "/platform/setting/script",
    ...libJs,
    ...(pc ? pcLibJs : []),
    ...(mobile ? mobileLibJs : []),
    ...getModuleDir(assetsDir, "core", null, "js", extendLibs["core"]),
    getAssetsDir("common", `/config_${runType}.js`, BUILD.isDevelopment),
    // `common/global.js`,
    `/platform/module/json`
  ];
  return scripts.filter((it) => it);
}
// 默认页面配置
function createDefaultPages() {
  //平台默认入口
  const defaultPages = linkTempScript({
    //PC主入口，默认样式
    app: {
      entry: "./src/pc/main.js",
      template: "./src/template/index.html",
      filename: `${pageDir}index.html`,
      minify: {
        removeComments: false,
        collapseWhitespace: true
      },
      chunks: ["manifest", "dsf-vendors", "dsf-common", "dsf-pc", "app"],
      title: "",
      includeCss: [
        ...getCommonCss(true),
        ...getModuleDir(assetsDir, "platform", "pc", "css", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "pc", "css", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "pc", "css", extendLibs["iagent"]),
        
      ],
      includeScripts: [
        ...getCommonJs(true),
        ...getModuleDir(assetsDir, "platform", "pc", "js", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "pc", "js", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "pc", "js", extendLibs["iagent"]),
      ],
    },
    //PC主入口，默认样式
    app1: {
      entry: "./src/pc/main.js",
      template: "./src/template/index.html",
      filename: `${pageDir}index1.html`,
      minify: {
        removeComments: false,
        collapseWhitespace: true
      },
      chunks: ["manifest", "dsf-vendors", "dsf-common", "dsf-pc", "app"],
      title: "",
      includeCss: [
        ...getCommonCss(true),
        ...getModuleDir(assetsDir, "platform", "pc", "css", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "pc", "css", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "pc", "css", extendLibs["iagent"]),
      ],
      includeScripts: [
        ...getCommonJs(true),
        ...getModuleDir(assetsDir, "platform", "pc", "js", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "pc", "js", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "pc", "js", extendLibs["iagent"]),
      ],
    },
    //PC主入口，默认样式
    app2: {
      entry: "./src/pc/main.js",
      template: "./src/template/index.html",
      filename: `${pageDir}index2.html`,
      minify: {
        removeComments: false,
        collapseWhitespace: true
      },
      chunks: ["manifest", "dsf-vendors", "dsf-common", "dsf-pc", "app"],
      title: "",
      includeCss: [
        ...getCommonCss(true),
        ...getModuleDir(assetsDir, "platform", "pc", "css", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "pc", "css", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "pc", "css", extendLibs["iagent"]),
      ],
      includeScripts: [
        ...getCommonJs(true),
        ...getModuleDir(assetsDir, "platform", "pc", "js", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "pc", "js", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "pc", "js", extendLibs["iagent"]),
      ],
    },
    //PC端次入口，无菜单
    subPage: {
      entry: "./src/pc/main.js",
      template: "./src/template/index.html",
      filename: `${pageDir}page.html`,
      minify: {
        removeComments: false,
        collapseWhitespace: true
      },
      chunks: ["manifest", "dsf-vendors", "dsf-common", "dsf-pc", "subPage"],
      title: "",
      includeCss: [
        ...getCommonCss(true),
        ...getModuleDir(assetsDir, "platform", "pc", "css", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "pc", "css", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "pc", "css", extendLibs["iagent"]),
      ],
      includeScripts: [
        ...getCommonJs(true),
        ...getModuleDir(assetsDir, "platform", "pc", "js", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "pc", "js", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "pc", "js", extendLibs["iagent"]),
      ],
    },
    //PC端次入口，多页签
    multiPage: {
      entry: "./src/pc/main.js",
      template: "./src/template/index.html",
      filename: `${pageDir}multiPage.html`,
      minify: {
        removeComments: false,
        collapseWhitespace: true
      },
      chunks: ["manifest", "dsf-vendors", "dsf-common", "dsf-pc", "multiPage"],
      title: "",
      includeCss: [
        ...getCommonCss(true),
        ...getModuleDir(assetsDir, "platform", "pc", "css", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "pc", "css", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "pc", "css", extendLibs["iagent"])
      ],
      includeScripts: [
        ...getCommonJs(true),
        ...getModuleDir(assetsDir, "platform", "pc", "js", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "pc", "js", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "pc", "js", extendLibs["iagent"])
      ],
    },
    //移动端页面入口
    "mobile-app": {
      entry: "./src/mobile/main.js",
      template: "./src/template/mobileIndex.html",
      filename: `${pageDir}mobile-index.html`,
      minify: {
        removeComments: false,
        collapseWhitespace: true
      },
      chunks: ["manifest", "dsf-vendors", "dsf-common", "dsf-mobile", "mobile-app"],
      title: "",
      includeCss: [
        ...getCommonCss(false, true),
        ...getModuleDir(assetsDir, "platform", "mobile", "css", extendLibs["platform"], "/"),
        ...getModuleDir(assetsDir, "dataview", "mobile", "css", extendLibs["dataview"], "/"),
        ...getModuleDir(assetsDir, "iagent", "mobile", "css", extendLibs["iagent"], "/"),
      ],
      includeScripts: [
        ...getCommonJs(false, true),
        ...getModuleDir(assetsDir, "platform", "mobile", "js", extendLibs["platform"],"/"),
        ...getModuleDir(assetsDir, "dataview", "mobile", "js", extendLibs["dataview"],"/"),
        ...getModuleDir(assetsDir, "iagent", "mobile", "js", extendLibs["iagent"],"/"),
      ],
    },
    // pc端设计器入口
    "designer-app": {
      entry: "./src/designer/main.js",
      template: "./src/template/designerIndex.html",
      filename: `${pageDir}designer.html`,
      title: "",
      minify: {
        removeComments: false,
        collapseWhitespace: true
      },
      chunks: ["manifest", "dsf-vendors", "dsf-common", "dsf-pc", "dsf-mobile", "dsf-designer", "designer-app"],
      includeCss: [
        ...getCommonCss(true, true),
        ...getModuleDir(assetsDir, "platform", "designer", "css", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "designer", "css", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "designer", "css", extendLibs["iagent"]),
      ],
      includeScripts: [
        ...getCommonJs(true, true),
        ...getModuleDir(assetsDir, "platform", "designer", "js", extendLibs["platform"]),
        ...getModuleDir(assetsDir, "dataview", "designer", "js", extendLibs["dataview"]),
        ...getModuleDir(assetsDir, "iagent", "designer", "js", extendLibs["iagent"]),
      ],
    },
  });

  //产品页面自定义入口
  const pages = {};
  if (BUILD.isProduction) {
    // for (let k in defaultPages) {
    //   defaultPages[k].filename = defaultPages[k].filename.replace(/.html$/, `_${runType}.html`);
    // }
  }
  dsfPkgWebpackConfig.pages = { ...defaultPages, ...pages };
}

module.exports = function (pkgInfo) {
  createDefaultPages();
  init({ dsfPkgWebpackConfig, extendLibs });
  return dsfPkgWebpackConfig;
};

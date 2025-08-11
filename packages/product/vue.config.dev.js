const path = require("path");
const proxy = require("@dsf/cli-core/build/proxywatch");
proxy.init(path.resolve(__dirname, "proxy.config.js"));
// 开发环境
module.exports = function () {
  return {
    publicPath: "/",
    productionSourceMap: true,
    // 更多见 https://webpack.docschina.org/configuration/dev-server/#devservery
    devServer: {
      port: 8080,
      host: "0.0.0.0",
      // 服务启动后自动打开浏览器
      open: true,
      openPage: "platform/page.html#/pc/login",
      // headers: {
      //   Pragma: "no-cache",
      //   "Cache-Control": "no-cache",
      //   Expires: "0"
      // },
      // 是否使用https
      https: false,
      // 模块热替换
      hot: true,
      hotOnly: true,
      noInfo: false,
      lazy: false,
      overlay: false,
      filename: "bundle.js",
      // 一切服务都启用gzip 压缩
      compress: true,
      inline: false,
      disableHostCheck: true,
      // historyApiFallback: {
      //   rewrites: [
      //     { from: /^\/index/, to: "/index.html" },
      //     { from: /^\/page/, to: "/page.html" },
      //     { from: /^\/designer/, to: "/designer.html" },
      //     { from: /^\/mobile-index/, to: "/mobile-index.html" }
      //   ]
      // },
      proxy: {
        "^/nacos/*": {
          target: "/",
          changeOrigin: true,
          secure: false,
          router: (req) => proxy.getActiveProxy("nacos", req),
          headers: {
            Connection: "keep-alive" // add this can fix this issue
          }
        },
        "^/setting/*": {
          target: "/",
          changeOrigin: true,
          secure: false,
          router: (req) => proxy.getActiveProxy("setting", req),
          headers: {
            Connection: "keep-alive" // add this can fix this issue
          }
        },
        // "^/dataview/*": {
        //   target: "/",
        //   changeOrigin: true,
        //   secure: false,
        //   pathRewrite: { "^/dataview": "" },
        //   router: (req) => proxy.getActiveProxy("proxyview", req),
        //   headers: {
        //     Connection: "keep-alive" // add this can fix this issue
        //   }
        // },
        "^/pc/*": {
          target: "/",
          changeOrigin: true,
          secure: false,
          router: (req) => proxy.getActiveProxy("pc", req),
          headers: {
            Connection: "keep-alive" // add this can fix this issue
          }
        },
        "^/mobile/*": {
          target: "/",
          changeOrigin: true,
          secure: false,
          router: (req) => proxy.getActiveProxy("mobile", req),
          headers: {
            Connection: "keep-alive" // add this can fix this issue
          }
        },
        "/": {
          target: "/",
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: "0.0.0.0",
          router: (req) => proxy.getActiveProxy("/", req),
          headers: {
            Connection: "keep-alive" // add this can fix this issue
          },
          onProxyRes: (proxyRes, proxyReq) => {
            // 确保代理正确处理 SSE 的响应头不被压缩
            if (proxyRes.headers['content-type'] == 'text/event-stream') {
              delete proxyReq.headers['Accept-Encoding'];
              delete proxyReq.headers['accept-encoding'];
            }
          },
          // bypass: function (req) {
          //   let { host, origin, referer } = req.headers;
          //   let result = proxy.getActiveProxy("/", req).match(/(^https?:\/\/)([.\w\d:]+)/);
          //   referer && (req.headers.referer = referer.replace(host, result[2]));
          //   host && (req.headers.host = result[2]);
          //   origin && (req.headers.origin = result[0]);
          //   let map = {
          //     "/index/": "index.html",
          //     "/page/": "/page.html",
          //     "/designer/": "/designer.html",
          //     "/mobile-index/": "/mobile-index.html"
          //   };
          //   for (let k in map) {
          //     if (req.path.startsWith(k)) {
          //       return map[k];
          //     }
          //   }
          // }
        }
      }
    },
    configureWebpack: {
      devtool: "source-map" //'eval-source-map'
    }
  };
};

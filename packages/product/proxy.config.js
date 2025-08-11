/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-06-02 11:12:27
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 17:29:54
 */


// 开发环境
// let proxyUrl = "http://192.168.0.62:1024/";  
// let proxyUrl = "http://192.168.0.25:16201/"
// let proxyUrl = "http://192.168.0.62:1019/" 

// let proxyUrl = "http://192.168.0.244:9102/"; // 可以进行测试北京二包地址
// let proxyUrl = "http://192.168.0.161:32229/"; // 可以进行测试北京二包13地址

// let proxyUrl = "http://192.168.0.13:9095/";
// let proxyUrl = "http://192.168.0.149:1024/"; // 北京二包地址
// let proxyUrl = "http://192.168.5.165:9083/";//张钰杰
// let proxyUrl = "http://192.168.5.156:8085/";//平台张鹏

// let proxyUrl = "http://192.168.0.161:32667/" // 平台

// let proxyUrl = "http://192.168.0.103:31238/"; // 杨杰环境
let proxyUrl = "http://192.168.0.171:9083/"; // 大屏6.0.0的环境
// let proxyUrl = "http://192.168.0.244:9102/"; // 数据管理系统(二包)
// let proxyUrl = "http://192.168.0.171:8083/"; // 大屏发布的环境
// let proxyUrl = "https://cgyy.zjdx.gov.cn/"; // 浙江驾校对应的环境
// let proxyUrl = "http://192.168.0.161:32229/"; // 茂总环境

// 动态配置代理，无需重启服务
define({
  // 当前激活的代理
  active: "171:8080",
  config: {
    "161:32667": "http://192.168.0.161:32667/", // 平台地址
    "171:8080": {
      "setting": proxyUrl,
      "default": proxyUrl // 默认
    },
  }
});


//注入平台公共接口调用
export default (dsf) => {
  let addAPI = dsf.api.addAPI;
  //每个函数最后二个参数必须是options和baseUrl，且函数不可以使用箭头函数
  // addAPI("demo", function (ns, params,options, baseUrl) {
  //   let url = "xxx/xxx/xxx"
  //   return this.$http.get(url, params, options,baseUrl);
  // });
}
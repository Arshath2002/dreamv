//api注册示例,
//注：
//1.第二个参数为一个函数类型不要使用箭头函数进行注册，否则后续无法将this指针绑定到组件示例。
//2.最后一个参数必须是baseUrl
// dsf.api.addAPI("projectApi", function (params, baseUrl) {
//   this.$http.get("/xxx/xxx/xx", params, null, baseUrl)
// });
/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-05-27 10:49:40
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-08 19:12:29
 */
const componentMap = new Map([
  ["DsfDataViewTable", { actual: "DsfDataViewLargeTable" }],
  ["DsfDataViewStackedBar", { actual: "DsfDataViewMixinAxis", extra: { stack: true,type: "bar" } }],
  ["DsfDataViewBar", { actual: "DsfDataViewMixinAxis", extra: { type: "bar" } }],
  ["DsfDataViewPolyline", { actual: "DsfDataViewMixinAxis", extra: { type: "line" } }],
  ["DsfDataViewHorizontalBar", { actual: "DsfDataViewBar", extra: { isReturn: true } }],
  ["DsfDataViewStackHorizontalBar", { actual: "DsfDataViewBar", extra: { isReturn: true, stack: true } }],
  ["DsfDataViewCirclePie", { actual: "DsfDataViewPie", extra: { isCircle: true } }],
]);
export { componentMap };

/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-07-21 11:17:17
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-29 11:36:00
 */
const { add, addAsync } = dsf.mixins;
// add("dataView", () => require("./dataView").default);
addAsync("dataView", () => import(/*webpackChunkName:"dataview_mixin_dataview"*/ "./dataView"));


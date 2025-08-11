/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-04-10 09:12:28
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-14 16:11:41
 */

/**
 * 公共组件-所有组件都有的事件
 */
const commonEvents = {
  显示: function fn() {
    this.handleShow();
    return this;
  },
  隐藏: function fn() {
    this.handleHidden();
    return this;
  },
  切换显示状态: function fn() {
    this.toggleShow()
    return this
  },
  获取实例: function fn() {
    return this;
  },
};

/**
 * 存在dataType 数据的组件
 */
const dataEvent = {
  ...commonEvents,
  获取查询参数: function fn() {
    return this.handleParams(...arguments);
  },
  更新数据源: function fn(url) {
    return this.handleUpdateDataUrl(...arguments);
  },
  获取数据源: function fn() {
    return this.handleGetDataSource();
  },
  更新接口参数: function fn(key, val) {
    return this.handleUpdateInterfaceParams(...arguments);
  },
  更新综合表参数: function fn(key, val) {
    return this.handleUpdateParams(...arguments);
  },
  更新数据源参数: function fn(key, val) {
    return this.handleUpdateDataSourceParams(...arguments);
  },
  获取当前值: function fn() {
    return this.handleGetValue(...arguments);
  },
  获取原始值: function fn() {
    return this.handleGetOriginValue(...arguments);
  },
  添加过滤规则: function fn(key, rule, option) {
    return this.addFilterRules(...arguments);
  },

};

const chartCommon = {
  ...dataEvent,
  刷新: function fn() {
    return this.beforeInit();
  },
  获取配置项: function fn() {
    return this.handleGetOption();
  },
  设置配置项: function fn(option) {
    return this.handleSetOption(option);
  },
  设置标题: function fn(name) {
    return this.handleTitle(name);
  },
  还原数据: function fn() {
    return this.fakeRestoreData();
  },
  添加指标: function fn(seriesName, data) {
    return this.handleAddGraphItem(...arguments);
  },
  删除指标: function fn(seriesName, name) {
    return this.handleDeleteGraphItem(...arguments);
  },
  重绘: function fn() {
    return this.reset();
  },
  设置宽度: function fn(width) {
    return this.handleSetWidth(width);
  },
  设置高度: function fn(height) {
    return this.handleSetHeight(height);
  },
  获取高度: function fn() {
    return this.handleGetHeight();
  },
  获取宽度: function fn() {
    return this.handleGetWidth();
  },
  获取当前值: function fn() {
    return this.handleGetValue(...arguments);
  },
};
export { dataEvent, chartCommon, commonEvents };

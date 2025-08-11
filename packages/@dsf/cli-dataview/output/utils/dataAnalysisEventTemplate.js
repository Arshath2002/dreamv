/*
 * @Description: 数据分析事件模板
 * @Author: shenah
 * @Date: 2023-04-06 09:54:12
 * @LastEditors: shenah
 * @LastEditTime: 2023-12-25 16:47:21
 */

export const dataAnalysis = {
  刷新: function fn() {
    return this.refreshDataEvent();
  },
  还原数据: function fn() {
    return this.resetDataEvent();
  },
  追加数据: function fn(data) {
    return this.appendDataEvent(data);
  },
  删除数据: function fn(str, field) {
    return this.delDataEvent(str, field);
  },
  显示列: function fn(str) {
    return this.showTableColEvent(str);
  },
  隐藏列: function fn(str) {
    return this.hideTableColEvent(str);
  },
  获取列: function fn(str) {
    return this.getTableColEvent(str);
  },
  获取行: function fn(str) {
    return this.getTableRowEvent(str);
  },
  替换数据: function fn(one) {
    return this.replaceDataEvent(one);
  },
  设置值: function fn(one) {
    return this.setDataEvent(one);
  },
  设置内容: function fn(content) {
    return this.handleSetContent(...arguments);
  },

};

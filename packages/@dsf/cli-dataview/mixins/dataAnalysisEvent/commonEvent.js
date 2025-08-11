/*
 * @Description: 数据分析伪代码公用方法实现
 * @Author: shenah
 * @Date: 2023-04-11 17:04:43
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-14 14:43:33
 */
export default {
  // 刷新方法
  refreshDataEvent() {
    this.init();
    return this;
  },
  // 添加数据
  appendDataEvent(data) {
    if (Array.isArray(this.data)) {
      if (Array.isArray(data)) {
        this.data.push([...data]);
      } else {
        this.data.push(data);
      }
     this.dataAnalysis(this.data)
    }
    return this;
  },
  /**
   * @description: 删除数据
   *@param {string | number} sort 下标(传入1就是删除第一个,依次类推)删除、以及名称删除
   * @param {string} field 支持传入动态字段
   */
  delDataEvent(str, field = "name") {
    if (Array.isArray(this.data)) {
      let isNumber = typeof str === "number";
      let argLength = [...arguments].filter(
        (item) => item !== undefined && item !== null
      ).length;
      let index = 0;
      if (isNumber && argLength === 1) {
        index = str - 1;
      } else {
        index = this.data.findIndex((item) => item[field] == str);
        if (index === -1) {
          return this;
        }
      }
      this.data.splice(index, 1);
      this.dataAnalysis(this.data)
    }
    return this;
  },
  // 还原数据
  resetDataEvent() {
    this.refreshDataEvent();
    return this;
  },
  setDataEvent(data) {
    //目前就只有时间线有这个方法
  },
  getCurrentDataEvent(data) {
    //目前就只有时间线有这个方法
  },
};

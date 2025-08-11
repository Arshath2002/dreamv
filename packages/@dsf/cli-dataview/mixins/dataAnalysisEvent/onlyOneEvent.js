/*
 * @Description: 数组里面只有一个数据的伪代码实现方法
 * @Author: shenah
 * @Date: 2023-04-11 17:06:12
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-14 18:05:54
 */
export default {
  /**
   * @description: 替换数据
   * @param {*} obj
   * @return {*}
   */
  replaceDataEvent(obj) {
    if (typeof obj === "number" || typeof obj === "string") {
      obj = [obj];
    } else if (obj && typeof obj === "object") {
      let field = this.mapRelations[0].map;
      if (field) {
        obj = [obj[field]];
      }
    }
    this.dataAnalysis(data);
  },
};

/*
 * @Description: 普通列表伪代码的实现
 * @Author: shenah
 * @Date: 2023-04-11 17:00:15
 * @LastEditors: shenah
 * @LastEditTime: 2023-12-25 16:21:14
 */

export default {
  //显示列
  showTableColEvent(str) {
    let header = _.cloneDeep(this.header);
    if (str) {
      for (let i = 0; i < header.length; i++) {
        let oneHeader = header[i];
        if (str === oneHeader.label) {
          oneHeader.hide = false;
          break;
        }
      }
    } else {
      header.forEach((item) => (item.hide = false));
    }
    this.header = _.cloneDeep(header);
    return this;
  },
  //隐藏列
  hideTableColEvent(str) {
    let isNumber = typeof str === "number" ? true : false;
    let index = 0;
    let filterHeader = this.header.filter((item) => !item.hide);
    if (isNumber) {
      index = str - 1;
    } else {
      index = filterHeader.findIndex((item) => item.label === str);
    }
    if (index > -1) {
      let headerOne = filterHeader[index];
      headerOne.hide = true;
      this.header = _.cloneDeep(this.header);
    }
    return this;
  },
  // 获取当前列
  getTableColEvent(str) {
    let obj = {};
    let isNumber = typeof str === "number" ? true : false;
    let index = 0;
    if (isNumber) {
      index = str - 1;
    } else {
      index = this.header.findIndex((one) => one.label === str);
    }
    let header = this.header[index] || {};
    let label = header.label || "";
    let field = header.map || "";
    let value = this.data.map((item) => item[field] || "");
    obj = {
      label,
      value,
    };
    return obj;
  },
  // 获取当前行
  getTableRowEvent(str) {
    let obj = {};
    let isNumber = typeof str === "number" ? true : false;
    let index = 0;
    let label = this.header.map((item) => item.label);
    let maps = this.header.map((item) => item.map);
    let value = [];
    if (isNumber) {
      index = str - 1;
      let one = this.data[index];
      if (one) {
        maps.forEach((field) => {
          value.push(one[field] || "");
        });
      }
    } else {
      for (let i = 0; i < this.data.length; i++) {
        let one = this.data[i];
        let val = Object.values(one);
        if (val.indexOf(str) > -1) {
          maps.forEach((field) => {
            value.push(one[field] || "");
          });
          break;
        }
      }
    }
    obj = {
      label,
      value,
    };
    return obj;
  }
};

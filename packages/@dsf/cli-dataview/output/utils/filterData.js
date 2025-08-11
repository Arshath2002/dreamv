/*
 * @Description: 采用策略模式进行数据过来
 * @Author: shenah
 * @Date: 2023-08-10 11:03:49
 * @LastEditors: shenah
 * @LastEditTime: 2024-12-17 13:50:17
 */
export const filterConditionStrategy = {
  //等于
  equalTo: function (switchData, item, isCal = false) {
    let conditions = item.threshold?.split(",") || [];
    let key = item.valueName;
    //是否用于计算
    if (isCal) {
      //防止字符串和数字不等 都转化字符串比较
      return key && conditions.includes(switchData[key] + "");
    }
    return switchData.filter(
      (data) => key && conditions.includes(data[key] + "")
    );
  },
  //不等于
  notEqualTo: function (switchData, item, isCal = false) {
    let conditions = item.threshold?.split(",") || [];
    let key = item.valueName;
    if (isCal) {
      return key && !conditions.includes(switchData[key] + "");
    }
    return switchData.filter(
      (data) => key && !conditions.includes(data[key] + "")
    );
  },
  //模糊匹配
  involve: function (switchData, item, isCal = false) {
    let key = item.valueName;
    if (isCal) {
      return key && ~(switchData[key] + "").indexOf(item.threshold);
    }
    return switchData.filter(
      (data) => key && ~(data[key] + "").indexOf(item.threshold)
    );
  },
  //大于
  greaterThan: function (switchData, item, isCal = false) {
    let key = item.valueName;
    if (isCal) {
      return key && switchData[key] - item.threshold > 0;
    }
    return switchData.filter((data) => key && data[key] - item.threshold > 0);
  },
  //大于等于
  greaterThanOrEqual: function (switchData, item, isCal = false) {
    let key = item.valueName;
    if (isCal) {
      return key && switchData[key] - item.threshold >= 0;
    }
    return switchData.filter((data) => key && data[key] - item.threshold >= 0);
  },
  //小于
  lessThan: function (switchData, item, isCal = false) {
    let key = item.valueName;
    if (isCal) {
      return key && switchData[key] - item.threshold < 0;
    }
    return switchData.filter((data) => key && data[key] - item.threshold < 0);
  },
  //小于等于
  lessThanOrEqual: function (switchData, item, isCal = false) {
    let key = item.valueName;
    if (isCal) {
      return key && switchData[key] - item.threshold <= 0;
    }
    return switchData.filter((data) => key && data[key] - item.threshold <= 0);
  },
  //开头匹配
  start: function (switchData, item, isCal = false) {
    let key = item.valueName;
    if (isCal) {
      return (switchData[key] + "").startsWith(item.threshold);
    }
    return switchData.filter((data) =>
      (data[key] + "").startsWith(item.threshold)
    );
  },

  //结尾匹配
  last: function (switchData, item, isCal = false) {
    let key = item.valueName;
    if (isCal) {
      return (switchData[key] + "").endsWith(item.threshold);
    }
    return switchData.filter((data) =>
      (data[key] + "").endsWith(item.threshold)
    );
  },
  //数据截取
  intercept: function (switchData, item) {
    let [start, end] = item.threshold.split(",");
    if (item.startVal !== undefined) {
      // 拆分成两个,前面是为
      start = item.startVal;
      end = item.endVal;
    }
    return switchData.slice(start, end);
  },
  //不为空
  notEmpty: function (switchData, item, isCal = false) {
    let key = item.valueName;
    if (isCal) {
      let val = switchData[key] + "";
      return val != "" && val != null && val != undefined;
    }
    return switchData.filter(
      (data) =>
        key && data[key] != "" && data[key] != null && data[key] != undefined
    );
  },
  //保留几位小数
  decimal: function (switchData, item) {
    let key = item.valueName;
    let num = item.threshold;
    let flag = item.keepZero === undefined ? false : item.keepZero;
    return switchData.map((data) => {
      let item = { ...data };
      item[key] = dsf.dataview.utils.handleDecimal(item[key], num, flag);
      return item;
    });
  },
  //去除空格
  spliceEmpty: function (switchData, item) {
    let key = item.valueName;
    return switchData.map((data) => {
      let item = { ...data };
      item[key] = item[key]?.replace(/\s/g, "");
      return item;
    });
  },
  //去除空数据
  selectNotEmpty: function (switchData, item) {
    return switchData.filter((data) =>
      Object.keys(data).some((key) => data[key])
    );
  },
  // 单位转化
  unitConvert: function (switchData, item) {
    let nowData = _.cloneDeep(switchData);
    let field = item.valueName;
    let unitCode = item.unitCode;
    let keepUnitDecimal = item.keepUnitDecimal;
    nowData.forEach((oneData) => {
      if (keepUnitDecimal === "") {
        oneData[field] = dsf.dataview.utils.transformUnit(
          oneData[field],
          unitCode,
          false
        );
      } else {
        let val = dsf.dataview.utils.transformUnit(
          oneData[field],
          unitCode,
          false
        );
        oneData[field] = dsf.dataview.utils.handleDecimal(val, keepUnitDecimal);
      }
    });
    return nowData;
  },
  //自定义
  custom: function (switchData, item) {
    return switchData.filter((data) => {
      let params = this.$expressParams(data);
      return this.$eval(item.threshold, params);
    });
  },
  // 升序
  asc: function (switchData, item) {
    let data = _.cloneDeep(switchData);
    let field = item.valueName;
    return data.sort((a, b) => a[field] - b[field]);
  },
  // 降序
  desc: function (switchData, item) {
    let data = _.cloneDeep(switchData);
    let field = item.valueName;
    return data.sort((a, b) => b[field] - a[field]);
  },
};

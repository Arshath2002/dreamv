/*
 * @Description:
 * @Author: shenah
 * @Date: 2023-04-28 10:15:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-10 15:30:23
 */
import { filterConditionStrategy } from "./filterData.js";
import { handleColor } from "_dataview/output/config/commonConfig";
import { createDefaultImageVar } from "_dataview/output/config/backgroundExtend.js";

const objectToString = function (o, root) {
  if (o === null) {
    return "null,\n";
  } else if (typeof o === "string") {
    return JSON.stringify(o) + ",\n";
  } else if (typeof o === "function") {
    return o.toString() + ",";
  } else if (Array.isArray(o)) {
    let val = `[
      `;
    o.forEach((it) => {
      val += objectToString(it);
    });
    val += `]`;
    if (root) {
      return `${val}\n`;
    }
    return `${val},\n`;
  } else if (typeof o === "object") {
    let val = `{
      `;
    Object.keys(o).forEach((key) => {
      val += `"${key}":`;
      val += objectToString(o[key]);
    });
    val += `}`;
    if (root) {
      return `${val}\n`;
    }
    return `${val},\n`;
  } else {
    return `${o},\n`;
  }
};
/**
 * @description: 处理小数不用对象的方式传
 * @param {string|number} data 传入的数据
 * @param {number} digit 保留几位小数
 * @param {boolean} isKeep 是否保留0
 * @param {number} type 0代表四舍五入1代表向上取证2代表向下舍入
 * @return {string|number} 保留0就是字符串,不保留就是number
 */
let handleDecimal = (data, digit = -1, isKeep = false, type = 0) => {
  let nowData = Number(data);
  if (isNaN(nowData) || digit < 0 || digit > 100) {
    return data;
  }
  let methodObj = {
    0: _.round,
    1: _.ceil,
    2: _.floor,
  };
  let method = methodObj[type];
  if (!method) {
    return data;
  }
  nowData = method(nowData, digit);
  if (isKeep) {
    return nowData?.toFixed(digit) || data;
  }
  if (isNaN(nowData)) {
    return data;
  }
  return nowData;
};

//默认静态数据转化成luncysheet表格二维数据
const transformToExcelData = (data, desc) => {
  //字段数组
  let fields = Object.keys(desc);
  //字段名描述
  let fieldDesc = Object.values(desc);
  let res = [];
  res.push(["字段名", ...fields]);
  res.push(["字段名描述", ...fieldDesc]);

  for (let i = 0; i < data.length; i++) {
    let cell = data[i];
    let row = [null];
    fields.forEach((field) => {
      row.push(cell[field]);
    });
    if (row.length > 1) {
      res.push([...row]);
    }
  }
  return res;
};
//lunckysheet表格二维数据集转成JSON
const transformExcelDataToJSON = (data) => {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return { res: [], mapList: [] };
  let res = [];
  let mapList = [];
  let fields = data[0];
  let decs = data[1];
  for (let i = 1; i < fields.length; i++) {
    let field = fields[i];
    mapList.push({
      name: decs[i] || field,
      value: field,
    });
  }
  for (let i = 2; i < data.length; i++) {
    let resData = {};
    let row = data[i];
    for (let j = 1; j < row.length; j++) {
      let str = row[j] !== undefined ? row[j] : "";
      //字段名
      let key = fields[j];
      let value = str;
      resData[key] = value;
    }
    res.push(resData);
  }

  return { res, mapList };
};

/**
 * @name: 数字转化为千分位
 * @param {*} str 任意类型
 * @return {*} string
 */
let toThSeparator = (str) => {
  // 将数字转换为字符串
  if (!dsf.isNumber(str)) {
    return str;
  }
  let strNumber = str?.toString() || "";
  // 使用正则表达式添加千分位分隔符
  strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return strNumber;
};

/**
 * @description: 数字单位换算
 * @param {*} number 数据
 * @param {*} unitVal 分割量级(如10,100)
 * @param {*} decimalNum 小数位
 * @param {*} divider 分割符
 * @return {*} number
 */
let transformUnit = function (number, unitVal, isUnit = true, decimalNum, divider) {
  let unitObj = dsf.dataview.units;
  let unit = unitObj[unitVal];
  if (!number || isNaN(Number(number))) {
    return number;
  }
  if (unit) {
    number = number / unitVal;
  }
  const strSplit = number.toString().split(".");
  const integer = strSplit[0];
  let decimal = strSplit[1] || "";
  if (decimalNum && decimal) {
    decimal = decimal.substr(0, decimalNum);
  }
  if (divider) {
    return integer.replace(/\B(?=(\d{3})+(?!\d))/g, divider) + (decimal ? "." + decimal : "") + (isUnit ? unit : "");
  }
  return integer + (decimal ? "." + decimal : "") + (isUnit ? unit : "");
};

const compatiblePathToExtendImg = function (obj, active = "custom") {
  if (!obj || typeof obj === "string") {
    return {
      active,
      custom: {
        image: obj ? obj : "",
        static: true,
        size: "cover",
        repeat: "no-repeat",
        position: "center",
      },
    };
  }
  return obj;
};
const compatiblePathToExtendShowImg = function (obj) {
  let nowObj = dsf.dataview.utils.compatiblePathToExtendImg(obj);
  let url = nowObj?.custom.image || "";

  return url;
};
//将样式转换为css样式格式
const transformToStyle = function (options) {
  let style = "";
  Object.keys(options).forEach((key) => {
    style += key.replace(/([A-Z])/g, function (match) {
      return "-" + match.toLowerCase();
    });
    style += ":";
    let value = options[key];
    if (Array.isArray(value)) {
      value = value.join("px ") + "px";
    } else if (dsf.isNumber(value)) {
      value += "px";
    }
    style += value + ";";
  });
  return style;
};

/**
 * 解析tooltip中html中的属性的值并转化为echarts相应的属性
 * @param {*} html 需要解析的html
 * @param {*} param formatter对应的单个param
 * @param {*} param hiddenField 置空字段
 * @param {*} param fieldsStyleRules 字段样式规则
 * @return {*}
 */
const analyzeToolTipHTMLAttr = function (html, param, type = "chart", hiddenField = [], fieldsStyleRules = []) {
  // 创建一个临时容器元素
  const container = document.createElement("div");
  container.innerHTML = html;
  // 获取含有 real-value 属性的元素
  const elements = container.querySelectorAll("[real-value]");

  let data = param || {};
  if (type === "gis") {
    data = param.properties;
  } else if (type === "chart") {
    const chartData = param.data || {};
    data = { ...param, ...chartData };
  }

  elements.forEach((element) => {
    const realValue = element.getAttribute("real-value");
    //找出匹配的样式规则
    const rules = fieldsStyleRules.filter((it) => it.valueName == realValue);
    //规则样式
    const computedStyle = dsf.dataview.utils.calculateStyle(rules, data);

    element.setAttribute("style", computedStyle);
    let replacement = "";
    switch (type) {
      case "chart":
        let val = data[realValue];
        //处理渐变marker--处理如果渐变有个透明marker不显示
        if (realValue.startsWith("marker")) {
          let index = realValue.split("_")[1];
          let colorStops = null;
          if (!index && param.color?.colorStops) {
            colorStops = param.color.colorStops;
          } else if (index && param["color_" + index]?.colorStops) {
            colorStops = param["color_" + index].colorStops;
          }
          if (colorStops) {
            let color1 = colorStops[0].color;
            let color2 = colorStops[1].color;
            let makerEl = $(val)[0];
            if (makerEl) {
              makerEl.style.background = "linear-gradient(" + color1 + ", " + color2 + ")";
              val = makerEl.outerHTML;
            }
          }
        }
        // 处理显示问题
        replacement = typeof val === "number" ? val : val || "-";
        break;
      default:
        replacement = data[realValue] === undefined ? "--" : data[realValue];
        break;
    }
    if (hiddenField?.indexOf(realValue) > -1) {
      replacement = "";
    }
    element.innerHTML = replacement;
  });
  // 返回替换后的 HTML 字符串
  return container.innerHTML;
};

/**
 * @param {Array} rules 规则数组
 * @param {Object} data 数据
 * @param {String} style 样式字符串
 */
const calculateStyle = function (rules, data) {
  let style = {};
  rules.forEach((rule) => {
    //没有规则
    if (rule.rule === "none") {
      style = dsf.mix(true, {}, rule.style);
      //有规则，规则必须存在
    } else if (rule.rule) {
      let fn = filterConditionStrategy[rule.rule];
      if (typeof fn === "function" && fn(data, rule, true)) {
        style = dsf.mix(true, {}, rule.style);
      }
    }
  });
  return dsf.dataview.utils.transformToStyle(style);
};

/**
 * 判断是否有内容
 * @param {*} html
 * @return {*}
 */
const hasTextContent = function (html) {
  let reg = /(<(.[^>]*)>)|(&nbsp;)/g;
  html = html?.replace(reg, "").trim() || "";
  if (html) {
    return true;
  }
  return false;
};

//拍平树
const flatTree = function (tree, cKey = "children") {
  let result = [];
  if (!Array.isArray(tree)) return [];
  tree = dsf.mix(true, [], tree);
  while (tree.length) {
    let current = tree.shift();
    let { [cKey]: children, ...properties } = current;
    result.push(properties);
    if (children && children.length) {
      tree.push(...children);
    }
  }
  return result;
};

//构建树
const establishTree = function (arr, id, realId, realPid, childrenField = "children", lastLevelChildrenFlag = true) {
  id = id + "";
  let map = new Map();
  arr.forEach((it) => {
    let _id = it[realId] + "";
    let current = map.get(_id);
    if (!current) {
      it[childrenField] = [];
      map.set(_id, it);
    } else {
      let children = current[childrenField];
      it[childrenField] = children;
    }
    let pid = it[realPid] + "";
    let parent = map.get(pid);
    if (parent) {
      parent[childrenField].push(it);
    } else {
      map.set(pid, {
        [childrenField]: [it],
      });
    }
  });
  // 最后一级子节点不显示children
  if (!lastLevelChildrenFlag) {
    arr.forEach((item) => {
      if (!item[childrenField].length) {
        delete item[childrenField];
      }
    });
  }
  if (map.get(id)) {
    return map.get(id)[childrenField];
  } else {
    return [];
  }
};

const transformPx = function (size, isRem = true) {
  if (dsf.isNumber(size) || /^\d+$/g.test(size)) {
    size += "px";
  }
  if (isRem) {
    size = dsf.pxToRem(size);
  }
  return size;
};
const transformArrayPx = function (arr) {
  if (!Array.isArray(arr)) {
    return arr;
  }
  let list = [];
  list = arr.map((str) => transformPx(str)).join(" ");
  return list;
};

//背景解析
const $colorFormat = function (opt, analysis) {
  if (!opt) {
    return {};
  }
  let getWebPath = dsf.url.getWebPath;

  if (typeof analysis === "function") {
    getWebPath = analysis;
  }
  let { active, color, pattern, custom } = opt;
  let result = {};
  switch (active) {
    case "color":
      let { value, image, type } = color;
      if (type == "color") {
        return {
          "background-color": value,
        };
      } else {
        return { background: image };
      }
    case "pattern":
      result = pattern;
      break;
    case "custom":
      result = custom;
  }
  if (result) {
    // 新版position格式是数组 兼容老板字符串
    let position = result.position;
    if (dsf.isArray(position)) {
      position = position.join(" ");
    }
    let size = result.size;
    if (size === "custom") {
      const w = dsf.dataview.utils.transformPx(result.customW);
      const h = dsf.dataview.utils.transformPx(result.customH);
      size = `${w} ${h}`;
    }
    if (result.isCustomPosition) {
      const x = dsf.dataview.utils.transformPx(result.customX);
      const y = dsf.dataview.utils.transformPx(result.customY);
      position = `${x} ${y}`;
    }
    return {
      "background-image": `url('${getWebPath(result.image)}')`,
      "background-size": size,
      "background-repeat": result.repeat,
      "background-position": position,
    };
  }
  return {};
};

/*
  新版 适用于颜色和图片分开选择
*/
const $backgroundFormat = function (config, attrObj) {
  if (!config) return attrObj?.isBgInfoVar ? createDefaultImageVar() : {};
  let { active, color, pattern, custom } = config;
  if (!active) return attrObj?.isBgInfoVar ? createDefaultImageVar() : {};
  let style = {};
  if ((color && color.type == "color") || (color && ["linear", "radial"].includes(color.type) && !pattern?.image && !custom?.image)) {
    style = {
      // 添加背景色
      ...$colorFormat({
        ...config,
        active: "color",
      }),
    };
  }
  if (pattern?.image || custom?.image) {
    let animationStyle = dsf.dataview.utils.analyzeAnimation(config[active]);
    let filterStyle = dsf.dataview.utils.analyzeCssFilter(config[active].filterConfig);
    style = {
      ...style,
      // 添加背景/自定义背景
      ...$colorFormat({
        ...config,
        active,
      }),
      ...animationStyle,
      ...filterStyle,
    };
  }
  if (attrObj?.isBgInfoVar) {
    let defaultBgVarCss = attrObj.defaultBgVarCss || {};
    style = dsf.dataview.utils.cssAttrToCssVar(style, defaultBgVarCss);
  }
  return style;
};
/**
 * @name: 统一将css的属性变成css的变量模式
 * @param {*} style
 * @return {*}
 */
const cssAttrToCssVar = function (style, defaultVar = {}) {
  let newStyle = {};
  if (style && typeof style === "object") {
    //防止嵌套被上一层给覆盖
    let defaultAttr = dsf.mix(true, {}, createDefaultImageVar(), defaultVar);
    Object.keys(style).forEach((key) => {
      let keyVal = style[key];
      // 统一将驼峰转化为-命名
      let newKey = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      if (newKey === "background" && keyVal.includes("gradient")) {
        newKey = "background-image";
      }
      if (key === "background-position" && typeof keyVal === "string") {
        keyVal = keyVal.replaceAll("middle", "center");
      }
      if (!newKey.includes("--")) {
        //证明没有--才添加为变量,getAnimation中已经有添加为变量的了这里就不用改变成变量
        newKey = `--${newKey}`;
      }
      newStyle[newKey] = keyVal;
    });
    newStyle = dsf.mix(true, {}, defaultAttr, {
      ...newStyle,
    });
  }
  if (!newStyle["--background-color"]) {
    newStyle["--background-color"] = "none";
  }
  return newStyle;
};
/**
 * @name: 分析规则转化为相对应的字段
 * @param {String} ruleStr 规则字符串
 * @param {Array} fieldList 对应的字段映射
 * @param {String} nameField 名称对应的字段
 * @param {String} valueField 值对应的字段
 * @return {String}
 */
const analysisRuleToDataField = function (ruleStr, fieldList, nameField = "name", valueField = "value") {
  // 替换@ [xxxx ]  => @['相应的字段']
  let matched = ruleStr.match(/@\s*\[(.*?)\]/);
  let content = matched ? matched[1].trim() : "";
  if (/[\u4e00-\u9fa5]/.test(content)) {
    let reg = /@\s*\[\s*(.*?)\s*\]/;
    let one = fieldList.find((item) => item[nameField] === content || item[valueField] === content);
    if (one) {
      return ruleStr.replace(reg, `@[${one.value}]`);
    }
    // 如果找不到则传入空字符串(公用方法解析不了识别不了的中文)
    return "";
  }
  return ruleStr;
};
const analysisKeyToDataField = function (field, fieldList, nameField = "name", valueField = "value") {
  // 替换xxxx  =>'相应的字段
  let one = fieldList.find((item) => item[nameField] === field || item[valueField] === field);
  if (one) {
    return one.value;
  }
  return field;
};
//echarts颜色转css
const convertChartToCSSColor = function (color) {
  let res = "";
  if (color?.type === "linear") {
    const degreeMap = {
      "0100": 0,
      "0110": 45,
      "0010": 90,
      "0011": 135,
      "0001": 180,
      1001: 225,
      1000: 270,
      1100: 315,
    };
    const coordKey = "" + color.x + color.y + color.x2 + color.y2;
    let angle = degreeMap[coordKey];
    if (!angle) {
      const x = color.x;
      angle = parseInt((Math.asin(x) * 180) / Math.PI);
    }
    res += `linear-gradient(${angle}deg, `;
    const colorStops = color.colorStops;
    colorStops.forEach((it, index) => {
      let percent = parseInt(it.offset * 100);
      res += `${it.color} ${percent}%`;
      if (index < colorStops.length - 1) {
        res += ",";
      }
    });
    res += ")";
  } else if (color?.type === "radial") {
    let x = parseInt(color.x * 100);
    let y = parseInt(color.y * 100);
    const colorStops = color.colorStops;
    res += `radial-gradient(circle at ${x}% ${y}%, `;
    colorStops.forEach((it, index) => {
      let percent = parseInt(it.offset * 100);
      res += `${it.color} ${percent}%`;
      if (index < colorStops.length - 1) {
        res += ",";
      }
    });
    res += ")";
  } else {
    res = color;
  }
  return res;
};
// css 颜色转echarts
const convertCSSToEChartsColor = function (cssColor) {
  //匹配线性渐变
  const matchLine = cssColor.match(/linear-gradient\((.*)\)/);
  const matchRadial = cssColor.match(/radial-gradient\((.*)\)/);

  // 不是渐变色直接返回
  if (!matchLine && !matchRadial) return cssColor;
  if (matchLine) {
    const parts = matchLine[1].split("deg,");
    // 角度枚举
    // 01 00 下到上 0
    // 01 10 左下到右上 45
    // 00 10 左到右 90
    // 00 11 左上到右下 135
    // 00 01 上到下 180
    // 10 01 右上到左下 225
    // 10 00 右到左 270
    // 11 00 右下到左上 315
    const coordMap = {
      0: [
        [0, 1],
        [0, 0],
      ],
      45: [
        [0, 1],
        [1, 0],
      ],
      90: [
        [0, 0],
        [1, 0],
      ],
      270: [
        [1, 0],
        [0, 0],
      ],
      180: [
        [0, 0],
        [0, 1],
      ],
      135: [
        [0, 0],
        [1, 1],
      ],
      315: [
        [1, 1],
        [0, 0],
      ],
      225: [
        [1, 0],
        [0, 1],
      ],
    };
    const [[x, y], [x2, y2]] = coordMap[parts[0]];

    // 颜色转换处理
    const colors = parts[1].split("%,");
    const colorStops = [];
    for (let i = 0; i < colors.length; i++) {
      let item = colors[i];
      if (!item) continue;
      const splitIndex = item.lastIndexOf(" ");

      let color = item.slice(0, splitIndex);
      let percent = item.slice(splitIndex + 1);
      if (percent.endsWith("%")) percent = item.slice(splitIndex + 1, -1);
      color = color.replace(/NaN/g, "255");
      colorStops.push({
        offset: +percent / 100,
        color: color.trim(),
      });
    }

    return {
      type: "linear",
      x,
      y,
      x2,
      y2,
      colorStops,
    };
  } else {
    const parts = matchRadial[1].split("%,");
    parts.shift();
    const result = matchRadial[1].match(/at(.*?),/);
    let points = result[1].match(/([\d\.]+%)\s([\d\.]+%)\s?([\d\.]+%)?/);
    points = points.slice(1, 3).map(parseFloat);

    let x = 0.5;
    let y = 0.5;
    let r = 0.5;
    if (points.length) {
      switch (points.length) {
        case 1:
          x = parseFloat(points[0] / 100);
          break;
        case 2:
          x = parseFloat(points[0] / 100);
          y = parseFloat(points[1] / 100);
          break;
      }
    }

    const colorStops = [];
    for (let i = 0; i < parts.length; i++) {
      let item = parts[i];
      if (!item) continue;
      const splitIndex = item.lastIndexOf(" ");

      let color = item.slice(0, splitIndex);
      let percent = item.slice(splitIndex + 1);
      if (percent.endsWith("%")) percent = item.slice(splitIndex + 1, -1);

      color = color.replace(/NAN/g, "255");
      colorStops.push({
        offset: +percent / 100,
        color: color.trim(),
      });
    }
    return {
      type: "radial",
      x,
      y,
      r,
      colorStops,
    };
  }
};
const transformTextStyle = function (textStyle, filterAttr = []) {
  let color = handleColor(textStyle.colorObj || textStyle.color);
  let style = {
    fontFamily: textStyle.fontFamily,
    fontSize: dsf.dataview.utils.transformPx(textStyle.fontSize),
    fontWeight: textStyle.fontWeight,
    fontStyle: textStyle.fontStyle,
    textDecoration: textStyle.textDecoration,
    textShadow: textStyle.textShadow || "0 0 0 transparent",
  };
  let isGradientFlag = false;
  if (color.indexOf("gradient") > -1) {
    style.color = "transparent";
    style.backgroundImage = color;
    style.backgroundClip = "text";
    style["-webkit-background-clip"] = "text";
    style["-moz-background-clip"] = "text";
    isGradientFlag = true;
  } else {
    style.color = color;
  }
  filterAttr.forEach((key) => {
    let newKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    // 过滤属性
    if (newKey === "color") {
      if (isGradientFlag) {
        delete style.backgroundImage;
        delete style.backgroundClip;
      }
    }
    delete style[newKey];
  });
  return style;
};
const getTextColor = function (color) {
  let resultStyle = {};
  if (color && typeof color.indexOf === "function" && color.indexOf("gradient") > -1) {
    resultStyle.color = "transparent";
    resultStyle.backgroundImage = color;
    resultStyle.backgroundClip = "text";
    resultStyle["-webkit-background-clip"] = "text";
    resultStyle["-moz-background-clip"] = "text";
  } else {
    resultStyle.color = color;
  }
  return resultStyle;
};

const getRandomWithDecimal = function (min, max, digits = 1) {
  const randomArbitrary = Math.random() * (max - min) + min;
  const roundedToOneDecimal = Math.round(randomArbitrary * 10 * digits) / (10 * digits);
  return roundedToOneDecimal;
};
const generateRandomString = function (length = 8) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
/**
 * @name: 上下移动数组中的元素
 * @param {*} array 数组
 * @param {*} index 索引
 * @param {*} direction 移动的方向
 * @param {*} isDeepClone 是否进行深拷贝
 * @return {*}
 */
const moveOneArray = function (array, index, direction, isDeepClone = true) {
  let newArray = _.cloneDeep(array);
  if (!isDeepClone) {
    newArray = array;
  }
  // 首先检查边界条件
  if (direction === "up" && index <= 0) {
    return newArray; // 如果是在顶部且方向是向上，则无需操作
  } else if (direction === "down" && index >= newArray.length - 1) {
    return newArray; // 如果是在底部且方向是向下，则无需操作
  }

  // 移动元素
  let element = newArray.splice(index, 1)[0]; // 移除指定索引的元素
  let newIndex;

  // 根据方向确定新索引
  if (direction === "up") {
    newIndex = index - 1;
  } else {
    newIndex = index + 1;
  }

  // 插入元素到新位置
  newArray.splice(newIndex, 0, element);
  return newArray;
};
/**
 * @description: 解析css中filter对象
 * @param {*} config
 * @return {*}
 */
const analyzeCssFilter = function (config) {
  if (config) {
    let filter = "";
    let notAttr = ["show"];
    Object.keys(config).forEach((key) => {
      if (notAttr.indexOf(key) === -1) {
        const value = config[key];
        if (key === "hueRotate") {
          filter += `hue-rotate(${value}deg) `;
        } else {
          filter += `${key}(${value}) `;
        }
      }
    });
    return {
      filter,
    };
  }
  return {};
};
/**
 * @name: 解析动画对象
 * @param {*} obj
 * @return {style} style可以解析
 */
const analyzeAnimation = function (obj) {
  let style = {};
  let specialVar = {};
  let animationObj = obj?.animation;
  if (animationObj && animationObj.name?.length) {
    let animationArr = [];
    let attrList = animationObj.attrList || [];
    specialVar = {
      "--dv-dynamic-opacity-range-1": "0.5",
      "--dv-dynamic-opacity-range-2": "1",
      "--dv-jump-up-down-jump-height": "-15px",
    };
    animationObj.name.forEach((name) => {
      let one = attrList.find((item) => item.value === name);
      if (one) {
        animationArr.push(`${name} ${one.duration}s ${one.delay}s infinite`);
        if (name === "dvDynamicOpacity") {
          specialVar["--dv-dynamic-opacity-range-1"] = one.range[0];
          specialVar["--dv-dynamic-opacity-range-2"] = one.range[1];
        } else if (name === "dvJumpUpDown") {
          specialVar["--dv-jump-up-down-jump-height"] = `${one.jumpHeight}px`;
        }
      } else {
        animationArr.push(`${name} 2.5s 0s infinite`);
      }
    });
    style.animation = animationArr.join(",");
  }
  return {
    ...specialVar,
    ...style,
  };
};
/**
 * @name: 获取动效
 * @param {*} config (背景图片对象)
 * @return {style} style可以解析
 */
const getBgAnimation = function (config) {
  if (!config) return {};
  let { active } = config;
  if (!active || active === "color") return {};
  let animationStyle = dsf.dataview.utils.analyzeAnimation(config[active]);
  return animationStyle;
};

/**
 * @name: 生成AnimateCSS动画库相关的style
 * @param {*} target 当前的动画
 * @param {*} origin 之前的动画
 * @return {*}
 */
const getAnimateLibStyle = function (target, origin) {
  let style = {};
  if (!target) return style;
  if (target.animation.length) {
    const { animation, duration, delay, repeat } = target;
    const animDuration = parseFloat(duration);
    const animDelay = parseFloat(delay);
    Object.assign(style, {
      "animation-name": animation[0],
      "animation-iteration-count": repeat,
      "animation-duration": `${animDuration}s`,
      "animation-fill-mode": "backwards",
      "animation-delay": `${getAnimationDelay(origin, animDelay)}s`,
    });
  }
  return style;
};
function getAnimationDelay(origin, currentDelay) {
  if (!origin?.animation.length) return currentDelay;
  return origin.isOrder ? parseFloat(origin.duration) + parseFloat(origin.delay) + currentDelay : currentDelay;
}
/**
 * @name: 判断是否有鼠标手势伪代码事件数组
 * @param {Object} arr 像eventRelativeDeal中.click对象一样
 * @return {Boolean}
 */
const isCursorPointer = function (arr) {
  let flag = arr.some((item) => {
    if (item && typeof item.fn === "string" && item.fn.trim()) {
      return true;
    }
    return false;
  });
  return flag;
};

/**
 * @name: base64 转blob
 * @param {String} src base64
 * @return Blob
 */
const base64ToBlob = function (src) {
  const arr = src.split(",");
  const data = arr[1];
  const mime = arr[0].match(/:(.*?);/)[1];
  const at = atob(data);
  let len = at.length;
  const u8arr = new Uint8Array(len);
  while (len--) {
    u8arr[len] = at.charCodeAt(len);
  }
  return new File([u8arr], dsf.uuid(32) + ".png", { type: mime });
};

/**
 * rgba 分离
 */
const transformRgb = function (color) {
  const result = { rgb: "", opacity: 1 };
  const polygonFormat = tinycolor(color);
  if (polygonFormat) {
    const { r, g, b } = polygonFormat.toRgb();
    const rgb = `rgb(${r},${g},${b})`;
    const opacity = tinycolor(color).getAlpha();
    result.rgb = rgb;
    result.opacity = opacity;
  }
  return result;
};

/**
 * 图表标签转方法
 */
const labelStringToFunction = function (template, params, type = "") {
  switch (type) {
    case "gis":
      params = params.properties || {};
      break;
    case "scatter-map":
      params.value = params.value ? params.value[2] : "--";
      break;
  }
  let result = "";
  if (Array.isArray(template)) {
    template.forEach((it) => {
      if (dsf.isString(it)) {
        const content = it
          .replace(/{a}/g, params.seriesName)
          .replace(/{b}/g, params.name)
          .replace(/{c}/g, isNaN(params.value) ? "--" : params.value);
        result += content + "\n";
      }
    });
  } else if (dsf.isString(template)) {
    result = template
      .replace(/{a}/g, params.seriesName)
      .replace(/{b}/g, params.name)
      .replace(/{c}/g, isNaN(params.value) ? "--" : params.value);
  }
  return result;
};

/**
 * 引入项目自定义组件
 */
const importExtraComponent = function () {
  return this.$http.importFiles([dsf.url.getWebPath("/modules/dataview/js/dsf-dataview.extra.module.pc.js")]);
};

/**
 *
 * @param {*} args 文件数组
 * @param {*} resolve 成功回调
 * @param {*} reject  失败回调
 * @returns
 */
const importFiles = function (args, resolve, reject = () => {}, finallyFn = () => {}) {
  const result = dsf.http.importFiles(args);
  result
    .then(resolve)
    .catch((error) => {
      if (error.__CANCEL__) {
        console.warn(error.message || "停止加载");
      } else {
        reject(error);
      }
    })
    .finally((params) => {
      finallyFn(params);
    });
  return result;
};

/**
 *
 * @param {*} str
 * @returns
 */
const matchNumberAndSuffix = function (str) {
  if (!str) return;
  str = str + "";
  const regex = /^(-?\d+\.?\d*)(.*)$/;
  const match = str.match(regex);
  if (!match) return null;
  return {
    number: match[1] ? parseFloat(match[1]) : null,
    unit: match[2] || null,
  };
};

// 回溯法查找树节点id、pid、children字段
function detectTreeFields(rootNode) {
  if (!rootNode || typeof rootNode !== "object") return null;

  // 1. 找到唯一的数组类型字段（children）
  const childrenKey = Object.keys(rootNode).find((key) => Array.isArray(rootNode[key]));
  if (!childrenKey) return null;

  // 2. 收集候选 id/pid 字段（非数组字段）
  const keysMap = Object.keys(rootNode).filter((key) => !Array.isArray(rootNode[key]) && key !== childrenKey);

  // 3. 尝试所有可能的 (id, pid) 组合
  for (let i = 0; i < keysMap.length; i++) {
    for (let j = 0; j < keysMap.length; j++) {
      if (i === j) continue; // id 和 pid 不能相同

      const idKey = keysMap[i];
      const pidKey = keysMap[j];
      const fields = { id: idKey, pid: pidKey, children: childrenKey };

      // 4. 使用迭代方式验证整棵树
      if (validateTreeIterative(rootNode, fields)) {
        return fields; // 返回有效的字段组合
      }
    }
  }

  return null;
}

// 迭代验证树结构
function validateTreeIterative(rootNode, fields) {
  const stack = [];
  stack.push({ node: rootNode, parentId: null });

  while (stack.length > 0) {
    const { node, parentId } = stack.pop();

    // 检查当前节点的 pid 是否匹配父节点的 id
    if (parentId !== null && node[fields.pid] !== parentId) {
      return false; // 父子关系不成立
    }

    // 将子节点推入栈（继续遍历）
    const children = node[fields.children];
    if (children && children.length > 0) {
      for (const child of children) {
        stack.push({ node: child, parentId: node[fields.id] });
      }
    }
  }

  return true;
}

/**
 * 获取大屏上传文件相关参数
 * @param {boolean} staticFile  是否是静态文件
 * @returns {object} url 上传地址，headers 请求头，getFilePath 文件获取方法，extraData 额外参数
 */
const getDataViewUploadFilesArgs = function (staticFile) {
  const headers = dsf.getDefaultHttpHeader();

  const getFilePath = (data) => {
    const fileId = dsf.isObject(data) ? data.id : dsf.isArray(data) ? data[0] && data[0].id : "";
    return dsf.url.getWebPath("/file/sdk/download?files=" + fileId, $$webRoot.dataview);
  };
  // 静态文件
  if (staticFile) {
    return {
      url: dsf.url.getWebPath("/file/sdk/upload", $$webRoot.dataview),
      headers,
      getFilePath,
      extraData: {
        isStatic: 1,
        isPublic: 1,
        namespace: `${this.$route.query.B}.${this.$route.query.M}`,
        pageName: this.$route.query.pname,
      },
      msg:"**检测到开启静态上传模式，非【保存为页面模板、保存业务组件、项目需迁移】这三种情况，请关闭该模式。**"
    };
    // 非静态文件
  } else {
    return {
      url: dsf.url.getWebPath("/file/upload/", $$webRoot.platform),
      headers,
      extraData: {},
      getFilePath: dsf.url.getFilePath,
      msg:"**非【保存为页面模板、保存业务组件、项目需迁移】这三种情况，请不要开启静态模式。**"
    };
  }
};

/**
 * @name： 获取 对象的hashCode
 * @param {Object} data
 * @returns {String} hashCode
 */
 const getHashCode = function (data) {
  // 将对象obj转换为字符串
  const str = JSON.stringify(data);

  let hash = 0,
    i,
    chr,
    len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};
const dataviewUtils = {
  calculateStyle,
  getHashCode,
  getDataViewUploadFilesArgs,
  detectTreeFields,
  matchNumberAndSuffix,
  importFiles,
  importExtraComponent,
  labelStringToFunction,
  transformRgb,
  base64ToBlob,
  $backgroundFormat,
  transformToStyle,
  transformPx,
  transformArrayPx,
  flatTree,
  establishTree,
  objectToString,
  handleDecimal,
  toThSeparator,
  transformUnit,
  compatiblePathToExtendImg,
  compatiblePathToExtendShowImg,
  analyzeToolTipHTMLAttr,
  hasTextContent,
  analysisRuleToDataField,
  analysisKeyToDataField,
  transformToExcelData,
  transformExcelDataToJSON,
  convertCSSToEChartsColor,
  convertChartToCSSColor,
  transformTextStyle,
  getTextColor,
  getRandomWithDecimal,
  generateRandomString,
  moveOneArray,
  analyzeAnimation,
  getBgAnimation,
  cssAttrToCssVar,
  getAnimateLibStyle,
  isCursorPointer,
  analyzeCssFilter,
};
export default dataviewUtils;

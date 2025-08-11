/**
 * @description: 将html字符串转化为path
 * @param {String} htmlStr
 * @return {Array}
 */
const execHtmlStringToPath = (htmlStr) => {
  const tagRegex = /<(\w+)([^>]*)>/g;
  const attrRegex = /(\S+)=["']([^"']+)["']/g;
  let tagMatch;
  const tags = [];
  while ((tagMatch = tagRegex.exec(htmlStr)) !== null) {
    const tag = {
      name: tagMatch[1],
      attributes: {},
    };
    let attrMatch;
    while ((attrMatch = attrRegex.exec(tagMatch[2])) !== null) {
      tag.attributes[attrMatch[1]] = attrMatch[2];
    }
    tags.push(tag);
  }
  return execSvgObjToPath(tags);
};
/**
 * @description:
 * @param {Array} tags
 * @return {String}
 */
const execSvgObjToPath = (tags) => {
  // 匹配路径中数值的正则
  const regNumber = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
  // 按照此顺序寻找
  const findArr = ["path", "rect", "circle", "ellipse", "line", "polygon", "polyline"];
  let target = null;
  for (let i = 0, n = findArr.length; i < n; i++) {
    const findItem = findArr[i];
    for (let j = 0, m = tags.length; j < m; j++) {
      const tagetItem = tags[j];
      // 找到目标值跳出循环
      if (tagetItem.name === findItem) {
        target = tagetItem;
        break;
      }
    }
    // 找到目标值跳出循环
    if (target) {
      break;
    }
  }
  // 不存在目标元素则直接返回空串
  if (!target) {
    return "";
  }
  let path = "",
    x = "",
    y = "",
    width = "",
    height = "",
    rx = "",
    ry = "",
    cx = "",
    cy = "",
    r = "",
    x1 = "",
    x2 = "",
    y1 = "",
    y2 = "";
  switch (target.name) {
    case "path":
      path = target.attributes["d"];
      break;
    case "rect":
      x = Number(target.attributes["x"]);
      y = Number(target.attributes["y"]);
      width = Number(target.attributes["width"]);
      height = Number(target.attributes["height"]);
      /*
       * rx 和 ry 的规则是：
       * 1. 如果其中一个设置为 0 则圆角不生效
       * 2. 如果有一个没有设置则取值为另一个
       * 3.rx 的最大值为 width 的一半, ry 的最大值为 height 的一半
       */
      rx = Number(target.attributes["rx"]) || Number(target.attributes["ry"]) || 0;
      ry = Number(target.attributes["ry"]) || Number(target.attributes["rx"]) || 0;
      // 非数值单位计算，如当宽度像100%则移除
      // if (isNaN(x - y + width - height + rx - ry)) return;

      rx = rx > width / 2 ? width / 2 : rx;
      ry = ry > height / 2 ? height / 2 : ry;

      // 如果其中一个设置为 0 则圆角不生效
      if (rx == 0 || ry == 0) {
        // var path =
        //     'M' + x + ' ' + y +
        //     'H' + (x + width) +
        //     'V' + (y + height) +
        //     'H' + x +
        //     'z';
        path = "M" + x + " " + y + "h" + width + "v" + height + "h" + -width + "z";
      } else {
        path =
          "M" +
          x +
          " " +
          (y + ry) +
          "a" +
          rx +
          " " +
          ry +
          " 0 0 1 " +
          rx +
          " " +
          -ry +
          "h" +
          (width - rx - rx) +
          "a" +
          rx +
          " " +
          ry +
          " 0 0 1 " +
          rx +
          " " +
          ry +
          "v" +
          (height - ry - ry) +
          "a" +
          rx +
          " " +
          ry +
          " 0 0 1 " +
          -rx +
          " " +
          ry +
          "h" +
          (rx + rx - width) +
          "a" +
          rx +
          " " +
          ry +
          " 0 0 1 " +
          -rx +
          " " +
          -ry +
          "z";
      }
      break;
    case "circle":
      cx = target.attributes["cx"];
      cy = target.attributes["cy"];
      r = target.attributes["r"];
      path = "M" + (cx - r) + " " + cy + "a" + r + " " + r + " 0 1 0 " + 2 * r + " 0" + "a" + r + " " + r + " 0 1 0 " + -2 * r + " 0" + "z";
      break;
    case "ellipse":
      cx = target.attributes["cx"] * 1;
      cy = target.attributes["cy"] * 1;
      rx = target.attributes["rx"] * 1;
      ry = target.attributes["ry"] * 1;
      if (!isNaN(cx - cy + rx - ry)) {
        path = "M" + (cx - rx) + " " + cy + "a" + rx + " " + ry + " 0 1 0 " + 2 * rx + " 0" + "a" + rx + " " + ry + " 0 1 0 " + -2 * rx + " 0" + "z";
      }
      break;
    case "line":
      x1 = target.attributes["x1"];
      y1 = target.attributes["y1"];
      x2 = target.attributes["x2"];
      y2 = target.attributes["y2"];
      if (!isNaN(x1 - y1 + (x2 - y2))) {
        path = "M" + x1 + " " + y1 + "L" + x2 + " " + y2;
      }
      break;
    case "polygon":
    case "polyline":
      const points = (target.attributes["points"].match(regNumber) || []).map(Number);
      if (points.length < 4) {
        return;
      }
      path = "M" + points.slice(0, 2).join(" ") + "L" + points.slice(2).join(" ") + (targe.name === "polygon" ? "z" : "");
      break;
  }
  return path ? "path://" + path : "";
};

export default {
  methods: {
    /**
     * @description: svg和图片上传
     * @param {*} e
     * @param {String} item
     * @param {Function} callBack 回调函数执行
     * @return {*}
     */
    changeSymbolImage(e, item, callBack) {
      let file = e.target.files[0];
      const reader = new FileReader();
      if ((file.name || "").endsWith(".svg")) {
        // svg转化逻辑
        reader.readAsText(file);
        reader.onloadend = function (ev) {
          const result = execHtmlStringToPath(ev.target.result);
          e.target.value = "";
          if (callBack && typeof callBack === "function") {
            callBack(result,item);
            return;
          }
          item.symbol = result;
         
        };
      } else {
        // image转化逻辑
        reader.readAsDataURL(file);
        reader.onloadend = function (ev) {
          const result = "image://" + ev.target.result;
          e.target.value = "";
          if (callBack && typeof callBack === "function") {
            callBack(result,item);
            return;
          }
          item.symbol = result;
        };
      }
    },
    uploadClick(e) {
      if ($(e.target).next()?.click) {
        $(e.target).next().click();
      }
    },
    getSymbole($symbol) {
      if (/^image|^path/.test($symbol)) {
        return "custom";
      } else {
        return $symbol;
      }
    },
    changeSymbol(e, item) {
      item.symbol = e;
    },
  },
};

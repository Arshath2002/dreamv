/*
 * @Editor: zhanghang
 * @Description: 绘制label dom 对象
 * @Date: 2024-07-05 15:31:21
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-16 09:33:55
 */

export const drawLabel = function (options, data) {
  const { padding, borderRadius, backgroundColor, borderColor, borderWidth, textStyle } = options.itemStyle;

  const label = document.createElement("div");
  label.style.pointerEvents = "auto";
  label.style.cursor = "pointer";
  label.style.padding = padding.join("px ") + "px";
  label.style.borderRadius = Array.isArray(borderRadius) ? borderRadius.join("px ") + "px" : borderRadius + "px";

  label.style.backgroundColor = backgroundColor;
  label.style.borderColor = borderColor;
  label.style.borderWidth = borderWidth;
  Object.keys(textStyle).forEach((key) => {
    if (dsf.isNumber(textStyle[key])) {
      label.style[key] = textStyle[key] + "px";
    } else if (Array.isArray(textStyle[key])) {
      label.style[key] = textStyle[key].join("px ") + "px";
    } else {
      label.style[key] = textStyle[key];
    }
  });
  const name = options.name;
  let innerHtml = "";
  if (typeof options.formatter === "function" && options.isFormatter) {
    innerHtml = options.formatter(data);
  } else {
    let code = `var formatter = ${JSON.stringify(name)};
    var content = dsf.dataview.utils.labelStringToFunction(formatter,params);
    return content;`;
    const formatter = new Function("params", code)
    innerHtml = formatter(data)
  }
  label.innerHTML = innerHtml;
  label.className = `three-label-name ${options.className}`;

  return label;
};

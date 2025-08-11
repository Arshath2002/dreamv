/*
 * @Editor: zhanghang
 * @Description: 绘制区域
 * @Date: 2024-06-18 10:42:30
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-08-28 09:14:36
 */
import utils from "_dataview/output/utils/gis.js";

/**
 * @description 添加marker提示框
 * @return 无
 */
export const addTooltip = function (options, dom) {
  let { show, content, formatter, itemStyle: tooltipStyle } = options;

  if (show) {
    let style = utils.transformStyle(tooltipStyle);

    let _wrapper = function (data) {
      let _content = "";
      if (typeof formatter === "function") {
        _content = formatter(data);
      } else {
        _content = content;
      }
      return _content ? `<div style="${style}">${_content}</div>` : "";
    };
    //默认是空
    dom.innerHTML = "";
    const tooltip = {
      _type: "tooltip",
      _show: function (data) {
        dom.innerHTML = _wrapper(data);
        dom.style.display = "block";
      },
      _hide() {
        dom.style.display = "none";
      },
    };
    return tooltip;
  }
};

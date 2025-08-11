/*
 * @Editor: zhanghang
 * @Description: 绘制区域
 * @Date: 2024-06-18 10:42:30
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-16 13:58:02
 */
import utils from "_dataview/output/utils/gis.js";

/**
 * @description 提示框渲染
 * @return 无
 */
export const tooltipRender = function () {
  const { tooltip, mouseEvent: e, tooltipDom } = this;
  //隐藏
  if (tooltip) {
    tooltip._hide();
  }
  //存在选择区域
  if (this.pickDistrictMesh&&tooltip) {
    const mesh = this.pickDistrictMesh.object;
    const { deriveColor, ...properties } = mesh._privateData;
    tooltipDom.style.left = e.offsetX + 15 + "px";
    tooltipDom.style.top = e.offsetY + 2 + "px";
    tooltip._show(properties);
  }
};
/**
 * @description 添加提示框
 * @return 无
 */
export const addTooltip = function (options) {
  let { show, content, formatter, itemStyle: tooltipStyle } = options;
  const { tooltipDom } = this;
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
    tooltipDom.innerHTML = "";
    const tooltip = {
      _type: "tooltip",
      _show: function (data) {
        tooltipDom.innerHTML = _wrapper(data);
        tooltipDom.style.display = "block";
      },
      _hide() {
        tooltipDom.style.display = "none";
      },
    };
    return tooltip;
  }
};

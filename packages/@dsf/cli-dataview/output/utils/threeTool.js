/*
 * @Description: 第三方库引入的工具库
 * @Author: shenah
 * @Date: 2024-08-09 13:39:32
 * @LastEditors: shenah
 * @LastEditTime: 2024-12-16 10:51:29
 */

/**
 * @name: 颜色透明度的转化
 * @param {string} color 颜色
 * @param {number} opacity 透明度
 * @return {string} 颜色
 */
const transColorOpacity = function (color, opacity) {
  const colorValue = tinycolor(color);
  const transparentColor = colorValue.setAlpha(opacity).toRgbString();
  return transparentColor;
};
/**
 * @name: 加深或者变浅色
 * @param {string} color
 * @param {string} type darken加深lighten变浅
 * @param {*} depth
 * @return {*}
 */
const changeColorDepth = function (color, type, depth) {
  const colorValue = tinycolor(color);
  const darkerColor = colorValue[type](depth).toRgbString();
  return darkerColor;
};
/**
 * @description: 切换颜色类型
 * @param {any} color 颜色
 * @param {String} type sixteen十六进制
 * @return {*}
 */
const changeColorType = function (color, type) {
  const colorValue = tinycolor(color);
  let mapType = {
    sixteen: "toHexString", // 十六进制
  };
  let fn = mapType[type];
  if (fn) {
    return colorValue[fn]();
  }
  return color;
};
/**
 * @description: 获取颜色透明度
 * @param {*} color
 * @return {*}
 */
const getColorOpacity = function (color) {
  const colorValue = tinycolor(color);
  return colorValue.getAlpha();
};

export default {
  transColorOpacity,
  changeColorDepth,
  changeColorType,
  getColorOpacity,
};

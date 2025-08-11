/*
 * @Description: 背景配置项
 * @Author: zhanghang
 * @Date: 2023-08-10 15:02:19
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-09 11:11:25
 */
export const hMapData = [
  { mapName: "left", mapKey: "left" },
  { mapName: "center", mapKey: "center" },
  { mapName: "right", mapKey: "right" },
];
export const vMapData = [
  { mapName: "top", mapKey: "top" },
  { mapName: "center", mapKey: "middle" },
  { mapName: "bottom", mapKey: "bottom" },
];
export const fillOptions = [
  {
    text: "填充",
    value: "cover",
  },
  {
    text: "适应",
    value: "contain",
  },
  {
    text: "拉伸",
    value: "100% 100%",
  },
  {
    text: "原大小",
    value: "auto",
  },
  {
    text: "自定义",
    value: "custom",
  },
];
export const tilingOptions = [
  {
    text: "不平铺",
    value: "no-repeat",
  },
  {
    text: "平铺",
    value: "repeat",
  },
  {
    text: "水平平铺",
    value: "repeat-x",
  },
  {
    text: "垂直上平铺",
    value: "repeat-y",
  },
];
// 创建默认属性
export const createDefaultImageVar = () => ({
  "--background-color": "transparent",
  "--background-image": "none",
  "--background-size": "auto",
  "--background-repeat": "repeat",
  "--background-position": "0% 0%",
  "--animation": "none",
  "--border-radius": "0",
  "--data-view-box-shadow": "none",
});
export const createAnimationOptions = () => [
  {
    label: "动态渐变",
    value: "dvDynamicOpacity",
    disabled: false,
  },
  {
    label: "上下跳动",
    value: "dvJumpUpDown",
    disabled: false,
  },
  {
    label: "顺时针旋转",
    value: "dvClockwiseRotate",
    disabled: false,
  },
  {
    label: "逆时针旋转",
    value: "dvNotClockwiseRotate",
    disabled: false,
  },
];
const createCommonAttr = () => ({
  image: "",
  size: "contain",
  repeat: "no-repeat",
  position: ["center", "center"],
  customW: "100%",
  customH: "100%",
  customX: "center",
  customY: "center",
  isCustomPosition: false,
  static: true,
  animation: {
    name: [],
    attrList: [], // 属性list
  },
  filterConfig: {
    //滤镜相关配置(不要的属性要在方法里面进行过滤到)
    hueRotate: 0, // 色相
    saturate: 1, // 饱和度
    contrast: 1, // 对比度
    brightness: 1, // 亮 度
    blur: 0, // 高斯模糊
    show: true, // 只用于显示与隐藏属性
  },
});
export default function () {
  return {
    active: "pattern",
    imageType: "page",
    blurBackdrop: 0,
    pattern: createCommonAttr(),
    color: {
      // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
      type: "color",
      //提供给渐变使用
      image: "",
      isTheme: false,
      theme: "main",
      value: "",
    },
    custom: createCommonAttr(),
    linear: {
      angle: 0,
      point: [
        { length: 0, color: "rgba(255,255,255,0)" },
        { length: 100, color: "#000" },
      ],
    },
    radial: {
      shape: "circle",
      size: "farthest-corner",
      position: [50, 50],
      point: [
        { length: 0, color: "rgba(255,255,255,0)" },
        { length: 100, color: "#000" },
      ],
    },
  };
}

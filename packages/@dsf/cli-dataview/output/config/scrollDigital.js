/*
 * @Description:  数字翻牌器弹框配置
 * @Author: shenah
 * @Date: 2023-07-07 09:34:36
 * @LastEditors: shenah
 * @LastEditTime: 2025-02-12 14:02:49
 */
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";

export const createWholeConfig = () => {
  return {
    flag: true, // 是否是翻牌器 --- 图文需要
    // 数字文本样式
    digitalStyle: createCommonTextStyle({
      // 数字的宽度
      numberWidth: "auto",
    }),
    textAlign: { hAlign: "center" },
    fontMargin: [0, 0, 0, 0],
    fontPadding: [0, 0, 0, 0],
    isTotalDigital: false,
    singleBackgroundConfig: {},
    decimals: 0,
    isShowZero: true,
    unitTransform: "",
    separator: "",
    separatorColor:"", // 符号颜色
    config: {
      duration: 3000,
      autoplay: true,
    },
    isCycle: false,
    cycleSpaceTime: 3000,
  };
};
export const extendsAttrs = Object.keys(createWholeConfig());

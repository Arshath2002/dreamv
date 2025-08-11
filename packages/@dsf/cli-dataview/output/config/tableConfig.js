/*
 * @Description: 表格数据头部默认的config
 * @Author: shenah
 * @Date: 2024-03-26 10:25:52
 * @LastEditors: shenah
 * @LastEditTime: 2024-10-23 15:06:22
 */
import { createOneTableBar } from "_dataview/output/config/tableBarConfig";
import { createPrefixSuffixConFig } from "_dataview/output/config/prefixSuffixConFig";
export const createTableHeadData = (obj = {}) => {
  return dsf.mix(
    true,
    {},
    {
      id: dsf.uuid(),
      commonPadding: [0, 10, 0, 10],
      headerFontFamily: "",
      headerTextShadow: "",
      fontFamily: "",
      unitTransform: "",
      isThousandths: true,
      label: "",
      map: "",
      align: "",
      headerAlign: "",
      width: "",
      readOnly: true,
      header: true,
      headerFontSize: undefined,
      headerColor: undefined,
      fontSize: undefined,
      color: undefined,
      isSort: false,
      sortStyle: "dark",
      sort: "default",
      sortDefaultColor: "rgb(96, 98, 102)",
      sortColor: "rgb(96, 98, 102)",
      sortIsHighlight: false,
      sortHighlight: "#fff",
      filterIcon: "arrow",
      prefixType: "html",
      digit: undefined,
      keepZero: false,
      barSpace: "4px",
      headerSlotName: "",
      slotName: "",
      isBar: false,
      barInfo: [createOneTableBar()],
      isIndent: false,
      indentRules: [],
      dataRuleList: [], // 数据规则
      prefixConfig: createPrefixSuffixConFig({
        defaultConfig: {
          positionType: "left",
          text: {
            fontFamily: "Microsoft Yahei",
            fontSize: "16px",
            color: "#DCF0FF",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
          },
          icon: {
            fontSize: "16px",
            color: "#DCF0FF",
            icon: "up",
          },
          image: {
            width: "16px",
          },
        },
      }),
      suffixConfig: createPrefixSuffixConFig({
        defaultConfig: {
          positionType: "right",
          text: {
            fontFamily: "Microsoft Yahei",
            fontSize: "16px",
            color: "#DCF0FF",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
          },
          icon: {
            fontSize: "16px",
            color: "#DCF0FF",
            icon: "up",
          },
          image: {
            width: "16px",
          },
        },
      }),
      isCssTitle: true, // 悬浮提示
    },
    obj
  );
};

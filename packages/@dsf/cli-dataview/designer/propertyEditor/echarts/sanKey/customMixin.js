/*
 * @Description: 自定义混入
 * @Author: shenah
 * @Date: 2024-05-08 10:47:34
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 10:14:08
 */

import { borderTypeList, labelPosition } from "../attrConfig";
export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    length() {
      return Object.keys(this.customData).length;
    },
  },
  data() {
    return {
      labelPosition,
      borderTypeList,
      bothConfig: {
        type: "both",
      },
      colorConfig: {
        type: "color",
      },
      fontSizeUnitOptions: [
        {
          label: "px",
          value: "px",
        },
        {
          label: "fx",
          value: "",
        },
      ],
      pixelNoUnitOptions: [
        {
          value: "",
          label: "fx",
        },
      ],
      customData: {},
    };
  },
  created() { },
  beforeDestroy() { },
  methods: {
  },
};

/*
 * @Description: 系列类型属性
 * @Author: shenah
 * @Date: 2024-05-06 11:43:51
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-17 10:03:02
 */
import { borderTypeList, labelPosition, symbolOptionsList } from "./attrConfig";

import SelectInput from "_dataview/designer/setting/graph/selectInput";
import dsfButtonDialog from "_dataview/designer/common/components/dsfButton.vue";
import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js";
export default {
  props: {},
  mixins: [svgAndImageUpload],
  components: {
    
    SelectInput,
    dsfButtonDialog
  },
  data() {
    return {
      symbolOptionsList,
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
      percentOptions: [
        {
          label: "%",
          value: "%",
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
    };
  },
  methods: {
    changeItemColor(val, item, key) {
      let color = null;
      if (val && typeof val === "object") {
        val = val.color?.image || "#fff";
      }
      if (val !== "") {
        color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      }
      this.$set(item, key, color);
      this.$emit("updateChart");
    },
    changeItemValue(val, item, key) {
      if (this.changeSpecialItemKey) {
        this.changeSpecialItemKey(val, item, key);
      }
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
  },
};

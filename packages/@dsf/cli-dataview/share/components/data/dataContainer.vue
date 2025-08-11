<!--
 * @Description: 只用于请求数据的容器
 * @Author: shenah
 * @Date: 2023-10-26 10:05:14
 * @LastEditors: shenah
 * @LastEditTime: 2024-11-15 15:21:25
-->

<template>
  <div v-show="isDesign" class="dsf-data-container ds-control" v-loading="dataLoad" :element-loading-text="''" :element-loading-spinner="'none'" :element-loading-background="loadingBackground" :style="getContentStyle">
    {{ text }}
  </div>
</template>
<script>
const staticDataKeyDic = {
  name: "名称",
  value: "数量",
};
const staticData = [
  {
    name: "测试数据",
    value: 1,
  },
];
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewDataContainer",
  ctrlCaption: "加载数据",
  mixins: [$mixins.dataView, dataAnalysis],
  props: {
    text: {
      type: String,
      default: "生成数据",
    },
    scene: {
      type: String,
      default: "gis",
    },
    eventName: {
      type: String,
      default: "",
    },
    textColor: {
      type: String,
      default: "rgba(255, 255, 255, 1)",
    },
    height: {
      type: String,
      default: "auto",
    },
    dataSet: {
      type: Object,
      default: () => ({}),
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default: () => ({
        load: {
          relatives: [],
          fn: eventTemp,
        },
        click: {
          relatives: [],
          fn: eventTemp,
          hidden: true,
        },
      }),
    },
  },
  data() {
    return {
      otherEvents: ["刷新"],
      data: [],
    };
  },
  computed: {
    getContentStyle() {
      return {
        color: this.textColor,
      };
    },
  },
  watch: {
    staticData(val) {
      this.dataAnalysis(val);
    },
    scene() {
      this.beforeInit();
    },
    eventName() {
      this.beforeInit();
    },
  },
  beforeDestroy() {
    if (this.scene === "gis") {
      dsf.emit.$remove("GISLoad", window);
    } else if (this.scene === "custom" && this.eventName) {
      dsf.emit.$remove(this.eventName, window);
    }
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return { _props: { ctrlName: this._props.ctrlName } };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {},
    beforeInit() {
      if (this.scene === "gis") {
        // 之前再用了,就不在和自定义相融合了
        dsf.emit.$on(
          "GISLoad",
          () => {
            this.init();
          },
          window
        );
      } else if (this.scene === "custom") {
        if (this.eventName) {
          dsf.emit.$on(
            this.eventName,
            () => {
              this.init();
            },
            window
          );
        }
      } else {
        this.init();
      }
    },
    dataAnalysis(data) {
      this.data = data;
    },
  },
});
</script>

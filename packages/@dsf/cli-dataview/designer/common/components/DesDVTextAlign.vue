<!--
 * @Description: 
 * @Author: shenah
 * @Date: 2024-03-25 11:32:23
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-12 18:59:26
-->
<template>
  <div class="des-dv-text-align">
    <!-- 对齐方式选择 -->
    <div class="align-wrap">
      <!-- 水平位置 -->
      <Direction
        class="horizontal-items"
        type="horizontal"
        v-model="currentData.hAlign"
        :mapData="currentConfig.hMapData"
        @input="changeValue"
        v-if="currentConfig.isShowHAlign"
        :iconType="currentConfig.iconType"
      ></Direction>
      <!-- 垂直位置 -->
      <Direction
        class="vertical-items"
        v-model="currentData.vAlign"
        type="vertical"
        :mapData="currentConfig.vMapData"
        :iconType="currentConfig.iconType"
        @input="changeValue"
        v-if="currentConfig.isShowVAlign"
      ></Direction>
      <!-- 方位 -->
      <Direction
        class="direction-items"
        v-model="currentData.direction"
        type="direction"
        :mapData="currentConfig.dMapData"
        :iconType="currentConfig.iconType"
        @input="changeValue"
        v-if="currentConfig.isShowDirection"
      ></Direction>
    </div>
  </div>
</template>
<script>
import Direction from "../../setting/graph/config/tool/direction.vue";
import propertyMixin from "./propertyMixin";
export default {
  name: "DesDVTextAlign",
  components: { Direction },
  mixins: [propertyMixin],
  props: {
    value: {
      type: [Object, String],
    },
  },
  data() {
    return {
      defaultConfig: {
        isShowHAlign: true,
        isShowVAlign: true,
        isShowDirection:false,
        iconType:"content",
        hMapData: [
          { mapName: "left", mapKey: "left" },
          { mapName: "center", mapKey: "center" },
          { mapName: "right", mapKey: "right" },
        ],
        vMapData: [
          { mapName: "top", mapKey: "top" },
          { mapName: "middle", mapKey: "middle" },
          { mapName: "bottom", mapKey: "bottom" },
        ],
        dMapData: [
          { mapName: "top", mapKey: "top" },
          { mapName: "bottom", mapKey: "bottom" },
          { mapName: "left", mapKey: "left" },
          { mapName: "right", mapKey: "right" },
        ]
      },
      fonts: [],
      currentData: {},
      valueCopy: null,
    };
  },
  computed: {},
  watch: {
    value() {
      // 初始化值
      this.initData();
    },
  },
  created() {
    this.valueCopy = _.cloneDeep(this.value);
    this.initData();
  },
  methods: {
    initData() {
      // 初始化值
      this.currentData = this.formatValue(this.value)
    },
    changeValue() {
      let value = this.formatValue(this.currentData,'set')
      this.$emit("change", value);
    },
    // 兼容字符串格式
    formatValue(val, type = "get") {
      if (!val) return {};
      if (dsf.isObject(this.valueCopy)) return val;
      let valCopy = _.cloneDeep(val);
      let { isShowHAlign, isShowVAlign, isShowDirection } = this.currentConfig;
      if (isShowHAlign) {
        if (type == "get") return { hAlign: valCopy };
        return valCopy.hAlign
      } else if (isShowVAlign) {
        if (type == "get") return { vAlign: valCopy };
        return valCopy.vAlign
      } else if (isShowDirection) {
        if (type == "get") return { direction: valCopy };
        return valCopy.direction
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/dsfTextAlign.scss";
</style>

<!--
 * @Description: 元素阴影设置(后面把文字阴影集成过来)
 * @Author: shenah
 * @Date: 2024-11-26 11:11:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 16:56:17
-->


<template>
  <div class="ds-shadow-wrapper">
    <div class="shadow-switch-wrap">
      <DesDVSwitch :value="showFlag" @change="switchChange($event, 'showFlag')" />
      <DesDVToolTipsIcon
        v-if="currentConfig.type ==='box' && currentConfig.subType === 'outset' && currentConfig.desc"
        :data="{
          desc:currentConfig.desc
        }"
      >
      </DesDVToolTipsIcon>
    </div>
    <div v-if="showFlag" class="shadow-wrap">
      <div class="shadow-offset">
        <DsfWordColor :value="shadowColor" @change="shadowColorChange" type="color"></DsfWordColor>
        <span>X：</span>
        <DesDVNumber
          class="min"
          :config="{ unit: 'px' }"
          :value="shadowOffsetX | valueFilter"
          @change="changeShadowValue($event + 'px', 'shadowOffsetX')" />
        <span>Y：</span>
        <DesDVNumber
          class="min"
          :config="{ unit: 'px' }"
          :value="shadowOffsetY | valueFilter"
          @change="changeShadowValue($event + 'px', 'shadowOffsetY')" />
      </div>
      <div class="radius-wrap">
        <div class="radius-item">
          <span class="radius-item-name">模糊：</span>
          <el-input-number
            :value="shadowBlur | valueFilter"
            @change="changeShadowRadiusValue($event + 'px', 'shadowBlur')"
            :precision="0"
            :controls="false"
            class="radius-input">
          </el-input-number>
        </div>
        <div class="radius-item" v-if="currentConfig.type ==='box'">
          <span class="radius-item-name">展开：</span>
          <el-input-number
            :value="shadowSpread | valueFilter"
            @change="changeShadowRadiusValue($event + 'px', 'shadowSpread')"
            :precision="0"
            :controls="false"
            class="radius-input"
            style="margin-right: 6px;">
          </el-input-number>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import propertyMixin from "./propertyMixin.js";
import DsfWordColor from "./dsfWordColor.vue";
export default {
  name: "DesDVShadow",
  components: {
     DsfWordColor
  },
  mixins: [propertyMixin],
  props: {
    value: {
      type: Object,
    },
  },
  filters: {
    valueFilter(val) {
      return +(val + "").replace(/px/g, "");
    },
  },
  data() {
    return {
      defaultConfig: {
        type: "box", // box、元素类型,text文字类型
        subType: "outset", // 当只有box类型时分为内阴影与外阴影inset/outset
        flagField: "flag",
        cssAttrField: "boxShadow",
        desc:"<div>设置组件内边距时，外阴影显示效果最佳。</div><div>或者设置单元格属性为内容“全显”。</div>",
      },
      defaultBoxShadow: {
        flag: false,
        boxShadow: "5px 5px 5px 5px #000",
      },
      showFlag: false, // 是否显示阴影
      insetFlag: false, // 外阴影还是内阴影(文字无)
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 10,
      shadowSpread: 0, // 展开半径(文字无)
      shadowColor: "red",
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let type = this.currentConfig.type;
      let defaultTypeData = this[`default${_.capitalize(type)}Shadow`];
      let currentData = this.value;
      Object.keys(defaultTypeData).forEach((key) => {
        if (currentData[key] === undefined) {
          currentData[key] = defaultTypeData[key];
        }
      });
      let cssShadow = currentData[this.currentConfig.cssAttrField];
      this.showFlag = !!this.value[this.currentConfig.flagField];
      if (type === 'box') {
        const reg = /(\d+(?:px)?)\s+(\d+(?:px)?)\s+(\d+(?:px)?)\s+(\d+(?:px)?)\s+(#.{3,6}|rgb[a]?\(.+\))/g;
        let res = reg.exec(cssShadow);
        if (res && res.length) {
          this.shadowOffsetX = res[1];
          this.shadowOffsetY = res[2];
          this.shadowBlur = res[3];
          this.shadowSpread = res[4];
          this.shadowColor = res[5];
        }
        this.insetFlag = this.currentConfig.subType === 'inset';
      }
      this.currentData = currentData;
    },
    shadowColorChange(val) {
      this.shadowColor = val;
      this.shadowEmit();
    },
    switchChange(val, key) {
      this[key] = val;
      this.shadowEmit();
    },
    changeShadowValue(val, key) {
      this[key] = val;
      this.shadowEmit();
    },
    changeShadowRadiusValue(val, key) {
      this[key] = val;
      this.shadowEmit();
    },
    shadowEmit() {
      let { insetFlag, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY, shadowSpread } = this;
      insetFlag = insetFlag || false;
      shadowOffsetX = shadowOffsetX !== undefined ? shadowOffsetX : "0px";
      shadowOffsetY = shadowOffsetY !== undefined ? shadowOffsetY : "0px";
      shadowBlur = shadowBlur !== undefined ? shadowBlur : "10px";
      shadowSpread = shadowSpread !== undefined ? shadowSpread : "0px";
      shadowColor = shadowColor !== undefined ? shadowColor : "red";
      let flag = this.showFlag;
      let shadow = `${insetFlag ? 'inset ' : ''}${dsf.dataview.utils.transformPx(shadowOffsetX, false)} ${dsf.dataview.utils.transformPx(shadowOffsetY,false)} ${dsf.dataview.utils.transformPx(shadowBlur,false)} ${dsf.dataview.utils.transformPx(shadowSpread,false)} ${shadowColor}`;
      shadow = shadow.trim();
      this.$set(this.currentData, this.currentConfig.flagField, flag);
      this.$set(this.currentData, this.currentConfig.cssAttrField, shadow);
      this.$emit("change", this.currentData);
      this.$emit("input", this.currentData);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/shadow.scss";
</style>

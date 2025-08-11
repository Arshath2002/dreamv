<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-01-06 11:35:34
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 09:55:57
-->
<template>
  <div>
    <div class="dsf-dv-list-tree-index-item">
      <span>{{ serial }}级序号样式</span>
      <div>
        <span @click="add" class="add" v-if="serial === 1">新增</span>
        <DsfIcon @click="deleteData" name="close" class="close" v-if="serial > 1"></DsfIcon>
      </div>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">序号类型<span>： </span></div>
      <DesDVRadioGroup v-model="formData.showContent" :data="{ dictionary: options }" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">宽度<span>： </span></div>
      <DesDVPixel v-model="formData.width" />
    </div>
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name">高度<span>： </span></div>
      <DesDVPixel v-model="formData.height" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">字体<span>： </span></div>
      <DesDVTextStyle v-model="textStyle" :config="{ isShowColor: false }" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">字体颜色<span>： </span></div>
      <DesDVMoreModeColor v-model="formData.fontColors" :config="{ type: 'both' }" />
    </div>

    <div class="ds-designer-property property-item" v-if="formData.showContent === 'icon'">
      <div class="property-item-name">图标设置<span>： </span></div>
      <DesDVMoreIcon v-model="formData.icons" :config="{ isDelIcon: true }" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">背景色<span>： </span></div>
      <DesDVMoreModeColor v-model="formData.bgColors" :config="{ type: 'both' }" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">圆角<span>： </span></div>
      <DesDVBorderRadius v-model="formData.borderRadius" />
    </div>
  </div>
</template>
<script>
export default {
  name: "DesDVListTreeIndexItem",
  props: {
    serial: {
      type: Number,
      default: 1,
    },
    formData: {
      type: Object,
      require: true,
    },
  },
  computed: {
    textStyle: {
      get() {
        let { textShadow = "", color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.formData;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
          textShadow,
        };
      },
      set(v) {
        this.$emit("change", this.formData);
      },
    },
  },
  data() {
    return {
      options: [
        {
          text: "数字序号",
          value: "number",
        },
        {
          text: "图标序号",
          value: "icon",
        },
      ],
    };
  },
  methods: {
    deleteData() {
      this.$emit("delete");
    },
    add() {
      this.$emit("add");
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DsfDVListTreeIndexItem.scss";
</style>

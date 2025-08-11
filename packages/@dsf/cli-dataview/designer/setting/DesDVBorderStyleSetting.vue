<template>
  <div class="des-dv-border-style-setting">
    <dsf-virtual-scroll>
      <template v-for="(it, index) in styles">
        <div
          class="des-dv-border-style-setting-preview-item"
          :key="`des-dv-border-style-setting-item${index}`"
          @click="clickHandler(it)"
        >
          <div class="preview-wrap">
            <component
              v-if="!isdecorator"
              :is="`DsfDataViewBorder${index + 1}`"
            ></component>
            <component v-else :is="it.component"></component>
          </div>
          <el-radio v-model="style" :label="it.value">{{ it.text }}</el-radio>
        </div>
      </template>
    </dsf-virtual-scroll>
  </div>
</template>
<script>
// 边框风格
const borderStyles = [
  {
    text: "风格1",
    value: "dsf.dataviewborder1",
  },
  {
    text: "风格2",
    value: "dsf.dataviewborder2",
  },
  {
    text: "风格3",
    value: "dsf.dataviewborder3",
  },
  {
    text: "风格4",
    value: "dsf.dataviewborder4",
  },
  {
    text: "风格5",
    value: "dsf.dataviewborder5",
  },
  {
    text: "风格6",
    value: "dsf.dataviewborder6",
  },
  {
    text: "风格7",
    value: "dsf.dataviewborder7",
  },
  {
    text: "风格8",
    value: "dsf.dataviewborder8",
  },
  {
    text: "风格9",
    value: "dsf.dataviewborder9",
  },
  {
    text: "风格10",
    value: "dsf.dataviewborder10",
  },
  {
    text: "风格11",
    value: "dsf.dataviewborder11",
  },
  {
    text: "风格12",
    value: "dsf.dataviewborder12",
  },
  {
    text: "风格13",
    value: "dsf.dataviewborder13",
  },
];

// 装饰器风格
const decoratorStyles = [
  {
    text: "风格1",
    value: "dsf.dataviewdecorateone",
    component: "DsfDataViewDecorateOne"
  },
  {
    text: "风格2",
    value: "dsf.dataviewdecoratetwo",
    component: "DsfDataViewDecorateTwo"
  },
  {
    text: "风格3",
    value: "dsf.dataviewdecoratethree",
    component: "DsfDataViewDecorateThree"
  },
  {
    text: "风格4",
    value: "dsf.dataviewdecoratefour",
    component: "DsfDataViewDecorateFour"
  },
  {
    text: "风格5",
    value: "dsf.dataviewdecoratefive",
    component: "DsfDataViewDecorateFive"
  },
  {
    text: "风格6",
    value: "dsf.dataviewdecoratesix",
    component: "DsfDataViewDecorateSix"
  },
  {
    text: "风格7",
    value: "dsf.dataviewdecorateseven",
    component: "DsfDataViewDecorateSeven"
  },
  {
    text: "风格8",
    value: "dsf.dataviewdecorateeight",
    component: "DsfDataViewDecorateEight"
  },
  {
    text: "风格9",
    value: "dsf.dataviewdecoratenine",
    component: "DsfDataViewDecorateNine"
  },
  {
    text: "风格10",
    value: "dsf.dataviewdecorateten",
    component: "DsfDataViewDecorateTen"
  },
  {
    text: "风格11",
    value: "dsf.dataviewdecorateeleven",
    component: "DsfDataViewDecorateEleven"
  },
  {
    text: "雷达扫描",
    value: "dsf.dataviewradarscanning",
    component: "DsfDataViewRadarScanning"
  },
  {
    text: "旋转1",
    value: "dsf.dataviewrotate1",
    component: "DsfDataViewRotate1"
  },
  {
    text: "旋转2",
    value: "dsf.dataviewrotate2",
    component: "DsfDataViewRotate2"
  },
  {
    text: "底部旋转",
    value: "dsf.dataviewbottomcircle",
    component: "DsfDataViewBottomCircle"
  },
];

export default {
  name: "DesDVBorderStyleSetting",
  mixins: [$mixins.propertyDialogSetting],
  props: {
    comType: {
      type: String,
      default: "",
    },
    // 是否为装饰器
    isdecorator: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      styles: [],
      style: "",
      defaultStyle: ""
    };
  },
  created() {
    this.styles = _.map(
      this.isdecorator ? decoratorStyles : borderStyles,
      (it) => it
    );

    // 默认值
    this.defaultStyle = this.isdecorator
      ? "dsf.dataviewdecorateone"
      : "dsf.dataviewborder1";
  },
  mounted() {
    if (this.comType) this.style = this.comType;
    let target = document.querySelectorAll(`*[ctrl_type='${this.comType}']`);
    if (target?.[target.length - 1])
      target[target.length - 1]?.scrollIntoView();
  },
  methods: {
    clickHandler(item) {
      this.style = item?.value || this.defaultStyle;
    },
    clear() {
      return this.defaultStyle;
    },
    yes() {
      return this.style;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVBorderStyleSetting.scss";
</style>

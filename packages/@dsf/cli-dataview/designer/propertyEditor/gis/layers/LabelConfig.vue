<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签显示<span>： </span></div>
      <DesDVSwitch :value="label.show" @change="changeValue($event, label, 'show')" />
    </div>
    <template v-if="label.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">位置<span>： </span></div>
        <DesDVTextAlign :data="{ config: { isShowVAlign: false } }" :value="label.position" @change="changeValue($event, label, 'position')"></DesDVTextAlign>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">内容<span>： </span></div>
        <el-input style="width: 200px" class="min" v-model="label.name" @change="changeValue($event, label, 'name')"></el-input>
        <DesDVToolTipsIcon :data="{ desc: '{a}=系列名; {b}=名称; {c}=值;' }" :descStriking="false"></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name flex-center">背景色<span>： </span></div>
        <DesDVColorPicker v-model="label.itemStyle.backgroundColor" :config="{ type: 'color' }" @change="changeValue($event, label.itemStyle, 'backgroundColor')"></DesDVColorPicker>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">样式<span>： </span></div>
        <DesDVTextStyle :config="textConfig" class="min" v-model="textStyle"></DesDVTextStyle>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "LabelConfig",
  props: {
    label: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      colorConfig: {
        type: "color",
      },

      dictionary: [
        { text: "左", value: "left" },
        { text: "中", value: "center" },
        { text: "右", value: "right" },
      ],
      textConfig: {
        picker: { type: "color" },
        isShowFontWeight: false,
        isShowItalics: false,
        isShowUnderline: false,
        isShowShadow: false,
      },
    };
  },
  computed: {
    textStyle: {
      get() {
        const { color, fontSize, fontFamily = "Microsoft Yahei" } = this.label.itemStyle;
        return {
          color,
          fontSize,
          fontFamily,
        };
      },
      set(v) {
        Object.assign(this.label.itemStyle, v);
        this.$emit("updateGisLayer");
      },
    },
  },
  methods: {
    updateGisLayer() {
      this.$emit("updateGisLayer");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.updateGisLayer();
    },
  },
};
</script>

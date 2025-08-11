<!--
 * @Description: 散点3D系列配置项
 * @Author: shenah
 * @Date: 2024-07-25 13:36:11
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 15:02:47
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标记类型<span>： </span></div>
      <DesDVSelect :data="{ dictionary: dictionary }" :value="getSymbol(series.symbol)" @change="changeSymbol($event, series)" />
    </div>
    <div class="ds-designer-property property-item" v-show="getSymbol(series.symbol) === 'custom'">
      <div class="property-item-name">上传<span>： </span></div>
      <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="series.symbol"></el-input>
      <button class="upload-button el-button el-button--small">
        <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
        <input accept=".svg" @change="changeSymbolImage($event, series, callBack)" type="file" class="upload-input" style="display: none" />
      </button>
      <DesDVToolTipsIcon
        :data="{
          desc: '只支持.svg',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标记大小<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolSize" @change="changeValue($event, series, 'symbolSize')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标记颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="series.itemStyle.color" @change="changeValue($event, series.itemStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item ml10 float-one-row">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolOffset[0]" @change="changeArray($event, series, 'symbolOffset', 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolOffset[1]" @change="changeArray($event, series, 'symbolOffset', 1)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">基准值<span>： </span></div>
      <DesDVSwitch v-model="series.isBaseValue" @change="changeValue($event, series, 'isBaseValue')" />
    </div>
    <div class="ds-designer-property property-item float-one-row ml20" v-if="series.isBaseValue">
      <div class="property-item-name">基准值<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '' }" :value="series.baseValue" @change="changeValue($event, series, 'baseValue')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签<span>： </span></div>
      <DesDVSwitch v-model="series.label.show" @change="changeValue($event, series.label, 'show')" />
    </div>
    <template v-if="series.label.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">字体<span>： </span></div>
        <DesDVNumber :config="{ min: 12, unit: 'px' }" :value="series.label.textStyle.fontSize" @change="changeValue($event, series.label.textStyle, 'fontSize')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name"></div>
        <DesDVColorPicker :config="colorConfig" v-model="series.label.textStyle.color" @change="changeValue($event, series.label.textStyle, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">位置<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: labelPosition }" v-model="series.label.position" @change="changeValue($event, series.label, 'position')"></DesDVRadioGroup>
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">颜色模式<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: blendModeOptions }" :value="series.blendMode" @change="changeValue($event, series, 'blendMode')"></DesDVRadioGroup>
    </div>
  </div>
</template>
<script>
import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js";
export default {
  name: "DesDVScatterMap",
  mixins: [svgAndImageUpload],
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  computed: {},
  data() {
    return {
      blendModeOptions: [
        {
          text: "混合",
          value: "source-over",
        },
        {
          text: "叠加",
          value: "lighter",
        },
      ],
      labelPosition: [
        {
          text: "上",
          value: "top",
        },
        {
          text: "左",
          value: "left",
        },
        {
          text: "右",
          value: "right",
        },
        {
          text: "下",
          value: "bottom",
        },
      ],
      colorConfig: {
        type: "color",
      },
      symbols: ["circle", "rect", "roundRect", "triangle", "diamond", "pin", "arrow", "none"],
      dictionary: [
        {
          text: "圆",
          value: "circle",
        },
        {
          text: "矩形",
          value: "rect",
        },
        {
          text: "圆角矩形",
          value: "roundRect",
        },
        {
          text: "三角",
          value: "triangle",
        },
        {
          text: "钻石",
          value: "diamond",
        },
        {
          text: "默认",
          value: "pin",
        },
        {
          text: "箭头",
          value: "arrow",
        },
        {
          text: "自定义",
          value: "custom",
        },
        {
          text: "无",
          value: "none",
        },
      ],
    };
  },
  methods: {
    changeArray(val, item, key, index) {
      let arr = item[key];
      arr[index] = val;
      this.$set(item, key, arr);
      this.$emit("updateChart");
    },
    getSymbol($symbol) {
      if (!this.symbols.includes($symbol)) {
        return "custom";
      } else {
        return $symbol;
      }
    },
    changeSymbol(e, item) {
      let val = "";
      if (e !== "custom") {
        val = e;
        this.$set(item, "symbol", val);
        this.$emit("updateChart");
      } else {
        this.$set(item, "symbol", val);
      }
    },
    callBack(val) {
      this.$set(this.series, "symbol", val);
      this.$emit("updateChart");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
  },
};
</script>

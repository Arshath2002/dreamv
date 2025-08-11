<!--
 * @Description: 每个饼图属性
 * @Author: shenah
 * @Date: 2024-04-26 16:19:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:26:00
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">线条类型<span>： </span></div>
      <DesDVRadioGroup
        :data="{ dictionary: borderTypeList }"
        :value="series.lineStyle.type"
        :fieldMap="{
          text: 'label',
          value: 'value',
        }"
        @change="changeItemValue($event, series.lineStyle, 'type')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">线条粗细<span>： </span></div>
      <DesDVNumber
        :value="series.lineStyle.width"
        :config="{
          unit: 'px',
        }"
        @change="changeItemValue($event, series.lineStyle, 'width')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">线条颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" :value="series.lineStyle.color" @change="changeLineColor($event, series, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" v-model="areaStyleColor" @change="changeItemColor($event, series.areaStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标记<span>： </span></div>
      <DesDVSwitch :value="getSymbole(series.symbol) !== 'none'" @change="changeSymbolFlag($event, series, 'symbol')" />
    </div>
    <!-- 标记 -->
    <template v-if="getSymbole(series.symbol) !== 'none'">
      <div class="ds-designer-property property-item">
        <div class="property-item-name ml20">形状<span>： </span></div>
        <DesDVSelect
          :value="getSymbole(series.symbol)"
          :data="{ dictionary: symbolOptions }"
          :fieldMap="{
            text: 'label',
            value: 'value',
          }"
          @change="changeItemValue($event, series, 'symbol')"
        ></DesDVSelect>
      </div>
      <div class="ds-designer-property property-item" v-if="getSymbole(series.symbol) === 'custom'">
        <div class="property-item-name ml20" style="opacity: 0">标记<span>： </span></div>
        <div style="display: inline-flex">
          <el-input readonly="readonly" style="width: 108px; margin: 0 10px 0 0" placeholder="请输入内容" size="small" :value="series.symbol"></el-input>
          <button class="upload-button el-button el-button--small" style="box-sizing: border-box; height: 32px">
            <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%; box-sizing: border-box"> 点击上传 </span>
            <input @change="changeCustomSymbol($event, series)" type="file" class="upload-input" style="display: none" />
          </button>
        </div>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name ml20">大小<span>： </span></div>
        <DesDVNumber :value="series.symbolSize" @change="changeItemValue($event, series, 'symbolSize')" />
      </div>
      <div class="ds-designer-property property-item" v-if="getSymbole(series.symbol) !== 'custom'">
        <div class="property-item-name ml20">颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" :value="series.itemStyle.color" @change="changeItemColor($event, series.itemStyle, 'color')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签<span>： </span></div>
      <DesDVSwitch :value="series.label.show" @change="changeItemValue($event, series.label, 'show')" />
    </div>
    <template v-if="series.label.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">标签位置<span>： </span></div>
        <DesDVSelect
          :value="series.label.position"
          :data="{ dictionary: labelPosition }"
          :fieldMap="{
            text: 'label',
            value: 'value',
          }"
          @change="changeItemValue($event, series.label, 'position')"
        ></DesDVSelect>
      </div>
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name">字体<span>： </span></div>
        <DesDVPixel :value="series.label.fontSize" :options="fontSizeUnitOptions" @change="changeItemValue($event, series.label, 'fontSize')"></DesDVPixel>
      </div>
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name" style="min-width: 0px; display: none">
          字体
          <span>： </span>
        </div>
        <DesDVColorPicker
          :config="{
            ...colorConfig,
            noInput: true,
          }"
          v-model="series.label.color"
          @change="changeItemValue($event, series.label, 'color')"
        />
      </div>
    </template>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js";
export default {
  name: "DsfDVChartRadarItem",
  mixins: [itemMixin, svgAndImageUpload],
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      symbolOptions: [
        {
          label: "自定义",
          value: "custom",
        },
        {
          label: "圆",
          value: "circle",
        },
        {
          label: "空心圆",
          value: "emptyCircle",
        },
        {
          label: "长方形",
          value: "rect",
        },
        {
          label: "圆角长方形",
          value: "roundRect",
        },
        {
          label: "三角形",
          value: "triangle",
        },
        {
          label: "钻石形",
          value: "diamond",
        },
        {
          label: "pin",
          value: "pin",
        },
        {
          label: "箭头",
          value: "arrow",
        },
      ],
      areaStyleColor: "",
    };
  },
  computed: {},
  created() {
    if (this.series.areaStyle.startColor) {
      delete this.series.areaStyle.startColor;
      delete this.series.areaStyle.endColor;
      delete this.series.areaStyle.isshade;
    }
    this.areaStyleColor = dsf.dataview.utils.convertChartToCSSColor(this.series.areaStyle.color);
  },
  methods: {
    changeSymbolFlag(val, item, key) {
      let type = val ? "circle" : "none";
      this.changeItemColor(type, item, key);
    },
    changeLineColor(val, series, key) {
      this.changeItemColor(val, series.itemStyle, key);
      this.changeItemColor(val, series.lineStyle, key);
    },
    changeCustomSymbol(val, item) {
      this.changeSymbolImage(val, item, (result) => {
        this.changeItemValue(result, item, "symbol");
      });
    },
  },
};
</script>

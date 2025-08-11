<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-23 14:49:28
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:24:22
-->
<template>
  <div style="margin-top: 10px">
    <template v-if="type == 'scatter'">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">散点形状<span>： </span></div>
        <DesDVSelect  :data="{ dictionary: dictionary }" :value="getSymbol(series.symbol)" @change="changeSymbol($event, series)" />
      </div>
      <div class="ds-designer-property property-item" v-show="getSymbol(series.symbol) === 'custom'">
        <div class="property-item-name">上传<span>： </span></div>
        <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="series.symbol"></el-input>
        <button class="upload-button el-button el-button--small">
          <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
          <input @change="changeSymbolImage($event, series, callBack)" type="file" class="upload-input" style="display: none" />
        </button>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">散点大小<span>： </span></div>
        <DesDVRadioGroup  :data="{ dictionary: radios }"  v-model="series.isSize" @change="changeValue($event, series, 'isSize')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="!series.isSize">
        <div class="property-item-name">大小<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolSize" @change="changeValue($event, series, 'symbolSize')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-else>
        <div class="property-item-name">基准值<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.scatterBase" @change="changeValue($event, series, 'scatterBase')" />
      </div>
    </template>
    <!-- 线条 -->
    <template v-if="type == 'line'">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">线条粗细<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.lineStyle.width" @change="changeValue($event, series.lineStyle, 'width')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">{{ colorsName[type] }}<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" ref="tag" v-model="itemColor" @change="changeColor($event, series.itemStyle, 'color')" />
    </div>
    <template v-if="type == 'line'">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">线条平滑<span>： </span></div>
        <DesDVSwitch :value="series.smooth" @change="changeValue($event, series, 'smooth')" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">线条堆叠<span>： </span></div>
        <DesDVSwitch :config="{ activeValue: 'line', inactiveValue: '' }" :value="series.stack" @change="changeValue($event, series, 'stack')" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">线条标记<span>： </span></div>
        <DesDVSwitch :value="series.showSymbol" @change="changeValue($event, series, 'showSymbol')" />
      </div>

      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">标记形状<span>： </span></div>
        <DesDVSelect :data="{ dictionary: dictionary }" :value="getSymbol(series.symbol)" @change="changeSymbol($event, series)" />
      </div>
      <div class="ds-designer-property property-item ml20" v-show="getSymbol(series.symbol) === 'custom'">
        <div class="property-item-name">上传<span>： </span></div>
        <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="series.symbol"></el-input>
        <button class="upload-button el-button el-button--small">
          <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
          <input @change="changeSymbolImage($event, series, callBack)" type="file" class="upload-input" style="display: none" />
        </button>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">标记大小<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolSize" @change="changeValue($event, series, 'symbolSize')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签展示<span>： </span></div>
      <DesDVSwitch :value="series.label.show" @change="changeValue($event, series.label, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">位置<span>： </span></div>
      <Direction
        class="vertical-items"
        v-model="series.label.position"
        type="vertical"
        :mapData="[
          { mapName: 'top', mapKey: 'top' },
          { mapName: 'inside', mapKey: 'middle' },
          { mapName: 'bottom', mapKey: 'bottom' },
        ]"
        @input="changeValue($event, series.label, 'position')"
      ></Direction>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="textStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item" v-if="type == 'bar'">
      <div class="property-item-name">柱体堆叠<span>： </span></div>
      <DesDVSwitch :config="{ activeValue: 'bar', inactiveValue: '' }" :value="series.stack" @change="changeValue($event, series, 'stack')" />
    </div>
  </div>
</template>
<script>


import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";

import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js";


import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "DesDVChartPolarItem",
  components: {   Direction,   },
  mixins: [svgAndImageUpload, commonMixin],
  inject:["owner"],
  props: {
    series: {
      type: Object,
      require: true,
    },
    type: {
      type: String,
      default: "bar",
    },
  },
  data() {
    return {
      colorsName: {
        bar: "柱体颜色",
        scatter: "散点颜色",
        line: "线条颜色",
      },
      itemColor: "",
      bothConfig: {
        type: "both",
      },
      colorConfig: {
        type: "color",
      },
      radios: [
        {
          text: "自动计算",
          value: true,
        },
        {
          text: "固定大小",
          value: false,
        },
      ],
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
  computed: {
    textStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.series.label;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.series.label, v);
        this.$emit("updateChart");
      },
    },
  },
  created() {
    this.styleChange();
    //样式风格改变
    dsf.emit.$on("updateStyleChange", this.styleChange, this.owner.$children[0]);
  },
  beforeDestroy() {
    dsf.emit.$remove("updateStyleChange", this.owner.$children[0]);
  },
  methods: {
    styleChange() {
      const itemColor = this.series.itemStyle.color;
      this.itemColor = dsf.dataview.utils.convertChartToCSSColor(itemColor);
    },
    changeColor(val, item, key) {
      const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      if (!_.isEqual(item[key], color)) {
        this.$set(item, key, color);
        this.$emit("updateChart");
      }
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
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
  },
};
</script>

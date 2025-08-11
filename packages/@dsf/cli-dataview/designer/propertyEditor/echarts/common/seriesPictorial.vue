<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">X轴<span>： </span></div>
      <DesDVSelect class="min" :data="{ dictionary: xAxisList }" :value="series.xAxisIndex" @change="changeValue($event, series, 'xAxisIndex')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">Y轴<span>： </span></div>
      <DesDVSelect class="min"  :data="{ dictionary: yAxisList }"  :value="series.yAxisIndex" @change="changeValue($event, series, 'yAxisIndex')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体颜色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" v-model="itemColor" @change="changeColor($event, series.itemStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">单个颜色<span>： </span></div>
      <DesDVMoreModeColor :config="modeColor" v-model="singleData" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体宽度<span>： </span></div>
      <DesDVPixel class="min" :options="options" v-model="series.barWidth" @change="changeValue($event, series, 'barWidth')" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">图形类型<span>： </span></div>
      <DesDVSelect :data="{ dictionary: markers }"  :value="getSymbol(series.symbol)" @change="changeSymbol($event, series)" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="getSymbol(series.symbol) === 'custom'">
      <div class="property-item-name">上传<span>： </span></div>
      <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="series.symbol"></el-input>
      <button class="upload-button el-button el-button--small">
        <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
        <input @change="changeSymbolImage($event, series, callBack)" type="file" class="upload-input" style="display: none" />
      </button>
    </div>
    <div class="ds-designer-property property-item ml10 float-one-row">
      <div class="property-item-name">图形宽<span>： </span></div>
      <DesDVPixel class="min" :options="options" :value="series.symbolSize[0]" @change="changeValue($event, series.symbolSize, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">图形高<span>： </span></div>
      <DesDVPixel class="min" :options="options" :value="series.symbolSize[1]" @change="changeValue($event, series.symbolSize, 1)" />
    </div>
    <div class="ds-designer-property property-item ml20 float-one-row">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: -1000, unit: 'px' }" :value="series.symbolOffset[0]" @change="changeValue($event, series.symbolOffset, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: -1000, unit: 'px' }" :value="series.symbolOffset[1]" @change="changeValue($event, series.symbolOffset, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图形位置<span>： </span></div>
      <Direction
        class="horizontal-items"
        type="horizontal"
        v-model="series.symbolPosition"
        :mapData="[
          { mapName: 'start', mapKey: 'left' },
          { mapName: 'center', mapKey: 'center' },
          { mapName: 'end', mapKey: 'right' },
        ]"
        @input="changeValue($event, series, 'symbolPosition')"
      ></Direction>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图形数量<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: repeatOptions }" v-model="series.symbolRepeat" @change="changeValue($event, series, 'symbolRepeat')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签展示<span>： </span></div>
      <DesDVSwitch v-model="series.label.show" @change="changeValue($event, series.label, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">位置<span>： </span></div>
      <Direction
        class="vertical-items"
        type="vertical"
        v-model="series.label.position"
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
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
  </div>
</template>
<script>





import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";


import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "seriesPictorial",
  inject: ["owner"],
  mixins: [svgAndImageUpload, commonMixin],
  components: {        Direction },
  props: {
    chart: {
      type: Object,
      require: true,
    },
    series: {
      type: Object,
      require: true,
    },
  },
  filters: {
    valueFilter(val) {
      return (val + "").replace(/%/g, "");
    },
  },
  computed: {
    nameTextStyle: {
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
    singleData: {
      get() {
        let res = [];
        let defaultColor = this.series.itemStyle.color || "red";
        if (!this.series.singleData) return [];
        this.series.singleData.forEach((it) => {
          let color = it.itemStyle ? it.itemStyle.color : defaultColor;
          res.push(dsf.dataview.utils.convertChartToCSSColor(color));
        });
        return res;
      },
      set(v) {
        let singleData = [];
        v.forEach((it) => {
          const color = dsf.dataview.utils.convertCSSToEChartsColor(it);
          singleData.push({
            itemStyle: {
              color,
            },
          });
        });
        this.series.data.forEach((it, index) => {
          if (singleData[index]) {
            if (dsf.isObject(it)) {
              it.itemStyle = singleData[index].itemStyle;
            } else {
              this.series.data[index] = {
                value: it,
                itemStyle: singleData[index].itemStyle,
              };
            }
          } else {
            if (dsf.isObject(it)) {
              Reflect.deleteProperty(it, "itemStyle");
            }
          }
        });
        this.$set(this.series, "singleData", singleData);
        this.$emit("updateChart");
      },
    },
    xAxisList() {
      return this.chart.xAxis.map((it, index) => {
        return {
          text: `X${index + 1}轴`,
          value: index,
        };
      });
    },
    yAxisList() {
      return this.chart.yAxis.map((it, index) => {
        return {
          text: `Y${index + 1}轴`,
          value: index,
        };
      });
    },
  },
  data() {
    const colors = this.chart.color;
    return {
      itemColor: "",
      options: [
        {
          value: "%",
          label: "%",
        },
        {
          value: "fx",
          label: "fx",
        },
      ],
      repeatOptions: [
        { text: "不重复", value: false },
        { text: "重复", value: true },
        { text: "固定数量", value: "fixed" },
      ],
      modeColor: {
        lastOneDel: true,
        colors: colors,
        type: "both",
      },
      colorConfig: {
        type: "color",
      },
      bothConfig: {
        type: "both",
      },
      markers: [
        {
          text: "默认",
          value: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
        },
        {
          text: "自定义",
          value: "custom",
        },
      ],
    };
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
    getSymbol($symbol) {
      if ($symbol != "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z") {
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
  },
};
</script>

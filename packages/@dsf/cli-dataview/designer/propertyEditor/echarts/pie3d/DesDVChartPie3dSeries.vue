<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-08 14:49:12
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-18 11:02:25
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">外环<span>： </span></div>
      <DesDVPixel :options="options" :value="series.size" @change="changeValue($event, series, 'size')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">内环<span>： </span></div>
      <DesDVPixel :options="options" :value="series.innerSize" @change="changeValue($event, series, 'innerSize')" />
    </div>
    <div class="ds-designer-property property-item float-one-row ml10">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVPixel :options="options" :value="series.center[0]" @change="changeValue($event, series.center, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVPixel :options="options" :value="series.center[1]" @change="changeValue($event, series.center, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">深度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.depth" @change="changeValue($event, series, 'depth')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">系列颜色<span>： </span></div>
      <DesDVMoreModeColor
        ref="DesDVMoreModeColor"
        :config="{
          lastOneDel: true,
          type: 'both',
          colors: chartColorList,
        }"
        v-model="singleData"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签展示<span>： </span></div>
      <DesDVSwitch v-model="series.dataLabels.enabled" @change="changeValue($event, series.dataLabels, 'enabled')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.dataLabels.enabled">
      <div class="property-item-name">标签内容<span>： </span></div>
      <div>
        <div style="display: flex; align-items: center; margin-bottom: 5px" v-for="(formatter, index) in series.dataLabels.formatters" :key="index">
          <el-input size="small" :value="formatter" @input="changeFormatterValue($event, index)" class="data-view-text"></el-input>
          <div class="des-dv-icon-add" v-if="index == 0" @click="addFormat" style="margin: 0 5px">
            <i class="add-btn el-icon-plus"></i>
          </div>
          <div class="des-dv-icon-add" v-if="index > 0" @click="deleteItem(index)" style="margin: 0 5px">
            <i class="add-btn el-icon-minus"></i>
          </div>
        </div>
      </div>
      <DesDVToolTipsIcon
        style="margin-top: 2px"
        :data="{
          desc: '{point.name}=数据名; {point.y}=数据值; {point.b}=百分比',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.dataLabels.enabled">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.dataLabels.enabled">
      <div class="property-item-name">引导线<span>： </span></div>
      <DesDVSwitch :config="{ activeValue: '30', inactiveValue: 0 }" v-model="series.dataLabels.distance" @change="changeValue($event, series.dataLabels, 'distance')" />
    </div>
  </div>
</template>
<script>
import mixin from "../mixin.js";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";

//css转highchart
const convertCSSToHighColor = function (cssColor) {
  //匹配线性渐变
  const matchLine = cssColor.match(/linear-gradient\((.*)\)/);
  const matchRadial = cssColor.match(/radial-gradient\((.*)\)/);

  // 不是渐变色直接返回
  if (!matchLine && !matchRadial) return cssColor;
  if (matchLine) {
    const parts = matchLine[1].split("deg,");
    // 将角度转换成坐标
    let angle = +parts[0];
    const limited = 0.01;
    let radian = (angle * Math.PI) / 180;
    let x1 = 0;
    let y1 = 0;
    if (angle > 90) {
      y1 = +Math.sin(((angle - 90) * Math.PI) / 180).toFixed(2);
      x1 = -Math.cos(((angle - 90) * Math.PI) / 180).toFixed(2);
    }
    const x2 = Math.abs(Math.sin(radian)) < limited ? 0 : Math.sin(radian);
    const y2 = Math.abs(Math.cos(radian)) < limited ? 0 : Math.cos(radian);

    // 颜色转换处理
    const colors = parts[1].split("%,");

    if (colors.length == 1) {
      console.log("colors", cssColor, colors);
    }
    const stops = [];
    for (let i = 0; i < colors.length; i++) {
      let item = colors[i];
      if (!item) continue;
      const splitIndex = item.lastIndexOf(" ");

      let color = item.slice(0, splitIndex);
      let percent = item.slice(splitIndex + 1);
      if (percent.endsWith("%")) percent = item.slice(splitIndex + 1, -1);
      color = color.replace(/NaN/g, "255");
      stops.push([+percent / 100, color]);
    }

    return {
      linearGradient: { x1, x2, y1, y2 },
      stops,
    };
  } else {
    const parts = matchRadial[1].split("%,");
    parts.shift();
    const result = matchRadial[1].match(/at(.*?),/);
    let points = result[1].match(/([\d\.]+%)\s([\d\.]+%)\s?([\d\.]+%)?/);
    points = points.slice(1, 3).map(parseFloat);

    let cx = 0.5;
    let cy = 0.5;
    let r = 0.5;
    if (points.length) {
      switch (points.length) {
        case 1:
          cx = parseFloat(points[0] / 100);
          break;
        case 2:
          cx = parseFloat(points[0] / 100);
          cy = parseFloat(points[1] / 100);
          break;
      }
    }

    const stops = [];
    for (let i = 0; i < parts.length; i++) {
      let item = parts[i];
      if (!item) continue;
      const splitIndex = item.lastIndexOf(" ");

      let color = item.slice(0, splitIndex);
      let percent = item.slice(splitIndex + 1);
      if (percent.endsWith("%")) percent = item.slice(splitIndex + 1, -1);

      color = color.replace(/NAN/g, "255");
      stops.push([+percent / 100, color]);
    }
    return {
      radialGradient: { cx, cy, r },
      stops,
    };
  }
};
const convertHightToCSSColor = function (color) {
  let res = "";
  //线性颜色
  if (color.linearGradient) {
    const x = color.linearGradient.x1;
    const colorStops = color.stops;
    const angle = parseInt((Math.asin(x) * 180) / Math.PI);
    res += `linear-gradient(${angle}deg,`;
    colorStops.forEach((it, index) => {
      let percent = parseInt(it[0] * 100);
      res += `${it[1]} ${percent}%`;
      if (index < colorStops.length - 1) {
        res += ",";
      }
    });
    res += ")";
  } else if (color.radialGradient) {
    const { cx, cy } = color.radialGradient;
    let x = parseInt(cx * 100);
    let y = parseInt(cy * 100);
    const colorStops = color.stops;
    res += `radial-gradient(circle at ${x}% ${y}%,`;
    colorStops.forEach((it, index) => {
      let percent = parseInt(it[0] * 100);
      res += `${it[1]} ${percent}%`;
      if (index < colorStops.length - 1) {
        res += ",";
      }
    });
    res += ")";
  } else {
    res = color;
  }
  return res;
};
export default {
  name: "DesDVChartPie3dSeries",
  mixins: [mixin, commonMixin],
  computed: {
    series() {
      return this.chart.series[0];
    },
    chartColorList() {
      return this.chart.colors;
    },
    nameTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.series.dataLabels.style || {};
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        if (this.series.dataLabels.style) {
          Object.assign(this.series.dataLabels.style, v);
        } else {
          this.$set(this.series.dataLabels, "style", v);
        }

        this._updateChart();
      },
    },
    singleData: {
      get() {
        let res = [];
        let colorList = this.chart.colors;
        let nowIndex = -1;
        if (this.series.singleData && this.series.singleData.length) {
          this.series.singleData.forEach((it) => {
            let color = it.color;
            if (color) {
              res.push(convertHightToCSSColor(color));
            } else {
              nowIndex += 1;
              res.push(colorList[nowIndex]);
            }
          });
        } else {
          this.series.data.forEach((it) => {
            let color = it.color;
            if (color) {
              res.push(convertHightToCSSColor(color));
            } else {
              nowIndex += 1;
              res.push(colorList[nowIndex]);
            }
          });
        }
        return res;
      },
      set(v) {
        let singleData = [];
        v.forEach((it) => {
          const color = convertCSSToHighColor(it);
          singleData.push({
            color,
          });
        });
        this.series.data.forEach((it, index) => {
          if (singleData[index]) {
            if (dsf.isObject(it)) {
              it.color = singleData[index].color;
            } else {
              this.series.data[index] = {
                value: it,
                color: singleData[index].color,
              };
            }
          } else {
            if (dsf.isObject(it)) {
              Reflect.deleteProperty(it, "itemStyle");
            }
          }
        });
        this.series.singleData = singleData;
        this._updateChart();
      },
    },
  },
  data() {
    const colors = this.owner.chart.color;
    return {
      colors: [],
      options: [
        {
          value: "%",
          label: "%",
        },
      ],
      modeColor: {
        colors: colors,
        lastOneDel: true,
        type: "both",
      },
    };
  },
  created() {
    if (!Array.isArray(this.series.dataLabels.formatters)) {
      this.$set(this.series.dataLabels, "formatters", [this.series.dataLabels.format]);
    }
  },
  methods: {
    addFormat() {
      this.series.dataLabels.formatters.push("");
    },
    deleteItem(index) {
      this.series.dataLabels.formatters.splice(index, 1);
      const formatter = this.series.dataLabels.formatters.reduce((sum, cur) => (sum ? sum + "<br/>" : sum) + cur, "");
      this.changeValue(formatter, this.series.dataLabels, "format");
    },
    changeFormatterValue(value, index) {
      this.$set(this.series.dataLabels.formatters, index, value);
      const formatter = this.series.dataLabels.formatters.reduce((sum, cur) => (sum ? sum + "<br/>" : sum) + cur, "");
      this.changeValue(formatter, this.series.dataLabels, "format");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this._updateChart();
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>

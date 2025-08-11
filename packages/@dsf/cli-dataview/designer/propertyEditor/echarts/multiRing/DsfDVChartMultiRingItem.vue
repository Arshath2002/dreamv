<!--
 * @Description: 多圆环属性配置
 * @Author: shenah
 * @Date: 2024-05-06 15:07:38
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 11:44:02
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">圆环数据<span>： </span></div>
      <DesDVRadioGroup  :data="{ dictionary: countActiveOptions }"  :value="chart.countActive" @change="changeItemValue($event, chart, 'countActive')" />
    </div>
    <!-- 圆环位置 -->
    <div class="property-flex-wrap">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">圆环位移X<span>： </span></div>
        <DesDVPixel :value="settingSeries.center[0]" @change="changePosition($event, 0)"></DesDVPixel>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name two">Y<span>： </span></div>
        <DesDVPixel :value="settingSeries.center[1]" @change="changePosition($event, 1)"></DesDVPixel>
      </div>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">圆环方向<span>： </span></div>
      <DesDVRadioGroup  :data="{ dictionary: clockWiseOptions }"  :value="settingSeries.clockWise" @change="changeClockWise" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">圆环大小<span>： </span></div>
      <DesDVNumber
        :value="chart.pieSize[0]"
        :config="{
          unit: '%',
        }"
        @change="changePieSize($event, 0)"
      />
      <DesDVToolTipsIcon
        :data="{
          desc: '占父容器的百分比',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="property-flex-wrap">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">圆环宽度<span>： </span></div>
        <DesDVNumber
          :value="chart.pieSize[1]"
          :config="{
            unit: 'px',
          }"
          @change="changePieSize($event, 1)"
        />
        <DesDVToolTipsIcon
          :data="{
            desc: '最大10，最小1',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name two">间隙<span>： </span></div>
        <DesDVNumber
          :value="chart.pieSize[2]"
          :config="{
            unit: 'px',
          }"
          @change="changePieSize($event, 2)"
        />
      </div>
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">类型<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: activeTypeOptions }"  :value="chart.active" @change="changeItemValue($event, chart, 'active')" />
    </div>
    <!-- 数据堆叠 -->
    <template v-if="chart.active === 0">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">自动排序<span>： </span></div>
        <DesDVSwitch :value="chart.autoSort" @change="changeItemValue($event, chart, 'autoSort')" />
        <DesDVToolTipsIcon
          :data="{
            desc: '开启按照数据大小自动排序，关闭按照数据初始顺序排序。',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">系列色<span>： </span></div>
        <DesDVMoreModeColor
          ref="DesDVMoreModeColor"
          :config="{
            type: 'color',
            colors: chartColorList,
          }"
          v-model="ringColorList"
        />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">底色<span>： </span></div>
        <DesDVMoreModeColor :config="colorConfig" v-model="ringBaseColorList" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">圆环样式<span>： </span></div>
        <DesDVRadioGroup  :data="{ dictionary: circleStyleOptions }"  :value="circleStyle.data[0].value" @change="changeRingStyle" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">标签<span>： </span></div>
        <DesDVSwitch :value="settingSeries.data[2].label.show" @change="handleRingMoreLabel($event, 'show')" />
      </div>
      <!-- 标签 -->
      <template v-if="settingSeries.data[2].label.show">
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">标签内容<span>： </span></div>
          <el-input size="small" v-model="chart.labelFormatter" @change="handleRingMoreLabel($event, 'formatter')"></el-input>
          <DesDVToolTipsIcon
            :data="{
              desc: '{a}=数据名; {b}=数据值; {c}=占比',
            }"
          ></DesDVToolTipsIcon>
        </div>
        <div class="ds-designer-property property-item float-one-row ml40">
          <div class="property-item-name">字体<span>： </span></div>
          <DesDVPixel :value="settingSeries.data[2].label.fontSize" :options="fontSizeUnitOptions" @change="handleRingMoreLabel($event, 'fontSize')"></DesDVPixel>
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
            v-model="settingSeries.data[2].label.color"
            @change="handleRingMoreLabel($event, 'color')"
          />
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
export default {
  name: "DsfDVChartMultiRingItem",
  mixins: [itemMixin],
  inject: ["owner"],
  props: {
    chart: {
      type: Object,
      require: true,
    },
    settingSeries: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      activeTypeOptions: [
        {
          text: "数据堆积",
          value: 0,
        },
        {
          text: "单环",
          value: 1,
        },
      ],
      countActiveOptions: [
        {
          text: "数值",
          value: 1,
        },
        {
          text: "百分比",
          value: 0,
        },
      ],
      circleStyleOptions: [
        {
          text: "全圆",
          value: 10,
        },
        {
          text: "四分之三圆",
          value: 7.5,
        },
        {
          text: "半圆",
          value: 5,
        },
      ],
      circleSingleStyleOptions: [
        {
          text: "全铺",
          value: 1,
        },
        {
          text: "自适应",
          value: 0.5,
        },
      ],
      clockWiseOptions: [
        {
          text: "顺时针",
          value: true,
        },
        {
          text: "逆时针",
          value: false,
        },
      ],
      circleStyle:
        this.chart.active === 0
          ? _.cloneDeep(this.chart.series[1])
          : {
              data: [
                {
                  value: 7.5,
                  itemStyle: {
                    color: "rgba(0,0,0,0)",
                  },
                  tooltip: {
                    show: false,
                  },
                  hoverAnimation: false,
                },
                {
                  value: 2.5,
                  itemStyle: {
                    color: "rgba(0,0,0,0)",
                    borderWidth: 0,
                  },
                  tooltip: {
                    show: false,
                  },
                  hoverAnimation: false,
                },
              ],
            },
    };
  },
  computed: {
    ringColorList: {
      get() {
        const colors = [];
        if (this.chart.singleData && this.chart.singleData.length) {
          this.chart.singleData.forEach((it) => {
            colors.push(dsf.dataview.utils.convertChartToCSSColor(it.itemStyle.color));
          });
        }
        return colors;
      },
      set(v) {
        const singleData = [];
        v.forEach((it) => {
          const color = dsf.dataview.utils.convertCSSToEChartsColor(it);
          singleData.push({
            itemStyle: {
              color,
            },
          });
        });
        let nowIndex = -1;
        this.chart.series.forEach((it) => {
          if (!it.z) {
            nowIndex += 1;
            this.handleRingMoreSetColor(nowIndex, it, singleData);
          }
        });

        this.$set(this.chart, "singleData", singleData);
        this.$emit("updateChart");
      },
    },
    ringBaseColorList: {
      get() {
        const colors = [];
        if (this.chart.baseSingleData && this.chart.baseSingleData.length) {
          this.chart.baseSingleData.forEach((it) => {
            colors.push(dsf.dataview.utils.convertChartToCSSColor(it.itemStyle.color));
          });
        }
        return colors;
      },
      set(v) {
        const baseSingleData = [];
        v.forEach((it) => {
          const color = dsf.dataview.utils.convertCSSToEChartsColor(it);
          baseSingleData.push({
            itemStyle: {
              color,
            },
          });
        });
        let nowIndex = -1;
        this.chart.series.forEach((it) => {
          if (it.z) {
            nowIndex += 1;
            this.handleRingMoreSetColor(nowIndex, it, baseSingleData);
          }
        });
        this.$set(this.chart, "baseSingleData", baseSingleData);
        this.$emit("updateChart");
      },
    },
    chartColorList() {
      return this.chart.color;
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
      const singleData = [];
      // 底色
      const baseSingleData = [];
      this.chart.series.forEach((it) => {
        const color = it.data[0].itemStyle.color;
        if (!it.z) {
          singleData.push({
            itemStyle: {
              color: color,
            },
          });
        } else {
          baseSingleData.push({
            itemStyle: {
              color: color,
            },
          });
        }
      });
      this.$set(this.chart, "singleData", singleData);
      this.$set(this.chart, "baseSingleData", baseSingleData);
    },
    changePosition(val, type) {
      this.chart.series.forEach((series) => {
        this.$set(series.center, type, val);
      });
      this.$emit("updateChart");
    },
    changeRingStyle(val) {
      // 数据堆叠
      this.chart.series.forEach((series, index) => {
        if (index % 2 === 1) {
          this.$set(series.data[0], "value", val);
          this.$set(series.data[1], "value", 10 - val);
        }
      });
      this.chart.series[1].data[0].value = val;
      this.circleStyle.data[0].value = val;
      this.$emit("updateChart");
    },
    changeClockWise(val) {
      this.chart.series.forEach((series) => {
        this.$set(series, "clockWise", val);
      });
      this.$emit("updateChart");
    },
    changePieSize(val, key) {
      let options = _.cloneDeep(this.chart.pieSize);
      options[key] = val;
      let zIndex = 0;
      let NoIndex = 0;
      this.chart.series.forEach((item) => {
        if (!item.z) {
          item.radius = [options[0] - NoIndex * options[2] + "%", options[0] - options[1] - NoIndex * options[2] + "%"];
          NoIndex++;
        } else {
          item.radius = [options[0] - zIndex * options[2] + "%", options[0] - options[1] - zIndex * options[2] + "%"];
          zIndex++;
        }
      });
      this.$set(this.chart.pieSize, key, val);
      this.$emit("updateChart");
    },
    handleRingMoreGetColor(list, it) {
      let color = it.data[0].itemStyle.color;
      list.push(dsf.dataview.utils.convertChartToCSSColor(color));
    },
    handleRingMoreSetColor(nowIndex, it, colorList) {
      let item = colorList[nowIndex];
      if (item) {
        const color = item.itemStyle.color;
        if (dsf.isObject(it.data[0])) {
          if (it.data[0].itemStyle) {
            it.data[0].itemStyle.color = color;
          } else {
            it.data[0].itemStyle = {
              color: color,
            };
          }
        } else {
          this.chart.series.data[0] = {
            value: it,
            itemStyle: {
              color: color,
            },
          };
        }
      } else {
        if (dsf.isObject(it)) {
          Reflect.deleteProperty(it, "itemStyle");
        }
      }
    },
    handleRingMoreLabel(val, type, i) {
      this.chart.series.forEach((series, index) => {
        if (index % 2 === 0) {
          if (type === "padding") {
            series.data[2].label[type][i] = val;
          } else {
            series.data[2].label[type] = val;
          }
        }
      });
      if (type === "formatter") {
        this.chart.labelFormatter = val;
      }
      this.$emit("updateChart");
    },
    changeSpecialItemKey(val, item, key) {
      if (key === "active") {
        if (val === 0) {
          this.initSingleToStackData();
        } else {
          this.circleStyle = _.cloneDeep(this.chart.series[1]);
          this.initStackToSingleData();
        }
      } else if (key === "countActive") {
        if (this.chart.active === 0) {
          this.handleMoreCountActive();
        } else if (this.chart.active === 1) {
          this.handleSingleCountActive(this.chart.series[0].thresholdCode);
        }
      } else if (key === "thresholdCode") {
        this.handleSingleCountActive(val);
      }
    },
    handleMoreCountActive() {
      let tempData = [];
      this.chart.series.forEach((item) => {
        if (!item.z) {
          tempData.push(_.cloneDeep(item.data[0]));
        }
      });
      this.resetSingleData(tempData);
    },
    handleSingleCountActive(thresholdCode) {
      let sum = 0;
      let length = this.chart.series[0].data.length;
      this.chart.series[0].data.forEach((item, index) => {
        if (length - index > 2) {
          item.value = (this.chart.countActive === 0 ? item.numberZb : item.original) * thresholdCode;
          sum += item.value;
        } else if (length - index === 2) {
          item.value = 100 - sum;
        }
      });
    },
    // 多环转单环
    initStackToSingleData() {
      let newData = [];
      let sum = 0;
      let newSeries = [];
      // 每次切换重新装载底色
      this.chart.series.forEach((item) => {
        if (!item.thresholdCode) item.thresholdCode = 0.5;
        if (!item.z) {
          let obj = _.cloneDeep(item.data[0]);
          obj.value = (this.chart.countActive === 0 ? obj.original : obj.numberZb) * item.thresholdCode;
          sum = sum + obj.value;
          newData.push(obj);
        }
      });
      let resArr = newData.reduce((prev, cur) => {
        const { category } = cur;
        prev[category] = prev[category] ?? [];
        prev[category].push(cur);
        return prev;
      }, {});
      let i = 0;
      for (let key in resArr) {
        newSeries.push(this.getStackSeries(resArr[key], this.chart.series[0], this.chart.pieSize, key, i));
        i++;
      }
      let nameArr = newSeries.map((item) => {
        return item.data[item.data.length - 1].name;
      });
      let maxlengthName = nameArr.sort((a, b) => {
        return b.length - a.length;
      })[0];
      let canvasWidth = Number(this.getTextWidth(maxlengthName, this.chart.series[0].data[this.chart.series[0].data.length - 1].label.fontSize + "px")) + 35;
      let shiftPadding = [0, 0, 0, 0];
      if (this.chart.series[0].clockWise === true) {
        shiftPadding[1] = canvasWidth;
        shiftPadding[3] = 0;
      } else {
        shiftPadding[1] = 0;
        shiftPadding[3] = canvasWidth;
      }
      newSeries.forEach((item, index) => {
        item.data[item.data.length - 1].label.padding = shiftPadding;
        if (this.chart.series[index]) {
          this.$set(this.chart.series, index, item);
        } else {
          this.chart.series.push(item);
        }
      });
      this.settingSeries = this.chart.series[0];
      this.chart.series.splice(newSeries.length);
    },
    //单环转多环
    initSingleToStackData() {
      let data = [];
      this.chart.series.forEach((item) => {
        item.data.forEach((cItem) => {
          if (cItem.number && cItem.name.indexOf("模拟数据") === -1) {
            cItem.category = item.data[item.data.length - 1].name;
            data.push(cItem);
          }
        });
      });
      this.resetSingleData(data);
    },
    resetSingleData(data) {
      let series = [];
      let pieSize = this.chart.pieSize;
      let maxCount = [];
      data.forEach((item) => {
        maxCount.push(Number(this.chart.countActive === 0 ? item.original : item.numberZb * ((this.circleStyle?.data[0]?.value || 7.5) / 10)).toFixed(1));
      });
      data.sort((a, b) => {
        return Number(this.chart.countActive === 0 ? b.original : b.numberZb) - Number(this.chart.countActive === 0 ? a.original : a.numberZb);
      });
      maxCount.sort((a, b) => {
        return Number(b) - Number(a);
      });

      let maxlengthName = data
        .map((item) => {
          return this.chart.labelFormatter
            .replace("{c}", `${Number(this.countActive === 0 ? item.original : item.numberZb * ((this.circleStyle?.data[0]?.value || 7.5) / 10)).toFixed(1)}%`)
            .replace("{a}", item.name)
            .replace("{b}", item.number);
        })
        .sort((a, b) => {
          return b.length - a.length;
        })[0];
      let canvasWidth = Number(this.getTextWidth(maxlengthName, this.chart.series[0].data[this.chart.series[0].data.length - 1].label.fontSize + "px")) + 35;
      let shiftPadding = [0, 0, 0, 0];
      if (this.chart.series[0].clockWise === true) {
        shiftPadding[1] = canvasWidth;
        shiftPadding[3] = 0;
      } else {
        shiftPadding[1] = 0;
        shiftPadding[3] = canvasWidth;
      }
      for (let i = 0; i < data.length; i++) {
        series.push({
          name: "",
          type: "pie",
          clockWise: this.chart.series[0].clockWise, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [pieSize[0] - i * pieSize[2] + "%", pieSize[0] - pieSize[1] - i * pieSize[2] + "%"],
          center: this.chart.series[0].center,
          thresholdCode: this.chart.series[0].thresholdCode,
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: 5,
          },
          data: [
            {
              value: maxCount[i],
              original: data[i].original,
              name: data[i].name || "",
              number: data[i].number,
              category: data[i].category,
              numberZb: data[i].numberZb,
              itemStyle: {
                color: data[i].itemStyle.color,
              },
            },
            {
              value: 100 - maxCount[i],
              name: "",
              itemStyle: {
                color: "transparent",
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
            {
              value: 0,
              name: this.chart.labelFormatter.replace("{c}", `${maxCount[i]}%`).replace("{a}", data[i].name).replace("{b}", data[i].number),
              itemStyle: {
                color: "transparent",
              },
              label: {
                show: this.chart.series[0].data[this.chart.series[0].data.length - 1].label.show,
                fontSize: this.chart.series[0].data[this.chart.series[0].data.length - 1].label.fontSize,
                color: this.chart.series[0].data[this.chart.series[0].data.length - 1].label.color,
                position: "inner",
                padding: shiftPadding,
              },
              tooltip: {
                show: false,
              },
            },
          ],
        });
        series.push({
          name: "",
          type: "pie",
          silent: true,
          z: 1,
          clockWise: this.chart.series[0].clockWise, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [pieSize[0] - i * pieSize[2] + "%", pieSize[0] - pieSize[1] - i * pieSize[2] + "%"],
          center: this.chart.series[0].center,
          thresholdCode: this.chart.series[0].thresholdCode,
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: 5,
          },
          data: [
            {
              value: this.circleStyle?.data[0]?.value || 7.5,
              itemStyle: {
                color: `${data[i].itemStyle.color}1A`,
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
            {
              value: this.circleStyle?.data[1]?.value || this.circleStyle?.data[1]?.value === 0 ? this.circleStyle?.data[1]?.value : 2.5,
              itemStyle: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0,
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
          ],
        });
      }
      series.forEach((item, index) => {
        if (this.chart.series[index]) {
          this.$set(this.chart.series, index, item);
        } else {
          this.chart.series.push(item);
        }
      });
      if (this.chart.series.length > series.length) this.chart.series.splice(series.length);
      this.settingSeries = _.cloneDeep(series[0]);
      this.circleStyle = _.cloneDeep(series[1]);
    },
    getStackSeries(data, settingSeries, pieSize, name, i) {
      let sum = 0;
      data.forEach((item) => {
        sum = sum + item.value;
      });
      let series = {
        name: "",
        type: "pie",
        clockWise: settingSeries.clockWise, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [pieSize[0] - i * pieSize[2] + "%", pieSize[0] - pieSize[1] - i * pieSize[2] + "%"],
        center: settingSeries.center,
        thresholdCode: settingSeries.thresholdCode,
        label: {
          show: false,
        },
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          borderWidth: settingSeries.itemStyle.borderWidth,
        },
        data: [
          ...data,
          {
            value: 100 - sum,
            name: "",
            itemStyle: {
              color: "transparent",
            },
            tooltip: {
              show: false,
            },
            hoverAnimation: false,
          },
          {
            value: 0,
            name: !name || name === "undefined" || name === "" ? `未分类${Math.random().toString(16).slice(12)}` : name,
            itemStyle: {
              color: "transparent",
            },
            label: {
              show: settingSeries.data[settingSeries.data.length - 1].label.show,
              fontSize: settingSeries.data[settingSeries.data.length - 1].label.fontSize,
              color: settingSeries.data[settingSeries.data.length - 1].label.color,
              position: "inner",
              padding: settingSeries.data[settingSeries.data.length - 1].label.padding,
            },
            tooltip: {
              show: false,
            },
          },
        ],
      };
      return series;
    },
    getTextWidth(text, font) {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      context.font = font;
      let metrics = context.measureText(text);
      return Number(metrics.width).toFixed(0);
    },
  },
};
</script>

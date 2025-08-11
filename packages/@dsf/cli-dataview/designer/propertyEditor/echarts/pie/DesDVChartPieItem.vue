<!--
 * @Description: 每个饼图属性
 * @Author: shenah
 * @Date: 2024-04-26 16:19:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-23 17:18:28
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">相对位移X<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.center[0] | valueFilter" @change="changeItemValue($event + '%', series.center, 0)"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name">Y<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.center[1] | valueFilter" @change="changeItemValue($event + '%', series.center, 1)"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name">外环<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.radius[1] | valueFilter" @change="changeItemValue($event + '%', series.radius, 1)"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">内环<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.radius[0] | valueFilter" @change="changeItemValue($event + '%', series.radius, 0)"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">南丁格尔<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: roseTypeOptions }" v-model="series.roseType" @change="changeItemValue($event, series, 'roseType')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">系列颜色<span>： </span></div>
      <DesDVMoreModeColor
        ref="DesDVMoreModeColor"
        :config="{
          type: 'both',
          colors: chartColorList,
        }"
        v-model="singleData"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">边框<span>： </span></div>
      <DesDVSwitch :value="series.itemStyle.isShowBorder" @change="changeItemValue($event, series.itemStyle, 'isShowBorder')" />
    </div>
    <!-- 边框 -->
    <template v-if="series.itemStyle.isShowBorder">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">线宽<span>： </span></div>
        <DesDVNumber :value="series.itemStyle.borderWidth" @change="changeItemValue($event, series.itemStyle, 'borderWidth')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">颜色<span>： </span></div>
        <DesDVColorPicker :config="bothConfig" v-model="itemBorderColor" @change="changeItemColor($event, series.itemStyle, 'borderColor')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签<span>： </span></div>
      <DesDVSwitch :value="series.label.show" @change="changeItemValue($event, series.label, 'show')" />
    </div>
    <!-- 标签 -->
    <template v-if="series.label.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">标签位置<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: labelOptions }" v-model="series.label.position" @change="changeItemValue($event, series.label, 'position')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">标签内容<span>： </span></div>
        <div>
          <div style="display: flex; align-items: center; margin-bottom: 5px" v-for="(formatter, index) in series.label.formatters" :key="index">
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
            desc: '{a}=系列名; {b}=数据名; {c}=数据值; {d}=百分比',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item ml20" style="margin-right: 40px">
        <div class="property-item-name">标签行高<span>： </span></div>
        <DesDVNumber :value="series.label.lineHeight" @change="changeItemValue($event, series.label, 'lineHeight')"></DesDVNumber>
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name">标签字体<span>： </span></div>
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
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">高亮字体<span>： </span></div>
        <DesDVPixel :value="series.emphasis.label.fontSize" :options="fontSizeUnitOptions" @change="changeItemValue($event, series.emphasis.label, 'fontSize')"></DesDVPixel>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">标签重叠<span>： </span></div>
        <DesDVSwitch :value="series.avoidLabelOverlap" @change="changeItemValue($event, series, 'avoidLabelOverlap')" />
      </div>
    </template>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
export default {
  name: "DesDVChartPieItem",
  mixins: [itemMixin],
  inject: ["owner"],
  props: {
    series: {
      type: Object,
      require: true,
    },
    chart: {
      type: Object,
      require: true,
    },
    type: {
      type: String,
      default: "bar",
    },
  },
  filters: {
    valueFilter(val) {
      return +(val + "").replace(/%/g, "");
    },
  },
  data() {
    return {
      centerOptions: [
        {
          label: "%",
          value: "%",
        },
        {
          label: "无",
          value: "",
        },
      ],
      roseTypeOptions: [
        {
          text: "否",
          value: false,
        },
        {
          text: "按面积",
          value: "area",
        },
        {
          text: "按半径",
          value: "radius",
        },
      ],
      labelOptions: [
        {
          text: "外侧",
          value: "outside",
        },
        {
          text: "内侧",
          value: "inside",
        },
        {
          text: "中心",
          value: "center",
        },
      ],
      itemBorderColor: "",
    };
  },
  computed: {
    chartColorList() {
      return this.chart.color;
    },
    singleData: {
      get() {
        const res = [];
        if (this.series.singleData && this.series.singleData.length) {
          this.series.singleData.forEach((it) => {
            res.push(dsf.dataview.utils.convertChartToCSSColor(it.itemStyle.color));
          });
        } else {
          const colors = this.owner.chart.color;
          this.series.data.forEach((it, index) => {
            let color = it.itemStyle ? it.itemStyle.color : colors[index % colors.length];
            res.push(dsf.dataview.utils.convertChartToCSSColor(color));
          });
        }
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
          it.itemStyle = singleData[index % singleData.length].itemStyle;
        });
        this.series.singleData = singleData;
        this.$emit("updateChart");
      },
    },
  },
  created() {
    if (!Array.isArray(this.series.label.formatters)) {
      this.$set(this.series.label, "formatters", [this.series.label.formatter]);
    }

    if (this.series.itemStyle) {
      const itemBorderColor = this.series.itemStyle.borderColor;
      this.itemBorderColor = dsf.dataview.utils.convertChartToCSSColor(itemBorderColor);
    } else {
      this.series.itemStyle = {};
    }
  },

  methods: {
    addFormat() {
      this.series.label.formatters.push("");
    },
    deleteItem(index) {
      this.series.label.formatters.splice(index, 1);
      const formatter = this.series.label.formatters.reduce((sum, cur) => (sum ? sum + "\n" : sum) + cur, "");
      this.changeItemValue(formatter, this.series.label, "formatter");
    },
    changeFormatterValue(value, index) {
      this.$set(this.series.label.formatters, index, value);
      const formatter = this.series.label.formatters.reduce((sum, cur) => (sum ? sum + "\n" : sum) + cur, "");
      this.changeItemValue(formatter, this.series.label, "formatter");
    },
    changeSpecialItemKey(val, item, key) {
      if (key === "isShowBorder") {
        if (val) {
          this.$set(item, "borderWidth", 1);
        } else {
          this.$set(item, "borderWidth", 0);
        }
      }
    },
    changeSeriesColor(val, item, key) {
      let oldFlag = _.isEqual(item[key], val);
      if (!oldFlag) {
        val.forEach((str, index) => {
          const color = dsf.dataview.utils.convertCSSToEChartsColor(str);
          let one = this.series.data[index];
          if (one) {
            if (one.itemStyle) {
              this.$set(one.itemStyle, "color", color);
            } else {
              this.$set(one, "itemStyle", {
                color,
              });
            }
          }
        });
        this.$set(item, key, val);
        this.$emit("updateChart");
      }
    },
  },
};
</script>

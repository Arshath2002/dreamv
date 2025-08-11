<!--
 * @Editor: zhanghang
 * @Description: 关系图谱系列
 * @Date: 2024-06-04 17:05:56
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:25:59
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">节点斥力<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '' }" :value="series.force.repulsion" @change="changeValue($event, series.force, 'repulsion')"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">布局动画<span>： </span></div>
      <DesDVSwitch :value="series.force.layoutAnimation" @change="changeValue($event, series.force, 'layoutAnimation')"></DesDVSwitch>
      <DesDVToolTipsIcon
        :data="{
          desc: '节点数据较多（>100）的时候不建议关闭',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">节点连线<span>： </span></div>
      <DesDVSwitch :config="{ activeValue: 1, inactiveValue: 0 }" :value="series.lineStyle.opacity" @change="changeValue($event, series.lineStyle, 'opacity')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.lineStyle.opacity == 1">
      <div class="property-item-name">连线颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="series.lineStyle.color" @change="changeValue($event, series.lineStyle, 'color')"></DesDVColorPicker>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.lineStyle.opacity == 1">
      <div class="property-item-name">线条宽度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.lineStyle.width" @change="changeValue($event, series.lineStyle, 'width')"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.lineStyle.opacity == 1">
      <div class="property-item-name">起点箭头<span>： </span></div>
      <DesDVSwitch :config="{ activeValue: 'arrow', inactiveValue: 'none' }" :value="series.edgeSymbol[0]" @change="changeValue($event, series.edgeSymbol, 0)"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.lineStyle.opacity == 1">
      <div class="property-item-name">终点箭头<span>： </span></div>
      <DesDVSwitch :config="{ activeValue: 'arrow', inactiveValue: 'none' }" :value="series.edgeSymbol[1]" @change="changeValue($event, series.edgeSymbol, 1)"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.lineStyle.opacity == 1">
      <div class="property-item-name">连线文字<span>： </span></div>
      <DesDVSwitch :value="series.edgeLabel.show" @change="changeValue($event, series.edgeLabel, 'show')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.edgeLabel.show && series.lineStyle.opacity == 1">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle v-model="labelTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">节点内容<span>： </span></div>
      <el-input size="small" v-model="series.label.formatter" @change="changeValue($event, series.label, 'formatter')"></el-input>
      <DesDVToolTipsIcon
        :data="{
          desc: '{a}=系列名; {b}=数据名; {c}=数据值;',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">节点类目样式<span>： </span></div>
    </div>
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = it.name" :class="{ active: active === it.name }" v-for="it in series.categories" :key="it.name" :label="it.name">
        {{ it.name }}
      </div>
    </div>
    <div v-for="(it, index) in series.categories" :key="index">
      <template v-if="it.name == active">
        <div class="ds-designer-property property-item">
          <div class="property-item-name">节点颜色<span>： </span></div>
          <DesDVColorPicker :config="bothConfig" v-model="categoryItemColor" />
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">节点大小<span>： </span></div>
          <DesDVNumber :config="{ min: 0, unit: '' }" :value="it.symbolSize" @change="changeValue($event, it, 'symbolSize')"></DesDVNumber>
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">节点内容跨行<span>： </span></div>
          <DesDVSwitch :config="{ activeValue: 'break', inactiveValue: 'none' }" :value="it.label.overflow" @change="changeValue($event, it.label, 'overflow')"></DesDVSwitch>
        </div>
        <div class="ds-designer-property property-item ml20" v-if="it.label.overflow == 'break'">
          <div class="property-item-name">节点宽度<span>： </span></div>
          <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="it.label.width" @change="changeValue($event, it.label, 'width')"></DesDVNumber>
          <DesDVToolTipsIcon
            :data="{
              desc: '必须设置节点宽度，节点内容跨行才会生效',
            }"
          ></DesDVToolTipsIcon>
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">字体样式<span>： </span></div>
          <DesDVTextStyle v-model="categoryItemTextStyle" :config="fontConfig"></DesDVTextStyle>
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">形状<span>： </span></div>
          <DesDVSelect :data="{ dictionary: markers }"  :value="getSymbol(it.symbol)" @change="changeSymbol($event, it)" />
        </div>
        <div class="ds-designer-property property-item ml20" v-if="getSymbol(it.symbol) === 'custom'">
          <div class="property-item-name">上传<span>： </span></div>
          <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="it.symbol"></el-input>
          <button class="upload-button el-button el-button--small">
            <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
            <input @change="changeSymbolImage($event, it, callBack)" type="file" class="upload-input" style="display: none" />
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin.js";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js";
export default {
  name: "DesDVChartRelationSeries",
  mixins: [mixin, commonMixin, svgAndImageUpload],

  computed: {
    series() {
      return this.chart.series[0];
    },
    labelTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.series.edgeLabel.textStyle;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.series.edgeLabel.textStyle, v);
        this._updateChart();
      },
    },
    categoryItemTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.categoryItem.label;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.categoryItem.label, v);
        this._updateChart();
      },
    },
    categoryItem() {
      return this.series.categories.find((it) => it.name === this.active);
    },
    categoryItemColor: {
      get() {
        const color = this.categoryItem ? this.categoryItem.itemStyle.color : "red";
        return dsf.dataview.utils.convertChartToCSSColor(color);
      },
      set(val) {
        const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
        this.$set(this.categoryItem.itemStyle, "color", color);
        this._updateChart();
      },
    },
  },
  data() {
    return {
      active: "",
      bothConfig: {
        type: "both",
      },
      colorConfig: {
        type: "color",
      },
      symbols: ["circle", "emptyCircle", "rect", "roundRect", "triangle", "diamond", "pin", "arrow", "none"],
      markers: [
        {
          text: "圆",
          value: "circle",
        },
        {
          text: "空心圆",
          value: "emptyCircle",
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
  created() {
    this.updatePropertyChartCallBack();
    // 兼容之前
    if (this.series.force.layoutAnimation === undefined) {
      this.changeValue(true, this.series.force, "layoutAnimation");
    }
  },
  methods: {
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
        this._updateChart();
      } else {
        this.$set(item, "symbol", val);
      }
    },
    callBack(val, it) {
      this.$set(it, "symbol", val);
      this._updateChart();
    },
    updatePropertyChartCallBack() {
      if (!this.active) {
        const name = this.series.categories && this.series.categories.length ? this.series.categories[0].name : "";
        this.active = name;
      } else {
        if (!this.series.categories.find((it) => it.name === this.active)) {
          this.active = this.series.categories[0].name;
        }
      }
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

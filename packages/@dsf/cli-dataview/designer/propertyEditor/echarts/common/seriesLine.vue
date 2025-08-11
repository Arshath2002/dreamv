<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">X轴<span>： </span></div>
      <DesDVSelect class="min"  :data="{ dictionary: xAxisList }" :value="series.xAxisIndex" @change="changeValue($event, series, 'xAxisIndex')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">Y轴<span>： </span></div>
      <DesDVSelect class="min"  :data="{ dictionary: yAxisList }"  :value="series.yAxisIndex" @change="changeValue($event, series, 'yAxisIndex')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">线条类型<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="series.lineStyle.type" @change="changeValue($event, series.lineStyle, 'type')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">是否平滑<span>： </span></div>
      <DesDVSwitch v-model="series.smooth" @change="changeValue($event, series, 'smooth')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">线条宽度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.lineStyle.width" @change="changeValue($event, series.lineStyle, 'width')" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">线条颜色<span>： </span></div>
      <DesDVColorPicker v-model="itemColor" :config="bothConfig" @change="changeColor($event, series.itemStyle, 'color')"></DesDVColorPicker>
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">视觉映射<span>： </span></div>
      <DesDVSwitch v-model="series.isVisualMap" @change="changeVisual($event, series, 'isVisualMap')" />
    </div>

    <template v-if="series.isVisualMap">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">模式<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: options }" :value="visualMap.type" @change="changeValue($event, visualMap, 'type')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="visualMap.type == 'continuous'">
        <div class="property-item-name">渐变颜色<span>： </span></div>
        <DesDVMoreModeColor v-model="visualMap.inRange.color" @change="changeValue($event, visualMap.inRange, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-else>
        <DesDVPiecewise :pieces="visualMap.pieces" @change="changeValue($event, visualMap, 'pieces')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">背景颜色</div>
        <DesDVColorPicker :config="colorConfig" v-model="visualMap.outOfRange.color" @change="changeValue($event, visualMap.outOfRange, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">标注<span>： </span></div>
        <DesDVSwitch v-model="visualMap.show" @change="changeValue($event, visualMap, 'show')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="visualMap.show">
        <div class="property-item-name">排列<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: direction }" :value="visualMap.orient" @change="changeValue($event, visualMap, 'orient')" />
      </div>
      <div class="ds-designer-property property-item ml20 float-one-row" v-if="visualMap.show && visualMap.type == 'continuous'">
        <div class="property-item-name" style="min-width: 60px">最大值<span>： </span></div>
        <el-input style="width: 60px" class="data-view-dv-dsf-pixel" v-model="visualMap.max" @change="changeValue($event, visualMap, 'max')"></el-input>
      </div>
      <div class="ds-designer-property property-item ml10 float-one-row" v-if="visualMap.show && visualMap.type == 'continuous'">
        <div class="property-item-name">最小值<span>： </span></div>
        <el-input style="width: 60px" class="data-view-dv-dsf-pixel" v-model="visualMap.min" @change="changeValue($event, visualMap, 'max')"></el-input>
      </div>
      <div class="ds-designer-property property-item ml20" v-if="visualMap.show">
        <div class="property-item-name">两端文字<span>： </span></div>
        <el-input style="width: 60px" class="data-view-dv-dsf-pixel" v-model="visualMap.text[0]" @change="changeText($event, 0)"></el-input>
        <el-input style="width: 60px; margin-left: 10px" class="data-view-dv-dsf-pixel" v-model="visualMap.text[1]" @change="changeText($event, 1)"></el-input>
      </div>
      <div class="ds-designer-property property-item ml20" v-if="visualMap.show">
        <div class="property-item-name">字体<span>： </span></div>
        <DesDVNumber :config="{ min: 12, unit: 'px' }" :value="visualMap.textStyle.fontSize" @change="changeValue($event, visualMap.textStyle, 'fontSize')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="visualMap.show">
        <div class="property-item-name"></div>
        <DesDVColorPicker :config="colorConfig" v-model="visualMap.textStyle.color" @change="changeValue($event, visualMap.textStyle, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="visualMap.show">
        <div class="property-item-name">位置<span>： </span></div>
        <div class="des-dv-text-align">
          <!-- 对齐方式选择 -->
          <div class="align-wrap">
            <!-- 水平位置 -->
            <Direction
              class="horizontal-items"
              v-model="visualMap.left"
              type="horizontal"
              @input="changeValue($event, visualMap, 'left')"
              :mapData="[
                { mapName: 'left', mapKey: 'left' },
                { mapName: 'center', mapKey: 'center' },
                { mapName: 'right', mapKey: 'right' },
              ]"
            ></Direction>
            <!-- 垂直位置 -->
            <Direction class="vertical-items" v-model="visualMap.top" type="vertical" @input="changeValue($event, visualMap, 'top')"></Direction>
          </div>
        </div>
      </div>
      <div class="ds-designer-property property-item" v-if="visualMap.show && visualMap.type == 'continuous'">
        <div class="property-item-name">显示手柄<span>： </span></div>
        <DesDVSwitch v-model="visualMap.calculable" @change="changeValue($event, visualMap, 'calculable')" />
      </div>
    </template>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVSwitch v-model="series.isShowAreaStyle" @change="changeZone($event, series, 'isShowAreaStyle')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.isShowAreaStyle">
      <div class="property-item-name"></div>
      <DesDVColorPicker v-model="zoneColor" :config="bothConfig" @change="changeColor($event, series.areaStyle, 'color')"></DesDVColorPicker>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">拐点<span>： </span></div>
      <DesDVSwitch v-model="series.showSymbol" @change="changeValue($event, series, 'showSymbol')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.showSymbol">
      <div class="property-item-name">形状<span>： </span></div>
      <DesDVSelect :data="{ dictionary: markers }"  :value="getSymbol(series.symbol)" @change="changeSymbol($event, series)" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.showSymbol && getSymbol(series.symbol) === 'custom'">
      <div class="property-item-name">上传<span>： </span></div>
      <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="series.symbol"></el-input>
      <button class="upload-button el-button el-button--small">
        <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
        <input @change="changeSymbolImage($event, series, callBack)" type="file" class="upload-input" style="display: none" />
      </button>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.showSymbol">
      <div class="property-item-name">大小<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolSize" @change="changeValue($event, series, 'symbolSize')" />
    </div>
    <div class="ds-designer-property property-item" v-if="series.showSymbol">
      <div class="property-item-name">标签展示<span>： </span></div>
      <DesDVSwitch v-model="series.label.show" @change="changeValue($event, series.label, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.showSymbol && series.label.show">
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
    <div class="ds-designer-property property-item ml20" v-if="series.showSymbol && series.label.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标记线<span>： </span></div>
      <DesDVSwitch v-model="owner.isLineAndMarkLine" @change="changeValue($event, owner, 'isLineAndMarkLine')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="owner.isLineAndMarkLine">
      <div class="property-item-name">颜色<span>： </span></div>
      <DesDVMoreModeColor v-model="owner.lineAndMarkLineColor" @change="changeValue($event, owner, 'lineAndMarkLineColor')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="owner.isLineAndMarkLine">
      <div class="property-item-name">间隔距离<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '个' }" :value="owner.lineAndMarkLineInterval" @change="changeValue($event, owner, 'lineAndMarkLineInterval')" />
    </div>

    <template v-if="series.markPoint">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">单点标记<span>： </span></div>
        <DesDVSwitch :value="!!series.markPoint.data.length" @change="changeMarketPoint($event)" />
      </div>
      <!-- 存在标记点 -->
      <template v-if="series.markPoint.data.length">
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">形状<span>： </span></div>
          <DesDVSelect :data="{ dictionary: markers }" :value="getSymbol(series.markPoint.symbol)" @change="changeSymbol($event, series.markPoint)" />
        </div>
        <div class="ds-designer-property property-item ml20" v-if="getSymbol(series.markPoint.symbol) === 'custom'">
          <div class="property-item-name">上传<span>： </span></div>
          <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="series.markPoint.symbol"></el-input>
          <button class="upload-button el-button el-button--small">
            <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
            <input @change="changeSymbolImage($event, series.markPoint, callMarkerPointBack)" type="file" class="upload-input" style="display: none" />
          </button>
        </div>

        <div class="ds-designer-property property-item ml30 float-one-row">
          <div class="property-item-name">偏移X<span>： </span></div>
          <DesDVNumber class="min" :config="{ unit: '%' }" :value="series.markPoint.symbolOffset[0] | valueFilter" @change="changeValue($event + '%', series.markPoint.symbolOffset, 0)" />
        </div>
        <div class="ds-designer-property property-item ml20 float-one-row">
          <div class="property-item-name">偏移Y<span>： </span></div>
          <DesDVNumber class="min" :config="{ unit: '%' }" :value="series.markPoint.symbolOffset[1] | valueFilter" @change="changeValue($event + '%', series.markPoint.symbolOffset, 1)" />
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">标签样式<span>： </span></div>
          <DesDVTextStyle class="min" v-model="markerPointStyle" :config="fontConfig"></DesDVTextStyle>
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">大小<span>： </span></div>
          <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.markPoint.symbolSize" @change="changeValue($event, series.markPoint, 'symbolSize')" />
        </div>
        <div style="display: flex" v-for="(it, index) in series.markPoint.data.filter((it) => it.type)" :key="it.name">
          <div class="ds-designer-property property-item ml20">
            <div class="property-item-name">标记值<span>： </span></div>
            <DesDVSelect :data="{ dictionary: markerPoints }" :value="it.type" @change="changeValue($event, it, 'type')" />
          </div>
          <div v-if="!index" style="flex-shrink: 0; margin: 5px 8px 8px 0" class="des-dv-icon-add" @click="addMarkerPoint">
            <i class="add-btn el-icon-plus"></i>
          </div>
          <div v-else style="flex-shrink: 0; margin: 5px 8px 8px 0" class="des-dv-icon-add" @click="removeMarkerPoint(it)">
            <i class="add-btn el-icon-minus"></i>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script>




import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js";
import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";


import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
import DesDVPiecewise from "_dataview/designer/propertyEditor/map/piecewise.vue";
export default {
  name: "seriesLine",
  mixins: [svgAndImageUpload, commonMixin],
  inject: ["owner"],
  components: { DesDVPiecewise,      Direction },
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
  computed: {
    visualMap() {
      return this.chart.visualMap;
    },
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
    markerPointStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.series.markPoint.label;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.series.markPoint.label, v);
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
    return {
      markerPoints: [
        {
          text: "最小值",
          value: "min",
        },
        {
          text: "最大值",
          value: "max",
        },
        {
          text: "平均值",
          value: "average",
        },
        {
          text: "第一个",
          value: "first",
        },
        {
          text: "最后一个",
          value: "last",
        },
      ],
      symbols: ["circle", "emptyCircle", "rect", "roundRect", "triangle", "diamond", "pin", "arrow", "none"],
      //单个标记点
      markPoint: {
        symbol: "pin",
        symbolSize: 50,
        symbolOffset: [0, 0],
        label: {
          show: true,
          color: "#fff",
          position: "inside",
          fontSize: 12,
        },
        data: [],
      },
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
      itemColor: "",
      zoneColor: "",
      colorConfig: {
        type: "color",
      },
      bothConfig: {
        type: "both",
      },
      options: [
        { text: "渐变", value: "continuous" },
        { text: "分段", value: "piecewise" },
      ],
      direction: [
        { text: "横向", value: "horizontal" },
        { text: "纵向", value: "vertical" },
      ],
      dictionary: [
        {
          text: "实线",
          value: "solid",
        },
        {
          text: "虚线",
          value: "dashed",
        },
        {
          text: "点线",
          value: "dotted",
        },
      ],
    };
  },
  created() {
    const itemColor = this.series.itemStyle.color;
    this.itemColor = dsf.dataview.utils.convertChartToCSSColor(itemColor);
    // 解决折柱图点击的时候只能点击折线的点的问题
    if (!this.series.isShowAreaStyle) {
      this.$set(this.series, "areaStyle",undefined);
    } else {
      if (this.series.areaStyle === undefined) {
        this.$set(this.series, "areaStyle", { color: "rgba(255,255,255,0.5)" });
      }
      const zoneColor = this.series.areaStyle.color;
      this.zoneColor = dsf.dataview.utils.convertChartToCSSColor(zoneColor);
    }
    if (this.series.isVisualMap === undefined) {
      this.$set(this.series, "isVisualMap", false);
    }
    //标记点
    const mergeMarkerPoint = this.series.markPoint ? dsf.mix(true, {}, this.markPoint, this.series.markPoint) : this.markPoint;
    this.$set(this.series, "markPoint", mergeMarkerPoint);

    //样式风格改变
    dsf.emit.$on("updateStyleChange", this.styleChange, this.owner.$children[0]);
  },
  beforeDestroy() {
    dsf.emit.$remove("updateStyleChange", this.owner.$children[0]);
  },
  methods: {
    //主题改变
    styleChange() {
      const itemColor = this.series.itemStyle.color;
      this.itemColor = dsf.dataview.utils.convertChartToCSSColor(itemColor);
      const zoneColor = this.series.areaStyle.color;
      this.zoneColor = dsf.dataview.utils.convertChartToCSSColor(zoneColor);
    },
    changeMarketPoint(val) {
      if (val) {
        //默认添加一个最大值
        this.series.markPoint.data.push({ type: "max", name: dsf.uuid().slice(0, 4) });
      } else {
        this.series.markPoint.data = [];
      }
      this.$emit("updateChart");
    },
    addMarkerPoint() {
      this.series.markPoint.data.push({ type: "max", name: dsf.uuid().slice(0, 4) });
      this.$emit("updateChart");
    },
    removeMarkerPoint(it) {
      const index = this.series.markPoint.data.findIndex((_it) => it === _it);
      this.series.markPoint.data.splice(index, 1);
      this.$emit("updateChart");
    },
    changeVisual(val, item, key) {
      const index = this.chart.series.findIndex((it) => it === this.series);
      if (this.chart.visualMap) {
        const seriesIndex = this.chart.visualMap.seriesIndex;
        const isExit = seriesIndex.findIndex((it) => it === index);
        if (val && isExit === -1) {
          this.chart.visualMap.seriesIndex.push(index);
        } else if (!val && isExit > -1) {
          this.chart.visualMap.seriesIndex.splice(isExit);
        }
      }
      if (!val) {
        this.chart.visualMap.show = false;
      }
      this.changeValue(val, item, key);
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
    callMarkerPointBack(val) {
      this.$set(this.series.markPoint, "symbol", val);
      this.$emit("updateChart");
    },
    changeZone(val, item, key) {
      this.$set(item, key, val);
      if (val) {
        this.$set(item, "areaStyle", {
          color: "rgba(255,255,255,0.5)",
        });
      } else {
        this.$set(item, "areaStyle",undefined);
      }
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
  filters: {
    valueFilter(val) {
      return +(val + "").replace(/%/g, "");
    },
  },
};
</script>

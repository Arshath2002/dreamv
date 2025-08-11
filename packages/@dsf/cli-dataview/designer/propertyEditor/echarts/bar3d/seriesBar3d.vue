<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-24 16:57:11
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:10:35
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">X轴<span>： </span></div>
      <DesDVSelect class="min" :data="{ dictionary: xAxisList }" :value="series.xAxisIndex" @change="changeValue($event, series, 'xAxisIndex')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">Y轴<span>： </span></div>
      <DesDVSelect class="min" :data="{ dictionary: yAxisList }"  :value="series.yAxisIndex" @change="changeValue($event, series, 'yAxisIndex')" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体形状<span>： </span></div>
      <DesDVSelect :data="{ dictionary: options }"  :value="series.shape" @change="changeColor($event, series, 'shape')" />
    </div>
    <template v-if="series.shape === 'cube'">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">柱体颜色<span>： </span></div>
      </div>
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name">正面<span>： </span></div>
        <DesDVColorPicker class="cube-color" :config="{ type: 'linear', noArrow: true }" v-model="cubeColors[0]" @change="changeCubeColor($event, 0)" />
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name">侧面<span>： </span></div>
        <DesDVColorPicker class="cube-color" :config="{ type: 'linear', noArrow: true }" v-model="cubeColors[1]" @change="changeCubeColor($event, 1)" />
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name">顶面<span>： </span></div>
        <DesDVColorPicker class="cube-color" :config="{ type: 'linear', noArrow: true }" v-model="cubeColors[2]" @change="changeCubeColor($event, 2)" />
      </div>
      <div class="ds-designer-property property-item" style="margin-bottom: 0px;">
        <div class="property-item-name">单个颜色<span>： </span></div>
        <div class="cube-single-list">
          <div class="des-dv-icon-add" @click="addSingleData" v-if="series.singleData.length == 0">
            <i class="add-btn el-icon-plus"></i>
          </div>
          <div class="cube-single-list-item" v-for="(it, _idx) in series.singleData" :key="_idx">
            <span>正：</span>
            <DesDVColorPicker
              class="cube-color"
              :config="{ type: 'linear', noArrow: true }"
              :value="getSingleColor(it.itemStyle.cubeColors[0])"
              @change="changeSingleCubeColor($event, it.itemStyle, 0)"
            />
            &nbsp;
            <span>侧：</span>
            <DesDVColorPicker
              class="cube-color"
              :config="{ type: 'linear', noArrow: true }"
              :value="getSingleColor(it.itemStyle.cubeColors[1])"
              @change="changeSingleCubeColor($event, it.itemStyle, 1)"
            />
            &nbsp;
            <span>顶：</span>
            <DesDVColorPicker
              class="cube-color"
              :config="{ type: 'linear', noArrow: true }"
              :value="getSingleColor(it.itemStyle.cubeColors[2])"
              @change="changeSingleCubeColor($event, it.itemStyle, 2)"
            />
            &nbsp;
            <div class="des-dv-icon-add" @click="addSingleData(_idx)">
              <i class="add-btn el-icon-plus"></i>
            </div>
            <div class="des-dv-icon-add" @click="deleteSingleData(_idx)">
              <i class="add-btn el-icon-minus"></i>
            </div>
          </div>
        </div>
      </div>
      <div
        class="ds-designer-property property-item"
      >
        <div class="property-item-name" style="opacity: 0">
          单个颜色<span>： </span>
        </div>
        <dsfButtonDialog
          @click="settingMoreSingleRule"
          :hasValue="isMoreSingleRule"
          :config="{
            buttonText: '颜色规则',
          }"
        >
        </dsfButtonDialog>
      </div>
    </template>
    <template v-else>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">柱体颜色<span>： </span></div>
        <DesDVColorPicker :config="bothConfig" v-model="itemColor" @change="changeColor($event, series.itemStyle, 'color')" />
      </div>
      <div class="ds-designer-property property-item" style="margin-bottom: 4px;">
        <div class="property-item-name">单个颜色<span>： </span></div>
        <DesDVMoreModeColor :config="modeColor" v-model="singleData" />
      </div> 
      <div
        class="ds-designer-property property-item"
        style="margin-bottom: 10px;"
      >
        <div class="property-item-name" style="opacity: 0">
          单个颜色<span>： </span>
        </div>
        <dsfButtonDialog
          @click="settingSingleRule"
          :hasValue="isSingleRule"
          :config="{
            buttonText: '颜色规则',
          }"
        >
        </dsfButtonDialog>
      </div>
    </template>
    <!-- 气泡图 -->
    <template v-if="series.shape === 'barbubble'">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">气泡大小<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolSize" @change="changeValue($event, series, 'symbolSize')" />
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name">基值计算<span>： </span></div>
        <DesDVSwitch v-model="series.isBaseValue" @change="changeValue($event, series, 'isBaseValue')" />
      </div>
      <div class="ds-designer-property property-item float-one-row" v-if="series.isBaseValue">
        <div class="property-item-name">基值大小<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.baseValue" @change="changeValue($event, series, 'baseValue')" />
      </div>
    </template>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">柱体宽度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0, unit: '%' }" :value="series.barWidth | valueFilter" @change="changeValue($event + '%', series, 'barWidth')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">柱体间隙<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0, unit: '%' }" :value="series.barGap | valueFilter" @change="changeValue($event + '%', series, 'barGap')" />
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
    <div class="ds-designer-property property-item">
      <div class="property-item-name">裁剪<span>： </span></div>
      <DesDVSwitch v-model="series.clip" @change="changeValue($event, series, 'clip')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">堆叠<span>： </span></div>
      <DesDVSwitch v-model="series.stack" @change="changeValue($event, series, 'stack')" />
    </div>
  </div>
</template>
<script>





import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";
import dsfButtonDialog from "_dataview/designer/common/components/dsfButton.vue";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "seriesBar3d",
  mixins: [commonMixin],
  inject: ["owner"],
  components: {      Direction,dsfButtonDialog },
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
    isSingleRule() {
      return !! this.series.singleDataRuleList?.length;
    },
    isMoreSingleRule(){
      return !! this.series.singleMoreDataRuleList?.length;
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
    singleData: {
      get() {
        let res = [];
        let defaultColor = this.series.itemStyle.color || "red";
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
          const cubeDimensionalColor = this.smallColor(color, 3);
          singleData.push({
            itemStyle: {
              color,
              cubeColors: cubeDimensionalColor,
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
        this.series.singleData = singleData;
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
      cubeColors: [],
      options: [
        {
          value: "clinder",
          text: "圆柱体",
        },
        {
          value: "cube",
          text: "立方体",
        },
        {
          value: "barbubble",
          text: "柱泡图",
        },
        {
          value: "rect",
          text: "矩形",
        },
        {
          value: "cone",
          text: "圆锥",
        },
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
      this.cubeColors = this.series.itemStyle.cubeColors.map((it) => {
        return `linear-gradient(0deg,${it[0]} 0%, ${it[1]} 100%)`;
      });
    },
    addSingleData(index) {
      if (!this.series.singleData) {
        this.$set(this.series, "singleData", []);
      }
      const len = this.series.singleData.length;
      if (len > this.series.data.length) {
        return;
      }
      // 根据形状来设置
      let next = this.getNextColor();
      const cubeDimensionalColor = this.smallColor(next, 3);
      const item = {
        itemStyle: {
          color: next,
          cubeColors: cubeDimensionalColor,
        },
      };
      if (index) {
        this.series.singleData.splice(index + 1, 0, item);
      } else {
        this.series.singleData.push(item);
      }

      this.$emit("updateChart");
    },
    deleteSingleData(index) {
      this.series.singleData.splice(index, 1);
      this.$emit("updateChart");
    },
    changeCubeColor(val, type) {
      const color = this.transformColor(val);
      this.$set(this.series.itemStyle.cubeColors, type, color);
      this.$emit("updateChart");
    },
    changeSingleCubeColor(val, it, index) {
      const color = this.transformColor(val);
      this.$set(it.cubeColors, index, color);
      this.$emit("updateChart");
    },
    getSingleColor(it) {
      return `linear-gradient(0deg,${it[0]} 0%, ${it[1]} 100%)`;
    },
    changeColor(val, item, key) {
      const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      if (!_.isEqual(item[key], color)) {
        this.$set(item, key, color);
        this.$emit("updateChart");
      }
    },
    transformColor(color) {
      const matchLine = color.match(/linear-gradient\((.*)\)/);
      const colorStops = [];
      if (matchLine) {
        const parts = matchLine[1].split("deg,");
        const colors = parts[1].split("%,");
        for (let i = 0; i < colors.length; i++) {
          let item = colors[i];
          if (!item) continue;
          const splitIndex = item.lastIndexOf(" ");
          let color = item.slice(0, splitIndex);
          colorStops.push(color.trim());
        }
      }
      return colorStops;
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
    //获取下一个色值
    getNextColor() {
      let colors = this.chart.color;
      const series = this.chart.series;
      let len = series.length;
      let next = colors[len % colors.length];
      let exits = series.map((data) => data.itemStyle.color);
      let recurveIndex = 0;
      while (exits.includes(next) && recurveIndex < 50) {
        len++;
        recurveIndex++;
        next = colors[len % colors.length];
      }
      return next;
    },
    smallColor(color, idx) {
      const start = tinycolor(color).toRgb();
      let count = 0;
      const result = [];
      while (count < idx) {
        count++;
        const temp = [];
        for (let i = 0; i < 2; i++) {
          const params = {
            r: Math.round(start.r - start.r * Math.random()),
            g: Math.round(start.g - start.g * Math.random()),
            b: Math.round(start.b - start.b * Math.random()),
          };
          temp.push(
            tinycolor(params)
              .desaturate(count * 10)
              .toHexString()
          );
        }
        result.push(temp);
      }
      return idx === 1 ? result[0] : result;
    },
    settingSingleRule() {
      let self = this;
      let list = this.series.singleDataRuleList || [];
      this.$openDialog({
        title: "颜色规则",
        content: "DesDVUniversalRuleConfig",
        params: {
          currentData: list,
          owner: this.owner,
          config: {
            typeOptions: [
              {
                label: "色值",
                value: "color",
              },
            ],
          },
        },
        width: "1100px",
        height: "60vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let result = res.yes();
                self.$set(self.series, "singleDataRuleList", result);
                self.$emit("updateChart");
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
    settingMoreSingleRule(){
      let self = this;
      let list = this.series.singleMoreDataRuleList || [];
      this.$openDialog({
        title: "颜色规则",
        content: "DesDVUniversalRuleConfig",
        params: {
          currentData: list,
          owner: this.owner,
          config: {
            typeOptions: [
              {
                label: "多个色值",
                value: "moreColor",
                config:{
                  limit: 3,
                  type:"both",
                },
                desc:"<div>颜色顺序:正面、侧面、顶面</div>"
              },
            ],
          },
        },
        width: "1100px",
        height: "60vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let result = res.yes();
                self.$set(self.series, "singleMoreDataRuleList", result);
                self.$emit("updateChart");
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    }
  },
};
</script>

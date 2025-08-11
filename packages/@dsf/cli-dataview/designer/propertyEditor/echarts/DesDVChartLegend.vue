<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-22 14:08:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:08:53
-->
<template>
  <div style="flex: 1">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图例<span>： </span></div>
      <DesDVSwitch v-model="legend.show" @change="changeValue($event, legend, 'show')" />
    </div>
    <template v-if="legend.show">
      <div class="ds-designer-property property-item ml20" v-if="legend.show">
        <div class="property-item-name">排列<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: dictionary }"  v-model="legend.orient" @change="changeValue($event, legend, 'orient')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="legend.show">
        <div class="property-item-name">样式<span>： </span></div>
        <DesDVTextStyle v-model="legend.textStyle" @change="changeValue($event, legend, 'textStyle')" :config="fontConfig"></DesDVTextStyle>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">自定义位置<span>： </span></div>
        <DesDVSwitch v-model="legend.custom" @change="changeValue($event, legend, 'custom')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name"></div>
        <template v-if="legend.custom">
          <DesDVMargins
            :value="[legend.top, legend.right, legend.bottom, legend.left]"
            :config="{
              type: 'string',
            }"
            @change="(val) => marginChange(val)"
          />
        </template>
        <template v-else>
          <DesDVTextAlign
            :value="{
              hAlign: legend.left,
            }"
            :config="{
              isShowVAlign: false,
              hMapData: [
                { mapName: 'left', mapKey: 'left' },
                { mapName: 'center', mapKey: 'center' },
                { mapName: 'right', mapKey: 'right' },
              ],
            }"
            @change="alignChange($event, 'hAlign', 'left')"
          >
          </DesDVTextAlign>
          <DesDVTextAlign
            :value="{
              vAlign: legend.top,
            }"
            :config="{
              isShowHAlign: false,
              vMapData: [
                { mapName: 'top', mapKey: 'top' },
                { mapName: 'middle', mapKey: 'middle' },
                { mapName: 'bottom', mapKey: 'bottom' },
              ],
            }"
            @change="alignChange($event, 'vAlign', 'top')"
          ></DesDVTextAlign>
        </template>
      </div>
      <div class="ds-designer-property property-item" v-if="isControl && legend.show">
        <div class="property-item-name">图例选中控制<span>： </span></div>
        <DesDVSwitch v-model="defaultLegend"></DesDVSwitch>
      </div>
      <div class="ds-designer-property property-item ml20" v-if="isControl && legend.show">
        <div class="property-item-name">图例形状<span>： </span></div>
      </div>
      <div class="ds-designer-property property-item ml20" v-for="(item, index) in legendData" :key="index">
        <div class="property-item-name ellipsis">{{ item.name }}<span>： </span></div>
        <div style="legend-property">
          <div>
            <DesDVSelect :data="{ dictionary: legendIcons }"  :value="getSymbol(item.icon)" @change="changeSymbol($event, item)" />
            <DesDVSwitch class="ml10" v-if="defaultLegend" v-model="tempSelected[item.name]" @change="changLegendStatus($event, item.name)"></DesDVSwitch>
          </div>
          <div
            v-show="getSymbol(item.icon) === 'custom'"
            :style="{
              marginTop: '5px',
            }"
          >
            <el-input
              readonly="readonly"
              :style="{
                width: '108px',
                margin: '0 5px',
              }"
              placeholder="请输入内容"
              size="small"
              :value="item.icon"
            ></el-input>
            <button
              class="upload-button el-button el-button--small"
              :style="{
                height: '32px',
                boxSizing: 'border-box',
              }"
            >
              <span
                @click.stop="uploadClick"
                :style="{
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  boxSizing: 'border-box',
                }"
              >
                点击上传
              </span>
              <input
                @change="changeIconImage($event, item)"
                type="file"
                class="upload-input"
                :style="{
                  display: 'none',
                }"
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
              />
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "DesDVChartLegend",
  mixins: [svgAndImageUpload, commonMixin],
  props: {
    owner: {
      type: Object,
      require: true,
    },
    //是否控制
    isControl: {
      type: Boolean,
      default: true,
    },
    jsonConfig: {
      type: Object,
      require: true,
    },
  },

  computed: {
    legend() {
      return this.chart ? this.chart.legend : {};
    },
    legendData: {
      get() {
        return this.chart.legend.data;
      },
    },
  },
  filters: {
    valueFilter(val) {
      return +(val + "").replace(/%/g, "");
    },
  },
  watch: {
    defaultLegend: {
      handler(val) {
        if (!this.isControl) {
          return;
        }
        if (val) {
          this.$set(this.legend, "selected", { ...this.tempSelected });
          this._updateChart();
        } else {
          if (this.legend.selected) {
            Vue.delete(this.legend, "selected");
            this._updateChart();
          }
        }
      },
    },
  },
  data() {
    return {
      chart: this.owner.chart,
      defaultLegend: false,
      select: [
        {
          value: "",
          label: "fx",
        },
      ],
      legendIcons: [
        {
          text: "默认",
          value: "",
        },
        {
          text: "自定义",
          value: "custom",
        },
        {
          text: "圆",
          value: "circle",
        },
        {
          text: "空心圆",
          value: "emptyCircle",
        },
        {
          text: "正方形",
          value: "square",
        },
        {
          text: "长方形",
          value: "rect",
        },
        {
          text: "圆角长方形",
          value: "roundRect",
        },
        {
          text: "三角形",
          value: "triangle",
        },
        {
          text: "直线",
          value: "path://M6 4L30 4L30 8L6 8",
        },
        {
          text: "虚线",
          value:
            "path://M304.43 532.76H221.4c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h83.03c11.47 0 20.76 9.3 20.76 20.76s-9.29 20.76-20.76 20.76zM581.19 532.76H442.81c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h138.38c11.47 0 20.76 9.3 20.76 20.76s-9.3 20.76-20.76 20.76zM802.59 532.76h-83.03c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h83.03c11.47 0 20.76 9.3 20.76 20.76s-9.29 20.76-20.76 20.76z",
        },
        {
          text: "标记",
          value: "pin",
        },
        {
          text: "箭头",
          value: "arrow",
        },
        {
          text: "无",
          value: "none",
        },
      ],
      dictionary: [
        {
          text: "横向",
          value: "horizontal",
        },
        {
          text: "纵向",
          value: "vertical",
        },
      ],
      options: {
        // 是否显示
        show: true,
        //朝向
        orient: "horizontal",
        //图例形状
        icon: "",
        normalWays: true,
        custom: false,
        textStyle: {
          fontStyle: "normal",
          fontWeight: "normal",
          fontFamily: "Microsoft YaHei",
        },
      },
      tempSelected: {},
    };
  },
  created() {
    this._updateChart = _.debounce(this.updateChart, 500);
    this.chart.legend = dsf.mix(true, {}, this.options, this.chart.legend);
    this.initLegend();
    // this._updateChart();
    // console.log('触发')
    //在数据配置完成时候，接受一次最新的chart
    dsf.emit.$on(
      "updatePropertyChart",
      () => {
        this.chart = this.owner.chart;
        this.chart.legend = dsf.mix(true, {}, this.options, this.chart.legend);
        this.initLegend();

        this._updateChart();
      },
      this.owner.$children[0]
    );
  },
  beforeDestroy() {
    dsf.emit.$remove("updatePropertyChart", this.owner.$children[0]);
  },
  methods: {
    initLegend() {
      this.dealNormalWays(this.options);
      const legend = this.chart.legend;
      if (legend.selected) {
        for (let key in legend.selected) {
          if (legend.selected[key]) {
            this.tempSelected[key] = true;
          }
        }
        this.defaultLegend = true;
      }
    },
    changeValue(val, item, key) {
      if (key === "custom") {
        // 只要改变了还原
        if (val) {
          this.legend.top = "auto";
          this.legend.left = "auto";
        } else {
          this.legend.top = "top";
          this.legend.left = "center";
        }
        this.legend.bottom = "auto";
        this.legend.right = "auto";
      }
      this.$set(item, key, val);
      this._updateChart();
    },
    getSymbol($symbol) {
      let arr = [
        "path://M6 4L30 4L30 8L6 8",
        "path://M304.43 532.76H221.4c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h83.03c11.47 0 20.76 9.3 20.76 20.76s-9.29 20.76-20.76 20.76zM581.19 532.76H442.81c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h138.38c11.47 0 20.76 9.3 20.76 20.76s-9.3 20.76-20.76 20.76zM802.59 532.76h-83.03c-11.47 0-20.76-9.3-20.76-20.76s9.29-20.76 20.76-20.76h83.03c11.47 0 20.76 9.3 20.76 20.76s-9.29 20.76-20.76 20.76z",
      ];
      if (arr.indexOf($symbol) > -1) {
        return $symbol;
      }
      if (/^image|^path/.test($symbol)) {
        return "custom";
      }
      return $symbol;
    },
    changeSymbol(e, item) {
      item.icon = e;
      if (e === "square") {
        this.legend.itemWidth = 14;
        this.legend.itemHeight = 14;
      } else {
        this.legend.itemWidth = 25;
        this.legend.itemHeight = 14;
      }
      this._updateChart();
    },
    updateChart() {
      dsf.emit.$emit(
        "updateChart",
        {
          chart: this.chart,
        },
        [this.owner.$children[0]]
      );
    },
    // 处理legend的方式
    dealNormalWays() {
      if (this.defaultShowLegend !== -1) {
        this.tempSelected = {};
        //初始化默认选中图例
        this.legendData.forEach((item) => {
          this.tempSelected[`${item.name}`] = this.options.selected ? false : true;
        });
      }
    },
    changLegendStatus(e, name) {
      this.$set(this.tempSelected, name, e);
      this.$set(this.legend, "selected", _.cloneDeep(this.tempSelected));
      this._updateChart();
      this.$forceUpdate();
    },
    changeIconImage(e, item) {
      this.changeSymbolImage(e, item, (value) => {
        item.icon = value;
        e.target.value = "";
        this._updateChart();
      });
    },
    handleCommonIconData(list, iconData) {
      return list.map((item, idx) => {
        // 考虑配置总览中给data中icon单独添加颜色
        const obj = dsf.isObject(iconData[idx]) ? iconData[idx] : {};
        return {
          ...obj,
          name: item.name,
          icon: iconData[idx]?.icon ? iconData[idx].icon : "",
        };
      });
    },
    alignChange(val, valKey, key) {
      this.legend.bottom = "auto";
      this.legend.right = "auto";
      this.$set(this.legend, key, val[valKey]);
      this._updateChart();
    },
    marginChange(val) {
      let topField = "top";
      let rightField = "right";
      let bottomField = "bottom";
      let leftField = "left";
      this.$set(this.legend, topField, val[0]);
      this.$set(this.legend, rightField, val[1]);
      this.$set(this.legend, bottomField, val[2]);
      this.$set(this.legend, leftField, val[3]);
      this._updateChart();
    },
  },
};
</script>

<!--
 * @Description: 水位图组
 * @Author: shenah
 * @Date: 2023-06-16 09:38:22
 * @LastEditors: shenah
 * @LastEditTime: 2025-03-14 09:59:33
-->

<template>
  <div
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    class="data-view-item-wrap ds-control dsf-dv-level-pond-group ds-control data-view-no-padding"
    :style="singleControlStyle"
    :ref="ref"
  >
    <DsfEmptyData v-if="!hasData" />
    <div class="dsf-dv-level-box-wrap" :ref="ref" v-else>
      <div class="dsf-dv-level-box" v-for="(item, index) in data" :key="item.id" @click="clickItem(item)" :style="dataViewLevelBoxStyle">
        <div class="canvas-wrap">
          <svg v-if="rendererObj[item.id]">
            <defs>
              <linearGradient :id="`gradient${item.id}`" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop v-for="lc in svgBorderGradientObj[item.id]" :key="lc[0]" :offset="lc[0]" :stop-color="lc[1]" />
              </linearGradient>
            </defs>
            <slot
              :item="item"
              name="default"
              :area="rendererObj[item.id].area"
              :styleItem="{
                color: valueConfig.color,
                fontSize: dsf.dataview.utils.transformPx(valueConfig.fontSize),
                fontFamily: valueConfig.fontFamily,
                fontWeight: valueConfig.fontWeight,
                fontStyle: valueConfig.fontStyle,
                textDecoration: valueConfig.textDecoration,
              }"
            >
              <text
                v-if="rendererObj[item.id]"
                :fill="valueConfig.color"
                :x="rendererObj[item.id].area[0] / 2 + 8"
                :y="rendererObj[item.id].area[1] / 2 + 8"
                :style="{
                  color: valueConfig.color,
                  fontSize: dsf.dataview.utils.transformPx(valueConfig.fontSize),
                  fontFamily: valueConfig.fontFamily,
                  fontWeight: valueConfig.fontWeight,
                  fontStyle: valueConfig.fontStyle,
                  textDecoration: valueConfig.textDecoration,
                }"
              >
                {{ detailsObj[item.id] }}%
              </text>
            </slot>
            <ellipse
              v-if="!shape(index) || shape(index) === 'round'"
              :cx="rendererObj[item.id].area[0] / 2"
              :cy="rendererObj[item.id].area[1] / 2"
              :rx="rendererObj[item.id].area[0] / 2 - 3"
              :ry="rendererObj[item.id].area[1] / 2 - 3"
              :stroke="`url(#gradient${item.id})`"
            />
            <rect
              v-else
              x="2"
              y="2"
              :rx="shape(index) === 'roundRect' ? 10 : 0"
              :ry="shape(index) === 'roundRect' ? 10 : 0"
              :width="rendererObj[item.id].area[0] - 4"
              :height="rendererObj[item.id].area[1] - 4"
              :stroke="`url(#gradient${item.id})`"
            />
          </svg>
          <canvas :id="`canvas${item.id}`" class="water-canvas" :style="waterCanvasStyle(index)" />
        </div>
        <div class="des-text" :style="getDesTextStyle" :title="item.name" v-if="isShowName">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const staticDataKeyDic = {
  name: "名称",
  value: "百分比",
};
const staticData = [
  {
    name: "三峡水库",
    value: "80",
  },
  {
    name: "洞庭湖水库",
    value: "60",
  },
  {
    name: "鄱阳湖水库",
    value: "55",
  },
];
import svg from "_dataview/mixins/svg.js";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewWaterLevelPondGroup",
  ctrlCaption: "水位图",
  mixins: [$mixins.dataView, svg, dataAnalysis],
  props: {
    staticData: {
      type: Array,
      default: () => staticData,
    },
    isCustomWH: {
      type: Boolean,
      default: false,
    },
    isShowName: {
      type: Boolean,
      default: true,
    },
    configs: {
      type: Array,
      default: () => [
        {
          //水位形状
          shape: "rect",
          //波纹数量
          waveNum: 3,
          //波纹高度
          waveHeight: 10,
          // 波纹透明度
          waveOpacity: 40,
          //水位图配色
          colors: ["#3DE7C9", "#00BAFF"],
        },
      ],
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "名称",
            value: "name",
            map: "name",
          },
          {
            text: "百分比",
            value: "value",
            map: "value",
          },
        ];
      },
    },
    singleWidth: {
      type: String,
      default: "300",
    },
    singleHeight: {
      type: String,
      default: "200",
    },
    nameConfig: {
      type: Object,
      default: () => ({}),
    },
    nameFontSize: {
      type: [String, Number],
      default: 24,
    },
    nameColor: {
      type: String,
      default: "#3DE7C9",
    },
    valueConfig: {
      type: Object,
      default: () => ({}),
    },
    valueFontSize: {
      type: [String, Number],
      default: 24,
    },
    valueColor: {
      type: String,
      default: "#3DE7C9",
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
  },
  computed: {
    singleControlStyle() {
      return {
        ...this.controlStyle,
        ...this.getCommonEnterAnimateStyle,
        padding: 0,
      };
    },
    dataViewLevelBoxStyle() {
      if (this.isCustomWH) {
        let height = this.singleHeight?.trim().replaceAll("px", "");
        if (height.includes("%")) {
          //
        } else {
          if (this.isShowName) {
            height = dsf.dataview.utils.transformPx(height * 1 + 50);
          } else {
            height = dsf.dataview.utils.transformPx(height);
          }
        }
        return {
          width: dsf.dataview.utils.transformPx(this.singleWidth),
          height: height,
          flex: "none",
          ...this.eventCursorPointerStyle,
        };
      }
      return {
        flex: 1,
        width: 0,
        minWidth: "200px",
        ...this.eventCursorPointerStyle,
      };
    },
    getDesTextStyle() {
      if (dsf.isEmptyObject(this.nameConfig)) {
        return {};
      }
      let { fontFamily, fontSize, color, fontWeight, fontStyle, textDecoration } = this.nameConfig;

      return {
        fontSize: dsf.dataview.utils.transformPx(fontSize),
        color,
        fontFamily,
        fontWeight,
        fontStyle,
        textDecoration,
      };
    },
  },
  data() {
    return {
      data: [],
      isLoadListener: false,
      ref: "water-pond-level-wrap",
      componentRef: "water-pond-level-wrap",
      rendererObj: {}, // 用于存放多个canvas对象
      svgBorderGradientObj: {},
      detailsObj: {},
      wavesObj: {},
      animationObj: {},
      defaultTextConfig: {
        fontFamily: "Microsoft Yahei", // 字体
        fontSize: "24px", // 字号
        color: "#3DE7C9", // 颜色
        fontWeight: "normal", // 加醋
        fontStyle: "normal", // 斜体
        textDecoration: "none", // 下划线
      },
    };
  },
  watch: {
    isShowName: {
      handler() {
        if (this.isDesign) {
          setTimeout(this.init, 0);
        }
      },
    },
    isCustomWH: {
      handler() {
        if (this.isDesign) {
          setTimeout(this.init, 0);
        }
      },
    },
    singleWidth: {
      handler() {
        if (this.isDesign) {
          setTimeout(this.init, 0);
        }
      },
    },
    singleHeight: {
      handler() {
        if (this.isDesign) {
          setTimeout(this.init, 0);
        }
      },
    },
    configs: {
      handler() {
        if (this.isDesign) {
          setTimeout(this.init, 0);
        }
      },
      deep: true,
    },
    staticData: {
      handler() {
        if (this.isDesign) {
          setTimeout(this.init, 0);
        }
      },
    },
  },
  created() {
    // 新版兼容老版
    this.initTextConfig();
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.valueConfig, this.nameConfig],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        const { textStyles = [], backgrounds = [] } = config;
        groups = groups.filter(it => /布局|背景|边框设置|入场动画/.test(it.name));
        this.updateComponentStyle("valueConfig", textStyles[0]);
        this.updateComponentStyle("nameConfig", textStyles[1]);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    initTextConfig() {
      let props = [
        {
          newName: "nameConfig",
          maps: [
            {
              form: "nameFontSize",
              to: "fontSize",
            },
            {
              form: "nameColor",
              to: "color",
            },
          ],
        },
        {
          newName: "valueConfig",
          maps: [
            {
              form: "valueFontSize",
              to: "fontSize",
            },
            {
              form: "valueColor",
              to: "color",
            },
          ],
        },
      ];
      _.each(props, (item) => {
        let textConfig = this[item.newName];
        if (!textConfig || dsf.isEmptyObject(textConfig)) {
          textConfig = dsf.mix(true, {}, this.defaultTextConfig);
          _.each(item.maps, (it) => {
            let form = this[it.form];
            if (form) {
              textConfig[it.to] = form;
            }
          });
        }
        for (let key in textConfig) {
          this.$set(this[item.newName], key, textConfig[key]);
        }
      });
    },
    waterCanvasStyle(dataIndex) {
      let config = this.getOneConfig(dataIndex);
      const { shape } = config;
      let borderRadius = 0;
      if (shape === "round") borderRadius = "50%";
      if (shape === "rect") borderRadius = "0";
      if (shape === "roundRect") borderRadius = "10px";
      let style = {
        "border-radius": borderRadius,
      };
      return style;
    },
    shape(dataIndex) {
      let config = this.getOneConfig(dataIndex);
      const { shape } = config;
      if (!shape) return "rect";
      return shape;
    },
    // 获取对应的config
    getOneConfig(dataIndex) {
      let nowIndex = dataIndex;
      let configLength = this.configs.length;
      if (dataIndex > configLength - 1) {
        nowIndex = configLength - 1;
      }
      return this.configs[nowIndex];
    },
    clickItem(row) {
      this.$dispatch("clickItem", row);
      this.loadClickEvents(row);
    },
    dataAnalysis(data) {
      this.resetData();
      if (!data.length) {
        this.hasData = false;
        return;
      }
      let nowData = data;
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        let nameKey = this.mapRelations[0].map;
        let valueKey = this.mapRelations[1].map;
        nowData = data.map((item) => ({
          ...item,
          name: item[nameKey],
          value: this.handleMapRelationNum(item[valueKey], this.mapRelations[1]),
        }));
      } else {
        nowData = data;
      }
      this.data = nowData.map((item) => ({
        ...item,
        id: dsf.uuid(8),
      }));

      this.loadScript().then(() => {
        if (typeof CRender !== "function") {
          CRender = CRender.default;
        }
        this.$nextTick(() => {
          this.initData();
          this.resize();
        });
      });
    },
    initData() {
      this.data.forEach((item, index) => {
        this.initCanvas(item);
        this.calcSvgBorderGradient(item, index);
        this.calcDetails(item);
        this.addWave(item, index);
        this.animationWave(item);
      });
    },
    initCanvas(row) {
      let canvasEl = document.getElementById(`canvas${row.id}`);
      let cRender = new CRender(canvasEl);
      this.$set(this.rendererObj, row.id + "", cRender);
    },
    calcSvgBorderGradient(row, dataIndex) {
      let config = this.getOneConfig(dataIndex);
      let colors = config.colors;
      const colorNum = colors.length;
      const colorOffsetGap = 100 / (colorNum - 1);
      this.svgBorderGradientObj[row.id] = colors.map((c, i) => [colorOffsetGap * i, c]);
    },
    calcDetails(row) {
      this.detailsObj[row.id] = row.value;
    },

    addWave(row, dataIndex) {
      const { getWaveShapes, getWaveStyle, drawed } = this;
      const renderer = this.rendererObj[row.id];
      const shapes = getWaveShapes(row, dataIndex);
      const style = getWaveStyle(row, dataIndex);
      this.wavesObj[row.id] = shapes.map((shape) =>
        renderer.add({
          name: "smoothline",
          animationFrame: 300,
          shape,
          style,
          drawed,
        })
      );
    },
    getWaveShapes(row, dataIndex) {
      let config = this.getOneConfig(dataIndex);
      const { mergeOffset } = this;
      const { waveNum, waveHeight } = config;
      let renderer = this.rendererObj[row.id];
      const [w, h] = renderer.area;
      const pointsNum = waveNum * 4 + 4;
      const pointXGap = w / waveNum / 2;
      return [row.value].map((v) => {
        let points = new Array(pointsNum).fill(0).map((foo, j) => {
          const x = w - pointXGap * j;
          let num = isNaN(v * 1) ? 50 : v;
          const startY = (1 - num / 100) * h;
          const y = j % 2 === 0 ? startY : startY - waveHeight;
          return [x, y];
        });
        points = points.map((p) => mergeOffset(p, [pointXGap * 2, 0]));
        return { points };
      });
    },
    getWaveStyle(row, dataIndex) {
      let config = this.getOneConfig(dataIndex);
      let renderer = this.rendererObj[row.id];
      const h = renderer.area[1];
      return {
        gradientColor: config.colors,
        gradientType: "linear",
        gradientParams: [0, 0, 0, h],
        gradientWith: "fill",
        opacity: config.waveOpacity / 100,
        translate: [0, 0],
      };
    },
    mergeOffset([x, y], [ox, oy]) {
      return [x + ox, y + oy];
    },
    drawed({ shape: { points } }, { ctx, area }) {
      const firstPoint = points[0];
      const lastPoint = points.slice(-1)[0];

      const h = area[1];

      ctx.lineTo(lastPoint[0], h);
      ctx.lineTo(firstPoint[0], h);

      ctx.closePath();

      ctx.fill();
    },
    async animationWave(row, repeat = 1) {
      let renderer = this.rendererObj[row.id];
      let waves = this.wavesObj[row.id];
      let animation = this.animationObj[row.id];
      if (animation) return;
      this.animationObj[row.id] = true;
      const w = renderer.area[0];
      waves.forEach((graph) => {
        graph.attr("style", { translate: [0, 0] });
        graph.animation(
          "style",
          {
            translate: [w, 0],
          },
          true
        );
      });
      await renderer.launchAnimation();
      this.animationObj[row.id] = false;
      if (!renderer.graphs.length) return;
      this.animationWave(row, repeat + 1);
    },
    resetData() {
      Object.keys(this.rendererObj).forEach((key) => {
        let renderer = this.rendererObj[key];
        renderer?.delAllGraph();
      });
      this.rendererObj = {};
      this.svgBorderGradientObj = {};
      this.detailsObj = {};
      this.wavesObj = {};
    },
    changeDataRender() {
      this.resetData();
      setTimeout(() => {
        this.initData();
      });
    },
    onResize() {
      if (!window.CRender) return;
      this.changeDataRender();
    },
    loadScript() {
      if (window.CRender) {
        return Promise.resolve();
      } else {
        return new Promise((resolve, reject) => {
          let loadFileHttp = dsf.dataview.utils.importFiles(
            [this.$getWebPath("static/js/libs/crender/crender.min.js", __DSF_DATAVIEW_PATH__)],
            () => {
              resolve();
            },
            (err) => {
              reject(err);
              dsf.layer.message("加载crender文件报错", false);
            },
            () => {
              this.addNowRequestFileList(loadFileHttp, true);
            }
          );
          this.addNowRequestFileList(loadFileHttp);
        });
      }
    },
  },
  beforeDestroy() {
    this.resetData();
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/DsfDataViewWaterLevelPondGroup.scss";
</style>
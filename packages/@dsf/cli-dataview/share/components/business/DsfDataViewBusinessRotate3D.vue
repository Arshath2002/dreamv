<template>
  <div
    class="dsf-dv-rotate3d-wrap data-view-item-wrap ds-control data-view-no-padding data-view-parent-slot-wrap"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div class="content" :style="contentStyle">
      <div
        class="slot-full-panel"
        v-if="isSlotFullPanel"
        slot-name="full-panel"
        :style="$slotStyle"
        :class="{
          'slot-common-block-wrap': isDesign,
        }"
      >
        <slot name="full-panel"></slot>
      </div>
      <div class="nav-wrap" :ref="ref">
        <ul class="nav-list" :style="navStyle" ref="nav">
          <li v-for="(item, index) in data" :key="item.id" class="item rotation3D__item" :class="'item' + index" :style="itemStyle">
            <div class="scale" :style="cellStyle(index)" @click="clickScale(item)">
              {{ item.name }}
            </div>
          </li>
        </ul>
        <div class="track" v-if="isTrack" :style="trackStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
import "./rotation3D";
import defaultImg from "_dataview/assets/styles/themes/img/bussiness/center_ball.png";
import svg from "_dataview/mixins/svg.js";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";

const staticDataKeyDic = {
  name: "名称",
};
let staticData = [
  {
    name: "锦江区",
  },
  {
    name: "青羊区",
  },
  {
    name: "金牛区",
  },
  {
    name: "武侯区",
  },
  {
    name: "成华区",
  },
  {
    name: "龙泉驿区",
  },
  {
    name: "青白江区",
  },
  {
    name: "新都区",
  },
  {
    name: "温江区",
  },
  {
    name: "双流区",
  },
  {
    name: "郫都区",
  },
  {
    name: "新津区",
  },
];
export default dsf.component({
  name: "DsfDataViewBusinessRotate3D",
  ctrlCaption: "三维旋转",
  mixins: [$mixins.dataView, dataAnalysis, svg],
  props: {
    staticData: {
      type: Array,
      default: () => staticData,
    },
    // 文本样式
    textStyle: {
      type: Object,
      default: () => createCommonTextStyle({ fontSize: 15 }),
    },
    size: {
      type: Number,
      default: 70,
    },
    height: {
      type: String,
      default: "100%",
    },
    // X轴翻转角度
    rotateX: {
      type: Number,
      default: 40,
    },
    // Z轴翻转角度
    rotateZ: {
      type: Number,
      default: 0,
    },
    //内边距
    padding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    // 最远距离缩放大小
    farScale: {
      type: Number,
      default: 0.8,
    },

    autoPlay: {
      type: Boolean,
      default: true,
    },
    isTrack: {
      type: Boolean,
      default: false,
    },
    trackWidth: {
      type: Number,
      default: 2,
    },
    trackColor: {
      type: String,
      default: "#fff",
    },
    timelineTimeDistance: {
      type: Number,
      default: 3000,
    },
    speed: {
      type: [Number, String],
      default: 1,
    },
    slotWidth: {
      type: String,
      default: "50%",
    },
    slotHeight: {
      type: String,
      default: "50%",
    },
    slotTop: {
      type: String,
      default: "10%",
    },
    isAround: {
      type: Boolean,
      default() {
        return true;
      },
    },
    slotLeft: {
      type: String,
      default: "50%",
    },

    backgroundConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否自定义背景图
    isCustom: {
      type: Boolean,
      default: false,
    },
    // 背景图数组
    scaleGroundConfigs: {
      type: Array,
      default() {
        return [];
      },
    },
    isSlotFullPanel: {
      type: Boolean,
      default() {
        return false;
      },
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "full-panel",
            controls: [],
          },
        ];
      },
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "名称",
            value: "name",
            map: "name",
            hideDigit: true,
          },
        ];
      },
    },
  },
  computed: {
    trackStyle() {
      const deg = this.rotateX;
      const size = dsf.dataview.utils.transformPx(this.size);
      return {
        borderWidth: dsf.dataview.utils.transformPx(this.trackWidth),
        borderColor: this.trackColor,
        transform: `rotateX(${deg}deg)`,
        inset: `${size}`,
      };
    },
    contentStyle() {
      let { padding } = this;
      return {
        ...this.dvBackgroundFormat(this.backgroundConfig),
        padding: dsf.dataview.utils.transformArrayPx(padding),
      };
    },
    $slotStyle() {
      return {
        height: this.slotHeight,
        width: this.slotWidth + "!important",
        top: this.slotTop,
        left: this.slotLeft,
        transform: `translate(-${this.slotLeft},-${this.slotTop})`,
        "z-index": this.isAround ? 88 : 9999,
      };
    },
    navStyle() {
      const { realWidth, rotateX, realHeight, rotateZ } = this;
      let height = Math.cos((Math.PI * rotateX) / 180) * realWidth;
      height = height > realHeight ? realHeight : height;
      return {
        height: dsf.dataview.utils.transformPx(height),
        transform: `rotateZ(${rotateZ}deg)`,
      };
    },

    itemStyle() {
      const size = dsf.dataview.utils.transformPx(this.size);
      let style = {
        width: size,
        height: size,
      };
      return style;
    },
    getRotateOptions() {
      const { farScale, size, autoPlay, rotateZ, timelineTimeDistance, speed, autoPlayFinishFn } = this;
      return {
        farScale,
        autoPlay,
        speed,
        autoPlayFinishFn,
        rotateZ,
        autoPlayDelay: timelineTimeDistance,
        xRadius: size,
        yRadius: size,
      };
    },
    // 监听多个影响3D旋转圆球的属性
    initRotation3D() {
      return `${this.padding}-${this.autoPlay}-${this.timelineTimeDistance}-${this.speed}-${this.rotateX}-${this.farScale}-${this.rotateZ}`;
    },
  },
  watch: {
    initRotation3D: {
      handler() {
        this.$nextTick(() => {
          setTimeout(() => {
            if (this.rotation) {
              this.rotation.onUpdate(this.getRotateOptions);
            } else {
              this.startMove();
            }
          });
        });
      },
      deep: true,
    },
  },
  data() {
    return {
      ref: "wrap",
      navList: [],
      rotation: null,
    };
  },
  methods: {
    cellStyle(index) {
      let { textStyle, scaleGroundConfigs, data } = this;
      textStyle = dsf.dataview.utils.transformTextStyle(textStyle);
      let background = data.length && scaleGroundConfigs.length ? scaleGroundConfigs[index % data.length] : "default";
      const isCustom = this.isCustom;
      if (!isCustom || background === "default") {
        background = {
          "background-image": `url(${defaultImg})`,
        };
      } else {
        background = this.dvBackgroundFormat(background);
      }
      return {
        ...textStyle,
        ...background,
        ...this.eventCursorPointerStyle,
      };
    },
    /* 数据解析 */
    dataAnalysis(data = this.data) {
      if (!data.length) {
        this.hasData = false;
        return;
      }
      if (eval(this.dynamicRules)) {
        this.data = this.handleData(data);
      } else if (this.dataType === "excel") {
        this.data = this.handleData(data);
      } else {
        if (this.$listeners["interceptOptions"]) {
          this.$dispatch("interceptOptions", { vm: this });
        } else {
          this.data = data;
        }
      }
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.rotation) {
            this.rotation.onUpdate(this.getRotateOptions);
          } else {
            this.startMove();
          }
        });
      });
    },
    startMove() {
      if (this.rotation) return false;
      this.rotation = new Rotation3D({
        el: this.$refs.nav,
        ...this.getRotateOptions,
      });
    },
    clickScale(item) {
      this.loadClickEvents(item);
    },
    handleData(data) {
      let nowData = data.map((item) => {
        let obj = {
          id: dsf.uuid(),
          ...item,
        };
        let titleKey = this.mapRelations[0]?.map;
        obj.name = item[titleKey];
        return obj;
      });
      return nowData;
    },
    autoPlayFinishFn(params) {
      if (this.$listeners["autoPlayFinish"]) {
        this.$dispatch("autoPlayFinish", { vm: this, ...params });
      }
    },
    onResize() {
      if (this.$listeners["customResize"]) {
        this.$dispatch("customResize", { vm: this });
      } else {
        setTimeout(() => {
          this.rotation && this.rotation.onUpdate(this.getRotateOptions);
        }, 1000);
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/rotate3d.scss";
</style>

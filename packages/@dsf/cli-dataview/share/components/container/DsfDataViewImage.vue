<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-09-27 16:02:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-23 10:34:32
-->
<!--  图形容器  -->
<template>
  <div
    class="dsf-container-image data-view-item-wrap ds-control data-view-no-padding"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <div class="dsf-container-image" :style="$containStyle">
      <div class="img-content data-view-common-bg-effect" :ref="ref" :style="$pageStyle" @click="imgClick">
        <div class="mask" v-if="waveSetting.show && waveSetting.maskImage" ref="mask">
          <div class="mask-inner" ref="mask-inner" :style="maskInnerStyle"></div>
        </div>

        <div class="ds-backdrop-filter" :style="backdropStyle">
          <div class="image-slot-content" :style="controlInnerStyle" slot-name="default">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>

    <svg xlmns="http://www.w3.org/2000/svg" version="1.1" style="display: none">
      <filter :id="heatId" filterUnits="objectBoundingBox" x="0" y="0" width="100%" height="100%">
        <feTurbulence :id="heatTurbulence" type="fractalNoise" numOctaves="1" seed="2" />
        <feDisplacementMap xChannelSelector="G" yChannelSelector="B" scale="22" in="SourceGraphic" />
      </filter>
    </svg>
  </div>
</template>
<script>
let defaultBackgroundConfig = {
  active: "pattern",
  pattern: {
    image: "platform/upload/file/jpg/e9dfb791da6540c2ab97190f55474e7b",
    size: "100% 100%",
    repeat: "no-repeat",
    position: "center",
    width: "100%",
    height: "100%",
  },
};
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewImage",
  ctrlCaption: "图片容器",
  mixins: [$mixins.dataView, border],
  props: {
    // 背景图片
    backgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackgroundConfig };
      },
    },
    // 图片波纹设置
    waveSetting: {
      type: Object,
      default() {
        return {
          show: false,
          maskImage: "",
        };
      },
    },
    margin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    wholePadding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    padding: {
      type: Array,
      default: () => [10, 10, 10, 10],
    },
    borderConfig: {
      type: Object,
      default: () => ({}),
    },
    borderRadius: {
      type: Array,
      default: () => [2, 2, 2, 2],
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
        ];
      },
    },
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          click: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
  },
  data() {
    const heatId = dsf.uuid();
    return {
      heatId: `heat_${heatId}`,
      heatTurbulence: `heatTurbulence_${heatId}`,
      ref: "containerImage",
    };
  },
  watch: {
    backgroundConfig: {
      handler(val, old) {
        const active = val.active;
        if (!val[active].image || old.active != active) {
          this.$set(this.waveSetting, "maskImage", "");
          this.$set(this.waveSetting, "show", false);
        }
      },
      deep: true,
    },
  },
  created() {
    this.compatibleProp();
  },
  beforeDestroy() {
    this.timeline && this.timeline.kill();
  },
  mounted() {
    this.$nextTick(() => {
      this.handleEventScope();
    });

    this.loadScript(() => {
      const timeline = new TimelineMax({
        repeat: -1,
        yoyo: true,
      });
      this.timeline = timeline;

      const heatTurbulence = document.querySelector(`#${this.heatTurbulence}`);

      timeline.add(
        TweenMax.to(heatTurbulence, 8, {
          onUpdate: function () {
            var bfX = this.progress() * 0.01 + 0.025,
              bfY = this.progress() * 0.003 + 0.01,
              bfStr = bfX.toString() + " " + bfY.toString();
            heatTurbulence.setAttribute("baseFrequency", bfStr);
          },
        }),
        0
      );
    });
  },
  computed: {
    maskInnerStyle() {
      const { waveSetting, heatId } = this;
      return {
        "mask-image": `url(${waveSetting.maskImage})`,
        filter: `url(#${heatId})`,
      };
    },
    controlStyle() {
      let { height, width, wholePadding } = this;
      height = dsf.dataview.utils.transformPx(height);
      wholePadding = dsf.dataview.utils.transformArrayPx(wholePadding);
      if (this.isDesign) {
        if ((height + "").includes("%") && !(height + "").includes("calc")) {
          height = "100%";
        }
      }
      return {
        height,
        width,
        padding: wholePadding,
      };
    },
    $pageStyle() {
      const controlStyle = {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      };
      let borderStyle = {
        borderRadius: this.borderRadius.join("px ") + "px",
        ...this.borderConfig,
      };
      if (dsf.dataview.utils.isCursorPointer([this.eventRelativeDeal.click])) {
        controlStyle["cursor"] = "pointer";
      }
      return {
        ...borderStyle,
        ...controlStyle,
      };
    },
    $containStyle() {
      let background = this.dvBackgroundFormat(this.backgroundConfig, {
        isBgInfoVar: true,
      });
      // 解析宽高
      let { width, margin } = this;
      if (this.isDesign) {
        margin = [0, margin[1], 0, margin[3]];
      }
      margin = dsf.dataview.utils.transformArrayPx(margin);
      return {
        margin,
        width: this.dealUnitNumber(width),
        ...background,
        ...this.getBoxShadowConfig(true),
        "--border-radius": this.borderRadius.join("px ") + "px",
      };
    },
    backdropStyle() {
      return {
        width: "100%",
        height: "100%",
      };
    },
  },
  methods: {
    // 兼容属性
    compatibleProp() {
      // 兼容border
      this.compatibleBorderProp();
    },
    compatibleBorderProp() {
      this.commonBorderManageCompatible({
        isShowField: "isborder",
        borderWidthField: "borderWidth",
        isBorderSolidField: "isBorderSolid",
        borderColorField: "borderColor",
        updateField: "borderConfig",
        updateCssField: "border",
      });
    },
    dealUnitNumber(str) {
      str = "" + str;
      switch (true) {
        case str.indexOf("px") > -1:
          return parseInt(str) + "px";
        case str.indexOf("%") > -1:
          return parseInt(str) + "%";
        case str === "auto":
          return "auto";
        case str === "":
          return 0;
        default:
          return str + "px";
      }
    },
    imgClick(evt) {
      this.loadClickEvents(evt);
    },
    loadClickEvents(evt) {
      try {
        let { fn } = this.eventRelativeDeal.click;
        //给组件设置当前数据
        this.currentComponentData = {};
        this.handleCommonEmit(fn, {}, evt);
      } catch (e) {
        console.error(e);
      }
    },
    loadScript(callback) {
      if (window.TweenMax) {
        callback?.();
      } else {
        let loadFileHttp = dsf.dataview.utils.importFiles(
          [this.$getWebPath("static/js/libs/TweenMax/TweenMax.min.js", __DSF_DATAVIEW_PATH__)],
          () => {
            callback?.();
          },
          (err) => {
            console.error(err);
            dsf.layer.message("加载TweenMax文件报错", false);
          },
          () => {
            this.addNowRequestFileList(loadFileHttp, true);
          }
        );
        this.addNowRequestFileList(loadFileHttp);
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/containerImage.scss";
</style>

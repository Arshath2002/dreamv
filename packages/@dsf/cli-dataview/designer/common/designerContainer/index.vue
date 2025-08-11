<template>
  <div class="dv-designer-container-frame" :class="[auxiliary ? 'dv-designer-container' : 'dv-designer-container-disabled']" @wheel.stop="onWheel">
    <template v-if="auxiliary">
      <div class="dv-designer-container__tools">
        <div @click="setScale" class="tools-item fit-cursor">
          自适应
          <DsfIcon class="bt" name="dv-icon-self-adaptation4"></DsfIcon>
        </div>

        <div class="tools-item">
          <span @click="clickScale">缩放</span>
          <el-dropdown size="mini" placement="top" @command="scaleChange">
            <span class="bt">{{ scale }}%</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="num in scaleConfig" :key="num" :command="num">{{ num }}%</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="tools-item slider_wrapper">
          <el-slider :min="50" :max="200" :value="scale" @input="scaleChange"></el-slider>
        </div>
        <el-popover placement="bottom" width="800" trigger="hover">
          <Help />
          <div class="tools-item fit-cursor" slot="reference">
            快捷键
            <DsfIcon class="help-bt" name="icon-jianpan" title="快捷键" />
          </div>
        </el-popover>

        <div class="tools-item-operation">
          <div class="operation-item is-active" v-if="$designer.openDrag" @click="changeDrag">
            <DsfIcon class="bt" name="icon-dui" />
            完成
          </div>
          <div v-else class="operation-item" @click="changeDrag">
            <DsfIcon class="bt" name="icon-buju" />
            布局
          </div>
        </div>
      </div>
      <transition name="el-fade-in-linear">
        <div v-if="showScaleTips && !disableScale" class="scale-tips">
          <span>{{ scale }}%</span>
          <div>alt键 + 鼠标滚轮</div>
        </div>
      </transition>
      <Ruler v-if="!disableRuler" ref="rulerX" class="__ruler __x" type="x" />
      <Ruler v-if="!disableRuler" ref="rulerY" class="__ruler __y" type="y" />
      <div v-if="!disableGuidelines" v-show="mouseIsEnter" class="__guidelines __x" :style="{ transform: `translateX(${mousePointX}px)` }">
        <span>{{ mousePointLeft }}</span>
      </div>
      <div v-if="!disableGuidelines" v-show="mouseIsEnter" class="__guidelines __y" :style="{ transform: `translateY(${mousePointY}px)` }">
        <span>{{ mousePointTop }}</span>
      </div>
    </template>
    <div
      ref="warp"
      @click="selectPage"
      class="dv-designer-container__warp"
      @mousedown="selectGridMousedown"
      @mouseup="selectGridMouseup"
      @mouseenter="mouseIsEnter = true"
      @mouseleave="mouseIsEnter = false"
      @mousemove="warpMousemove"
      @scroll="onScroll"
    >
      <template v-if="auxiliary">
        <div ref="rect" class="__rect"></div>
        <div class="__occupying" :style="occupyingStyle" @mousedown.left="panelMouseDown"></div>
      </template>
      <div tabindex="-1" ref="dataview-page" class="dv-designer-container__warp-canvas" :class="{ 'is-key-alt': isKeyAlt }" :style="canvasStyle" @mousedown.left.alt="panelMouseDown">
        <slot />
      </div>
      <div class="select-bound-wrapper" v-if="selectDown && $designer.openDrag" :style="selectBoundWrapper"></div>
    </div>
    <div class="minimap-wrapper">
      <div class="minimap-wrapper__box" :class="{ hidden: !minimapSwitch }">
        <canvas id="minimap-canvas"></canvas>
        <div ref="draggable" class="move-cursor" :style="minimapBorderStyle"></div>
      </div>
      <span class="switch" @click="minimapSwitch = !minimapSwitch">{{minimapSwitch?'隐藏':'鹰眼'}}</span>
    </div>
  </div>
</template>

<script>
import Ruler from "./ruler";
import Help from "./help";

// 最小缩放系数
const minScale = 25;
const padding = 30;
const padding2 = padding * 2;

export default {
  name: "DsfDVDesignerContainer",
  components: {
    Ruler,
    Help,
  },
  inject: {
    $designer: {
      default: null,
    },
  },
  provide() {
    return {
      $designerContainer: this,
    };
  },
  props: {
    mobile: {
      type: Boolean,
      default: false,
    },
    // 禁用缩放
    disableScale: {
      type: Boolean,
      default: false,
    },
    // 禁用旋转
    disableRotate: {
      type: Boolean,
      default: false,
    },
    // 设备列表
    deviceList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 默认设备
    defaultDevice: {
      type: Object,
      default: null,
    },
  },
  data() {
    this.scaleConfig = [50, 60, 80, 100, 125, 150, 200];
    return {
      selectDown: false,
      minimapSwitch: false,
      initialX: 0,
      initialY: 0,
      currentX: 0,
      currentY: 0,
      isDragging: false,
      minimapHeight: 0,
      minimapWidth: 150,
      minimapBorder: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
      },
      selectBound: {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        startPointX: 0,
        startPointY: 0,
        endPointX: 0,
        endPointY: 0,
      },
      autoDevice: { name: "auto", text: "自定义", width: 0, height: 0 },
      showScaleTips: false,
      device: null,
      fullScreen: false,
      disableRuler: false,
      disableGuidelines: true,
      mouseIsEnter: false,
      scrollWidth: 0,
      scrollHeight: 0,
      scale2: 100,
      top: padding,
      left: padding,
      mousePointX: 0,
      mousePointY: 0,
      mousePointLeft: 0,
      mousePointTop: 0,
      isKeyAlt: false,
      isDownPanel: false,
      scrollBarXStyle: {},
      scrollBarYStyle: {},
    };
  },
  computed: {
    selectBoundWrapper() {
      const { startX, startY, endX, endY } = this.selectBound;
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);

      const left = startX < endX ? startX : endX;
      const top = startY < endY ? startY : endY;
      return {
        width: width + "px",
        height: height + "px",
        left: left + "px",
        top: top + "px",
      };
    },
    auxiliary() {
      let { auxiliary, disableAuxiliary } = this.$designer;
      return !disableAuxiliary && auxiliary;
    },
    deviceConfig() {
      let list = this.mobile ? mobileDeviceList : pcDeviceList;
      if (!this.deviceList.length) {
        return [this.autoDevice].concat(list);
      }
      return [this.autoDevice].concat(this.deviceList, list);
    },
    width() {
      if (!this.device) return 0;
      let { rotate, width = 0, height = 0 } = this.device;
      return rotate ? height : width;
    },
    height() {
      if (!this.device) return 0;
      let { rotate, width = 0, height = 0 } = this.device;
      return rotate ? width : height;
    },
    scale: {
      get() {
        return this.scale2;
      },
      set(val) {
        if (!this.disableScale) {
          this.scale2 = val > minScale ? val : minScale;
        }
      },
    },
    realWidth() {
      let { width, scale } = this;
      return (width * scale) / 100;
    },
    realHeight() {
      let { height, scale } = this;
      return (height * scale) / 100;
    },
    warpStyle() {
      let { top, left, scale } = this;
      scale /= 100;
      return {
        "background-size": `${scale / 10}px ${scale / 10}px, ${scale}px ${scale}px`,
        "background-position": `${left}px ${top}px, ${left - scale / 20}px ${top - scale / 20}px`,
      };
    },
    canvasStyle() {
      if (!this.auxiliary) return {};
      let { top, left, width, height, scale } = this;
      scale /= 100;
      return {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${left}px, ${top}px) scale(${scale})`,
      };
    },
    occupyingStyle() {
      if (!this.auxiliary) return {};
      let { hasXScroll = false, hasYScroll = false } = this.boxRect || {};
      let { left, top, scale, scrollWidth, scrollHeight } = this;
      if (!hasXScroll) {
        scrollWidth = "100%";
      } else {
        scrollWidth += "px";
      }
      if (!hasYScroll) {
        scrollHeight = "100%";
      } else {
        scrollHeight += "px";
      }
      return {
        "background-size": `${scale / 10}px ${scale / 10}px, ${scale}px ${scale}px`,
        "background-position": `${left + scale / 20}px ${top + scale / 20}px, ${left + scale / 2}px ${top + scale / 2}px`,
        width: scrollWidth,
        height: scrollHeight,
      };
    },
    minimapStyle() {
      if (!this.auxiliary) return {};
      let { scrollWidth, scrollHeight } = this;
      const width = 200;
      const ratio = scrollWidth / scrollHeight;
      const height = 200 / ratio;
      return {
        width: width + "px",
        height: height + "px",
      };
    },
    minimapBorderStyle() {
      const { width, height, top, left } = this.minimapBorder;
      return {
        width: width + "px",
        height: height + "px",
        top: top + "px",
        left: left + "px",
      };
    },
    rulerXStyle() {
      if (!this.auxiliary) return {};
      let { realWidth, top, left } = this;
      return {
        width: `${realWidth}px`,
        height: "20px",
        top: `${top}px`,
        left: `${left}px`,
      };
    },
    rulerYStyle() {
      if (!this.auxiliary) return {};
      let { realHeight, top, left } = this;
      return {
        height: `${realHeight}px`,
        width: "20px",
        top: `${top}px`,
        left: `${left}px`,
      };
    },
  },
  watch: {
    auxiliary: {
      handler(to) {
        if (to) {
          this.$nextTick(() => {
            if (!this.device) {
              this.setBoxRect();
              this.setDefaultDevice();
              this.autoScale();
            }
            window.$designerScale = this.scale;
            this.$emit("scale-change", this.scale);
            this.mobile && flexible(this.width);
            window.addEventListener("keydown", this.onKeyDown);
            this.doResize();
            this.$nextTick(this.toScroll);
          });
        } else {
          this.isKeyAlt = false;
          window.$designerScale = 100;
          this.$emit("scale-change", 100);
          this.mobile && flexible(375);
          window.removeEventListener("keydown", this.onKeyDown);
          window.removeEventListener("keyup", this.onKeyUp);
          document.body.removeEventListener("mousemove", this.onKeyUp);
          this.$nextTick(() => {
            this.dispatchResize();
          });
        }
      },
      immediate: true,
    },
    disableRuler(to) {
      if (!to) {
        this.$nextTick(() => {
          this.resizeRuler();
          this.drawRuler();
        });
      }
    },
    scale(to) {
      this.showScaleTips = true;
      clearTimeout(this.__showScaleTipsTimeout);
      this.__showScaleTipsTimeout = setTimeout(() => {
        this.showScaleTips = false;
      }, 1000);
      window.$designerScale = to;
      this.$emit("scale-change", to);
    },
    width(to) {
      this.mobile && flexible(this.auxiliary ? to : 375);
    },
  },

  created() {
    this.dispatchResize = _.debounce(dsf.dispatchResize, 500);
    this.$resize = _.throttle(this.doResize, 16);
    if (this.auxiliary) {
      window.addEventListener("keydown", this.onKeyDown);
    }

    dsf.emit.$on(
      "update-minimap",
      () => {
        this.$nextTick(this.drawMinimap);
      },
      this
    );
  },
  mounted() {
    if (window.ResizeObserver) {
      // 监听容器内部变化
      this.observer = new ResizeObserver(() => {
        if (!this.auxiliary) return;
        this.setBoxRect();
        this.doResize();
        this.$nextTick(this.toScroll);
      });
      this.observer.observe(this.$refs.warp);
    }

    this.$eventBus.$on("update-desinger-outline", () => {
      this.drawMinimap();
    });

    this.$refs.warp.addEventListener("scroll", () => {
      this.drawMinimap();
    });

    // 鼠标按下事件 - 开始拖拽
    document.addEventListener("mousedown", this.minimapMouseDown);
    // 鼠标移动事件 - 更新位置
    document.addEventListener("mousemove", this.minimapMouseMove);
    document.addEventListener("mouseup", this.minimapMouseUp);
    // 可选：防止拖拽时触发文本选择
    document.addEventListener("selectstart", this.minimapDefault);
  },
  beforeDestroy() {
    this.observer?.disconnect();
    this.dispatchResize.cancel();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    document.body.removeEventListener("mousemove", this.onKeyUp);
    window.removeEventListener("mousemove", this.mousemove);
    window.removeEventListener("mouseup", this.mouseup);
    dsf.emit.$remove("update-minimap", this);

    // 鼠标按下事件 - 开始拖拽
    document.removeEventListener("mousedown", this.minimapMouseDown);
    // 鼠标移动事件 - 更新位置
    document.removeEventListener("mousemove", this.minimapMouseMove);
    document.removeEventListener("mouseup", this.minimapMouseUp);
    // 可选：防止拖拽时触发文本选择
    document.removeEventListener("selectstart", this.minimapDefault);
  },
  methods: {
    /**
     * 绘制鹰眼
     */
    drawMinimap() {
      const { scrollWidth, scrollHeight, box } = this.boxRect;
      const { offsetWidth, offsetHeight } = this.$refs.rect;
      const canvasWidth = this.minimapWidth;
      const ratio = scrollWidth / scrollHeight;
      this.minimapHeight = canvasWidth / ratio;
      const canvasHeight = this.minimapHeight;

      const borderWidth = (canvasWidth * offsetWidth) / scrollWidth;
      const borderHeight = (canvasHeight * offsetHeight) / scrollHeight;
      const { scrollTop, scrollLeft } = this.$refs.warp;

      this.minimapBorder.width = borderWidth;
      this.minimapBorder.height = borderHeight;
      this.minimapBorder.left = (canvasWidth * scrollLeft) / scrollWidth;
      this.minimapBorder.top = (canvasHeight * scrollTop) / scrollHeight;

      const boundTop = box.top;
      const boundLeft = box.left;

      const canvas = document.getElementById("minimap-canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawRect = (ctx, rect, color = "rgba(255,255,255,0.2)") => {
        const { left, top, width, height } = rect;

        const x = (canvasWidth * (left + scrollLeft - boundLeft)) / scrollWidth;
        const y = (canvasHeight * (top + scrollTop - boundTop)) / scrollHeight;
        const w = (canvasWidth * width) / scrollWidth;
        const h = (canvasHeight * height) / scrollHeight;
        ctx.fillStyle = color; // 设置填充颜色
        ctx.fillRect(x, y, w, h); // (x, y, width, height)
      };

      const dataview = this.$refs["dataview-page"];
      const rect = dataview.getBoundingClientRect();
      const slots = $(dataview).find(".dsf-dv-grid-item");

      drawRect(ctx, rect);
      for (let i = 0; i < slots.length; i++) {
        const el = slots[i];
        const rect = el.getBoundingClientRect();
        drawRect(ctx, rect, `rgba(255,255,255,0.4)`);
      }
    },

    clickScale() {
      const scale = this.scale;
      const config = this.scaleConfig;
      let minIndex = 0;
      config.forEach((it, index, array) => {
        if (Math.abs(array[minIndex] - scale) > Math.abs(it - scale)) {
          minIndex = index;
        }
      });
      if (scale >= config[minIndex]) {
        minIndex++;
      }
      if (minIndex >= config.length) {
        minIndex = 0;
      }
      this.scaleChange(config[minIndex]);
    },
    setScale() {
      this.autoScale();
      this.doResize();
      this.$nextTick(() => {
        dsf.dispatchResize();
        this.toScroll();
      });
    },
    selectPage() {
      this.$emit("selectPage");
    },
    changeDrag() {
      this.$emit("changeDrag");
    },
    setDefaultDevice() {
      let { defaultDevice, deviceConfig } = this;
      let device = defaultDevice ? _.find(deviceConfig, (d) => d.name == defaultDevice.name) : null;
      if (!device) {
        if (this.mobile) {
          device = deviceConfig[1];
        } else {
          device = deviceConfig[0];
        }
      }
      this.device = device;
      this.$emit("device-change", device);
    },
    deviceChange(device) {
      if (device.name == "auto" && (!device.width || !device.height)) {
        device.width = this.width;
        device.height = this.height;
      }
      this.device = device;
      if (device.width && device.height) {
        this.autoScale();
      }
      this.$emit("device-change", device);
      this.doResize();
      this.$nextTick(() => {
        this.toScroll();
        this.dispatchResize();
      });
    },
    autoScale() {
      if (!this.disableScale) {
        let { width, height } = this.boxRect.box;
        let scale = Math.floor(Math.min((width - padding2) / this.width, (height - padding2) / this.height) * 100);
        this.scale = scale < 100 ? scale : 100;
      }
    },
    scaleChange(scale) {
      this.scale = scale;
      this.doResize();
      this.$nextTick(this.toScroll);
    },
    doRotate() {
      this.$set(this.device, "rotate", !this.device.rotate);
      this.autoScale();
      this.doResize();
      this.$nextTick(() => {
        dsf.dispatchResize();
        this.toScroll();
      });
    },
    doFullScreen() {
      let { fullScreen, $el, __parentEl, __oComment } = this;
      this.fullScreen = !fullScreen;
      if (fullScreen) {
        __parentEl.insertBefore($el, __oComment);
        __parentEl.removeChild(__oComment);
        this.$refs.warp.classList.remove("designer-page");
        $el.classList.remove("ds-designer");
        $el.classList.remove("mobile");
        this.__oComment = void 0;
        this.__parentEl = void 0;
      } else {
        let __parentEl = $el.parentNode;
        let __oComment = document.createComment("dv-designer-container");
        __parentEl.insertBefore(__oComment, $el);
        this.__oComment = __oComment;
        this.__parentEl = __parentEl;
        this.$refs.warp.classList.add("designer-page");
        $el.classList.add("ds-designer");
        if (this.mobile) {
          $el.classList.add("mobile");
        }
        document.body.appendChild($el);
      }
      this.dispatchResize();
    },
    setBoxRect() {
      let boxRect = this.$refs.warp.getBoundingClientRect();
      this.boxRect = {
        box: boxRect,
      };
    },
    doResize() {
      if (!this.auxiliary || !this.device) return;
      let {
        width,
        height,
        $refs: { warp, rect },
      } = this;
      let { offsetWidth, offsetHeight } = rect;
      if (offsetWidth < warp.offsetWidth) {
        offsetWidth = warp.offsetWidth;
      }
      if (offsetHeight < warp.offsetHeight) {
        offsetHeight = warp.offsetHeight;
      }
      if (!width || !height) {
        this.$set(this.device, "width", offsetWidth - padding2);
        this.$set(this.device, "height", offsetHeight - padding2);
      }
      let { realWidth, realHeight } = this;
      let boxRect = this.$el.getBoundingClientRect();
      let scrollWidth = offsetWidth;
      let scrollHeight = offsetHeight;
      let hasXScroll = false;
      let hasYScroll = false;
      if (realWidth > scrollWidth - padding2) {
        scrollWidth = realWidth + padding2;
        hasXScroll = true;
      }
      if (realHeight > scrollHeight - padding2) {
        scrollHeight = realHeight + padding2;
        hasYScroll = true;
      }
      this.boxRect = Object.assign(this.boxRect, {
        left: boxRect.left,
        top: boxRect.top,
        width: offsetWidth,
        height: offsetHeight,
        scrollWidth: scrollWidth,
        scrollHeight: scrollHeight,
        hasXScroll,
        hasYScroll,
        scrollTop: 0,
        scrollLeft: 0,
      });
      this.scrollWidth = scrollWidth;
      this.scrollHeight = scrollHeight;
      this.resizeRuler();
    },
    toScroll(scrollX, scrollY) {
      if (!this.auxiliary) return;
      let { scrollTop, scrollLeft } = this.$refs.warp;
      if (scrollX == void 0) {
        scrollX = scrollLeft;
      }
      if (scrollY == void 0) {
        scrollY = scrollTop;
      }
      let { realWidth, realHeight } = this;
      let { hasXScroll, hasYScroll, scrollWidth, scrollHeight } = this.boxRect;
      let top = padding;
      let left = padding;
      if (!hasXScroll) {
        left = (scrollWidth - realWidth) / 2;
      }
      if (!hasYScroll) {
        top = (scrollHeight - realHeight) / 2;
      }
      this.top = top;
      this.left = left;
      if (hasXScroll || hasYScroll) {
        this.$refs.warp.scrollTo(scrollX, scrollY);
      }
      this.drawRuler();
      this.drawMinimap();
    },
    onScroll(e) {
      if (!this.auxiliary) return;
      let { scrollTop, scrollLeft } = e.target;
      let { boxRect, left, top, mousePointX, mousePointY, scale } = this;
      scale /= 100;
      this.boxRect = Object.assign(boxRect, {
        scrollTop,
        scrollLeft,
      });
      this.mousePointLeft = Math.round((mousePointX - left + scrollLeft) / scale);
      this.mousePointTop = Math.round((mousePointY - top + scrollTop) / scale);
      this.drawRuler();
    },
    onWheel(e) {
      if (e.ctrlKey) e.preventDefault();
      if (!this.auxiliary) return;
      let deltaX = e.deltaX,
        deltaY = e.deltaY;
      if (e.shiftKey && deltaY) {
        deltaX = deltaY;
        deltaY = 0;
      }
      // 如果是火狐浏览器，并且不是由鼠标滚轮触发
      // 火狐浏览器e.deltaMode：0触摸板，e.deltaMode：1鼠标
      // 其他浏览器e.deltaMode始终为0
      // 火狐浏览器鼠标delta值3或-3
      // 其他浏览器鼠标delta值100或-100
      if (dsf.client.type === "FF" && e.deltaMode === 1) {
        if (deltaX) deltaX = deltaX < 0 ? -10 : 10;
        if (deltaY) deltaY = deltaY < 0 ? -10 : 10;
      } else {
        if (Math.abs(deltaX) < 100) {
          deltaX /= 2;
        } else {
          deltaX /= 10;
        }
        if (Math.abs(deltaY) < 100) {
          deltaY /= 2;
        } else {
          deltaY /= 10;
        }
      }
      if (e.altKey) {
        e.preventDefault();
        this.doScale(deltaX + deltaY > 0 ? -1 : 1, e.clientX, e.clientY);
        this.warpMousemove(e);
      }
    },
    // 缩放
    doScale(offScale) {
      if (this.disableScale) return;
      let { scale, mousePointX, mousePointY } = this;
      let { scrollTop, scrollLeft } = this.$refs.warp;
      let nScale = scale + offScale;
      if (nScale < minScale) return;
      let k = nScale / scale;
      scrollLeft = (mousePointX + scrollLeft - padding) * k + padding - mousePointX;
      scrollTop = (mousePointY + scrollTop - padding) * k + padding - mousePointY;
      this.scale = nScale;
      this.doResize();
      this.$nextTick(() => {
        this.toScroll(scrollLeft, scrollTop);
      });
    },
    onKeyDown(e) {
      if (!this.auxiliary) return;
      if (e.keyCode == 18) {
        e.stopPropagation();
        e.preventDefault();
        this.isKeyAlt = true;
        window.addEventListener("keyup", this.onKeyUp);
        document.body.addEventListener("mousemove", this.onKeyUp);
      }
    },
    onKeyUp(e) {
      if (!this.auxiliary) return;
      if ((e.type == "mousemove" && !e.altKey) || e.keyCode == 18) {
        this.isKeyAlt = false;
        window.removeEventListener("keyup", this.onKeyUp);
        document.body.removeEventListener("mousemove", this.onKeyUp);
      }
    },
    selectGridMousedown(e) {
      if (!this.$designer.openDrag || !this.disableGuidelines) return false;
      const wrapper = this.$refs.warp;
      this.selectDown = true;
      let { boxRect } = this;
      let left = e.clientX - boxRect.box.left + wrapper.scrollLeft;
      let top = e.clientY - boxRect.box.top + wrapper.scrollTop;
      this.selectBound.startX = left;
      this.selectBound.startY = top;
      this.selectBound.endX = left;
      this.selectBound.endY = top;
      // 页面级
      this.selectBound.startPointX = e.clientX;
      this.selectBound.startPointY = e.clientY;
      this.selectBound.endPointX = e.clientX;
      this.selectBound.endPointY = e.clientY;
    },
    selectGridMouseup(e) {
      if (!this.$designer.openDrag || !this.disableGuidelines) return false;
      this.selectDown = false;
      this.selectBound.startX = 0;
      this.selectBound.startY = 0;
      this.selectBound.endX = 0;
      this.selectBound.endY = 0;
      // 页面级
      this.selectBound.startPointX = 0;
      this.selectBound.startPointY = 0;
      this.selectBound.endPointX = 0;
      this.selectBound.endPointY = 0;
      dsf.emit.$emit("designer-grid-box-select-up");
    },
    warpMousemove(e) {
      let { top, left, scale, boxRect } = this;

      scale /= 100;
      if (!this.disableGuidelines && this.mouseIsEnter) {
        let mousePointX = e.clientX - boxRect.box.left;
        let mousePointY = e.clientY - boxRect.box.top;
        this.mousePointX = Math.round(mousePointX);
        this.mousePointY = Math.round(mousePointY);
        this.mousePointLeft = Math.round((mousePointX - left + boxRect.scrollLeft) / scale);
        this.mousePointTop = Math.round((mousePointY - top + boxRect.scrollTop) / scale);
      } else if (this.selectDown && this.$designer.openDrag) {
        const wrapper = this.$refs.warp;
        let left = e.clientX - boxRect.box.left + wrapper.scrollLeft;
        let top = e.clientY - boxRect.box.top + wrapper.scrollTop;

        this.selectBound.endX = left;
        this.selectBound.endY = top;

        // 页面级
        this.selectBound.endPointX = e.clientX;
        this.selectBound.endPointY = e.clientY;

        const { startPointX, startPointY, endPointX, endPointY } = this.selectBound;
        // 向布局传递坐标信息
        dsf.emit.$emit("designer-grid-box-select", {
          startPointX,
          startPointY,
          endPointX,
          endPointY,
          scale,
        });
      }
    },
    panelMouseDown(e) {
      window.addEventListener("mousemove", this.mousemove);
      window.addEventListener("mouseup", this.mouseup);
    },
    mousemove({ movementX = 0, movementY = 0 }) {
      this.$refs.warp.scrollBy(-movementX, -movementY);
    },
    mouseup(e) {
      this.mousemove(e);
      window.removeEventListener("mousemove", this.mousemove);
      window.removeEventListener("mouseup", this.mouseup);
    },

    resizeRuler() {
      let { rulerX, rulerY } = this.$refs;
      if (rulerX && rulerY) {
        rulerX.resize();
        rulerY.resize();
      }
    },
    drawRuler() {
      let { rulerX, rulerY } = this.$refs;
      if (rulerX && rulerY) {
        rulerX.draw();
        rulerY.draw();
      }
    },
    setRect() {
      let rect = Vue.observable({
        width: this.width + "",
        height: this.height + "",
      });
      let rules = {
        width: [
          { required: true, message: "宽度不能为空", trigger: "blur" },
          { type: "string", pattern: /^[1-9]\d+$/, message: "必须输入正整数", trigger: "blur" },
        ],
        height: [
          { required: true, message: "高度不能为空", trigger: "blur" },
          { type: "string", pattern: /^[1-9]\d+$/, message: "必须输入正整数", trigger: "blur" },
        ],
      };
      let fn = (h) => {
        return (
          <el-form ref="form" label-width="60px" props={{ model: rect }} rules={rules}>
            <el-form-item label="宽" prop="width">
              <div class="el-input" style="width: 280px">
                <input v-model={rect.width} type="text" class="el-input__inner" />
              </div>
            </el-form-item>
            <el-form-item label="高" prop="height">
              <div class="el-input" style="width: 280px">
                <input v-model={rect.height} type="text" class="el-input__inner" />
              </div>
            </el-form-item>
          </el-form>
        );
      };
      ELEMENT.MessageBox({
        title: "宽高设置",
        showClose: false,
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        message: fn(this.$createElement),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.$refs.form.validate((valid) => {
              if (valid) {
                done();
              } else {
                return false;
              }
            });
          } else {
            done();
          }
        },
      }).then((action) => {
        if (action === "confirm") {
          let w = Number(rect.width);
          let h = Number(rect.height);
          if (!isNaN(w) && !isNaN(h)) {
            this.deviceChange({
              name: "auto",
              text: "自定义",
              width: w,
              height: h,
            });
          }
        }
      });
    },
    minimapMouseDown(e) {
      if (e.target !== this.$refs.draggable) return false;

      this.isDragging = true;
      // 记录鼠标初始位置
      this.initialX = e.clientX;
      this.initialY = e.clientY;
      const { left, top } = this.minimapBorder;
      this.currentX = left;
      this.currentY = top;
    },
    minimapMouseMove(e) {
      const { isDragging, initialX, initialY, currentX, currentY } = this;
      if (!isDragging) return;
      // 计算新位置
      const offsetX = e.clientX - initialX;
      const offsetY = e.clientY - initialY;
      const rx = offsetX + currentX;
      const ry = offsetY + currentY;
      const { width, height } = this.minimapBorder;

      this.minimapBorder.left = rx;
      this.minimapBorder.left = rx < 0 ? 0 : rx + width > this.minimapWidth ? this.minimapWidth - width : rx;

      this.minimapBorder.top = ry;
      this.minimapBorder.top = ry < 0 ? 0 : ry + height > this.minimapHeight ? this.minimapHeight - height : ry;

      const { scrollWidth, scrollHeight } = this.boxRect;
      const { left, top } = this.minimapBorder;

      const scrollLeft = (left * scrollWidth) / this.minimapWidth;
      const scrollTop = (top * scrollHeight) / this.minimapHeight;
      this.$refs.warp.scrollLeft = scrollLeft;
      this.$refs.warp.scrollTop = scrollTop;
    },
    minimapMouseUp() {
      this.isDragging = false;
      this.initialX = 0;
      this.initialY = 0;
      this.currentX = 0;
      this.currentY = 0;
    },
    minimapDefault(e) {
      if (this.isDragging) e.preventDefault();
    },
  },
};

const mobileDeviceList = [
  { name: "iPhone SE", width: 375, height: 667, divided: true },
  { name: "iPhone XR", width: 414, height: 896 },
  { name: "iPhone 12 Pro", width: 390, height: 844 },
  { name: "Pixel 5", width: 393, height: 851 },
  { name: "Samsung Galaxy S8+", width: 360, height: 740 },
  { name: "Samsung Galaxy S80 Ultra", width: 412, height: 915 },
  { name: "iPad Air", width: 1180, height: 820 },
  { name: "iPad Mini", width: 1024, height: 768 },
  { name: "Surface Pro 7", width: 1368, height: 912 },
];
const pcDeviceList = [
  { name: "1k屏 (16:9)", width: 1920, height: 1080, divided: true },
  { name: "2k屏 (16:9)", width: 2560, height: 1440 },
  { name: "2.5k屏 (16:10)", width: 2560, height: 1600 },
  { name: "4k屏 (16:9)", width: 3840, height: 2160 },
  { name: "2k超宽屏 (21.5:9)", width: 3440, height: 1440 },
  { name: "1k超宽屏 (32:9)", width: 3840, height: 1080 },
  { name: "iPad Air", width: 1180, height: 820 },
  { name: "iPad Mini", width: 1024, height: 768 },
  { name: "Surface Pro 7", width: 1368, height: 912 },
];

function flexible(clientRealSize) {
  let minPx = 320;
  let baseFontSize = 100;
  let docWidth = clientRealSize * 2;
  if (docWidth > 750) {
    docWidth = 750;
  }
  let docEl = window.document.documentElement;
  // 如果比例大于设计稿尺寸不再放大
  if (clientRealSize >= docWidth) {
    docEl.style.fontSize = baseFontSize + "px";
  } else if (clientRealSize <= minPx) {
    docEl.style.fontSize = baseFontSize * (minPx / docWidth) + "px";
  } else {
    docEl.style.fontSize = baseFontSize * (clientRealSize / docWidth) + "px";
  }
}
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/designerContainer.scss";
</style>

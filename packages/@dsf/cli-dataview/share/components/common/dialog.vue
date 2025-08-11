<template>
  <el-dialog ref="dialog" :key="index" class="ds-dialog dsf-dv-dialog" v-bind.sync="$attrs" :class="elClass" :index="index" append-to-body v-on="$listeners">
    <template v-slot:default>
      <div class="dsf-dv-dialog-content" :style="wrapStyle">
        <div class="dsf-dv-dialog-title" :style="titleStyle">
          <div class="dsf-dv-dialog-title_inner" :style="getInnerTitleStyle">{{ title }}</div>
          <div class="dsf-dv-dialog-title_icon" @mousedown.stop @click="close" v-if="styleConfig.closeImgConfig && handleImgSrcStr(styleConfig.closeImgConfig)" :style="iconStyle">
            <img class="img" :src="handleImgSrcStr(styleConfig.closeImgConfig)" :style="getIconImgStyle(styleConfig.closeImgConfig)" />
          </div>
          <div @mousedown.stop class="dsf-dv-dialog-title_icon" @click="close" :style="iconStyle" v-else>
            <DsfIcon :name="styleConfig.iconName || 'guanbi2'" :style="{ fontSize: dsf.dataview.utils.transformPx(styleConfig.iconSize, false) }"></DsfIcon>
          </div>
        </div>
        <DsfVirtualScroll :style="contentHeight" :scrollX="true">
          <slot></slot>
        </DsfVirtualScroll>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
export default {
  name: "DsfDataViewDialog",
  inheritAttrs: false,
  provide() {
    return {
      $dialog: this,
    };
  },
  props: {
    modalColor: {
      type: String,
      default: "",
    },
    index: {
      type: String,
      default: "",
    },
    titleHeight: {
      type: String,
      default: "40",
    },
    noTitle: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    dialogArgs: {
      type: Object,
      default() {
        return null;
      },
    },
    openerVm: {
      type: Object,
      default() {
        return null;
      },
    },
    //弹框样式配置
    styleConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    // 底部left居左,center居中,right居右
    footerAlign: {
      type: String,
      required: false,
    },
    allowDraggable: {
      type: Boolean,
      default: true,
    },
    height: {
      type: String,
      default: "300px",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      closeAnimateClass: "",
    };
  },
  created() {
    this.currentView = null;
    const modalColor = this.modalColor;
    modalColor && document.documentElement.style.setProperty("--dv-v-modal-bg", modalColor);

    //向下兼容
    const styleConfig = this.styleConfig;

    if (!styleConfig.textStyle) {
      let textStyle = createCommonTextStyle();
      Object.keys(textStyle).forEach((key) => {
        if (styleConfig[key]) {
          textStyle[key] = styleConfig[key];
          Reflect.deleteProperty(styleConfig, key);
        }
      });
      this.$set(styleConfig, "textStyle", textStyle);
    }
  },
  computed: {
    wrapStyle() {
      let { background, borderWidth, borderColor, borderRadius } = this.styleConfig;
      let backgroundStyle = dsf.dataview.utils.$backgroundFormat(background);

      borderRadius = dsf.dataview.utils.transformPx(borderRadius);
      borderWidth = dsf.dataview.utils.transformPx(borderWidth);
      let border = `${borderWidth} solid ${borderColor}`;
      return {
        border,
        ...backgroundStyle,
        "border-radius": borderRadius,
      };
    },
    contentHeight() {
      let { padding } = this.styleConfig;
      padding = dsf.dataview.utils.transformArrayPx(padding);
      let height = this.height;
      return {
        padding,
        height,
      };
    },
    getInnerTitleStyle() {
      let { align = "left", vectorAlign, textStyle } = this.styleConfig;
      textStyle = dsf.dataview.utils.transformTextStyle(textStyle);
      let map = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return {
        "justify-content": map[align],
        "align-items": vectorAlign,
        ...textStyle,
      };
    },
    titleStyle() {
      let { titleHeight = 40, titlePadding, titleBackground } = this.styleConfig;
      const height = dsf.dataview.utils.transformPx(titleHeight, false);
      const padding = dsf.dataview.utils.transformArrayPx(titlePadding);
      const background = dsf.dataview.utils.$backgroundFormat(titleBackground);
      return {
        height,
        padding,
        ...background,
      };
    },
    iconStyle() {
      let { iconColor, align = "left", vectorAlign, iconPosition } = this.styleConfig;
      let map = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return {
        color: iconColor,
        "justify-content": map[align],
        "align-items": vectorAlign,
        ...this.transformPosition(iconPosition),
      };
    },
    elClass() {
      let res = [];
      let align = this.footerAlign || dsf.config.setting_public_default_dialog_footer_align;
      if (align && align != "right") {
        res.push("dialog-footer-" + align);
      }
      if (this.$attrs["show-close"]) {
        res.push("show-close");
      }
      if (this.noTitle) {
        res.push("no-title");
      }
      if (this.options.className) {
        res.push(this.options.className);
      }
      if (this.allowDraggable) {
        res.push("ds-dialog-allow-draggable");
      }
      if (this.closeAnimateClass) {
        res.push(this.closeAnimateClass);
      }
      return res;
    },
  },
  methods: {
    handleImgSrcStr(obj) {
      return dsf.dataview.utils.compatiblePathToExtendShowImg(obj.imgObj);
    },
    getIconImgStyle(obj) {
      return {
        width: obj.width + "px",
        height: obj.height + "px",
        ...dsf.dataview.utils.getBgAnimation(obj.imgObj),
      };
    },
    close() {
      this.closeAnimateClass = "data-view-common-pop-dialog-animate-close";
      this.$refs.dialog.handleClose();
    },
    transformPosition(position = [0, 0, 0, 0]) {
      let _position = _.map(position, (v) => {
        return dsf.isNumber(v) ? v + "px" : v;
      });
      // 兼容二开里的样式
      let status = _position.every((v) => {
        return v == "auto";
      });
      if (status) return {};
      return {
        top: _position[0],
        right: _position[1],
        bottom: _position[2],
        left: _position[3],
      };
    },
    dialogSure() {
      this.$emit("dialog-yes");
    },
    updateElInfo() {
      this.windowWidth = document.documentElement.clientWidth;
      this.windowHeight = document.documentElement.clientHeight;
      let boundingClientRect = this.dialogEl[0].getBoundingClientRect();
      this.elTop = boundingClientRect.top;
      this.elRight = boundingClientRect.right;
      this.elBottom = boundingClientRect.bottom;
      this.elLeft = boundingClientRect.left;
      this.elWidth = this.dialogEl.width();
      this.elHeight = this.dialogEl.height();
      this.elBodyHeight = this.dialogEl.find(".el-dialog__body").height();
      if (this.isMarginCenter == undefined) this.isMarginCenter = true;
    },
    draggable({ disable } = {}) {
      if (disable) return;
      this.headEl = this.dialogEl.find(".dsf-dv-dialog-title");

      this.headEl.get(0).addEventListener("mousedown", this.draggableMouseDown);
    },
    dragSize({ disable } = {}) {
      this.sizeHandleEl = $('<div class="el-dialog__size-handle"></div>');
      let sizeHandleEl = this.sizeHandleEl;
      this.dialogEl.append(sizeHandleEl);
      sizeHandleEl.get(0).addEventListener("mousedown", this.dragSizeMouseDown);
    },
    draggableMouseDown(e) {
      this.headEl.css({
        userSelect: "none",
      });
      this.updateElInfo();
      this.moveType = "position";
      this.sizeDownX = e.pageX;
      this.sizeDownY = e.pageY;
      this.isSizeDown = true;
    },
    dragSizeMouseDown(e) {
      this.updateElInfo();
      this.moveType = "size";
      this.sizeDownX = e.pageX;
      this.sizeDownY = e.pageY;
      this.isSizeDown = true;
    },
    bodyMousemove(e) {
      if (!this.moveType) {
        return;
      }
      let distanceX = e.pageX - this.sizeDownX;
      let distanceY = e.pageY - this.sizeDownY;
      if (this.moveType == "size" && (this.isSizeDown && this.elWidth, this.elBodyHeight)) {
        if (this.isMarginCenter) {
          distanceX = distanceX * 2;
        }
        let width = this.elWidth + distanceX;
        let height = this.elBodyHeight + distanceY;
        if (width > this.windowWidth) {
          width = this.windowWidth;
        }
        if (height > this.windowHeight) {
          height = this.windowHeight;
        }
        this.dialogEl.width(width);
        this.dialogEl.find(".el-dialog__body").height(height);
      } else if (this.moveType == "position") {
        let left = this.elLeft + distanceX;
        let top = this.elTop + distanceY;

        if (left > this.windowWidth - this.elWidth) {
          left = this.windowWidth - this.elWidth;
        }
        if (top > this.windowHeight - this.elHeight) {
          top = this.windowHeight - this.elHeight;
        }
        if (left < 0) {
          left = 0;
        }
        if (top < 0) {
          top = 0;
        }
        this.isMarginCenter = false;
        dsf.closeAllPopover();
        this.dialogEl.css({
          left,
          top,
          margin: 0,
        });
      }
    },
    bodyMouseup(e) {
      this.isSizeDown = false;
      this.moveType = null;
      this.elWidth = null;
      this.elHeight = null;
      this.elBodyHeight = null;
      this.headEl.css({
        userSelect: "text",
      });
    },
    destroyOnClose() {
      this.$refs.dialog.key++;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.bodyMousemove = this.bodyMousemove.bind(this);
      this.bodyMouseup = this.bodyMouseup.bind(this);
      document.addEventListener("mousemove", this.bodyMousemove);
      document.addEventListener("mouseup", this.bodyMouseup);
      this.dialogEl = $(this.$refs.dialog.$el).find(".el-dialog");
      if (this.styleConfig.animate?.flag && ["left", "right"].includes(this.styleConfig.position)) {
        this.dialogEl.css({
          marginLeft: this.$attrs.left,
        });
      }
      this.draggable({ disable: !this.allowDraggable });
    });

    // this.dragSize();
  },
  beforeDestroy() {
    if (this.sizeHandleEl && this.sizeHandleEl.length) {
      this.sizeHandleEl.get(0).removeEventListener("mousedown", this.dragSizeMouseDown);
      this.sizeHandleEl.remove();
    }
    if (this.headEl && this.headEl.length) {
      this.headEl.get(0).removeEventListener("mousedown", this.draggableMouseDown);
    }
    this.currentView = null;
  },
  destroyed() {
    document.removeEventListener("mousemove", this.bodyMousemove);
    document.removeEventListener("mouseup", this.bodyMouseup);
    this.draggable({ disable: true });
  },
};
</script>

/*
 * @Description: 页面插槽管理(左上、右上、左下、右下)
 * @Author: shenah
 * @Date: 2023-06-20 15:34:19
 * @LastEditors: shenah
 * @LastEditTime: 2024-07-02 10:24:07
 */

export default {
  data() {
    return {
      slotAttrBase: [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "custom-position",
      ],
    };
  },
  props: {
    isSlotCustomPosition: {
      type: Boolean,
      default: false,
    },
    slotCustomPositionWidth: {
      type: String,
      default: "100px",
    },
    slotCustomPositionHeight: {
      type: String,
      default: "100px",
    },
    slotCustomPositionTop: {
      type: String,
      default: "50%",
    },
    slotCustomPositionLeft: {
      type: String,
      default: "50%",
    },
    slotCustomIsEvent: {
      type: Boolean,
      default: true,
    },
    isSlotTopLeft: {
      type: Boolean,
      default: false,
    },
    slotTopLeftWidth: {
      type: String,
      default: "100px",
    },
    slotTopLeftHeight: {
      type: String,
      default: "60px",
    },
    isSlotTopRight: {
      type: Boolean,
      default: false,
    },
    slotTopRightWidth: {
      type: String,
      default: "100px",
    },
    slotTopRightHeight: {
      type: String,
      default: "60px",
    },
    isSlotBottomLeft: {
      type: Boolean,
      default: false,
    },
    slotBottomLeftWidth: {
      type: String,
      default: "100px",
    },
    slotBottomLeftHeight: {
      type: String,
      default: "60px",
    },
    isSlotBottomRight: {
      type: Boolean,
      default: false,
    },
    slotBottomRightWidth: {
      type: String,
      default: "100px",
    },
    slotBottomRightHeight: {
      type: String,
      default: "60px",
    },
  },
  computed: {
    slotTopLeftStyle() {
      return {
        width: dsf.dataview.utils.transformPx(this.slotTopLeftWidth),
        height: dsf.dataview.utils.transformPx(this.slotTopLeftHeight),
      };
    },
    slotTopRightStyle() {
      return {
        width: dsf.dataview.utils.transformPx(this.slotTopRightWidth),
        height: dsf.dataview.utils.transformPx(this.slotTopRightHeight),
      };
    },
    slotBottomLeftStyle() {
      return {
        width: dsf.dataview.utils.transformPx(this.slotBottomLeftWidth),
        height: dsf.dataview.utils.transformPx(this.slotBottomLeftHeight),
      };
    },
    slotBottomRightStyle() {
      return {
        width: dsf.dataview.utils.transformPx(this.slotBottomRightWidth),
        height: dsf.dataview.utils.transformPx(this.slotBottomRightHeight),
      };
    },
    slotCustomPositionStyle() {
      return {
        width: dsf.dataview.utils.transformPx(this.slotCustomPositionWidth),
        height: dsf.dataview.utils.transformPx(this.slotCustomPositionHeight),
        top: dsf.dataview.utils.transformPx(this.slotCustomPositionTop),
        left: dsf.dataview.utils.transformPx(this.slotCustomPositionLeft),
        pointerEvents: this.slotCustomIsEvent && !this.isDesign ? "none" : "auto"
      };
    },
    slotAttrMap() {
      const map = this.slotAttrBase.map((item) => {
        const upperCaseStr = item.split("-").reduce((str, item) => {
          if (!item.length) {
            return str;
          }
          str += item.charAt(0).toUpperCase() + item.slice(1);
          return str;
        }, "");
        const className = "slot-" + item;
        const isDisplay = "isSlot" + upperCaseStr;
        const nameStyle = "slot" + upperCaseStr + "Style";
        const slotName = item;
        return {
          isDisplay: this[isDisplay],
          nameStyle: this[nameStyle],
          className,
          slotName,
        };
      });
      return map;
    },
  },
};

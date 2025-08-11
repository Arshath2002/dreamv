/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-07-25 13:46:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-28 14:37:18
 */
import svg from "./svg";
export default {
  mixins: [svg],
  props: {
    mainColor: {
      type: String,
      default: "#83bff6",
    },
    viceColor: {
      type: String,
      default: "#00CED1",
    },
    backgroundColor: {
      type: String,
      default: "transparent",
    },
    blink: {
      type: Boolean,
      default: true,
    },
    dur: {
      type: [String, Number],
      default: 0.5,
    },
    margin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    padding: {
      type: Array,
      default: () => [15, 15, 15, 15],
    },
    isVertical: {
      type: Boolean,
      default: true,
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
  },
  computed: {
    controlHeight() {
      let enterAnimateStyle = this.getCommonEnterAnimateStyle;
      let style = {
        ...enterAnimateStyle,
      };
      let { height } = this;
      if (!this.isDesign) {
        style.height = height;
      }
      return style;
    },
    controlStyle() {
      let { margin } = this;
      margin = margin.map((it) => {
        if (dsf.isNumber(it)) {
          it = this.pxToRem(it);
        }
        return it;
      });
      let style = {
        top: `${margin[0]}`,
        right: `${margin[1]}`,
        bottom: `${margin[2]}`,
        left: `${margin[3]}`,
      };
      return style;
    },
    controlInnerStyle() {
      let { padding } = this;
      padding = padding.map((it) => {
        if (dsf.isNumber(it)) {
          it = this.pxToRem(it);
        }
        return it;
      });

      let top = padding[0];
      let right = padding[1];
      let bottom = padding[2];
      let left = padding[3];
      const vertical = this.isVertical ? {} : { display: "flex" };
      let style = {
        top: `${top}`,
        right: `${right}`,
        bottom: `${bottom}`,
        left: `${left}`,
        ...vertical,
      };
      return style;
    },
  },
  created() {},
  mounted() {
    this.resize();
  },
  watch: {
    margin() {
      if (this.isDesign) {
        this.resize();
      }
    },
    comType(code) {
      if (this.isDesign) {
        this.getTypeChangeProps(code);
      }
    },
  },
  methods: {
    getTypeChangeProps(code) {
      let attributes = {
        customType: "border",
        data: {
          code,
          name: code,
        },
      };
      this.$designer.changeSelectComp(attributes, this.slots);
    },
    fade(hex, apl) {
      if (hex && hex.startsWith("#")) {
        return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + apl / 100 + ")";
      } else {
        return hex;
      }
    },
    rgbToHex(rgb) {
      var color = rgb.match(/\d+/g);
      var hex = "#";
      for (var i = 0; i < 3; i++) {
        hex += ("0" + Number(color[i]).toString(16)).slice(-2);
      }
      return hex;
    },
    onResize() {},
  },
};

const defaultTabBgConfig = {
  active: "nav",
};
const defaultTabAcBgConfig = {
  active: "color",
  color: {
    type: "color",
    image: null,
    isTheme: false,
    theme: "main",
    value: "rgb(7, 122, 189)",
  },
};
const defaultPlanAcBgConfig = {
  active: "pattern",
};
const defaultNoSelectStyle = {
  fontSize: "14",
  color: "#dcf0ff",
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  fontFamily: "Microsoft Yahei",
  bgColor: "",
  shadowColor: "",
  borderConfig: {
    // border: "1px solid #077abd",
    commonBorderWidth: 1,
    commonBorderColor: "#077abd",
    commonBorderStyle: "solid",
  },

  // 新增配置
  bgConfig: { ...defaultTabBgConfig },
  margin: ["0", "0", "5", "0"],
  padding: ["4", "12", "4", "12"],
};
const defaultSelectStyle = {
  $fontSize: "",
  color: "#DCF0FF",
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  fontFamily: "Microsoft Yahei",
  bgColor: "#005fc9",
  shadowColor: "",
  borderConfig: {
    // border: "1px solid #077abd",
    commonBorderWidth: 1,
    commonBorderColor: "#077abd",
    commonBorderStyle: "solid",
  },
  // 新增配置
  bgConfig: { ...defaultTabAcBgConfig },
  margin: ["", "", "", ""],
  padding: ["", "", "", ""],
  $borderRadius: ["", "", "", ""],
};
export default {
  design: {
    layout: {
      exclude: ["active"],
    },
  },
  props: {
    navTabWidthType: {
      type: String,
      default: "auto",
    },
    selectOrNoType: {
      type: String,
      default: "default",
    },
    controlNavTabWidth: {
      type: String,
      default: "96px",
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
          {
            name: "header-top-left",
            controls: [],
          },
          {
            name: "header-top-right",
            controls: [],
          },
        ];
      },
    },
    tabStyle: {
      type: String,
      default: "",
      desc: "组件风格",
    },
    navPosition: {
      type: String,
      default: "center",
      desc: "导航栏位置",
    },
    tabPosition: {
      type: String,
      default: "top",
      desc: "组件位置",
    },
    tabActive: {
      type: String,
      default: "",
    },
    contentPadding: {
      type: Array,
      default: ["0", "0", "0", "0"],
    },
    // 兼容之前的配置 不要移入noSelectStyle
    borderRadius: {
      type: Array,
      default: ["0", "0", "0", "0"],
    },
    selectStyle: {
      type: Object,
      default: () => ({
        ...defaultSelectStyle,
      }),
    },
    noSelectStyle: {
      type: Object,
      default: () => ({
        ...defaultNoSelectStyle,
      }),
    },
    planStyle: {
      type: Object,
      default: {
        ...defaultPlanAcBgConfig,
      },
    },
  },
  data() {
    return {
      activeName: this.tabActive,
      // 组件类型
      componentType: "navTab",
    };
  },
  computed: {
    activeNames() {
      let arr = [];
      let navSlots = this.navSlots;
      for (let i = 0; i < navSlots.length; i++) {
        let tab = navSlots[i];
        if (this.isDesign) {
          arr.push(tab.name);
        } else {
          let v = this.$expressParams();
          if (!this.$eval(tab.disable, v) && !this.$eval(tab.isHide, v)) {
            arr.push(tab.name);
          }
        }
      }
      return arr;
    },
    navSlots: {
      get() {
        return this.slots.filter(
          (it) =>
            !["default", "header-top-left", "header-top-right"].includes(
              it.name
            )
        );
      },
    },
  },
  watch: {
    activeName(val) {
      this.$nextTick(() => {
        this.$page && dsf.resizeComponent(this.$page);
        this.loadChangeEvents(val);
      });
    },
  },
  created() {
    this.initProps();
    this.compatibleProp();
    if (this.isDesign) {
      let navSlots = this.navSlots;
      if (navSlots.length == 0) {
        let v = this.slots;
        for (let i = 0; i < 2; i++) {
          v.push({
            title: "Tab" + (i + 1),
            name: "tab" + (i + 1),
            disable: "false",
            isHide: "false",
            badge: null,
            lazy: "true",
            controls: [],
          });
        }
        this.slots = v;
      }
    }
    if (!this.tabActive || this.isDesign) {
      this.activeName = this.activeNames[0];
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleEventScope();
      this.resizeHeight();
    });
  },
  methods: {
    // 兼容之前保存的组件
    initProps() {
      let props = [
        {
          name: "noSelectStyle",
          default: defaultNoSelectStyle,
        },
        {
          name: "selectStyle",
          default: defaultSelectStyle,
        },
      ];
      _.each(props, (item) => {
        let obj = { ...item.default, ...this[item.name] };
        for (let key in obj) {
          this.$set(this[item.name], key, obj[key]);
        }
      });
    },
    compatibleProp() {
      // 兼容border
      this.compatibleBorderProp();
      this.compatibleEventRelativeDeal();
      if (typeof this.$attrs.isControlNavTabWidth === "boolean") {
        this.navTabWidthType = this.$attrs.isControlNavTabWidth
          ? "fixed"
          : "auto";
        this.noSelectStyle.fontFamily = this.$attrs.controlNavTabFontFamily;
        this.selectStyle.fontFamily = this.$attrs.controlNavTabFontFamily;
        this.$emit("update:navTabWidthType", this.navTabWidthType);
        this.$emit("update:noSelectStyle", this.noSelectStyle);
        this.$emit("update:selectStyle", this.selectStyle);
      }
    },
    compatibleBorderProp() {
      // 未选中的样式
      this.borderManage(this.noSelectStyle.borderConfig, {
        borderWidthField: "borderWidth",
        isBorderSolidField: "isBorderSolid",
        borderColorField: "borderColor",
      });
      //选中
      this.borderManage(this.selectStyle.borderConfig, {
        borderWidthField: "$borderWidth",
        isBorderSolidField: "$isBorderSolid",
        borderColorField: "borderColor",
      });
    },
    borderManage(obj, fieldObj) {
      if (
        typeof obj[fieldObj.isBorderSolidField] === "boolean" ||
        obj[fieldObj.isBorderSolidField] === ""
      ) {
        let borderWidth = obj[fieldObj.borderWidthField];
        let isBorderSolid = obj[fieldObj.isBorderSolidField];
        let borderColor = obj[fieldObj.borderColorField];
        let borderStyle = isBorderSolid ? "solid" : "dashed";
        let style = {
          commonBorderWidth: borderWidth,
          commonBorderColor: borderColor,
          commonBorderStyle: borderStyle,
        };
        if (parseInt(borderWidth)) {
          style.border = `${borderWidth}px ${borderStyle} ${borderColor}`;
        }
        obj.borderConfig = style;
        delete obj.borderWidth;
        delete obj.isBorderSolid;
        delete obj.borderColor;
      }
    },
    compatibleEventRelativeDeal() {
      let eventKeys = ["click", "change"];
      let events = {};
      eventKeys.forEach((key) => {
        if (this.eventRelativeDeal[key]) {
          events[key] = this.eventRelativeDeal[key];
        } else {
          events[key] = {
            relatives: [],
            fn: "",
          };
        }
      });
      this.$emit("update:eventRelativeDeal", events);
    },
    getTabStyle(d, index) {
      let { selectStyle, noSelectStyle } = this;
      if (this.activeName === d.name) {
        // 选中样式
        // 兼容之前的配置：换个命名，避免之前配过的样式污染
        let fontSize = selectStyle.$fontSize || noSelectStyle.fontSize,
          borderWidth =
            selectStyle.borderConfig.commonBorderWidth === ""
              ? noSelectStyle.borderConfig.commonBorderWidth
              : selectStyle.borderConfig.commonBorderWidth,
          borderStyle =
            selectStyle.borderConfig.commonBorderStyle ||
            noSelectStyle.borderConfig.commonBorderStyle,
          borderColor =
            selectStyle.borderConfig.commonBorderColor ||
            noSelectStyle.borderConfig.commonBorderColor;
        if (!selectStyle.borderConfig.border) {
          borderWidth = 0;
        }
        return {
          ...this.getTabTypeStyle(selectStyle, index),
          fontSize: dsf.dataview.utils.transformPx(fontSize),
          border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        };
      } else {
        return {
          ...this.getTabTypeStyle(noSelectStyle, index, false),
        };
      }
    },
    getTabTypeStyle(config, index, flag = true) {
      let { noSelectStyle } = this;
      let fontSize = config.fontSize || noSelectStyle.fontSize,
        color = config.color || noSelectStyle.color,
        shadowColor = config.shadowColor || noSelectStyle.shadowColor,
        borderWidth =
          (config.borderConfig.border &&
            config.borderConfig.commonBorderWidth) ||
          (noSelectStyle.borderConfig.border &&
            noSelectStyle.borderConfig.commonBorderWidth),
        borderStyle =
          config.borderConfig.commonBorderStyle ||
          noSelectStyle.borderConfig.commonBorderStyle,
        borderColor =
          config.borderConfig.commonBorderColor ||
          noSelectStyle.borderConfig.commonBorderColor,
        bgConfig = config.bgConfig || noSelectStyle.bgConfig,
        margin = this.isEmptyArr(config.margin)
          ? config.margin
          : noSelectStyle.margin,
        padding = this.isEmptyArr(config.padding)
          ? config.padding
          : noSelectStyle.padding,
        borderRConfig = flag ? config.$borderRadius : this.borderRadius;
      let showTab = this.slots.slice(3).filter((tab) => {
        return this.isHide(tab) !== true;
      });
      borderWidth = borderWidth ? borderWidth : 0;
      let borderRadius = 0;
      if (this.tabPosition == "top") {
        if (margin[1] != 0 || margin[3] != 0) {
          borderRadius = borderRConfig.join("px ") + "px";
        } else {
          if (index === 0) {
            borderRadius = `${dsf.dataview.utils.transformPx(
              borderRConfig[0]
            )} 0 0 ${dsf.dataview.utils.transformPx(borderRConfig[3])}`;
          }
          if (index === showTab.length - 1) {
            borderRadius = `0 ${dsf.dataview.utils.transformPx(
              borderRConfig[1]
            )} ${dsf.dataview.utils.transformPx(borderRConfig[2])} 0`;
          }
        }
      } else {
        if (margin[0] != 0 || config.borderWidth || margin[2] != 0) {
          borderRadius = borderRConfig.join("px ") + "px";
        } else {
          if (index === 0) {
            borderRadius = `${dsf.dataview.utils.transformPx(
              borderRConfig[0]
            )} ${dsf.dataview.utils.transformPx(borderRConfig[1])} 0 0 `;
          }
          if (index === showTab.length - 1) {
            borderRadius = `0  0 ${dsf.dataview.utils.transformPx(
              borderRConfig[2]
            )} ${dsf.dataview.utils.transformPx(borderRConfig[3])}`;
          }
        }
      }
      let style = {
        color,
        borderRadius,
        fontSize: dsf.dataview.utils.transformPx(fontSize),
        fontFamily: config.fontFamily || noSelectStyle.fontFamily,
        fontWeight: config.fontWeight || noSelectStyle.fontWeight,
        fontStyle: config.fontStyle || noSelectStyle.fontStyle,
        textDecoration: config.textDecoration || noSelectStyle.textDecoration,
        border: `${dsf.dataview.utils.transformPx(
          borderWidth
        )} ${borderStyle} ${borderColor}`,
        boxShadow: shadowColor ? `inset 0 0 5px 2px ${shadowColor}` : "none",
        padding: padding.join("px ") + "px",
        margin: margin.join("px ") + "px",
        ...this.dvBackgroundFormat(bgConfig),
      };
      if (this.navTabWidthType === "fixed") {
        style["width"] = dsf.dataview.utils.transformPx(
          this.controlNavTabWidth
        );
      }
      return style;
    },
    isEmptyArr(arr) {
      if (!arr) return false;
      return arr.some((it) => {
        if (it !== "") {
          return true;
        }
      });
    },
    isDisable(tab) {
      if (this.isDesign) {
        return false;
      }
      if (tab.disable) {
        let v = this.$expressParams();
        return this.$eval(tab.disable, v);
      }
      return false;
    },
    isHide(tab) {
      if (!this.isDesign) {
        let v = this.$expressParams();
        return this.$eval(tab.isHide, v);
      }
      return false;
    },
    isLazy(tab) {
      if (this.isDesign) {
        return false;
      } else {
        let v = this.$expressParams();
        return this.$eval(tab.lazy, v);
      }
    },
    resizeHeight() {
      if (this.$parent.__desContext__) {
        this.$parent.__desContext__.height = this.height;
      }
    },
    tabChange(obj) {
      // 作为二次开发切换选中tab
      this.activeName = obj.name;
    },
    tabClick(tab, event) {
      // 二次开发tab选中事件监听（第一次选中和代码触发时不会调用）
      if (this.$listeners["interInterfaceData"]) {
        this.$dispatch("interInterfaceData", { tab: tab, vm: this });
      }
      this.$emit("tab-click", tab);
      this.loadClickEvents(tab);
      this.$nextTick(() => {
        //强制更新页面尺寸,解决需要动态计算宽高的组件在tab未点击隐藏时尺寸计算不正确的情况
        dsf.resizeComponent(this);
      });
    },
    tabRemove(tab, event) {
      // 二次开发tab被删除事件
      // tab.index(索引)
      // tab.name(id)
    },
    renderTabContent(obj) {
      // 刷新某一个内容区域
      let name = obj && obj.name ? obj.name : this.activeName;
      let slot = _.find(this.slots, (s) => s.name === name);
      slot.isHide = "true";
      this.$nextTick(() => {
        slot.isHide = "false";
      });
    },
    reloadData() {
      this.$childrenReloadData();
    },
  },
};

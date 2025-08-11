/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-07-27 11:31:25
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-23 14:54:42
 */
import { utilsHandleScope, utilsHandleParseCode } from "_dataview/output/utils/event";
import { createCommonAnimateCss, createBoxShadow } from "_dataview/output/config/commonConfig";
export default {
  mixins: [$mixins.control],
  props: {
    boxOutsetShadowConfig: {
      type: Object,
      default: () => createBoxShadow(),
    },
    boxInsetShadowConfig: {
      type: Object,
      default: () => createBoxShadow(true),
    },
    enterAnimate: {
      type: Object,
      default: () => createCommonAnimateCss(),
    },
    //是否是大屏组件
    isDataViewControl: {
      type: Boolean,
      default: true,
    },
    //伪代码方法对象-字符串
    executeFnScope: {
      type: String,
      default: "",
    },
    //伪代码中文组件映射对象
    executeFnComp: {
      type: Object,
      default() {
        return {};
      },
    },
    //伪代码对应组件名字
    fakeCodeName: {
      type: String,
      default() {
        return "";
      },
    },
    fontSize: {
      type: [String, Number],
      default: 16,
    },
    fontWeight: {
      type: [String, Number],
      default: 500,
    },
    excelData: {
      type: Array,
      default: () => [],
    },
    padding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    margin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    height: {
      type: String,
      default: "100%",
    },
    width: {
      type: String,
      default: "100%",
    },
  },
  inject: {
    $frame: {
      default: null,
    },
  },
  watch: {
    height: {
      handler(v) {
        if (this.isDesign) {
          let height = v;
          if (!v) {
            height = "auto";
          }
          if (dsf.isNumber(height) || /^\d+$/g.test(height)) {
            height += "px";
          }
          this.$dispatch("design-height-change", height);
        }
        this.$nextTick(() => {
          this.resize && this.resize();
        });
      },
      immediate: true,
    },
    width: {
      handler(v) {
        if (this.isDesign) {
          let width = v;
          if (!v) {
            width = "auto";
          }
          if (dsf.isNumber(width) || /^\d+$/g.test(width)) {
            width += "px";
          }
          this.$dispatch("design-width-change", width);
        }
        this.$nextTick(() => {
          this.resize && this.resize();
        });
      },
      immediate: true,
    },
    margin: {
      handler(v) {
        if (this.isDesign) {
          let margin = v;
          let marginTop = 0;
          let marginBottom = 0;
          if (Array.isArray(margin)) {
            marginTop = dsf.dataview.utils.transformPx(margin[0]);
            marginBottom = dsf.dataview.utils.transformPx(margin[2]);
          } else {
            marginTop = dsf.dataview.utils.transformPx(margin);
            marginBottom = dsf.dataview.utils.transformPx(margin);
          }

          this.$dispatch("design-margin-change", `${marginTop} 0 ${marginBottom} 0`);
        }
      },
      immediate: true,
    },
  },
  computed: {
    // 组件是否运行在大屏页面内部
    isRunningDataViewPage() {
      if (this.isDesign) {
        return this.$designer && this.$designer.layoutType === "dataview";
      } else if (this.$page) {
        return this.$page.pageType === "dataview";
      }
      return false;
    },
    getBoxShadowConfig() {
      return (varFlag) => {
        const shadows = [this.boxOutsetShadowConfig.flag && this.boxOutsetShadowConfig.boxShadow, this.boxInsetShadowConfig.flag && this.boxInsetShadowConfig.boxShadow].filter(Boolean);
        let boxShadow = shadows.join(",");
        return shadows.length ? (varFlag ? { "--data-view-box-shadow": boxShadow } : { boxShadow }) : {};
      };
    },
    dvComp() {
      return this;
    },
    fontStyle() {
      return {
        fontSize: this.transFontSize,
      };
    },
    transFontSize() {
      return dsf.dataview.utils.transformPx(this.fontSize);
    },
    controlHeight() {
      let { height, width } = this;
      width = dsf.dataview.utils.transformPx(width);
      if (!this.isDesign) {
        return {
          height: dsf.dataview.utils.transformPx(height),
          width,
        };
      }
      return {
        width,
      };
    },
    marginAndPadding() {
      let { padding: paddingArray, margin: marginArray } = this;
      const padding = dsf.dataview.utils.transformArrayPx(paddingArray);

      let margin = dsf.dataview.utils.transformArrayPx(marginArray);
      return {
        padding,
        margin,
      };
    },
    // 新增的通用背景图片为变量
    controlOuterStyle() {
      let controlStyle = this.controlStyle;

      const filterBackGroundAttr = function (style, flag) {
        const keys = Object.keys(style);
        const imageAttr = ["background", "radius", "animation", "borderRadius"];
        const filteredKeys = keys.filter((key) => (flag ? imageAttr.some((str) => key.includes(str)) : imageAttr.every((str) => !key.includes(str))));
        return filteredKeys.reduce((obj, key) => {
          obj[key] = style[key];
          return obj;
        }, {});
      };

      let overStyle = filterBackGroundAttr(controlStyle, false);
      let background = {};
      if (this.controlBackgroundConfig) {
        background = this.dvBackgroundFormat(this.controlBackgroundConfig, {
          isBgInfoVar: true,
        });
      }
      return {
        ...overStyle,
        ...background,
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
    },
    controlStyle() {
      let { height, width, marginAndPadding, margin: marginArray, fontWeight, controlBackgroundConfig } = this;
      let { margin, padding } = marginAndPadding;
      if (dsf.isNumber(height) || /^\d+$/g.test(height)) {
        height += "px";
      }
      if (dsf.isNumber(width) || /^\d+$/g.test(width)) {
        width += "px";
      }
      let background = {};
      if (controlBackgroundConfig) {
        background = this.dvBackgroundFormat(controlBackgroundConfig);
      }
      if (this.isDesign) {
        marginArray = [0, marginArray[1], 0, marginArray[3]];
        return {
          margin: dsf.dataview.utils.transformArrayPx(marginArray),
          padding,
          width,
          fontWeight: fontWeight,
          boxSizing: "border-box",
          ...background,
        };
      }

      return {
        width,
        ...marginAndPadding,
        height,
        fontWeight,
        boxSizing: "border-box",
        ...background,
      };
    },
    getCommonEnterAnimateStyle() {
      try {
        this.resetEnterAnimate();
        return dsf.dataview.utils.getAnimateLibStyle(this.enterAnimate, this.$page.enterAnimate, this.isDesign);
      } catch (error) {
        return {};
      }
    },
  },
  data() {
    return {
      // 伪代码事件相关作用域
      eventScope: {},
      //当前组件值
      currentComponentData: {},
      loadFileList: [], // 加载文件对象
      //字数超长策略
      showFeildRules: [
        {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
        {
          overflow: "hidden",
          display: "-webkit-box",
          textOverflow: "ellipsis",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": 2,
        },
      ],
    };
  },
  created() {
    if (this.isDesign) {
      if (!this.fakeCodeName) {
        let it = this;
        //组件名字
        let ctrlName = it.ctrlName;
        let ctrlType = it.ctrlType.split(".")[1];
        //组件ref的后缀
        let sign = it.caption.substr(ctrlType.length);
        let dataviews = window.$components.dataview;
        let chineseName = dataviews[ctrlName].ctrlCaption;
        let name = `${chineseName}${sign}`;
        this.$emit("update:fakeCodeName", name);
      }
    }

    this.setModelStyle();
  },
  methods: {
    /**
     * 设置模型来的风格
     */
    setModelStyle() {
      // 模型组件风格
      if (this.$page && this.$page.isModel && this.$page.theme) {
        const styleTheme = this.$page.theme;
        import(/* webpackChunkName: "dataview_theme",webpackMode: "lazy" */ "_dataview/output/dataviewStyle/index.js").then((res) => {
          let styles = res.default.concat(dsf.dataview.extendStyle);
          let theme = styles.find((it) => it.value === styleTheme);
          if (theme) {
            this.handlerCurrentStyleConfig && this.handlerCurrentStyleConfig(theme);
          }
        });
      }
    },

    /**
     * @description: 解析大屏设计器等特殊变量
     * @param {*} str 传入的字符串
     * @return {*}
     */
    dataviewAnalysisSpecialVar(str) {
      if (this.isDesign) {
        return str;
      }
      try {
        let processedStr = str.replace(/@\[([^\]]*)\]/g, (match, content) => {
          // 更复杂的替换逻辑
          content = content.replace("路径参数", "queryString");
          content = content.replace("全局参数", "$dataview");
          content = content.replace("窗口变量", "$vm");
          content = content.replace("弹窗参数", "$dialogArgs");
          return "@[" + content + "]";
        });
        let obj = {
          queryString: this.queryString || {},
          $dataview: this.$vm && this.$vm.$dataview ? this.$vm.$dataview : {},
          $vm: this.$vm ? this.$vm : {},
          $dialogArgs: this.$vm && this.$vm.$dialogArgs ? this.$vm.$dialogArgs : {},
          cookie: dsf.cookies.get(),
          sessionStorage: sessionStorage,
          localStorage: localStorage,
        };
        return this.$replace(processedStr, obj);
      } catch (error) {
        console.log("dataviewAnalysisSpecialVar", error);
        return str;
      }
    },
    // 获取组件样式
    getComponentStyle() {
      return this.$designer.attributesGroup
        .filter((it) => !/数据|属性|插槽/.test(it.name))
        .reduce(
          (obj, group) => {
            group.attributes.forEach((attr) => {
              const bindKey = attr.bindControlAttr;
              if (bindKey && !attr.noCopy) {
                if (/\./.test(bindKey)) {
                  // 处理 bindControlAttr 中嵌套子属性 a.b.c 的情况
                  obj[bindKey] = bindKey.split(".").reduce((o, k) => (o ? o[k] : null), this._props);
                } else {
                  obj[bindKey] = this._props[bindKey];
                }
              } else if (attr.showType === "dv_margins_group") {
                attr.config.options.forEach((it) => {
                  obj[it.bindControlAttr] = this._props[it.bindControlAttr];
                });
              }
            });
            return obj;
          },
          { ctrlName: this._props.ctrlName }
        );
    },
    // 设置组件样式
    setComponentStyle(groups, props) {
      groups.forEach((group) => {
        group.attributes.forEach((attr) => {
          if (attr.bindControlAttr && !attr.noCopy) {
            this.updateComponentStyle(attr.bindControlAttr, null, props);
          } else if (attr.showType === "dv_margins_group") {
            attr.config.options.forEach((it) => {
              this.updateComponentStyle(it.bindControlAttr, null, props);
            });
          }
        });
      });
    },
    // 复制组件样式
    copyComponentStyle() {
      return { _props: this.getComponentStyle() };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        const { backgrounds = [] } = config;
        groups = groups.filter((it) => /布局|背景|边框设置|入场动画/.test(it.name));
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    // 更新组件样式
    updateComponentStyle(key, value, props, isTopLevel = true) {
      // 通过 this._props 更新样式
      if (typeof props === "object" && value === null) {
        value = props[key];
      }
      if (value === undefined) return;
      if (/\./.test(key)) {
        key.split(".").reduce((obj, k, i, arr) => {
          if (i + 1 == arr.length && obj) {
            this.updateComponentStyle(k, value, obj, false);
          } else {
            return obj ? obj[k] : undefined;
          }
        }, this._props);
      } else {
        props = props || this._props;
        if (typeof props[key] === "object" && typeof value === "object") {
          if (Array.isArray(props[key])) {
            value = dsf.mix([], props[key], value);
          } else {
            value = dsf.mix({}, props[key], value);
          }
        }
        if (isTopLevel) {
          this.$emit("update:" + key, value);
        } else {
          this.$set(props, key, value);
        }
      }
    },
    resetEnterAnimate() {
      // 这里是为了设计器时切换动画以及时间等好触发
      if (this.isDesign) {
        if (this.$el) {
          this.$el.style["animation-name"] = "none";
          this.$nextTick(() => {
            setTimeout(() => {
              this.$el.style["animation-name"] = this.enterAnimate.animation[0]; // 然后重新设置动画名称
            }, 20); // 等待下一个DOM更新周期
          });
        }
      }
    },
    handlePositionArrPx(arr) {
      if (Array.isArray(arr)) {
        let top = "auto";
        let right = "auto";
        let bottom = "auto";
        let left = "auto";
        if (arr.length == 2) {
          left = dsf.dataview.utils.transformPx(arr[0]);
          top = dsf.dataview.utils.transformPx(arr[1]);
        } else {
          top = dsf.dataview.utils.transformPx(arr[0]);
          right = dsf.dataview.utils.transformPx(arr[1]);
          bottom = dsf.dataview.utils.transformPx(arr[2]);
          left = dsf.dataview.utils.transformPx(arr[3]);
        }

        return {
          top,
          right,
          bottom,
          left,
        };
      }
      return {};
    },
    // 获取页面值单位转化列表
    addUnits(data) {
      let obj = dsf.dataview.units;
      let list = Object.keys(obj).map((key) => ({
        text: obj[key],
        value: key,
      }));
      list.unshift({
        text: "无",
        value: "",
      });
      data.dictionary = list;
    },
    //获取页面字体列表
    addFonts(data) {
      data.dictionary = dsf.dataview.designer.fonts;
    },
    //获取select下拉框主题
    addSelectThemes(data) {
      data.dictionary = dsf.dataview.selectThemes;
    },
    // 获取大屏弹窗标识符列表
    addDvDialogIds(data) {
      const dialogConfig = this.$page ? this.$page.dialogConfig : this.dialogConfig;
      const dictionary = [];
      if (!dialogConfig) return false;
      dialogConfig.forEach((it) => {
        dictionary.push({
          text: it.id,
          value: it.id,
        });
      });
      data.dictionary = dictionary;
    },
    // 兼容src统一使用bgSettingExtend的格式
    compatiblePathToObj(obj, active = "custom") {
      return dsf.dataview.utils.compatiblePathToExtendImg(obj, active);
    },
    // 兼容src并且进行反显
    handleImgSrcStr(obj) {
      return dsf.dataview.utils.compatiblePathToExtendShowImg(obj);
    },
    //单位换算
    transformUnit() {
      return dsf.dataview.utils.transformUnit(...arguments);
    },
    getBorderCss(width, isSolid, color) {
      let border = `${dsf.dataview.utils.transformPx(width)} ${isSolid ? "solid" : "dashed"} ${color}`;
      return border;
    },
    judgeMargin(arr) {
      if (!Array.isArray(arr)) {
        return false;
      }
      if (arr.length) {
        return arr.every((item) => item !== undefined && item !== null);
      }
      return false;
    },
    // 针对设置(bgLayoutArraySetting)属性提取,返回有的属性
    abstractBgArrAttr(obj) {
      // 单个背景
      let bgObj = obj?.bgImgObj || {};
      let background = this.dvBackgroundFormat(bgObj) || {};
      // 单个属性
      let borderRadius = obj?.borderRadius || "";
      let bgMargin = obj?.margin || "";
      let bgPadding = obj?.padding || "";
      let bgWH = obj?.wH || [];
      let bgRelative = obj?.relative;

      let bgRelativeObj = this.handlePositionArrPx(bgRelative);
      let bgRelativeStyle = {
        top: bgRelativeObj.top,
        left: bgRelativeObj.left, // 因为这里只取了前面两个所以用right的来变成left
        position: "relative",
      };
      let style = {
        ...background,
        ...bgRelativeStyle,
      };
      if (this.judgeMargin(borderRadius)) {
        style.borderRadius = dsf.dataview.utils.transformArrayPx(borderRadius);
      }
      if (this.judgeMargin(bgMargin)) {
        style.margin = dsf.dataview.utils.transformArrayPx(bgMargin);
      }
      if (this.judgeMargin(bgPadding)) {
        style.padding = dsf.dataview.utils.transformArrayPx(bgPadding);
      }
      if (bgWH.length) {
        if (bgWH[0]) {
          style.width = dsf.dataview.utils.transformPx(bgWH[0]);
        }
        if (bgWH[1]) {
          style.height = dsf.dataview.utils.transformPx(bgWH[1]);
        }
      }
      return style;
    },
    // 获取当前选择风格配置项
    handlerCurrentStyleConfig(theme) {
      if (theme) {
        let style = theme.style;
        let styleMapKey = this.styleMapKey;
        this.beforeChangeStyle && this.beforeChangeStyle();
        if (style[styleMapKey]) {
          this.styleConfigCallback(dsf.mix(true, {}, style[styleMapKey]), theme);
        }
      }
    },
    styleConfigCallback(options, theme) {
      const keys = Object.keys(this.$props);
      Object.keys(options).forEach((keyName) => {
        if (keys.includes(keyName)) {
          if (/backgroundConfig$/gi.test(keyName)) {
            let background = options[keyName];
            if (["custom", "pattern"].includes(background.active) && background[background.active]) {
              let image = background[background.active].image;

              background[background.active].image = image;
            }
            this.$emit(`update:${keyName}`, _.cloneDeep(background));
          } else {
            let nowVal = _.cloneDeep(options[keyName]);
            let oldVal = _.cloneDeep(this[keyName]);
            if (typeof options[keyName] === "function") {
              nowVal = options[keyName].call(this, theme);
            }
            if (_.isObject(nowVal)) {
              const res = dsf.mix(true, Array.isArray(nowVal) ? [] : {}, oldVal, nowVal);
              this.$emit(`update:${keyName}`, res);
            } else {
              this.$emit(`update:${keyName}`, nowVal);
            }
          }
        }
      });
      this.$nextTick(() => {
        this.afterChangeStyle && this.afterChangeStyle();
      });
    },
    // 相关事件作用域处理
    handleEventScope() {
      //脱离大屏独立运行组件
      if (!this.isRunningDataViewPage) return false;

      if (this.executeFnScope && !this.isDesign) {
        this.eventScope = utilsHandleScope(this, this.executeFnScope);
      }
    },
    // 组件伪代码统一入口
    handleCommonEmit(code, data, evt = {}) {
      //脱离二开独立运行组件
      if (!this.isRunningDataViewPage) return false;

      if (!this.isDesign && code) {
        try {
          let page = this.$page.$vm;
          //给作用域注入 vm page data
          this.eventScope.vm = this;
          this.eventScope.page = page;
          this.eventScope.data = data;
          let query = this.$route.query;
          //在viewpart中打开页面-gis运行一张图
          if (page.$frame) {
            let localParams = page.$frame.localParams;
            query = { ...query, ...localParams };
          }
          this.eventScope["全局参数"] = page.$dataview;
          this.eventScope["路径参数"] = query;
          this.eventScope["事件对象"] = evt.currentTarget || evt.target || {};
          this.eventScope["eventTarget"] = evt.currentTarget || evt.target || {};

          let callback = utilsHandleParseCode(code);
          callback.call(this, this.eventScope);
        } catch (error) {
          console.warn("伪代码执行失败", error);
        }
      }
    },

    //请求
    handleHTTP(url, method = "get", params = null, config = null) {
      return this.$http[method](this.$replace(url, this.local), params, config);
    },
    //显示
    handleShow() {
      this.$el.style.display = "block";
      if (typeof this.resize == "function") {
        this.$nextTick(this.resize);
      }
    },
    //隐藏
    handleHidden() {
      this.$el.style.display = "none";
      if (typeof this.resize == "function") {
        this.$nextTick(this.resize);
      }
      return this;
    },
    // 切换显示状态
    toggleShow() {
      const el = this.$el;
      if ($(el).is(":hidden")) {
        this.$el.style.display = "block";
      } else {
        this.$el.style.display = "none";
      }
      if (typeof this.resize == "function") {
        this.$nextTick(this.resize);
      }
    },
    //获取组件当前值
    handleGetValue() {
      return this.currentComponentData;
    },
    //回去组件原始值
    handleGetOriginValue() {
      return this.originComponentData;
    },
    //公共页面事件
    handleTurnPage(url, isNew) {
      if (!url) return false;
      let viewPartVm = this.$frame;
      if (viewPartVm) {
        // 证明套了一层内嵌视图,取消请求
        this.cancelDvAllRequest();
        viewPartVm.pathChange(url);
        return this;
      }
      let target = url;
      target = this.dataviewAnalysisSpecialVar(url);
      url = this.dataviewAnalysisSpecialVar(url);
      //内部
      let isOut = false;
      if (dsf.isString(url)) {
        if (url.startsWith("http")) {
          isOut = true;
        } else {
          url = url.replace(/^[\/]?#/g, "");
          if (!url.startsWith("/")) {
            url = "/" + url;
          }
        }
        target = {
          path: url,
        };
      }
      if (isNew) {
        if (isOut) {
          this.cancelDvAllRequest();
          dsf.layer.openWindow(target.path);
        } else {
          this.cancelDvAllRequest();
          dsf.layer.openWindow(`/page.html#${target.path}`);
        }
      } else {
        if (isOut) {
          this.cancelDvAllRequest();
          window.location.href = target.path;
        } else {
          this.cancelDvAllRequest();
          this.$router.push(target);
        }
      }

      return this;
    },
    //打开大屏弹框
    handleOpenDataViewDialog(url, width = "50%", height = "500px", title = "", type, dialogArgs = {}, className = "") {
      let _width = width;
      let _height = height;
      let _title = title;
      let _type = type;
      let _dialogArgs = dialogArgs;
      let _className = className;
      let _properties = {};

      if (dsf.isObject(url)) {
        const { width = "50%", height = "500px", title = "", type, dialogArgs = {}, className = "", ...properties } = url;
        _width = width;
        _height = height;
        _title = title;
        _type = type;
        _dialogArgs = dialogArgs;
        _className = className;
        _properties = properties;
      }
      const dialogConfig = this.$page ? this.$page.dialogConfig : this.dialogConfig;
      if (!dialogConfig) return false;
      let style = dialogConfig.find((it) => it.id === _type);
      if (!style) {
        style = dialogConfig[0];
      }
      let animateClass = style.animate && style.animate.flag ? style.animate.class : "";
      let options = {
        ..._properties,
        title: _title,
        params: {
          path: "",
        },
        width: _width,
        height: _height,
        className: [_className, "data-view-common-pop-dialog-animate", animateClass],
        dialogArgs: _dialogArgs,
        modal: style.modal,
        modalColor: style.modalColor,
      };
      url = this.dataviewAnalysisSpecialVar(url);
      if (dsf.isString(url)) {
        if (!url.startsWith("/")) {
          url = "/" + url;
        }
        url = url.replace(/^\/#\/pc/g, "");
        options.params.path = url;
      }
      import(/* webpackChunkName: "dataview_layer" */ "_dataview/output/utils/layer.js").then((res) => {
        let openDialog = res.default.openDialog;
        openDialog.call(this, options, style);
      });
    },
    // 伪代码关闭悬浮框
    handleClosePageDVPopup(url) {
      if (!url || !dsf.isString(url)) return false;
      if (url) {
        // 处理路径
        if (!url.startsWith("/")) {
          url = "/" + url;
        }
        url = url.replace(/^\/#\/pc/g, "");
        const path = url.split("?")[0];
        this.handleCloseDVPopup(path);
      } else {
        this.handleCloseDVPopup();
      }
    },
    // 打开悬浮框
    handleOpenDVPopup(referenceDom, url, width = "50%", height = "500px", type, manual = false, config = {}) {
      let { placement, offsetFormat, arrowStyle } = config;
      //关闭掉需要自动关闭的弹框
      this.handleCloseDVPopup();
      if (!url || !dsf.isString(url)) return false;
      url = this.dataviewAnalysisSpecialVar(url);
      const popupConfig = this.$page ? this.$page.popupConfig : this.popupConfig;
      const popupDialogs = this.$page ? this.$page.popupDialogs : this.popupDialogs;

      width = dsf.dataview.utils.transformPx(width, false);
      height = dsf.dataview.utils.transformPx(height, false);
      if (!popupConfig) return false;

      // 获取样式
      let style = popupConfig.find((it) => it.id === type);
      if (!style) {
        style = popupConfig[0];
      }

      let { placement: stylePlacement, relativeStyle, arrow, offsetFormat: styleOffsetFormat, id, ...styleConfig } = style;

      placement = placement || stylePlacement;
      offsetFormat = offsetFormat || styleOffsetFormat;

      arrowStyle = arrowStyle || { size: arrow.size };
      const hasArrow = arrow.show;

      styleConfig.width = width;
      styleConfig.height = height;

      // 处理路径
      if (!url.startsWith("/")) {
        url = "/" + url;
      }
      url = url.replace(/^\/#\/pc/g, "");
      const path = url.split("?")[0];
      import(/* webpackChunkName: "dataview_layer" */ "_dataview/output/utils/layer.js").then((res) => {
        let createPopupDialog = res.default.createPopupDialog.bind(this);
        let showPopupDialog = res.default.showPopupDialog;
        const options = {
          fullPath: url,
          path,
          style: styleConfig,
          placement,
          manual,
          offsetFormat,
          arrowStyle,
          hasArrow,
        };
        setTimeout(() => {
          // 判断是否有缓存
          if (popupDialogs[id]) {
            const { popupInstance } = popupDialogs[id];
            popupInstance.$el.style.opacity = 1;
            popupInstance.$el.style.zIndex = 100;
            popupInstance.$el.style.transform = "none";
            // 更新时间 预留字段
            popupDialogs[id].time = new Date().getTime();
            popupInstance.updatePath(url);
            showPopupDialog(referenceDom, popupInstance);
          } else {
            const time = new Date().getTime();
            const { popupInstance } = createPopupDialog(options);
            popupDialogs[id] = {
              id,
              fullPath: url,
              time,
              manual,
              popupInstance,
            };
            showPopupDialog(referenceDom, popupInstance);
          }
        }, 200);
      });
    },
    // 关闭悬浮框 无参数 关闭所有不需要手动关闭的 悬浮框，有path 关闭特定需要手动关闭的悬浮框
    handleCloseDVPopup(popup) {
      let popupDialogs = this.$page ? this.$page.popupDialogs : this.popupDialogs;
      if (popupDialogs) {
        // 需要关闭的弹框
        const closePopups = [];
        for (const key in popupDialogs) {
          const { popupInstance, manual, path } = popupDialogs[key];
          if ((manual && path == popup) || (!manual && !popupInstance.isOver)) {
            closePopups.push(popupInstance);
          }
        }
        closePopups.forEach((popupInstance) => {
          popupInstance.$el.style.opacity = 0;
          popupInstance.$el.style.zIndex = -100;
          popupInstance.$el.style.transform = "translate(-10000px,-10000px)";
        });
      }
    },
    // 打开弹框
    handleOpenDialog(url, width = "900px", height = "60vh", title = "", dialogArgs = {}) {
      url = this.dataviewAnalysisSpecialVar(url);
      if (dsf.isString(url)) {
        if (!url.startsWith("/")) {
          url = "/" + url;
        }
      }
      url = url.replace(/^\/#\/pc/g, "");
      this.$openDialog({
        title,
        width,
        height,
        params: {
          path: url,
        },
        btns: [],
        dialogArgs,
      });
      return this;
    },
    // 取消接口请求
    cancelDvRequest() {
      const pageVm = this.$page;
      pageVm.cancelRequestList();
      return this;
    },
    // 取消文件和接口请求
    cancelDvAllRequest() {
      const pageVm = this.$page;
      pageVm.cancelSomeThing();
      return this;
    },
    /**
     * @description: 文件加入队列或者清除队列
     * @param {*} obj 请求对象
     * @param {*} flag 是否完成
     */
    addNowRequestFileList(obj, flag) {
      if (!this.isRunningDataViewPage) return;
      const { requestFileList } = this.$page;
      if (flag) {
        const uuid = obj.uuid;
        let index = requestFileList.findIndex((item) => item.uuid === uuid);
        if (index > -1) {
          requestFileList.splice(index, 1);
        }
      } else {
        const uuid = dsf.uuid();
        obj.uuid = uuid;
        requestFileList.push(obj);
      }
    },
    commonBorderManageCompatible(obj) {
      let isShowBorder = this.$attrs[obj.isShowField];
      let borderWidth = this.$attrs[obj.borderWidthField];
      let isBorderSolid = this.$attrs[obj.isBorderSolidField];
      let borderColor = this.$attrs[obj.borderColorField];
      if (typeof isShowBorder === "boolean") {
        let borderStyle = isBorderSolid ? "solid" : "dashed";
        let style = {
          commonBorderWidth: borderWidth,
          commonBorderColor: borderColor,
          commonBorderStyle: borderStyle,
        };
        if (isShowBorder) {
          style[[obj.updateCssField]] = `${borderWidth}px ${borderStyle} ${borderColor}`;
          this.$emit(`update:${obj.updateField}`, style);
        } else {
          this.$emit(`update:${obj.updateField}`, style);
        }
      }
    },
    //新版 适用于颜色和图片分开选择
    dvBackgroundFormat(config, attrObj = {}) {
      return dsf.dataview.utils.$backgroundFormat(config, attrObj);
    },
  },
  beforeDestroy() {
    if (this.loadFileHttp && typeof this.loadFileHttp === "object") {
      this.loadFileHttp = true;
    }
  },
  design: {
    //设计器是是否在组件上产生遮罩
    isMask: false,
  },
};

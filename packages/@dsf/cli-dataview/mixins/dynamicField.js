/*
 * @Description: 组件中使用配置项动态字段-字体-颜色等公用方法
 * @Author: shenah
 * @Date: 2023-03-29 17:07:54
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-04 17:21:12
 */
export default {
  mixins: [],
  data() {
    return {
      originConfigMapRelations: {},
    };
  },
  methods: {
    getDynamicItem(attach) {
      if (!attach) return;
      let styleObj = attach.style;
      if (styleObj) {
        let height = dsf.dataview.utils.transformPx(styleObj.height);
        let lineHeight = styleObj.lineHeight;
        let align = styleObj.align;
        let verticalAlign = styleObj.verticalAlign;

        let paddingTop = dsf.dataview.utils.transformPx(styleObj.paddingTop);
        let paddingRight = dsf.dataview.utils.transformPx(styleObj.paddingRight);
        let paddingBottom = dsf.dataview.utils.transformPx(styleObj.paddingBottom);
        let paddingLeft = dsf.dataview.utils.transformPx(styleObj.paddingLeft);
        let padding = `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;
        let relativeTop = dsf.dataview.utils.transformPx(styleObj.relativeTop);
        let relativeRight = dsf.dataview.utils.transformPx(styleObj.relativeRight);
        let relativeBottom = dsf.dataview.utils.transformPx(styleObj.relativeBottom);
        let relativeLeft = dsf.dataview.utils.transformPx(styleObj.relativeLeft);
        return {
          height,
          lineHeight,
          "justify-content": align,
          "align-items": verticalAlign,
          padding,
          top: relativeTop,
          right: relativeRight,
          bottom: relativeBottom,
          left: relativeLeft,
        };
      }
      return;
    },
    getAttachNameStyle(attach) {
      if (!attach) return;
      let styleObj = attach.style;
      if (styleObj) {
        const fontSize = dsf.dataview.utils.transformPx(styleObj.nameFontSize);
        const fontWeight = styleObj.nameBoldFlag ? "bold" : undefined;
        const color = styleObj.nameColor;
        const fontFamily = styleObj.nameFontFamily;
        let style = {
          "font-size": fontSize,
          "font-weight": fontWeight,
          color: color,
        };
        if (fontFamily) {
          style.fontFamily = fontFamily;
        }
        return style;
      }
      return {
        "font-size": dsf.dataview.utils.transformPx(attach.nameFontSize),
        color: attach.nameColor,
      };
    },
    getAttachUnitStyle(attach, row) {
      if (!attach) return;
      let styleObj = attach.style;
      if (styleObj) {
        const fontSize = dsf.dataview.utils.transformPx(styleObj.unitFontSize);
        const fontWeight = styleObj.unitFontWeight;
        const fontFamily = styleObj.unitFontFamily;
        const fontStyle = styleObj.unitFontStyle;
        const textDecoration = styleObj.unitTextDecoration;
        const textShadow = styleObj.unitTextShadow;

        let color = styleObj.unitColor;
        let unitRuleStyle = this.handleUniversalRule(row, attach.unitRuleList);
        let colorStyle = dsf.dataview.utils.getTextColor(color);
        if (unitRuleStyle.text) {
          let colorRuleStyle = unitRuleStyle.text.color ? dsf.dataview.utils.getTextColor(unitRuleStyle.text.color) : {};
          return {
            ...unitRuleStyle.text,
            ...colorRuleStyle,
          };
        }
        return {
          fontStyle,
          textDecoration,
          textShadow,
          fontFamily,
          "font-size": fontSize,
          "font-weight": fontWeight,
          ...colorStyle,
        };
      }
    },
    handleEveryThing(data) {
      let nowData = JSON.parse(JSON.stringify(data));
      // 处理值前缀图标与图片的展示
      nowData.forEach((it) => {
        let valueObj = {};
        let nameObj = {};
        this.mapRelations.attachArr.forEach((attach) => {
          valueObj[attach.uuid] = this.handleRule({
            anyObj: attach.valueIconObj,
            row: it,
            attach,
            type: "icon",
          });
          nameObj[attach.uuid] = this.handleRule({
            anyObj: attach.nameIconObj,
            row: it,
            prefix: "name",
            attach,
            type: "icon",
          });
        });
        it.valueAnything = valueObj;
        it.nameAnything = nameObj;
      });
      return nowData;
    },
    showImgStyle(obj) {
      return {
        width: dsf.dataview.utils.transformPx(obj.imgWidth),
        height: dsf.dataview.utils.transformPx(obj.imgHeight),
      };
    },
    handleRule2(obj, row) {
      if (!obj) return;
      let { defaultValue = null, ruleList = [] } = obj;
      let value = defaultValue;
      for (let i = 0; i < ruleList.length; i++) {
        let ruleObj = ruleList[i];
        let ruleStr = this.analysisRuleToDataField(ruleObj.rule);
        let flag = this.$eval(ruleStr, row);
        if (flag) {
          value = ruleObj.value;
          break;
        }
      }
      return value;
    },
    handleRule({ anyObj, row, type, prefix = "value", attach }) {
      if (!anyObj) return {};
      let { defaultValue = null, ruleList = [] } = anyObj;
      let value = {
        showType: attach[`${prefix}ShowType`] || "icon",
        showPosition: attach[`${prefix}ShowPosition`] || "before",
      };
      if (type === "color") {
        value.value = defaultValue;
      } else {
        if (value.showType === "img") {
          let imgObj = attach[`${prefix}ImgObj`];
          // 图片
          value.value = imgObj.defaultValue;
          value.imgWidth = imgObj.imgWidth;
          value.imgHeight = imgObj.imgHeight;
        } else {
          value.value = attach[`${prefix}IconObj`].defaultValue;
        }
      }
      for (let i = 0; i < ruleList.length; i++) {
        let ruleObj = ruleList[i];
        let ruleStr = this.analysisRuleToDataField(ruleObj.rule);
        let flag = false;
        try {
          flag = this.$eval(ruleStr, row);
        } catch (error) {
          flag = false;
        }
        if (flag) {
          if (type === "color") {
            value = {
              ...ruleObj,
            };
          } else {
            if (ruleObj.showType === "img") {
              ruleObj = attach[`${prefix}ImgObj`]?.ruleList[i] || ruleObj;
            }
            value = {
              ...ruleObj,
            };
          }
          break;
        }
      }
      return value;
    },
    getAttachValueIcon(
      attach,
      row,
      obj = {
        iconField: "valueIconObj",
      }
    ) {
      if (!attach) return;
      let icon = this.handleRule({
        anyObj: attach[obj.iconField],
        type: "icon",
        row,
        attach,
      }).value;
      return icon;
    },
    getAttachValueStyle(
      attach,
      row,
      obj = {
        colorField: "valueColorObj",
        fontField: "valueFontSize",
        fontFamilyField: "valueFontFamily",
        fontWeightField: "valueFontWeight",
        fontStyleField: "valueFontStyle",
        textDecorationField: "valueTextDecoration",
        marginField: "valueMargin",
      }
    ) {
      if (!attach) return;
      if (!attach[obj.colorField]) {
        return this.getAttachNameStyle(attach);
      }
      let style = {};
      let title = row[attach.title] || attach.title;
      if (!title) {
        style["margin-left"] = "0px";
      }
      let styleObj = attach.style;
      let color = this.handleRule({
        anyObj: attach[obj.colorField],
        type: "color",
        row,
        attach,
      }).value;
      if (styleObj) {
        const fontSize = dsf.dataview.utils.transformPx(styleObj[obj.fontField]);
        const fontFamily = styleObj[obj.fontFamilyField];
        const fontStyle = styleObj[obj.fontStyleField];
        const fontWeight = styleObj[obj.fontWeightField];
        const textDecoration = styleObj[obj.textDecorationField];
        let marginTop = dsf.dataview.utils.transformPx(styleObj[`${obj.marginField}Top`]);
        let marginRight = dsf.dataview.utils.transformPx(styleObj[`${obj.marginField}Right`]);
        let marginBottom = dsf.dataview.utils.transformPx(styleObj[`${obj.marginField}Bottom`]);
        let marginLeft = dsf.dataview.utils.transformPx(styleObj[`${obj.marginField}Left`]);
        let margin = `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`;
        // 默认走规则,兼容之前没有这个值
        if (styleObj.valueToRuleFlag !== undefined) {
          if (!styleObj.valueToRuleFlag) {
            let defaultColor = attach[obj.colorField]?.defaultValue;
            color = defaultColor ? defaultColor : color;
          }
        }
        let nowStyle = {
          ...style,
          fontSize,
          fontWeight,
          fontStyle,
          textDecoration,
          color,
          margin,
        };
        if (fontFamily) {
          nowStyle.fontFamily = fontFamily;
        }
        // 是否是柱体并且是值
        if (styleObj.isBar && obj.colorField === "valueColorObj") {
          nowStyle.flex = 1;
        }
        return nowStyle;
      }
      return {
        ...style,
        "font-size": dsf.dataview.utils.transformPx(attach[obj.fontField]),
        color,
      };
    },

    getProgressWrapStyle(attach) {
      let style = attach.style;
      let barConfig = style.barConfig;
      let width = dsf.dataview.utils.transformPx(barConfig.width);
      let nowStyle = {};
      if (width === "100%") {
        nowStyle.flex = 1;
      } else {
        nowStyle.width = width;
      }
      return nowStyle;
    },
    getOuterBarStyle(attach) {
      let style = attach.style;
      let barConfig = style.barConfig;
      let borderRadius = barConfig.borderRadius;
      let arrBorder = borderRadius;
      if (typeof borderRadius === "string") {
        arrBorder = borderRadius.split(" ");
      }
      if (arrBorder.length === 1) {
        borderRadius = dsf.dataview.utils.transformPx(barConfig.borderRadius);
      } else {
        borderRadius = dsf.dataview.utils.transformArrayPx(borderRadius);
      }
      return {
        height: dsf.dataview.utils.transformPx(barConfig.height),
        borderRadius,
        background: barConfig.basicBgColor,
      };
    },
    getInnerStyle(attach, row) {
      let style = attach.style;
      let percent = Math.abs(row[attach.field]) * 1 || 0;
      let barConfig = style.barConfig;
      let animationObj = barConfig.animation || {
        flag: false,
        duration: 3,
      };
      let minBarPercent = barConfig.minPercent;
      let borderRadius = barConfig.borderRadius;
      let arrBorder = borderRadius;
      if (typeof borderRadius === "string") {
        arrBorder = borderRadius.split(" ");
      }
      if (arrBorder.length === 1) {
        borderRadius = dsf.dataview.utils.transformPx(barConfig.borderRadius);
      } else {
        borderRadius = dsf.dataview.utils.transformArrayPx(borderRadius);
      }
      if (minBarPercent > percent) {
        percent = minBarPercent;
      }
      if (percent >= 100) {
        percent = 100;
        borderRadius = borderRadius;
      }
      let background = barConfig.bgColor;
      let bgColorRuleList = barConfig.bgColorRuleList;
      if (bgColorRuleList.length) {
        let barColorStyle = this.handleUniversalRule(row, bgColorRuleList);
        background = barColorStyle.color ? barColorStyle.color.color : background;
      }
      return {
        width: `${percent}%`,
        "--inner-width": `${percent}%`,
        "--animation-duration": animationObj.duration + "s",
        borderRadius,
        background,
      };
    },
    lightLineStyle(attach, row) {
      let info = attach.style;
      let percent = Math.abs(row[attach.field]) * 1 || 0;
      let barConfig = info.barConfig;
      let animationObj = barConfig.animation || {
        flag: false,
        duration: 3,
      };
      let pointInfo = barConfig.pointInfo || {
        type: "no", // line、point
        color: "rgba(255,255,255,1)",
        baseColor: "rgba(255,255,255,0.3)",
        isBreathe: false,
      };
      let minBarPercent = barConfig.minPercent;
      if (minBarPercent > percent) {
        percent = minBarPercent;
      }
      if (percent >= 100) {
        percent = 100;
      }
      let diffWidth = 6;
      let lineWidth = 2;
      let left = `calc(${percent}% - ${dsf.dataview.utils.transformPx(lineWidth / 2)})`;
      let style = {
        backgroundColor: pointInfo.color,
        width: dsf.dataview.utils.transformPx(lineWidth),
        height: dsf.dataview.utils.transformPx(parseInt(barConfig.height) + diffWidth),
        left,
        "--shu-left": left,
        "--animation-duration": animationObj.duration + "s",
        marginTop: dsf.dataview.utils.transformPx(-diffWidth / 2),
      };
      return style;
    },
    lightPointStyle(attach, row) {
      let info = attach.style;
      let percent = Math.abs(row[attach.field]) * 1 || 0;
      let barConfig = info.barConfig;
      let animationObj = barConfig.animation || {
        flag: false,
        duration: 3,
      };
      let pointInfo = barConfig.pointInfo || {
        type: "no", // line、point
        color: "rgba(255,255,255,1)",
        baseColor: "rgba(255,255,255,0.3)",
        isBreathe: false,
      };
      let minBarPercent = barConfig.minPercent;
      if (minBarPercent > percent) {
        percent = minBarPercent;
      }
      if (percent >= 100) {
        percent = 100;
      }
      let diffWidth = 10;
      let width = parseInt(barConfig.height) + diffWidth;
      let left = `calc(${percent}% - ${dsf.dataview.utils.transformPx(width / 2)})`;
      let style = {
        backgroundColor: pointInfo.baseColor,
        width: dsf.dataview.utils.transformPx(width),
        height: dsf.dataview.utils.transformPx(width),
        left,
        "--shu-left": left,
        "--animation-duration": animationObj.duration + "s",
      };
      return style;
    },
    lightPointInnerStyle(attach) {
      let info = attach.style;
      let barConfig = info.barConfig;
      let width = parseInt(barConfig.height) + 4;
      let pointInfo = barConfig.pointInfo || {
        type: "no", // line、point
        color: "rgba(255,255,255,1)",
        baseColor: "rgba(255,255,255,0.3)",
        isBreathe: false,
      };
      let style = {
        backgroundColor: pointInfo.color,
        width: dsf.dataview.utils.transformPx(width),
        height: dsf.dataview.utils.transformPx(width),
      };
      return style;
    },
    isShowBarValue(attach) {
      let style = attach.style;
      let barConfig = style.barConfig;
      return barConfig.showValue;
    },
  },
};

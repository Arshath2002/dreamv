<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-10-18 09:17:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-04 10:46:42
-->

<template>
  <div class="row-item" :key="row.id" @mouseenter="(e) => handleRowItemMouseEnter(e, row)" @mouseleave="(e) => handleRowMouseLeave(e, row, row.rowIndex)">
    <div class="ceil-wrap" v-for="(ceil, ci) in header" v-show="!ceil.hide" :key="`${ceil.id}${row.rowIndex}${ci}`" :style="getCeilWrapStyle">
      <div class="ceil" v-if="ceil" :class="`${ceil.isIndex ? 'ceil-index' : ''}`" :style="getCeilStyle(ceil, ci)" @click="clickItem(ci, row, ceil, $event)">
        <slot :name="ceil.slotName ? ceil.slotName : 'default'" :ceil="ceil" :row="row" :index="row.rowIndex" :col="ci">
          <!-- 序号 -->
          <template v-if="ceil.isIndex">
            <div :style="getSequenceStyle(row)" class="index-cell">
              <template v-if="getSequenceStyle(row).other.showContent === 'number'">
                <div class="index-cell-text" :style="sequenceTextStyle(row)">{{ getRowIndex(row) }}</div>
              </template>
              <template v-else-if="getSequenceStyle(row).other.showContent === 'image'">
                <template v-if="getSequenceStyle(row).other.imageUrl">
                  <div class="index-cell-image" :style="sequenceImage(row)">
                    <div class="index-cell-image data-view-common-bg-effect">
                      <div class="index-cell-text" :style="sequenceTextStyle(row)">{{ getRowIndex(row) }}</div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="index-cell-text" :style="sequenceTextStyle(row)">{{ getRowIndex(row) }}</div>
                </template>
              </template>
              <DsfIcon
                :name="getSequenceStyle(row).other.icon"
                :style="{
                  fontSize: getSequenceStyle(row).fontSize,
                }"
                v-else
              ></DsfIcon>
            </div>
          </template>
          <!-- 普通列 -->
          <template v-else>
            <div
              class="common-content"
              :class="[isFixedHeight ? 'real-content' : 'auto-real-content', ceil.isBar ? 'bar-content' : '']"
              :style="contentStyle(ceil)"
              :align="ceil.align"
              :title="ceil.isCssTitle ? getGeneralVal(row, ceil) : ''"
            >
              <!-- 缩进规则 -->
              <div class="temp-box">
                <span v-for="space in getIndentRule(row, ceil)" :key="space"> &nbsp; </span>
              </div>
              <!-- 前缀 -->
              <template v-if="ceil.prefixConfig && ceil.prefixConfig.defaultConfig.flag && !ceil.isBar">
                <PrefixSuffixThing
                  :config="ceil.prefixConfig"
                  :row="row"
                  :belongDvComp="Table"
                  wrapClass="table-ceil-prefix"
                  :analysisRuleToDataField="Table.analysisRuleToDataField"
                  :analysisKeyToDataField="Table.analysisKeyToDataField"
                ></PrefixSuffixThing>
              </template>
              <!-- 柱体 -->
              <template v-if="ceil.isBar">
                <div class="progress-wrap" v-for="(barObj, barIndex) in ceil.barInfo" :key="barIndex" :style="progressWrapStyle(ceil, barIndex)">
                  <div class="progress" :style="getOuterStyle(ci, barIndex)">
                    <template v-if="barObj.pointType !== 'no'">
                      <!-- 光点 -->
                      <div
                        class="light-line"
                        :style="lightLineStyle(row, ceil, barIndex)"
                        :class="{
                          animationLeft: !Table.isVirtualTable && barObj.animation && barObj.animation.flag,
                        }"
                        v-if="barObj.pointType === 'line'"
                      ></div>
                      <div
                        class="light-point"
                        :style="lightPointStyle(row, ceil, barIndex)"
                        :class="{
                          animationLeft: !Table.isVirtualTable && barObj.animation && barObj.animation.flag,
                        }"
                        v-else-if="barObj.pointType === 'point'"
                      >
                        <div
                          class="light-point-inner"
                          :class="{
                            'breathe-effect': barObj.isPointBreathe,
                          }"
                          :style="lightPointInnerStyle(ceil, barIndex)"
                        ></div>
                      </div>
                    </template>

                    <div
                      class="inner-progress"
                      :style="getInnerStyle(row, ceil, ci, barIndex)"
                      :class="{
                        animationWidth: !Table.isVirtualTable && barObj.animation && barObj.animation.flag,
                      }"
                    >
                      <div
                        class="progress-text"
                        :data-bar-number="`${row.id}_${ci}_${barIndex}`"
                        :style="progressTextStyle(row, ceil, ci, barIndex, barObj)"
                        v-if="barObj.barTextPosition === 'barRight'"
                      >
                        <span :style="getBarSuffixStyle(barObj, row)">
                          {{ getBarValue(barObj, ceil, row) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="inner-progress-text" :style="{ 'text-align': barObj.barTextInnerAlign }" v-if="barObj.barTextPosition === 'barInner'">
                    <span :style="getBarSuffixStyle(barObj, row)">
                      {{ getBarValue(barObj, ceil, row) }}
                    </span>
                  </div>
                </div>
                <!-- 后缀-->
                <template v-if="ceil.suffixConfig && ceil.suffixConfig.defaultConfig.flag && !ceil.isBar">
                  <PrefixSuffixThing
                    :config="ceil.suffixConfig"
                    :row="row"
                    :belongDvComp="Table"
                    wrapClass="table-ceil-prefix"
                    :analysisRuleToDataField="Table.analysisRuleToDataField"
                    :analysisKeyToDataField="Table.analysisKeyToDataField"
                  ></PrefixSuffixThing>
                </template>
              </template>
              <!-- 普通内容 -->
              <template v-else>
                <div class="text-box" :style="getDataRuleStyle(row, ceil)">
                  <span class="real-text">{{ getGeneralVal(row, ceil) }}</span>
                  <!-- 后缀-->
                  <template v-if="ceil.suffixConfig && ceil.suffixConfig.defaultConfig.flag && !ceil.isBar">
                    <PrefixSuffixThing
                      :config="ceil.suffixConfig"
                      :row="row"
                      :belongDvComp="Table"
                      wrapClass="table-ceil-prefix"
                      :analysisRuleToDataField="Table.analysisRuleToDataField"
                      :analysisKeyToDataField="Table.analysisKeyToDataField"
                    ></PrefixSuffixThing>
                  </template>
                </div>
              </template>
              <br />
            </div>
          </template>
        </slot>
      </div>
    </div>
    <!-- 背景图 -->
    <div class="row-item-bg" :style="rowItemBgStyle(row)"></div>
  </div>
</template>
<script>
import PrefixSuffixThing from "_dataview/share/components/data/common/prefixSuffixThing";
import { filterConditionStrategy } from "_dataview/output/utils/filterData";
import { handleUniversalRule } from "_dataview/mixins/universalRuleMixin";
export default {
  name: "largeTableRowItem",
  inject: ["Table"],
  components: { PrefixSuffixThing },
  props: {
    // 行数据
    row: {
      type: Object,
      require: true,
    },
    // 列数组
    header: {
      type: Array,
      require: true,
    },
    // 列宽度数组
    widths: {
      type: Array,
      require: true,
    },
    // 单元格内容配置项目--newContentConfig
    contentConfig: {
      type: Object,
      require: true,
    },
    // 序号配置---indexAttrConfig
    sequenceConfig: {
      type: Object,
      require: true,
    },
    //是否含有边框--isShowContentBorder
    hasBorder: {
      type: Boolean,
      default: false,
    },
    // 边框配置-- contentBorderBottomConfig
    borderConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    //是否固定高度 config.fixEachRowHeightFlag
    isFixedHeight: {
      type: Boolean,
      default: true,
    },
    // 用于存储柱状自动计算的最大值,
    barAutoCalcMax: {
      type: Object,
      default() {
        return {};
      },
    },
    rowItemBgStyle: {
      type: Function,
    },
  },
  computed: {
    getCeilWrapStyle() {
      let style = {};
      if (!this.isFixedHeight) {
        style.height = "auto";
      }
      return style;
    },
  },
  methods: {
    handleRowItemMouseEnter(e, row) {
      this.$emit("handleRowItemMouseEnter", { e, row });
    },
    handleRowMouseLeave(e, row, ri) {
      this.$emit("handleRowMouseLeave", { e, row, ri });
    },
    clickItem(ci, row, ceil, evt) {
      this.$emit("clickItem", { ci, row, ceil, evt });
    },
    // 单元格样式函数
    getCeilStyle(ceil, ci) {
      let { fontSize, align: textAlign, fontWeight, fontStyle, fontFamily, textDecoration } = ceil;
      fontSize = fontSize ? dsf.dataview.utils.transformPx(fontSize) : dsf.dataview.utils.transformPx(this.contentConfig.fontSize);
      textDecoration = textDecoration ? textDecoration : this.contentConfig.textDecoration;
      let padding = dsf.dataview.utils.transformArrayPx(ceil.commonPadding);

      let style = {
        width: dsf.dataview.utils.transformPx(this.widths[ci], false),
        "font-size": fontSize,
        "text-align": textAlign ? textAlign : this.contentConfig.hAlign,
        fontFamily,
        padding,
        fontWeight,
        fontStyle,
        textDecoration,
      };
      // 是序号
      if (ceil.isIndex) {
        let attr = Array.isArray(this.sequenceConfig) ? this.sequenceConfig[0] : this.sequenceConfig;
        let vIndexAlign = attr.vAlign || "center";
        style.justifyContent = vIndexAlign;
      }
      if (this.hasBorder) {
        let borderConfig = this.borderConfig;
        let border = `${borderConfig.commonBorderWidth}px ${borderConfig.commonBorderStyle} ${borderConfig.commonBorderColor}`;
        if (ci === 0) {
          style["border-left"] = border;
        }
        style["border-right"] = border;
      }
      return style;
    },
    // 序列样式
    getSequenceStyle(row) {
      //序列样式配置
      let attr = Array.isArray(this.sequenceConfig) ? this.sequenceConfig[0] : this.sequenceConfig;
      let { borderRadius, width, height, fontSize, fontWeight, fontStyle, fontFamily, textDecoration, textShadow } = attr;

      borderRadius = dsf.dataview.utils.transformArrayPx(attr.borderRadius);
      width = dsf.dataview.utils.transformPx(attr.width);
      height = dsf.dataview.utils.transformPx(attr.height);
      fontSize = dsf.dataview.utils.transformPx(attr.fontSize);

      let bgColor = getColorIcon(attr, "bgColors", row.rowIndex);
      let iconColor = getColorIcon(attr, "iconColors", row.rowIndex);
      let obj = {
        width,
        height,
        background: bgColor,
        fontWeight,
        fontStyle,
        textDecoration,
        fontSize,
        textShadow,
        fontFamily,
      };
      if (["icon"].indexOf(attr.showContent) > -1) {
        obj.color = iconColor;
      }
      obj["border-radius"] = borderRadius;
      let icon = getColorIcon(attr, "icons", row.rowIndex);
      let image = getColorIcon(
        {
          images: attr.images || [],
        },
        "images",
        row.rowIndex
      );
      let imageUrl = "";
      if (image?.active && image?.custom?.image) {
        imageUrl = dsf.dataview.utils.compatiblePathToExtendShowImg(image);
      }
      obj.other = {
        ...attr,
        icon,
        imageUrl,
        imageObj: image || {},
      };
      return obj;
    },
    // 序列文本样式
    sequenceTextStyle(row) {
      let obj = {};
      let attr = Array.isArray(this.sequenceConfig) ? this.sequenceConfig[0] : this.sequenceConfig;
      let color = getColorIcon(attr, "fontColors", row.rowIndex);
      color = dsf.dataview.utils.getTextColor(color);
      if (["number", "image"].indexOf(attr.showContent) > -1) {
        obj = {
          ...obj,
          ...color,
        };
      } else {
        obj.color = iconColor;
      }
      return obj;
    },
    getRowIndex(row) {
      let attr = Array.isArray(this.sequenceConfig) ? this.sequenceConfig[0] : this.sequenceConfig;
      let indexField = attr.map;
      if (indexField) {
        if (indexField === "rowIndex") {
          // 内部的特殊字段
          return row.rowIndex + 1;
        }
        return row[indexField];
      }
      return row.rowIndex + 1;
    },
    // 序列图片样式
    sequenceImage(row) {
      let obj = this.getSequenceStyle(row);
      let bgVar = this.Table.dvBackgroundFormat(obj.other.imageObj, {
        isBgInfoVar: true,
        defaultBgVarCss: {
          "--border-radius": obj["border-radius"],
        },
      });
      let style = {
        width: dsf.dataview.utils.transformPx(obj.width),
        height: dsf.dataview.utils.transformPx(obj.height),
        color: obj.color,
        textShadow: obj.textShadow,
        ...bgVar,
      };
      return style;
    },
    //普通单元格样式
    contentStyle(header) {
      let flexObj = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      let align = header.align;
      let style = {};
      if (!this.isFixedHeight) {
        style = {
          display: "flex",
          "align-items": "center",
          "justify-content": flexObj[align],
        };
      }
      return style;
    },
    getGeneralVal(row, ceil) {
      let val = [undefined, null].indexOf(row[ceil.map]) === -1 ? row[ceil.map] : "";
      val = this.Table.handleMapRelationNum(val, ceil);
      if (ceil.unitTransform) {
        return this.Table.transformUnit(val, ceil.unitTransform, true, 2);
      }
      if (ceil.isThousandths === undefined || ceil.isThousandths) {
        return dsf.dataview.utils.toThSeparator(val);
      }
      return val;
    },
    //获取缩进行数
    getIndentRule(row, ceil) {
      let indent = 0;
      if (ceil.indentRules?.length) {
        ceil.indentRules.forEach((item) => {
          let fn = filterConditionStrategy[item.rule];
          if (typeof fn === "function") {
            let res = fn.call(this, row, item, true);
            res && (indent = Math.max(indent, item.indent));
          }
        });
      }
      return indent;
    },
    // 柱体样式
    progressWrapStyle(ceil, barIndex) {
      let isArray = Array.isArray(ceil.barInfo);
      let barInfo = isArray ? ceil.barInfo[barIndex] : ceil.barInfo;
      let barWidth = barInfo.width === undefined ? "100%" : dsf.dataview.utils.transformPx(barInfo.width);
      let style = {
        width: barWidth,
        "margin-bottom": dsf.dataview.utils.transformPx(ceil.barSpace),
      };
      return style;
    },
    //计算bar样式
    getOuterStyle(index, barIndex) {
      let header = this.header[index];
      let isArray = Array.isArray(header.barInfo);
      let barInfo = isArray ? header.barInfo[barIndex] : header.barInfo;
      let borderRadius = dsf.dataview.utils.transformArrayPx(barInfo.borderRadius);
      let background = handleOldBarBaseColor(barInfo, isArray, index);
      return {
        height: dsf.dataview.utils.transformPx(barInfo.height),
        borderRadius,
        background,
      };
    },

    // 计算柱体文字样式
    progressTextStyle(row, header, index, barIndex, barObj) {
      let style = {};

      return style;
    },
    //获取bar 后缀样式
    getBarSuffixStyle(barObj, row) {
      let defaultConfig = barObj.suffixRuleConfig.defaultConfig.text;
      let ruleList = barObj.suffixRuleConfig.ruleList;
      let style = {
        ...defaultConfig,
        fontSize: dsf.dataview.utils.transformPx(defaultConfig.fontSize),
      };
      let ruleStyle = handleUniversalRule.call(this.Table, row, ruleList);
      if (ruleStyle.text) {
        style = {
          ...ruleStyle.text,
        };
      }
      return style;
    },
    //计算bar条样式
    getInnerStyle(row, ceil, index, barIndex) {
      let header = ceil;
      let isArray = Array.isArray(header.barInfo);
      let barInfo = isArray ? header.barInfo[barIndex] : header.barInfo;
      let percent = this.getBarInterValue(barInfo, row, barIndex, header);
      let barRuleList = barInfo.bgColorRuleList;
      let barStyle = handleUniversalRule.call(this.Table, row, barRuleList);
      let animationObj = barInfo.animation || {
        flag: false,
        duration: 3,
      };
      let borderRadius = dsf.dataview.utils.transformArrayPx(barInfo.borderRadius);
      let minBarPercent = barInfo.minBarPercent || 0;

      let background = barInfo.barBgColor;
      if (barStyle.color) {
        background = barStyle.color.color;
      }
      const style = {
        width: `${percent}%`,
        borderRadius,
        background,
        "--inner-width": `${percent}%`,
        "--animation-duration": animationObj.duration + "s",
      };
      if (percent < minBarPercent) {
        style.width = minBarPercent + "%";
        style["--inner-width"] = minBarPercent + "%";
      }
      return style;
    },
    // 光点样式
    lightLineStyle(row, ceil, barIndex) {
      let header = ceil;
      let isArray = Array.isArray(header.barInfo);
      let barInfo = isArray ? header.barInfo[barIndex] : header.barInfo;
      let minBarPercent = barInfo.minBarPercent || 0;
      let percent = this.getBarInterValue(barInfo, row, barIndex, header);
      let animationObj = barInfo.animation || {
        flag: false,
        duration: 3,
      };
      let diffWidth = 6;
      let lineWidth = 2;
      let left = `calc(${percent}% - ${dsf.dataview.utils.transformPx(lineWidth / 2)})`;
      let style = {
        backgroundColor: barInfo.pointColor,
        width: dsf.dataview.utils.transformPx(lineWidth),
        height: dsf.dataview.utils.transformPx(parseInt(barInfo.height) + diffWidth),
        left,
        "--shu-left": left,
        "--animation-duration": animationObj.duration + "s",
        marginTop: dsf.dataview.utils.transformPx(-diffWidth / 2),
      };
      if (percent < minBarPercent) {
        style.left = minBarPercent + "%";
        style["--shu-left"] = minBarPercent + "%";
      }
      return style;
    },
    // 光点样式
    lightPointStyle(row, ceil, barIndex) {
      let header = ceil;
      let isArray = Array.isArray(header.barInfo);
      let barInfo = isArray ? header.barInfo[barIndex] : header.barInfo;
      let minBarPercent = barInfo.minBarPercent || 0;
      let percent = this.getBarInterValue(barInfo, row, barIndex, header);
      let animationObj = barInfo.animation || {
        flag: false,
        duration: 3,
      };
      let diffWidth = 10;
      let width = parseInt(barInfo.height) + diffWidth;
      let left = `calc(${percent}% - ${dsf.dataview.utils.transformPx(width / 2)})`;

      if (barInfo.showValue) {
        if (percent === 100) {
          width = 0;
          left = 0;
        } else {
          //展示后缀
          left = `calc(${percent}% - ${dsf.dataview.utils.transformPx(width - 4)})`;
        }
      }
      let style = {
        backgroundColor: barInfo.pointBaseColor,
        width: dsf.dataview.utils.transformPx(width),
        height: dsf.dataview.utils.transformPx(width),
        left,
        "--shu-left": left,
        "--animation-duration": animationObj.duration + "s",
      };
      if (percent < minBarPercent) {
        style.left = minBarPercent + "%";
        style["--shu-left"] = minBarPercent + "%";
      }
      return style;
    },
    lightPointInnerStyle(ceil, barIndex) {
      let header = ceil;
      let isArray = Array.isArray(header.barInfo);
      let barInfo = isArray ? header.barInfo[barIndex] : header.barInfo;
      let width = parseInt(barInfo.height) + 4;
      let style = {
        backgroundColor: barInfo.pointColor,
        width: dsf.dataview.utils.transformPx(width),
        height: dsf.dataview.utils.transformPx(width),
      };
      return style;
    },
    // 获取bar背景颜色的值
    getBarInterValue(barObj, row, barIndex, header) {
      let percent = row[header.map] || 0;
      let staticValue = barObj.staticValue * 1;
      let field = barObj.field;
      if (this.Table.dataType === "static") {
        if (barObj.staticValue !== "" && barObj.staticValue !== undefined && !isNaN(staticValue)) {
          percent = staticValue;
        }
      } else {
        let minBarPercent = barObj.minBarPercent;
        if (barObj.isAutoCalc) {
          if (field) {
            let max = this.barAutoCalcMax[header.id][barIndex];
            let val = row[field] * 1;
            percent = getAutoCalcPercent(max, val, minBarPercent);
          }
        } else {
          // 没有开启自动计算
          if (dsf.isNumber(minBarPercent)) {
            percent = row[field] < minBarPercent ? minBarPercent : row[field];
          } else {
            percent = row[field];
          }
        }
      }
      if (percent > 100) {
        percent = 100;
      }
      return percent;
    },
    //获取bar 显示值
    getBarValue(barObj, ceil, row) {
      if (!barObj.showValue) {
        return "";
      }
      let percent = row[ceil.map];
      let staticValue = barObj.staticValue || "";
      let val = `${staticValue ? staticValue : percent}${barObj.fieldSuffix}`;
      let isThousandths = ceil.isThousandths;
      if (isThousandths) {
        val = dsf.dataview.utils.toThSeparator(val);
      }
      if (this.dataType === "static") {
        return val;
      } else {
        let fieldSuffix = row[barObj.fieldSuffix] !== undefined ? row[barObj.fieldSuffix] : barObj.fieldSuffix;
        let unitField = row[barObj.unitField] ? row[barObj.unitField] : barObj.unitField;
        if (isThousandths) {
          fieldSuffix = dsf.dataview.utils.toThSeparator(fieldSuffix);
        }
        if (unitField) {
          return `${fieldSuffix}${unitField}`;
        }
        return fieldSuffix;
      }
    },
    getDataRuleStyle(row, header) {
      let { fontWeight, fontStyle, textDecoration, textShadow, fontSize, color } = header;

      fontWeight = fontWeight || this.contentConfig.fontWeight;
      fontStyle = fontStyle || this.contentConfig.fontStyle;
      textDecoration = textDecoration || this.contentConfig.textDecoration;
      textShadow = textShadow || this.contentConfig.textShadow;
      fontSize = fontSize ? dsf.dataview.utils.transformPx(fontSize) : dsf.dataview.utils.transformPx(this.contentConfig.fontSize);
      let contentColor = color === "inherit" ? undefined : color;
      let colorStyle = contentColor ? dsf.dataview.utils.getTextColor(contentColor) : dsf.dataview.utils.getTextColor(this.contentConfig.color);

      let style = {
        fontSize,
        fontStyle,
        textDecoration,
        ...colorStyle,
        textShadow,
      };
      let dataStyle = handleUniversalRule.call(this.Table, row, header.dataRuleList);
      let colorRuleStyle = dataStyle.text ? dsf.dataview.utils.getTextColor(dataStyle.text.color) : {};
      return {
        ...style,
        fontWeight,
        ...dataStyle.text,
        ...colorRuleStyle,
      };
    },
  },
};
// 纯函数 计算字体大小
function computeFontSize(str, size) {
  let spanDom = document.createElement("span");
  spanDom.style.fontSize = size;
  spanDom.style.opacity = "0";
  spanDom.innerHTML = str;
  document.body.append(spanDom);
  let sizeD = {};
  sizeD.width = spanDom.offsetWidth;
  sizeD.height = spanDom.offsetHeight;
  spanDom.remove();
  return sizeD.width;
}
// 纯函数
function getColorIcon(attr, field, index) {
  let arr = attr[field];
  if (!arr) return "";
  let arrLength = arr.length - 1;
  let str = arr[index] || "";
  if (index > arrLength) {
    str = arr[arrLength] || "";
  }
  return str;
}
//纯函数 处理旧的底色柱体颜色
function handleOldBarBaseColor(barInfo, isArray, index) {
  let oldColors = barInfo.baseBgColors;
  let color = "";
  if (oldColors) {
    color = isArray ? oldColors[0] : oldColors[index % oldColors.length];
  } else {
    color = barInfo.barBaseColor;
  }
  return color;
}

// 纯函数
function getAutoCalcPercent(max, val, minP) {
  let percent = 0;
  if (max && max !== 0 && !isNaN(val)) {
    let nowPercent = _.round((val / max) * 100, 2);
    if (dsf.isNumber(minP)) {
      percent = nowPercent > minP ? nowPercent : minP;
    } else {
      percent = nowPercent;
    }
  } else {
    percent = 0;
  }
  return percent;
}
</script>

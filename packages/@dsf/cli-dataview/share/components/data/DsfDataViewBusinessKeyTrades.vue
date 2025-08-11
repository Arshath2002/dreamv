<!--
 * @Description: 图文组件
 * @Author: zhanghang
 * @Date: 2024-01-30 13:37:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-18 09:53:11
-->
<template>
  <div
    class="dsf-dv-keytrades data-view-item-wrap ds-control data-view-no-padding"
    :style="componentStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <dsf-empty-data v-if="!hasData"></dsf-empty-data>
    <keyTradesScroller
      v-else
      class="key-trades-box-wrap data-view-common-bg-effect"
      style="width: 100%"
      :data="data"
      :grid="gridLayout"
      :type="scrollType"
      :config="scrollConfig"
      :item-style="itemStyle"
      :active-item="activeItem"
      @it-click="clickItem"
      @it-mouseenter.stop="handleBoxItemMouseEnter"
      @it-mouseleave.stop="handleBoxItemMouseLeave"
      @it-mouseover.stop="handleBoxItemMouseover"
    >
      <template v-slot="{ it, index }">
        <div class="key-trades-box-inner-item data-view-common-bg-effect" :style="innerItemStyle(index)">
          <div
            v-if="isShowIcon"
            class="key-trades-img-box-wrap"
            :style="getImgWrapStyle"
            :class="{
              'key-trades-img-box-wrap-v': direction,
            }"
          >
            <div class="key-trades-img-box" :style="getImgStyle">
              <el-image :key="index" :style="getImgSelfStyle(imgs[index % imgs.length])" :src="imgs[index % imgs.length] && imgs[index % imgs.length].url" :fit="'cover'">
                <div slot="error" class="image-slot" style="height: 100%">
                  <img :src="errImage" style="width: 100%; height: 100%" />
                </div>
              </el-image>
            </div>
          </div>
          <div class="right-content">
            <!-- 额外新增 -->
            <el-row :gutter="2" class="right-content-row">
              <el-col class="value" v-for="attach in mapRelations.attachArr" :key="attach.uuid" :style="getDynamicItem(attach)" :span="attach.layoutMethods">
                <div class="namebox" :style="getColItemStyle(it, attach, 'name')" v-if="attach.title">
                  <!-- 名称前缀 -->
                  <template
                    v-if="
                      showExtra(it, attach, {
                        type: 'image',
                        position: 'before',
                        field: 'name',
                      })
                    "
                  >
                    <img :src="getExtraImageIcon(it, attach, 'name', 'image')" :style="getExtraImageStyle(it, attach, 'name')" class="show-img before" />
                  </template>
                  <template
                    v-else-if="
                      showExtra(it, attach, {
                        type: 'icon',
                        position: 'before',
                        field: 'name',
                      })
                    "
                  >
                    <DsfIcon class="show-icon before" :name="getExtraImageIcon(it, attach, 'name', 'icon')" :style="getExtraIconStyle(it, attach, 'name')"></DsfIcon>
                  </template>
                  <template v-if="attach.title">
                    <template v-if="attach.style && attach.style.lineBreak > 0">
                      <!-- 截断 -->
                      <div class="work-break-name" :title="_getShowRes(it, attach.title)" v-html="handleLineBreak(it, attach)"></div>
                    </template>
                    <!-- 普通 -->
                    <span :title="_getShowRes(it, attach.title)" v-else>
                      {{ _getShowRes(it, attach.title) }}
                    </span>
                  </template>

                  <!-- 名称后缀 -->
                  <img
                    v-if="
                      showExtra(it, attach, {
                        type: 'image',
                        position: 'after',
                        field: 'name',
                      })
                    "
                    :style="getExtraImageStyle(it, attach, 'name')"
                    :src="getExtraImageIcon(it, attach, 'name', 'image')"
                    class="show-img after"
                  />
                  <DsfIcon
                    v-else-if="
                      showExtra(it, attach, {
                        type: 'icon',
                        position: 'after',
                        field: 'name',
                      })
                    "
                    class="show-icon after"
                    :name="getExtraImageIcon(it, attach, 'name', 'icon')"
                    :style="getExtraIconStyle(it, attach, 'name')"
                  ></DsfIcon>
                </div>
                <div class="num-box" :style="getColItemStyle(it, attach, 'value')" v-if="attach.field">
                  <!-- 值前缀 -->
                  <img
                    v-if="
                      showExtra(it, attach, {
                        type: 'image',
                        position: 'before',
                        field: 'value',
                      })
                    "
                    :src="getExtraImageIcon(it, attach, 'value', 'image')"
                    :style="getExtraImageStyle(it, attach, 'value')"
                    class="show-img before"
                  />
                  <DsfIcon
                    v-else-if="
                      showExtra(it, attach, {
                        type: 'icon',
                        position: 'before',
                        field: 'value',
                      })
                    "
                    class="show-icon before"
                    :name="getExtraImageIcon(it, attach, 'value', 'icon')"
                    :style="getExtraIconStyle(it, attach, 'value')"
                  ></DsfIcon>
                  <!-- 柱体 -->
                  <template v-if="attach.style && attach.style.isBar">
                    <div class="progress-wrap" :style="getProgressWrapStyle(attach)">
                      <div class="progress" :style="getOuterBarStyle(attach)">
                        <template v-if="attach.style.barConfig.pointInfo">
                          <!-- 线 -->
                          <div
                            class="light-line"
                            :style="lightLineStyle(attach, it)"
                            :class="{
                              animationLeft: attach.style.barConfig.animation && attach.style.barConfig.animation.flag,
                            }"
                            v-if="attach.style.barConfig.pointInfo.type === 'line'"
                          ></div>
                          <!-- 光点 -->
                          <div
                            class="light-point"
                            :style="lightPointStyle(attach, it)"
                            :class="{
                              animationLeft: attach.style.barConfig.animation && attach.style.barConfig.animation.flag,
                            }"
                            v-else-if="attach.style.barConfig.pointInfo.type === 'point'"
                          >
                            <div
                              class="light-point-inner"
                              :class="{
                                'breathe-effect': attach.style.barConfig.pointInfo.isBreathe,
                              }"
                              :style="lightPointInnerStyle(attach, it)"
                            ></div>
                          </div>
                        </template>

                        <div
                          class="inner-progress"
                          :class="{
                            animationWidth: attach.style.barConfig.animation && attach.style.barConfig.animation.flag,
                          }"
                          :style="getInnerStyle(attach, it)"
                        ></div>
                      </div>
                    </div>
                    <span class="show-progress-value" :title="showNoNumStr(it, attach)" v-if="isShowBarValue(attach)">
                      {{ showNoNumStr(it, attach) }}
                    </span>
                    <span class="value-unit" v-if="attach.unit" :style="getAttachUnitStyle(attach, it)">
                      {{ attach.style.valueUnitTransform }}
                      <span :style="unitGap(attach.style)">
                        {{ _getShowRes(it, attach.unit) }}
                      </span>
                    </span>
                  </template>
                  <!-- 普通值 -->
                  <template v-else>
                    <span v-if="judgeNoNumber(it, attach)" :title="showNoNumStr(it, attach)">
                      {{ showNoNumStr(it, attach) }}
                    </span>
                    <DsfDataViewScrollDigital
                      v-else-if="attach.style.digitalWholeConfig.flag"
                      style="padding: 0"
                      dataType="static"
                      v-bind="getDigitalConfig(it, attach)"
                      :staticData="{
                        startVal: 0,
                        endVal: transformUnit(it[attach.field], attach.style.valueUnitTransform, false),
                      }"
                    ></DsfDataViewScrollDigital>
                    <span v-else :title="showNoNumStr(it, attach)">
                      {{ showNoNumStr(it, attach) }}
                    </span>
                  </template>
                  <!-- 值后缀 -->
                  <img
                    v-if="
                      showExtra(it, attach, {
                        type: 'image',
                        position: 'after',
                        field: 'value',
                      })
                    "
                    :style="getExtraImageStyle(it, attach, 'value')"
                    :src="getExtraImageIcon(it, attach, 'value', 'image')"
                    class="show-img after"
                  />
                  <DsfIcon
                    v-else-if="
                      showExtra(it, attach, {
                        type: 'icon',
                        position: 'after',
                        field: 'value',
                      })
                    "
                    class="show-icon after"
                    :name="getExtraImageIcon(it, attach, 'value', 'icon')"
                    :style="getExtraIconStyle(it, attach, 'value')"
                  ></DsfIcon>
                </div>
                <span class="value-unit" v-if="judgeNormalValueUnit(attach)" :style="getAttachUnitStyle(attach, it)">
                  {{ attach.style.valueUnitTransform }}

                  <span :style="unitGap(attach.style)">
                    {{ _getShowRes(it, attach.unit) }}
                  </span>
                </span>
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
      <Pagination v-if="isShowPage" :config="pageConfig" :selectTheme="selectTheme" :total="pageTotal" :allowPageDataType="allowPageDataType" height="auto" @pageChange="pageChange"></Pagination>
    </keyTradesScroller>
  </div>
</template>
<script>
import Pagination from "_dataview/share/components/data/common/pagination";
import paginationMixin from "_dataview/mixins/pagination.js";
import universalRuleMixin from "_dataview/mixins/universalRuleMixin";

import { createDefault, createOneKeyTrades } from "_dataview/output/dynamicFieldStyleSetting/keytrades";
import errImage from "_dataview/assets/styles/themes/img/file-read-18688.png";
import dynamicField from "_dataview/mixins/dynamicField.js";
import border from "_dataview/mixins/border.js";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
import keyTradesScroller from "./common/keyTradesScroller.js";

const staticDataKeyDic = {
  name: "名称",
  num: "数量",
  value: "零售额",
  percent: "百分比",
};
const staticData = [
  {
    name: "工业增加值",
    num: 180,
    value: 148.6,
    percent: 11.9,
  },
  {
    name: "农业增加值",
    num: 280,
    value: 168.6,
    percent: 9.9,
  },
  {
    name: "互联网增加值",
    num: 380,
    value: 118.6,
    percent: 13.9,
  },
  {
    name: "房产增加值",
    num: 1110,
    value: 128.6,
    percent: 12.3,
  },
];
/**
 * @name: 切割字符串数字按照每n个一组
 * @param {String} str 字符串
 * @param {number} n 几个字符串
 * @return {Array} 数组
 */
const chunkString = function (str, n) {
  if (typeof str !== "string") {
    return [str];
  }
  return Array.from({ length: Math.ceil(str.length / n) }, (_, index) => str.slice(index * n, (index + 1) * n));
};

export default dsf.component({
  name: "DsfDataViewBusinessKeyTrades",
  ctrlCaption: "图文组件",
  mixins: [$mixins.dataView, border, dataAnalysis, dynamicField, universalRuleMixin, paginationMixin],
  components: { Pagination, keyTradesScroller },
  design: {
    isMask: false,
  },
  props: {
    // 插槽
    slots: {
      type: Array,
      default() {
        return new Array(staticData.length).fill(0).map((it, idx) => ({ name: "item-" + idx, controls: [] }));
      },
    },
    gridLayout: {
      type: Object,
      default() {
        return {
          cols: 2,
          rows: 2,
        };
      },
    },
    // 滚动设置
    scrollType: {
      type: String,
      default: "manual",
    },
    // 滚动设置
    scrollConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    selectTheme: {
      type: String,
      default: "lanse",
    },
    hoverConfig: {
      type: Object,
      default: () => ({
        isHoverFlag: false,
        bgEffect: {},
      }),
    },
    singleSizeType: {
      type: String,
      default: "auto",
    },
    propStyleFakeSelect: {
      type: String,
      default: "all",
    },
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewKeyTrades",
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    wholeBackground: {
      type: Object,
      default: () => defaultBackground,
    },
    config: {
      type: Object,
      default: () => ({
        colors: [
          {
            active: "pattern",
            imageType: "boardIcon",
            pattern: {
              image: "/dataview/file/sdk/download?files=09b193c4644441a5868ada0694982cd5",
              size: "contain",
              repeat: "no-repeat",
              position: ["center", "center"],
              customW: "100%",
              customH: "100%",
              customX: "center",
              customY: "center",
              isCustomPosition: false,
              animation: {
                name: ["dvDynamicOpacity"],
              },
              width: "160",
              height: "160",
            },
          },
        ],
      }),
    },
    isShowIcon: {
      type: Boolean,
      default: false,
    },
    imgWidth: {
      type: String,
      default: "50",
    },
    imgHeight: {
      type: String,
      default: "auto",
    },
    imgRelativeX: {
      type: String,
      default: "0",
    },
    imgRelativeY: {
      type: String,
      default: "0",
    },
    backgroundConfigs: {
      type: Array,
      default() {
        return [
          {
            bgImgObj: {
              active: "pattern",
              imageType: "board",
              pattern: {
                image: "/dataview/file/sdk/download?files=f2f8398021cd4091a92b9ec7985bf761",
                size: "100% 100%",
                repeat: "no-repeat",
                position: ["center", "center"],
                customW: "100%",
                customH: "100%",
                customX: "center",
                customY: "center",
                isCustomPosition: false,
                animation: {
                  name: [],
                },
                width: "100%",
                height: "100%",
              },
              color: {
                type: "color",
                image: "",
                isTheme: false,
                theme: "main",
                value: "",
              },
            },
          },
        ];
      },
    },
    itemWidth: {
      type: String,
      default: "200px",
    },
    itemHeight: {
      type: String,
      default: "auto",
    },
    direction: {
      type: Boolean,
      default: false,
    },
    itemAlign: {
      type: String,
      default: "center",
    },
    isCancelSelect: {
      type: Boolean,
      default: true,
    },
    isSelectEffect: {
      type: Boolean,
      default: false,
    },
    defaultSelect: {
      type: String,
      default: "无",
    },
    selectBgEffect: {
      type: Object,
      default: () => ({}),
    },
    contentWidth: {
      type: String,
      default: "100%",
    },
    // 组件整个外边距
    totalMargin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    totalPadding: {
      type: Array,
      default: () => [10, 10, 10, 10],
    },
    //单个外边距
    margin: {
      type: Array,
      default: () => [0, 10, 10, 10],
    },
    //单个内边距
    padding: {
      type: Array,
      default: () => [10, 10, 10, 10],
    },
    //外边距数组
    margins: {
      type: Array,
      default: () => [],
    },
    //内边距数组
    paddings: {
      type: Array,
      default: () => [],
    },
    align: {
      type: String,
      default: "center",
    },
    verticalAlign: {
      type: String,
      default: "center",
    },
    optionsLayout: {
      type: String,
      default: "2",
    },
    totalItemAlign: {
      type: String,
      default: "flex-start",
    },
    totalItemVAlign: {
      type: String,
      default: "flex-start",
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    configMapRelations: {
      type: Object,
      default: () => ({
        attachArr: createDefault(),
      }),
    },
  },
  data() {
    return {
      currentHoverIndex: -1, // 当前悬浮的index
      errImage,
      data: [],
      componentType: "keyTrades",
      activeItem: "",
      otherEvents: ["刷新", "还原数据", "追加数据", "删除数据", "显示", "隐藏", "获取当前值", "获取选中状态"],
    };
  },
  computed: {
    imgs() {
      const list = this.config?.colors || [];
      let res = [];
      list.forEach((it) => {
        if (typeof it === "string") {
          res.push({
            active: "custom",
            custom: {
              image: it,
              size: "contain",
              repeat: "no-repeat",
              position: ["center", "middle"],
              static: true,
              animation: null,
            },
          });
        } else {
          const image = it[it.active].image;
          const animation = it[it.active].animation || {};
          res.push({
            url: image,
            animation,
          });
        }
      });
      return res;
    },
    componentStyle() {
      let backgroundObj =
        this.dvBackgroundFormat(this.wholeBackground, {
          isBgInfoVar: true,
        }) || {};
      let style = {
        "justify-content": this.align,
        "align-items": this.verticalAlign,
        ...backgroundObj,
        width: dsf.dataview.utils.transformPx(this.contentWidth),
        margin: dsf.dataview.utils.transformArrayPx(this.totalMargin),
        padding: dsf.dataview.utils.transformArrayPx(this.totalPadding),
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
      if (this.isDesign) {
        return style;
      }
      style.height = dsf.dataview.utils.transformPx(this.height);
      return style;
    },
    itemBoxStyle() {
      let obj = {
        justifyContent: this.totalItemAlign,
        alignContent: this.totalItemVAlign,
      };
      if (this.isShowPage) {
        obj.height = `calc(100% - ${dsf.dataview.utils.transformPx(this.pageConfig.height)})`;
      }
      return obj;
    },
    mapRelations() {
      return this.configMapRelations;
    },
    getImgStyle() {
      return {
        width: dsf.dataview.utils.transformPx(this.imgWidth),
        height: dsf.dataview.utils.transformPx(this.imgHeight),
      };
    },
    getImgWrapStyle() {
      let imgRelative = this.handlePositionArrPx([this.imgRelativeX, this.imgRelativeY]);
      let style = {
        ...imgRelative,
      };
      if (this.direction) {
        style.justifyContent = this.itemAlign;
      }
      return style;
    },
  },
  watch: {
    staticData() {
      if (this.dataType === "static") {
        setTimeout(this.init, 0);
      }
    },
    defaultSelect: {
      handler(val) {
        let nowVal = val * 1;
        if (val === "" || isNaN(nowVal)) {
          this.activeItem = "";
        } else {
          this.activeItem = nowVal + 1;
        }
      },
      immediate: true,
    },
    "data.length": {
      handler(nv) {
        while (this.slots.length < nv) {
          const slot = { name: "item-" + this.slots.length, controls: [] };
          this.slots.push(slot);
        }
      },
    },
  },

  methods: {
    /**
     * 获取value 数字滚动配置项
     * @param {Object} item data 数据
     * @param {Object} attach 附加样式
     */
    getDigitalConfig(item, attach) {
      const ruleList = attach[`valueRuleList`] || [];
      const ruleStyle = this.handleUniversalRule(item, ruleList);

      const ruleColor = ruleStyle.text ? ruleStyle.text.color : "";
      const style = attach.style;

      const color = ruleColor ? ruleColor : style.valueColor;

      const fontSize = style.valueFontSize;
      const fontWeight = style.valueFontWeight;
      const fontStyle = style.valueFontStyle;
      const textDecoration = style.valueTextDecoration;
      const fontFamily = style.valueFontFamily;

      const digitalWholeConfig = dsf.mix(true, {}, style.digitalWholeConfig || { digitalStyle: {} });

      dsf.mix(true, digitalWholeConfig.digitalStyle, {
        color,
        fontSize,
        fontWeight,
        fontStyle,
        textDecoration,
        fontFamily,
      });
      return digitalWholeConfig;
    },
    /**
     * 是否显示icon,image前后缀
     * @param {Object} item data 数据
     * @param {Object} attach 附加样式
     * @param {Object} options 属性
     */
    showExtra(item, attach, options) {
      const { type, position, field } = options;
      // 规则样式
      const ruleList = attach[`${field}RuleList`] || [];
      const ruleStyle = this.handleUniversalRule(item, ruleList);

      return ruleStyle && ruleList.length && ruleStyle[type] && ruleStyle[type].position === position;
    },

    /**
     * 获取前后缀 icon,image 地址
     * @param {Object} item data 数据
     * @param {Object} attach 附加样式
     * @param {String} field 字段名称
     * @param {String} type 后缀类型
     */
    getExtraImageIcon(item, attach, field, type) {
      // 规则样式
      const ruleList = attach[`${field}RuleList`] || [];
      const ruleStyle = this.handleUniversalRule(item, ruleList);
      return type === "image" ? ruleStyle.image.url : ruleStyle.icon.icon;
    },

    /**
     * 获取前后缀image 样式
     * @param {Object} item data 数据
     * @param {Object} attach 附加样式
     * @param {String} field 字段名称
     */
    getExtraImageStyle(item, attach, field) {
      const ruleList = attach[`${field}RuleList`] || [];
      const ruleStyle = this.handleUniversalRule(item, ruleList);
      const image = ruleStyle.image;
      return {
        width: dsf.dataview.utils.transformPx(image.width),
        height: dsf.dataview.utils.transformPx(image.height),
        animation: image.animation,
      };
    },

    /**
     * 获取前后缀icon 样式
     * @param {Object} item data 数据
     * @param {Object} attach 附加样式
     * @param {String} field 字段名称
     */
    getExtraIconStyle(item, attach, field) {
      const ruleList = attach[`${field}RuleList`] || [];
      const ruleStyle = this.handleUniversalRule(item, ruleList);
      return {
        color: ruleStyle.color,
        textDecoration: "none",
        fontSize: ruleStyle.fontSize,
      };
    },

    /**
     * 规则样式
     * @param {Object} item data 数据
     * @param {Object} attach 附加样式
     * @param {String} field 字段名称
     */
    getColItemStyle(item, attach, field) {
      let style = {};
      let title = item[attach.title] || attach.title;
      if (!title) {
        style["margin-left"] = "0px";
      }
      // 规则样式
      const ruleList = attach[`${field}RuleList`] || [];
      const ruleStyle = this.handleUniversalRule(item, ruleList);

      let attachStyle = attach.style;
      const fontSize = dsf.dataview.utils.transformPx(attachStyle[`${field}FontSize`]);
      const fontFamily = attachStyle[`${field}FontFamily`];
      const fontStyle = attachStyle[`${field}FontStyle`];
      const fontWeight = attachStyle[`${field}FontWeight`];
      const textDecoration = attachStyle[`${field}TextDecoration`];
      const textShadow = attachStyle[`${field}TextShadow`];
      const textAlign = attachStyle[`${field}TextAlign`] || "left";
      const color = attachStyle[`${field}Color`];
      let colorStyle = dsf.dataview.utils.getTextColor(color);
      let colorRuleStyle = ruleStyle.text ? dsf.dataview.utils.getTextColor(ruleStyle.text.color) : {};
      if (ruleStyle.text) {
        style = {
          ...style,
          fontFamily,
          fontStyle,
          fontWeight,
          textShadow,
          textDecoration,
          textAlign,
          ...colorStyle,
          ...ruleStyle.text,
          ...colorRuleStyle,
          fontSize: ruleStyle.text.fontSize ? ruleStyle.text.fontSize : fontSize,
        };
      } else {
        style = {
          ...style,
          fontSize,
          fontFamily,
          fontStyle,
          fontWeight,
          textShadow,
          textDecoration,
          textAlign,
          ...colorStyle,
        };
      }
      let marginTop = dsf.dataview.utils.transformPx(attachStyle[`${field}MarginTop`]);
      let marginRight = dsf.dataview.utils.transformPx(attachStyle[`${field}MarginRight`]);
      let marginBottom = dsf.dataview.utils.transformPx(attachStyle[`${field}MarginBottom`]);
      let marginLeft = dsf.dataview.utils.transformPx(attachStyle[`${field}MarginLeft`]);
      let margin = `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`;
      style.margin = margin;
      if (attachStyle.isBar && field === "value") {
        style.flex = 1;
      }
      // 文字几行有省略号
      let overStyle = {};
      if (field === "name") {
        overStyle = this.handleLineNum(attach);
      }
      return {
        ...style,
        ...overStyle,
      };
    },

    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data }) {
      const attachArr = [];
      const dictionary = {};
      describe.forEach(({ title, field }) => {
        dictionary[field] = title;
        const cell = createOneKeyTrades();
        cell.title = title;
        cell.field = field;
        attachArr.push(cell);
      });
      this.mapRelations.attachArr = attachArr;
      // 布局模式使用固定
      this.$emit("update:singleSizeType", "fixed");

      // 处理成Excel
      const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
      this.excelData.length = 0;
      dsf.mix(true, this.excelData, excelData);
      this.$emit("update:excelData", excelData);
    },
    textStyleProxy(property, key = "", values = null) {
      // 图文组件字体样式字段名带有前缀，要特殊处理
      const keysArr = ["color", "fontSize", "fontWeight", "fontStyle", "fontFamily", "textDecoration", "textShadow"];
      const fontKeys = keysArr.map((str) => (key ? key + str.charAt(0).toUpperCase() + str.slice(1) : str));
      if (values !== null) {
        fontKeys.forEach((it, idx) => {
          const rKey = keysArr[idx];
          if (values[rKey] !== undefined) {
            property[it] = values[rKey];
          }
        });
      } else {
        return fontKeys.reduce((style, it, idx) => {
          const rKey = keysArr[idx];
          if (property[it] !== undefined) {
            style[rKey] = property[it];
          }
          return style;
        }, {});
      }
    },
    // 设置组件样式
    setComponentStyle(groups, props) {
      groups.forEach((group) => {
        group.attributes.forEach((attr) => {
          // configMapRelations 含有映射信息，需要特殊处理
          if (attr.bindControlAttr === "configMapRelations.attachArr") {
            let current = this.configMapRelations.attachArr;
            let target = props[attr.bindControlAttr];
            const min = Math.min(current.length, target.length);
            for (let i = 0; i < min; i++) {
              target[i].title = current[i].title;
              target[i].field = current[i].field;
              target[i].unit = current[i].unit;
              target[i].uuid = current[i].uuid;
            }
            if (current.length < target.length) {
              target = target.slice(0, min);
            } else {
              target = [...target, ...current.slice(min)];
            }
            this.updateComponentStyle(attr.bindControlAttr, null, props);
          } else if (attr.bindControlAttr && !attr.noCopy) {
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
      const textStyles = [];
      this.configMapRelations.attachArr.forEach((it) => {
        textStyles.push(this.textStyleProxy(it.style, "name"));
        textStyles.push(this.textStyleProxy(it.style, "value"));
        textStyles.push(this.textStyleProxy(it.style, "unit"));
      });
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles,
        backgrounds: [this.wholeBackground],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        const { textStyles = [], backgrounds = [] } = config;
        groups = groups.filter((it) => /布局|边框设置|背景|入场动画/.test(it.name));
        this.updateComponentStyle("wholeBackground", backgrounds[0]);
        for (let i = 0; i < textStyles.length && i < this.configMapRelations.attachArr.length * 3; i++) {
          const target = this.configMapRelations.attachArr[Math.floor(i / 3)];
          const key = ["name", "value", "unit"][i % 3];
          this.textStyleProxy(target.style, key, textStyles[i]);
        }
      }
      this.setComponentStyle(groups, config._props);
    },
    getImgSelfStyle(obj) {
      let style = {
        with: "100%",
        height: "100%",
      };
      let animationStyle = dsf.dataview.utils.analyzeAnimation(obj);
      return {
        ...style,
        ...animationStyle,
      };
    },

    unitGap(style) {
      return {
        "margin-left": dsf.dataview.utils.transformPx(style.unitGap),
      };
    },
    //获取显示值
    _getShowRes(item, value) {
      return item[value] === undefined ? value : item[value];
    },
    handleLineBreak(item, attach) {
      let showVal = this._getShowRes(item, attach.title);
      let breakNum = attach.style.lineBreak;
      if (typeof showVal === "string") {
        showVal = showVal.trim();
        let strLength = showVal.length;
        let lastStr = showVal[strLength - 1];
        let isColon = false;
        if (lastStr === "：" || lastStr === ":") {
          isColon = true;
          showVal = showVal.slice(0, -1);
        }
        let overStyle = this.handleLineNum(attach, true);
        let str = `<div style="${overStyle}">`;
        let arrStr = chunkString(showVal, breakNum);
        arrStr.forEach((eachStr, index) => {
          str += `<span>${eachStr}</span>`;
          if (index !== 0 || index !== arrStr.length - 1) {
            str += "<br/>";
          }
        });
        str += "</div>";
        if (isColon) {
          str += `<div>${lastStr}</div>`;
        }
        return str;
      }
      return showVal;
    },
    compatibleAttr() {
      let imgs = [];
      this.config?.colors.forEach((item) => {
        imgs.push(item);
      });
      this.$emit("update:config", {
        colors: imgs,
      });
    },
    judgeNoNumber(row, attach) {
      let val = row[attach.field];
      if ((typeof val === "string" && (val.includes("+") || val.includes("-"))) || isNaN(val * 1) || val === "") {
        return true;
      }
      return false;
    },
    showNoNumStr(row, attach) {
      let val = row[attach.field];
      if (val === "" || val === undefined || val === null) {
        return "";
      }
      return val;
    },
    itemStyle(index) {
      let { optionsLayout, backgroundConfigs, margin } = this;
      let singleMargin = dsf.dataview.utils.transformArrayPx(margin);
      let marginLeft = margin[3] || 0;
      let marginRight = margin[1] || 0;
      let len = backgroundConfigs.length;
      let bgPriority = null;
      let resultBg = {};
      if (backgroundConfigs.length) {
        bgPriority = "single";
      }
      let backgroundBorderObj = backgroundConfigs[index % len] || {
        bgImgObj: {},
      };

      let width = _.floor(100 / optionsLayout, 2);
      let resultWidth = this.calcWidth(width, marginLeft, marginRight);
      let resultHeight = null;
      // 单个属性
      let singleStyle = this.abstractBgArrAttr(backgroundBorderObj);

      // 选中的效果
      let selectBgEffect = {};
      if (this.isSelectEffect && this.activeItem === index + 1) {
        selectBgEffect = this.dvBackgroundFormat(this.selectBgEffect) || {};
        bgPriority = "select";
      }

      if (this.singleSizeType === "fixed") {
        resultWidth = dsf.dataview.utils.transformPx(this.itemWidth);
        resultHeight = dsf.dataview.utils.transformPx(this.itemHeight);
      }
      // 悬浮效果
      let hoverBgEffect = {};
      if (this.hoverConfig.isHoverFlag && this.currentHoverIndex === index) {
        hoverBgEffect = this.dvBackgroundFormat(this.hoverConfig.bgEffect) || {};
        selectBgEffect = {};
        delete singleStyle["background-image"];
        bgPriority = "hover";
      }
      let overSingleStyle = this.isFilterBgAttr(singleStyle, true);
      let hasBackSingleStyle = this.isFilterBgAttr(singleStyle, false);
      if (bgPriority === "hover") {
        resultBg = hoverBgEffect;
      } else if (bgPriority === "select") {
        resultBg = {
          ...selectBgEffect,
          ...overSingleStyle,
        };
      } else if (bgPriority === "single") {
        resultBg = hasBackSingleStyle;
      }
      // 处理滤镜只对图片生效
      singleStyle.filter && (resultBg.filter = singleStyle.filter);

      resultBg = dsf.dataview.utils.cssAttrToCssVar(resultBg);
      return {
        width: resultWidth,
        height: resultHeight,
        margin: singleMargin,
        ...overSingleStyle,
        ...resultBg,
      };
    },
    innerItemStyle() {
      let flexDirection = "row";
      if (this.direction) {
        flexDirection = "column";
      }
      let padding = dsf.dataview.utils.transformArrayPx(this.padding);
      let style = {
        padding,
        flexDirection,
      };
      if (this.isEventCursorPointer || this.isSelectEffect) {
        style["cursor"] = "pointer";
      }
      return style;
    },
    // 是否过滤出背景相关的属性
    isFilterBgAttr(style, flag) {
      const keys = Object.keys(style);
      const filteredKeys = keys.filter((key) =>
        flag
          ? !key.includes("filter") && !key.includes("background") && !key.includes("radius") && !key.includes("animation")
          : key.includes("background") || key.includes("borderRadius") || key.includes("animation")
      );
      return filteredKeys.reduce((obj, key) => {
        obj[key] = style[key];
        return obj;
      }, {});
    },
    calcWidth(width, marginLeft, marginRight) {
      marginLeft += "";
      marginRight += "";
      // width 为百分比
      let total = width;
      // 为px
      let diff = 0;
      let leftLength = marginLeft.length;
      let rightLength = marginRight.length;
      if (marginLeft.includes("%")) {
        // 证明包含百分比
        total -= marginLeft.slice(0, leftLength - 1);
      } else {
        if (!isNaN(marginLeft * 1)) {
          diff += marginLeft * 1;
        }
      }
      if (marginRight.includes("%")) {
        // 证明包含百分比
        total -= marginRight.slice(0, rightLength - 1);
      } else {
        if (!isNaN(marginRight * 1)) {
          diff += marginRight * 1;
        }
      }
      return `calc(${total}% - ${dsf.dataview.utils.transformPx(diff)})`;
    },
    clickItem(evt, it) {
      if (!this.isDesign) {
        let selectIndex = it.index;
        if (this.isCancelSelect && this.activeItem === selectIndex) {
          this.activeItem = "";
        } else {
          this.activeItem = selectIndex;
        }
        this.$dispatch("clickItem", it);
        this.loadClickEvents(it, evt);
      }
    },
    dataAnalysis(data = this.data) {
      if (!data || data.length == 0) {
        this.hasData = false;
        return false;
      }
      let result = data;
      if (eval(this.dynamicRules) || this.dataType === "excel" || this.modelArgs) {
        result = this.handleData(data);
      } else {
        result = data.map((item, index) => ({
          ...item,
          index: index + 1,
        }));
      }
      result = this.notRequestInitData(result);
      this.data = result;
    },

    loadCompleteEvents(data) {
      let it = this.data[this.activeItem - 1] || data;
      try {
        let { fn } = this.eventRelativeDeal.load;
        //给组件设置当前数据
        this.currentComponentData = it;
        this.handleCommonEmit(fn, it);
      } catch (e) {
        console.error(e);
      }
    },
    handleData(data) {
      let nowData = data.map((item, index) => {
        let obj = {
          ...item,
          index: index + 1,
        };
        this.mapRelations.attachArr.forEach((one) => {
          obj[one.field] = item[one.field];
        });
        return obj;
      });
      return nowData;
    },
    judgeNormalValueUnit(attach) {
      if (attach.style) {
        if (attach.style.isBar) {
          return false;
        }
        return true;
      }
      return attach.unit;
    },
    changeDataRender(list) {
      this.data = list.map((item, index) => ({
        ...item,
        index: index + 1,
      }));
    },
    clear() {
      this.data = [];
      return [];
    },
    styleConfigCallback(styleObj, theme) {
      if (styleObj && theme) {
        let configMapRelations = this.configMapRelations;
        let nameColor = styleObj.attachObj.nameColor;
        let valueColor = styleObj.attachObj.valueColor;
        let unitColor = styleObj.attachObj.unitColor;
        configMapRelations.attachArr.forEach((attach) => {
          // 名称
          attach.nameColor = nameColor;
          attach.style.nameColor = nameColor;
          attach.style.valueColor = valueColor;
          if (attach.style.digitalWholeConfig) {
            attach.style.digitalWholeConfig.color = valueColor;
          }
          // 单位
          attach.style.unitColor = unitColor;

          // 修改柱体颜色
          const colorList = theme.commonConfig.colorList;
          const barColor = colorList[0];
          // 柱体
          barColor && attach.style.barConfig && (attach.style.barConfig.bgColor = barColor);
        });
        if (styleObj.backgroundConfigs.length) {
          const res = dsf.mix(true, [], this.backgroundConfigs, styleObj.backgroundConfigs);
          this.$emit("update:backgroundConfigs", res);
        }
        this.$emit("update:configMapRelations", configMapRelations);
        this.$forceUpdate();
      }
    },
    handleBoxItemMouseEnter(e, data) {
      this.currentHoverIndex = data.index - 1;
      this.handleMouseEnter(data, e);
    },
    handleBoxItemMouseLeave(e, data) {
      this.currentHoverIndex = -1;
      this.handleMouseLeave(data, e);
      if (!this.isDesign) {
        if (this.$listeners["handleItemMouseLeave"]) {
          this.$dispatch("handleItemMouseLeave", { e, data, vm: this });
        }
      }
    },
    handleBoxItemMouseover(e, it) {
      if (!this.isDesign) {
        if (this.$listeners["handleItemMouseover"]) {
          this.$dispatch("handleItemMouseover", { e, it, vm: this });
        }
      }
    },
    handleLineNum(attach, cssFlag = false) {
      let overStyle = {};
      if (attach.style) {
        let lineNum = attach.style.lineNum;
        if (lineNum > 0) {
          overStyle = {
            display: "-webkit-box",
            overflow: "hidden",
            "text-overflow": "ellipsis",
            "-webkit-line-clamp": lineNum,
            "-webkit-box-orient": "vertical",
            "white-space": "normal !important",
            "word-break": "break-all",
          };
        } else {
          overStyle = {
            overflow: "hidden",
            "white-space": "nowrap !important",
            "--scroll-duration": Math.abs(lineNum) + "s" || "5s",
          };
        }
        if (cssFlag) {
          delete overStyle["-webkit-line-clamp"];
          overStyle = dsf.dataview.utils.transformToStyle(overStyle);
          overStyle += `-webkit-line-clamp:${lineNum};`;
        }
      }
      return overStyle;
    },
    getSelectStatus() {
      return this.activeItem !== "";
    },
    isTitleScroll(it, attach) {
      const text = it[attach.title];
      return text !== undefined && text.length > attach.style.lineBreak;
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/keytrades.scss";
</style>

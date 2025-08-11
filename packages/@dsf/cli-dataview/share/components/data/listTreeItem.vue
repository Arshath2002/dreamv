<template>
  <div class="dsf-list-tree-accordion infinite-list-wrapper scroller" v-if="listData.length > 0">
    <template v-for="(row, ri) in listData">
      <div
        :class="{
          'active-row-item': __context__.activeRowId === row.id,
        }"
        :key="row.id"
        class="row-item"
        :style="__context__.getRowItemStyle(row, ri)"
        @mouseenter="(e) => __context__.handleRowItemMouseEnter(e)"
        @mouseleave="(e) => __context__.handleRowMouseLeave(e, row, ri)"
      >
        <div class="ceil-wrap" v-for="(ceil, ci) in header" v-show="!ceil.hide" :key="`${ceil.id}${ri}${ci}`" :style="__context__.getCeilWrapStyle()">
          <div class="ceil" v-if="ceil" :class="`${ceil.isIndex ? 'ceil-index' : ''}`" :style="__context__.getCeilStyle(ceil, ci)" @click="emitEvent('clickItem', ri, ci, row, ceil, $event)">
            <slot :name="ceil.slotName ? ceil.slotName : 'default'" :ceil="ceil" :row="row" :index="ri" :col="ci">
              <!-- 序号 -->
              <template v-if="ceil.isIndex">
                <div v-if="__context__.indexAttrConfig.isShowChildren ? true : level == 0" :style="getSortWHF(row)" class="index-cell">
                  <template v-if="getSortWHF(row).other.showContent === 'number'">
                    {{ ri + 1 }}
                  </template>
                  <DsfIcon :name="getSortWHF(row).other.icon" v-else></DsfIcon>
                </div>
              </template>
              <div
                v-else
                class="common-content"
                :class="{
                  'real-content': __context__.config.fixEachRowHeightFlag,
                  'auto-real-content': !__context__.config.fixEachRowHeightFlag,
                  'bar-content': ceil.isBar,
                }"
                :style="__context__.lastContentStyle(ceil)"
                :align="ceil.align"
                :title="__context__.getGeneralVal(row, ceil)"
              >
                <!-- 缩进规则 -->
                <div :style="getChildrenStyle(ci)"></div>
                <div
                  v-if="(ci === 0 && row.children && dsf.isArray(row.children) && row.children.length > 0) ||(header[0].isIndex && ci === 1 && row.children && dsf.isArray(row.children) && row.children.length > 0)"
                  :class="{ isActive: row.isOpen }"
                  :style="__context__.accordionIconStyle"
                  class="list-arrow-icon"
                  @click.stop="toggle(row)"
                >
                  <i class="el-icon el-icon-arrow-right"></i>
                </div>

                <div class="temp-box">
                  <span v-for="space in __context__.getIndentRule(row, ceil)" :key="space"> &nbsp; </span>
                </div>
                <!-- 前缀 -->
                <template v-if="ceil.prefixConfig.defaultConfig.flag && !ceil.isBar">
                  <PrefixSuffixThing
                    :config="ceil.prefixConfig"
                    :row="row"
                    wrapClass="table-ceil-prefix"
                    :belongDvComp="__context__"
                    :analysisRuleToDataField="__context__.analysisRuleToDataField"
                    :analysisKeyToDataField="__context__.analysisKeyToDataField"
                  ></PrefixSuffixThing>
                </template>
                <!-- 柱体 -->
                <template v-if="ceil.isBar">
                  <div class="progress-wrap" :style="__context__.progressWrapStyle(ceil, barIndex)" v-for="(barObj, barIndex) in ceil.barInfo" :key="`${ceil.id}_${barIndex}`">
                    <div class="progress" :style="__context__.getOuterStyle(ci, barIndex)">
                      <div class="inner-progress" :style="__context__.getInnerStyle(row, ceil, ci, barIndex)">
                        <div class="progress-text">
                          <span :style="__context__.getBarSuffixStyle(barObj, row)">
                            {{ __context__.getBarValue(barObj, ceil, row) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <!-- 普通内容 -->
                <template v-else>
                  <div class="text-box" :style="__context__.getDataRuleStyle(row, ceil)">
                    {{ __context__.getGeneralVal(row, ceil) }}
                  </div>
                </template>
                <!-- 后缀-->
                <template v-if="ceil.suffixConfig.defaultConfig.flag && !ceil.isBar">
                  <PrefixSuffixThing
                    :config="ceil.suffixConfig"
                    :row="row"
                    :belongDvComp="__context__"
                    wrapClass="table-ceil-prefix"
                    :analysisRuleToDataField="__context__.analysisRuleToDataField"
                    :analysisKeyToDataField="__context__.analysisKeyToDataField"
                  ></PrefixSuffixThing>
                </template>
                <br />
              </div>
            </slot>
          </div>
        </div>
        <!-- 背景图 -->
        <div class="row-item-bg" :style="__context__.rowItemBgStyle(row)"></div>
      </div>
      <div v-if="row.children && row.children.length && row.children.length > 0 && row.isOpen" :key="ri">
        <ListTreeItem :items="row.children" :level="row.level + 1" :__context__="__context__"></ListTreeItem>
      </div>
    </template>
  </div>
</template>

<script>
import PrefixSuffixThing from "_dataview/share/components/data/common/prefixSuffixThing";
export default {
  name: "ListTreeItem",
  components: {
    PrefixSuffixThing,
  },
  props: {
    __context__: {
      type: Object,
      default() {
        return {};
      },
    },
    items: Array,
    level: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    //表头数据
    headerData() {
      return this.__context__.headData;
    },
    //表头
    header() {
      return this.__context__.header;
    },
  },
  watch: {
    items: {
      handler(v) {
        if (v.length !== 0) {
          this.listData = [];
          this.activeArr = [];
          this.barAutoCalcMaxObj = {};
          this.outerAutoCalcMaxObj = {};
          let maxObj = {};
          let outerMaxObj = {};
          let flatHeaderData = this.__context__.flatten(this.headerData);
          v.forEach((item, index) => {
            if (item.id === undefined) {
              item.id = dsf.uuid(16);
            }
            item.index = index + 1;
            item.rowIndex = index;
            item.isOpen = false;
            flatHeaderData.forEach((h) => {
              if (h.isBar) {
                this.__context__.getCalcMaxBar(outerMaxObj, maxObj, item, h);
              }
            });
            item.level = this.level;
          });
          this.barAutoCalcMaxObj = maxObj;
          this.outerAutoCalcMaxObj = outerMaxObj;
          this.$nextTick(() => {
            this.listData = _.cloneDeep(v);
          });
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      heights: [],
      listData: [],
    };
  },
  methods: {
    getSortWHF(row) {
      const indexAttrConfig = this.__context__.indexAttrConfig.setting;
      const attr = indexAttrConfig[this.level] ? indexAttrConfig[this.level] : indexAttrConfig[indexAttrConfig.length - 1];

      let { borderRadius, width, height, fontSize, fontWeight, fontStyle, fontFamily, textDecoration, textShadow } = attr;
      borderRadius = dsf.dataview.utils.transformArrayPx(borderRadius);

      width = dsf.dataview.utils.transformPx(width);
      height = dsf.dataview.utils.transformPx(height);
      fontWeight = fontWeight;
      const bgColor = this.__context__.getColorIcon(attr, "bgColors", row.rowIndex);
      const fontColor = this.__context__.getColorIcon(attr, "fontColors", row.rowIndex);
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
        borderRadius,
        color: fontColor,
      };
      let icon = this.__context__.getColorIcon(attr, "icons", row.rowIndex);
      obj.other = {
        ...attr,
        icon,
      };
      return obj;
    },
    getChildrenStyle(ci) {
      const isIndex = this.header[0].isIndex ? true : false;
      if ((isIndex && ci === 1 && this.level !== 0) || (!isIndex && ci === 0 && this.level !== 0)) {
        let width = this.__context__.accordionIconStyle["icon-left"] * this.level;
        let style = {
          width: `${dsf.dataview.utils.transformPx(width)} !important`,
        };
        return style;
      }
      return null;
    },
    toggle(item) {
      item.isOpen = !item.isOpen;
      let activeId = "";
      if (item.isOpen) {
        activeId = item.id;
      }
      this.__context__.activeRowId = activeId;

      this.$nextTick(() => {
        if (this.__context__.isScroll) {
          this.__context__.judgeAnimate();
        }
      });
    },
    emitEvent(type, ri, ci, orgRow, ceil, evt) {
      let row = _.cloneDeep(orgRow);
      const { rowIndex } = row;
      let activeId = "";
      if (this.__context__.isCancelSelect) {
        activeId === row.id ? (activeId = "") : (activeId = row.id);
      } else {
        activeId = row.id;
      }

      this.__context__.activeRowId = activeId;
      if (row.children) {
        Reflect.deleteProperty(row, "children");
      }
      this.__context__.$dispatch(type, {
        row,
        ceil,
        rowIndex,
        columnIndex: ci,
      });
      if (type === "clickItem") {
        let value = row[ceil.map] || "";
        let label = ceil?.label || "";
        this.__context__.loadClickEvents(row);
        let nowObjCell = {
          value,
          label,
        };
        this.__context__.$dispatch("loadClickCellEvents", nowObjCell);
        this.__context__.loadClickCellEvents(nowObjCell, evt);
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/listTreeTable.scss";
</style>

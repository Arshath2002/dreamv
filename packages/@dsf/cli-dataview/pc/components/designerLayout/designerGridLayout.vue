<!--
 * @Editor: zhanghang
 * @Description: 设计器下页面中布局
 * @Date: 2024-03-07 15:10:40
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 11:33:02
-->
<template>
  <div
    class="designer-grid-layout__wrapper"
    @mouseup="selectGridMouseup"
    @mousemove="selectGridMousemove"
    @mousedown="selectGridMousedown"
    @click.stop="recordMouse"
    v-context-menu="contentMenuEmpty"
    tabindex="-1"
    ref="wrapper"
  >
    <grid-layout
      v-if="dragGridLoaded"
      v-context-menu="contentMenuEmpty"
      :layout="[...currentLayout, ...compositionLayout, ...selectBoundLayout]"
      :col-num="colNum"
      :col-num-unit="colNumUnit"
      :row-height="rowHeight"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="false"
      :margin="margin"
      :use-css-transforms="true"
      :preventCollision="false"
      :transformScale="transformScale"
      :responsive="false"
      :freeDrag="true"
      :freeResize="true"
      @layout-updated="layoutUpdatedEvent"
      :style="layoutStyle"
      ref="gridLayout"
    >
      <template v-for="item in mergeLayout">
        <grid-item
          v-if="item.i.indexOf(',') === -1"
          :grid-sign="`${item.i}`"
          :grid-x="`${item.x}`"
          :grid-y="`${item.y}`"
          :grid-w="`${item.w}`"
          :grid-h="`${item.h}`"
          v-context-menu="contentMenu"
          :style="commonGridStyle(item, activeItem.includes(item.i) ? 900 : item.zIndex)"
          @mousedown.native.stop="handleActiveItem($event, item)"
          @resized="resizedEvent"
          @moved="resizedEvent"
          @resize="resizeEvent"
          @move="moveGrid"
          @dragEnd="resetHelperLine"
          @container-position-resized="posChange($event, item)"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :static="item.static"
          :isResizable="isNotComposition(item.i)"
          :key="item.i"
          :class="{
            locked: item.static,
            active: activeItem.includes(item.i),
            composition: activeItem.includes(item.i) && judgeInComposition(item.i),
            selected: selectBoundLayout.find((it) => it.i.split(',').includes(item.i)),
          }"
        >
          <a
            class="dv-grid-item-box"
            @click.stop
            @mousedown.stop
            @mousemove.stop
            @keyup.stop
            @keydown.stop
            v-if="activeItem.includes(item.i) && !judgeInComposition(item.i) && !selectBoundLayout.find((it) => it.i.split(',').includes(item.i))"
            :class="positionClass(item)"
          >
            <div class="dv-grid-item-box__size">{{ item.i }}</div>
            <div class="dv-grid-item-box__size">
              <div class="dv-grid-item-box__size__item">
                <span>x：</span>
                <input type="number" class="size-input" :value="item.x" @input="changeItem($event, item, 'x')" />
              </div>
              <div class="dv-grid-item-box__size__item"><span>y：</span><input type="number" class="size-input" :value="item.y" @input="changeItem($event, item, 'y')" /></div>
              z：{{ item.zIndex }}
            </div>
            <div class="dv-grid-item-box__size">
              <div class="dv-grid-item-box__size__item"><span>w：</span><input type="number" class="size-input" :value="item.w" @input="changeItem($event, item, 'w')" />{{ colNumUnit }}</div>
              <div class="dv-grid-item-box__size__item">
                <span>h：</span>
                <input type="number" class="size-input" :value="item.h" @input="changeItem($event, item, 'h')" />{{ colNumUnit }}
              </div>
            </div>
          </a>
        </grid-item>
        <!-- 组合单元格 -->
        <grid-item
          v-else
          v-context-menu="contentCompositionMenu"
          :key="`${item.i}_composition`"
          class="dv-grid-item-composition"
          :class="{ active: ~activeComposition.findIndex((it) => it.i === item.i), locked: item.static }"
          :style="commonGridStyle(item, ~activeComposition.findIndex((it) => it.i === item.i) ? 910 : item.zIndex)"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :static="item.static"
          :isResizable="false"
          @mousedown.native.stop="handleActiveComposition($event, item)"
          @move="dragCompositionEvent"
          @dragEnd="resetHelperLine"
        >
        </grid-item>
      </template>

      <!-- 框选单元格  -->
      <grid-item
        v-context-menu="selectBoundMenu"
        v-for="item in selectBoundLayout"
        :key="item.i"
        class="dv-grid-item-select-composition"
        :style="{ zIndex: 1000 }"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @mousedown.native.stop
        @resized="resizedSelectEvent"
        @move="dragSelectCompositionEvent"
        @dragEnd="resetHelperLine"
        @resize="resizeSelectEvent"
      >
        <a
          class="dv-grid-item-box"
          @click.stop
          @mousedown.stop
          @mousemove.stop
          @keyup.stop
          @keydown.stop
          :class="{ 'top-left': (colNumUnit == '%' && item.w + item.x >= 90) || (colNumUnit != '%' && item.w + item.x >= designerRatio.width - 280) }"
        >
          <div class="dv-grid-item-box__size">x：{{ item.x }}{{ colNumUnit }} y：{{ item.y }}{{ colNumUnit }}</div>
          <div class="dv-grid-item-box__size">w：{{ item.w.toFixed(2) }}{{ colNumUnit }} h：{{ item.h.toFixed(2) }}{{ colNumUnit }}</div>
        </a>
      </grid-item>
    </grid-layout>

    <div class="horizontal-line-helper" :style="{ left: topLine.left.x + colNumUnit, top: topLine.left.y + colNumUnit, width: topLine.right.x - topLine.left.x + colNumUnit }"></div>
    <div class="horizontal-line-helper" :style="{ left: bottomLine.left.x + colNumUnit, top: bottomLine.left.y + colNumUnit, width: bottomLine.right.x - bottomLine.left.x + colNumUnit }"></div>
    <!-- 横向标注线 -->
    <div
      class="horizontal-line-helper"
      v-if="horizontalLine.right.x - horizontalLine.left.x"
      :style="{ left: horizontalLine.left.x + colNumUnit, top: horizontalLine.left.y + colNumUnit, width: horizontalLine.right.x - horizontalLine.left.x + colNumUnit }"
    >
      <span class="tag" v-text="transformPxUnit(horizontalLine.right.x - horizontalLine.left.x, 1)"></span>
    </div>
    <div class="vertical-line-helper" :style="{ top: rightLine.top.y + colNumUnit, left: rightLine.top.x + colNumUnit, height: rightLine.bottom.y - rightLine.top.y + colNumUnit }"></div>
    <div class="vertical-line-helper" :style="{ top: leftLine.top.y + colNumUnit, left: leftLine.top.x + colNumUnit, height: leftLine.bottom.y - leftLine.top.y + colNumUnit }"></div>
    <!-- 纵向标注线 -->
    <div
      class="vertical-line-helper"
      v-if="verticalLine.bottom.y - verticalLine.top.y"
      :style="{ top: verticalLine.top.y + colNumUnit, left: verticalLine.top.x + colNumUnit, height: verticalLine.bottom.y - verticalLine.top.y + colNumUnit }"
    >
      <span class="tag" v-text="transformPxUnit(verticalLine.bottom.y - verticalLine.top.y, 2)"></span>
    </div>

    <!-- 横向中心标注线 -->
    <div class="x-center-line-helper" v-if="xCenterLine"></div>
    <!-- 纵向中心标注线 -->
    <div class="y-center-line-helper" v-if="yCenterLine"></div>

    <div class="select-grid-bound-wrapper" v-if="selectDown" :style="selectBoundWrapper"></div>
  </div>
</template>
<script>
import _select from "./_select";
import _setting from "./_setting";
import _size from "./_size";
import _keyboard from "./_keyboard.js";

export default {
  name: "DvDesignerGridLayout",
  mixins: [_keyboard],
  props: {
    parentHeight: {
      type: Number,
      require: true,
    },
    designer: {
      type: Object,
      require: true,
    },
    //页面全部分层布局
    layout: {
      type: Array,
      require: true,
    },
    //当前激活层级 1 为第一层
    activeLevel: {
      type: Number,
      default: 1,
    },
    //当前激活分辨率
    activeRatio: {
      type: String,
      default: ">=1920",
    },
    //当前页面宽高
    designerRatio: {
      type: Object,
      default() {
        return {};
      },
    },
    //缩放比例
    transformScale: {
      type: Number,
      default: 1,
    },
    compositionLayouts: {
      type: Object,
      require: true,
    },
  },
  computed: {
    layoutStyle() {
      const containerHeight = this.containerHeight;
      if (containerHeight && this.activeRatio != "<768") {
        return {
          background: `linear-gradient(to bottom, rgba(255,0,0,0) ${containerHeight}px,rgb(245, 108, 108) ${containerHeight}px, rgb(245, 108, 108))`,
        };
      } else {
        return {};
      }
    },
    selectBoundWrapper() {
      const { startPointX, startPointY, endPointX, endPointY } = this.selectBound;
      const width = Math.abs(endPointX - startPointX);
      const height = Math.abs(endPointY - startPointY);

      const left = startPointX < endPointX ? startPointX : endPointX;
      const top = startPointY < endPointY ? startPointY : endPointY;
      const scale = Math.round(1 / this.transformScale);
      return {
        width: width + "px",
        height: height + "px",
        left: left + "px",
        top: top + "px",
        border: `${scale}px dashed red`,
      };
    },
    // i->grid 字母映射单元格
    letterMapGrids() {
      const result = new Map();
      this.currentLayout.forEach((it) => {
        result.set(it.i, it);
      });
      return result;
    },
    // 合并离散单元格和组合单元格
    mergeLayout() {
      const compositionLayout = this.compositionLayout;
      const currentLayout = this.currentLayout;
      const compositions = compositionLayout.reduce((arr, item) => arr.concat(item.i.split(",")), []);

      // 每个组合单元格中的代表层级单元格
      const cachePresentGrids = [];
      const imapToComposition = new Map();

      // 需要找出组合中层级最高的单元格
      compositionLayout.forEach((it) => {
        // 最大单元格
        let max = null;
        let maxIndex = -1;
        it.i.split(",").forEach((i) => {
          const gridIndex = currentLayout.findIndex((l) => l.i === i);
          if (gridIndex > -1) {
            const grid = currentLayout[gridIndex];
            if (!max || max.zIndex < grid.zIndex || (max.zIndex == grid.zIndex && gridIndex > maxIndex)) {
              max = grid;
              maxIndex = gridIndex;
            }
          }
        });

        cachePresentGrids.push(max.i);
        imapToComposition.set(max.i, it);
      });

      // 获取离散单元格以及组合单元格的代表单元格
      const gridsLayout = currentLayout.filter((it) => !compositions.includes(it.i) || cachePresentGrids.includes(it.i));

      const sortLayout = gridsLayout.map((it) => {
        // 判断是添加离散单元格还是组合单元格
        const composition = imapToComposition.get(it.i);
        return composition ? composition : it;
      });
      const singleLayout = currentLayout.filter((it) => compositions.includes(it.i));

      return [...singleLayout, ...sortLayout];
    },
  },

  data() {
    const color = dsf.themeConfig.currentTheme.normal;
    return {
      selectDown: false,
      selectBound: {
        startPointX: 0,
        startPointY: 0,
        endPointX: 0,
        endPointY: 0,
      },
      // 页面中心对齐线
      xCenterLine: false,
      yCenterLine: false,

      topLine: {
        left: {
          x: 0,
          y: 0,
        },
        right: {
          x: 0,
          y: 0,
        },
      },
      // 横线标注线
      horizontalLine: {
        left: {
          x: 0,
          y: 0,
        },
        right: {
          x: 0,
          y: 0,
        },
      },
      bottomLine: {
        left: {
          x: 0,
          y: 0,
        },
        right: {
          x: 0,
          y: 0,
        },
      },
      verticalLine: {
        top: {
          x: 0,
          y: 0,
        },
        bottom: {
          x: 0,
          y: 0,
        },
      },
      leftLine: {
        top: {
          x: 0,
          y: 0,
        },
        bottom: {
          x: 0,
          y: 0,
        },
      },
      rightLine: {
        top: {
          x: 0,
          y: 0,
        },
        bottom: {
          x: 0,
          y: 0,
        },
      },
      //组合单元格
      compositionLayout: [],
      //框选单元格
      selectBoundLayout: [],

      isBound: false,
      mouseEvent: {
        x: 0,
        y: 0,
        unit: "%",
      },
      activeItem: [],
      // 激活的单元格对象
      activeItemGrid: [],
      //激活的组合
      activeComposition: [],

      //grid库是否加载完成
      dragGridLoaded: false,
      //容器高度
      containerHeight: 0,
      //100列
      colNum: 100,
      //行高
      rowHeight: 0,
      //单元格间隙
      margin: [],
      //当前激活分辨率布局
      currentLayout: [],
      //当前层级所有布局
      activeLevelLayout: {},
      //单位
      colNumUnit: "%",
      // 右键菜单
      contentMenu: {
        data: [
          { icon: "icon-calculatedColumn", name: "组合", hide: this.isHideComposition, color, handler: this.composition },
          { icon: "icon-calculatedColumn", name: "合并组合", hide: this.isHideCompositionMix, color, handler: this.compositionMix },
          { icon: "icon-add", name: "新增单元格", hide: this.isHideCommonBtn, color, handler: () => this.addGrid() },
          { icon: "icon-wnet", name: "设置宽高", hide: this.isHideCommonBtn, color, handler: this.setSize },
          { icon: "icon-dbgx", name: "切换布局模式", hide: this.isHideCommonBtn, color, handler: this.changeUnit },
          { icon: "icon-suo", name: "锁定", hide: this.isHideLocked, color, handler: this.locked },
          { icon: "icon-suozi", name: "取消锁定", hide: this.isHideUnLocked, color, handler: this.unLocked },
          { icon: "icon-arrow-up-new", name: "上移", hide: this.isHideCommonBtn, color, handler: this.gridUp },
          { icon: "icon-arrow-down-new", name: "下移", hide: this.isHideCommonBtn, color, handler: this.gridDown },
          { icon: "icon-zhiding1", name: "置顶", color, handler: this.gridTop },
          { icon: "icon-zhidi", name: "置底", color, handler: this.gridBottom },
          { icon: "icon-shanchu", name: "删除", color, handler: this.deleteAllGrid },
          { icon: "icon-mian", name: "清空画布", color, handler: this.clearLayout },
          { icon: "icon-set", name: "属性设置", hide: this.isHideCommonBtn, color, handler: this.setProperty },
        ],
      },
      contentMenuEmpty: {
        data: [
          { icon: "icon-add", name: "新增单元格", color, handler: () => this.addGrid() },
          { icon: "icon-dbgx", name: "切换布局模式", color, handler: this.changeUnit },
          { icon: "icon-mian", name: "清空画布", color, handler: this.clearLayout },
        ],
      },
      //组合状态的右键菜单
      contentCompositionMenu: {
        data: [
          { icon: "icon-calculatedColumn", name: "合并组合", hide: this.isHideCompositionMenu, color, handler: this.compositionMix },
          { icon: "icon-icon-subordinate", name: "取消组合", color, handler: this.dismissComposition },
          { icon: "icon-suo", name: "锁定", hide: this.isHideLocked, color, handler: this.locked },
          { icon: "icon-suozi", name: "取消锁定", hide: this.isHideUnLocked, color, handler: this.unLocked },
          { icon: "icon-zhiding1", name: "置顶", color, handler: this.gridTop },
          { icon: "icon-zhidi", name: "置底", color, handler: this.gridBottom },
          { icon: "icon-shanchu", name: "删除", color, handler: this.deleteAllGrid },
        ],
      },
      //框选状态菜单
      selectBoundMenu: {
        data: [
          { icon: "icon-calculatedColumn", name: "合并组合", hide: this.isHideCompositionMenu, color, handler: this.compositionMix },
          { icon: "icon-icon-subordinate", name: "取消组合", color, handler: this.dismissComposition },
          { icon: "icon-suo", name: "锁定", hide: this.isHideLocked, color, handler: this.locked },
          { icon: "icon-zhiding1", name: "置顶", color, handler: this.gridTop },
          { icon: "icon-zhidi", name: "置底", color, handler: this.gridBottom },
          { icon: "icon-shanchu", name: "删除", color, handler: this.deleteAllGrid },
        ],
      },
    };
  },
  created() {
    // 对齐提示框
    this.gridTooltip = _.debounce(() => {
      const locals = this.getActiveItemsLocation();
      const activeItemGrid = this.activeItemGrid;
      let x = Number.MAX_SAFE_INTEGER;
      let y = Number.MAX_SAFE_INTEGER;
      locals.forEach((it) => {
        x = Math.min(it.x, x);
        y = Math.min(it.y, y);
      });
      //左侧x
      let minX = Number.MAX_SAFE_INTEGER;
      //左侧中心坐标X
      let minCentX = Number.MAX_SAFE_INTEGER;
      // 右侧x
      let maxX = Number.MIN_SAFE_INTEGER;
      // 右侧中心坐标x
      let maxCentX = Number.MIN_SAFE_INTEGER;
      //上侧y
      let minY = Number.MAX_SAFE_INTEGER;
      //上侧中心坐标y
      let minCentY = Number.MAX_SAFE_INTEGER;
      // 下侧x
      let maxY = Number.MIN_SAFE_INTEGER;
      //下侧中心坐标y
      let maxCentY = Number.MIN_SAFE_INTEGER;

      //允许对齐
      let allowAlign = false;
      // 允许组合
      let allowComposition = false;
      //允许锁住
      let allowLocked = false;

      activeItemGrid.forEach((item) => {
        maxX = Math.max(item.x + item.w, maxX);
        minX = Math.min(item.x, minX);
        maxCentX = Math.max(item.x + item.w / 2, maxCentX);
        minCentX = Math.min(item.x + item.w / 2, minCentX);

        minY = Math.min(item.y, minY);
        minCentY = Math.min(item.y + item.h / 2, minCentY);

        maxY = Math.max(item.y + item.h, maxY);
        maxCentY = Math.max(item.y + item.h / 2, maxCentY);

        if (!this.judgeInComposition(item.i)) {
          allowComposition = true;
          !item.static && (allowAlign = true);
        }
        if (!item.static) {
          allowLocked = true;
        }
      });

      this.$dvGridTooltip({
        x,
        y,
        options: {
          allowAlign,
          allowComposition,
          allowLocked,
          // 回调方法
          callback: (type) => {
            switch (type) {
              //左对齐
              case 1:
                activeItemGrid.forEach((item) => {
                  !this.judgeInComposition(item.i) && !item.static && this.$set(item, "x", minX);
                });
                break;
              //水平居中
              case 2:
                activeItemGrid.forEach((item) => {
                  !this.judgeInComposition(item.i) && !item.static && this.$set(item, "x", (minX + maxX - item.w) / 2);
                });
                break;
              //右对齐
              case 3:
                activeItemGrid.forEach((item) => {
                  !this.judgeInComposition(item.i) && !item.static && this.$set(item, "x", maxX - item.w);
                });
                break;
              //顶端对齐
              case 4:
                activeItemGrid.forEach((item) => {
                  !this.judgeInComposition(item.i) && !this.judgeInComposition(item.i) && !item.static && this.$set(item, "y", minY);
                });
                break;
              //垂直居中
              case 5:
                activeItemGrid.forEach((item) => {
                  !this.judgeInComposition(item.i) && !item.static && this.$set(item, "y", (minY + maxY - item.h) / 2);
                });
                break;
              //底端对齐
              case 6:
                activeItemGrid.forEach((item) => {
                  !this.judgeInComposition(item.i) && !item.static && this.$set(item, "y", maxY - item.h);
                });
                break;
              //中心对齐
              case 7:
                activeItemGrid.forEach((item) => {
                  !this.judgeInComposition(item.i) && !item.static && this.$set(item, "x", (minX + maxX - item.w) / 2);
                  !this.judgeInComposition(item.i) && !item.static && this.$set(item, "y", (minY + maxY - item.h) / 2);
                });
                break;
              //横向均等分布
              case 12:
                const sortByX = _.orderBy(activeItemGrid, ["x"], ["asc"]);
                const avgX = (maxCentX - minCentX) / (sortByX.length - 1);
                sortByX.forEach((item, index) => {
                  if (!this.judgeInComposition(item.i) && !item.static) {
                    const val = minCentX + index * avgX;
                    this.$set(item, "x", val - item.w / 2);
                  }
                });
                break;
              //纵向均等分布
              case 13:
                const sortByY = _.orderBy(activeItemGrid, ["y"], ["asc"]);
                const avgY = (maxCentY - minCentY) / (sortByY.length - 1);
                sortByY.forEach((item, index) => {
                  if (!this.judgeInComposition(item.i) && !item.static) {
                    const val = minCentY + index * avgY;
                    this.$set(item, "y", val - item.h / 2);
                  }
                });
                break;
              // 组合
              case 8:
                this.compositionMix();
                this.refreshTooltip();
                break;
              // 取消组合
              case 9:
                this.dismissComposition();
                this.refreshTooltip();
                break;
              // 锁住
              case 10:
                this.locked();
                break;
              // 取消锁住
              case 11:
                this.unLocked();
                break;
            }
            const wrapper = document.querySelector(".designer-grid-layout__wrapper");
            wrapper && wrapper.focus();
          },
        },
      });
    }, 500);

    this.changeItem = _.debounce((evt, item, key) => {
      this.$set(item, key, Number(evt.target.value));
    }, 500);

    //预处理
    this.preDealLayout();
    //加载库
    this.loadLib();

    let isOutline = false;
    // 布局传递坐标信息
    dsf.emit.$on(
      "designer-grid-box-select",
      (data) => {
        isOutline = true;
        this.judgeGridIsBound(data);
      },
      this
    );
    // 放开
    dsf.emit.$on(
      "designer-grid-box-select-up",
      (data) => {
        setTimeout(() => {
          this.isBound = false;
          if (isOutline) {
            const wrapper = document.querySelector(".designer-grid-layout__wrapper");
            wrapper && wrapper.focus();
          }
          isOutline = false;
        }, 0);
      },
      this
    );
    // 高亮单元格
    dsf.emit.$on(
      "designer-grid-box-highlight",
      (data) => {
        const { i, type, mouse } = data;
        if (mouse === "enter") {
          if (type === "composition") {
            const item = this.compositionLayout.find((it) => it.i === i);
            // 激活activeItem
            let activeItem = [];
            this.activeComposition = [item];
            this.activeComposition.forEach((it) => {
              activeItem.push(...it.i.split(","));
            });
            this.activeItem = activeItem;
          } else {
            this.activeItem = [i];
          }
        } else {
          this.activeItem = [];
          this.activeComposition = [];
        }
      },
      this
    );
  },
  beforeDestroy() {
    dsf.emit.$remove("designer-grid-box-select", this);
    dsf.emit.$remove("designer-grid-box-select-up", this);
    dsf.emit.$remove("designer-grid-box-highlight", this);
  },
  mounted() {
    this.setContainerHeight();
    this.initCurrentLayout();
  },
  watch: {
    activeItem: {
      handler(v) {
        // 隐藏提示框
        this.$dvGridTooltipHide();
        const activeItemGrid = [];
        if (v.length == 0) {
          this.selectBoundLayout = [];
        } else {
          this.currentLayout.forEach((item) => {
            if (v.includes(item.i)) {
              activeItemGrid.push(item);
            }
          });
        }
        this.activeItemGrid = activeItemGrid;
        // 这里需要更新设计器左侧
        dsf.emit.$emit("update-tree-grid-active", v);
      },
      deep: true,
    },
    activeItemGrid: {
      handler(v) {
        // 更新组合单元格位置
        if (v.length > 1) {
          this.refreshTooltip();
          //更新组合单元格位置
          this.activeItem.forEach((letter) => {
            this.updateCompositionByGrid(letter);
          });
        }
        // 框选框
        this.selectBoundLayout.length && this.selectComposition();
      },
      deep: true,
    },
    //层级切换
    activeLevel() {
      this.$nextTick(() => {
        this.setContainerHeight();
        this.initCurrentLayout();
      });
    },
    designerRatio() {
      this.$nextTick(() => {
        this.setContainerHeight();
        this.initCurrentLayout();
      });
    },
    parentHeight() {
      this.$nextTick(() => {
        this.setContainerHeight();
        this.initCurrentLayout();
      });
    },
    //单位切换
    colNumUnit(v) {
      this.activeLevelLayout.colNumUnit = v;
      this.activeLevelLayout.rowHeightUnit = v;
      if (v === "%") {
        this.colNum = 100;
        this.rowHeight = +(this.containerHeight / 100).toFixed(2);
        this.activeLevelLayout.colNum = 100;
        this.activeLevelLayout.rowHeight = 1;
      } else {
        this.rowHeight = 1;
        this.colNum = 1;
        this.activeLevelLayout.colNum = 1;
        this.activeLevelLayout.rowHeight = 1;
      }
      this.$nextTick(() => {
        this.$refs.gridLayout && this.$refs.gridLayout.updateHeight();
      });
    },
  },
  methods: {
    positionClass(item) {
      const { colNumUnit, designerRatio } = this;
      const { x, w } = item;
      if ((colNumUnit == "%" && w >= 80) || (colNumUnit != "%" && w >= designerRatio.width - 280)) {
        return "inner";
      } else if ((colNumUnit == "%" && w + x >= 90) || (colNumUnit != "%" && w + x >= designerRatio.width - 280)) {
        return "top-left";
      }
      return "";
    },
    posChange(pos, item) {
      const { x, y, w, h } = pos;
      if (item.x != x) {
        this.$set(item, "x", x);
      }
      if (item.y != y) {
        this.$set(item, "y", y);
      }
      if (item.w != w) {
        this.$set(item, "w", w);
      }
      if (item.h != h) {
        this.$set(item, "h", h);
      }
    },
    /**
     * 单元格/组合单元格样式
     */
    commonGridStyle(item, zIndex) {
      const show = item.show != false;
      return {
        "pointer-events": show ? "auto" : "none",
        opacity: show ? 1 : 0,
        zIndex: zIndex,
      };
    },

    /**
     * @Description 刷新提示框状态
     */
    refreshTooltip() {
      this.$dvGridTooltipHide();
      this.gridTooltip();
    },
    selectGridMousedown(e) {
      this.selectDown = true;
      const { clientX, clientY } = e;

      const el = this.$refs.wrapper;
      const { left, top } = el.getBoundingClientRect();

      const x = Math.round((clientX - left) / this.transformScale);
      const y = Math.round((clientY - top) / this.transformScale);

      this.selectBound.startPointX = x;
      this.selectBound.startPointY = y;
      this.selectBound.endPointX = x;
      this.selectBound.endPointY = y;

      this.activeItem = [];
      this.activeComposition = [];
    },
    selectGridMouseup(e) {
      this.selectDown = false;
      this.selectBound.startPointX = 0;
      this.selectBound.startPointY = 0;
      this.selectBound.endPointX = 0;
      this.selectBound.endPointY = 0;
    },
    selectGridMousemove(e) {
      if (this.selectDown) {
        const el = this.$refs.wrapper;
        const { left, top } = el.getBoundingClientRect();
        const { clientX, clientY } = e;
        const x = Math.round((clientX - left) / this.transformScale);
        const y = Math.round((clientY - top) / this.transformScale);

        this.selectBound.endPointX = x;
        this.selectBound.endPointY = y;

        const { startPointX, startPointY, endPointX, endPointY } = this.selectBound;

        this.judgeGridIsBound(
          {
            startPointX,
            startPointY,
            endPointX,
            endPointY,
          },
          true
        );
      }
    },
    /**
     * @Description 获取选中单元格相对document位置
     */
    getActiveItemsLocation() {
      const activeItem = this.activeItem;
      const parent = this.$refs.gridLayout.$el;
      const result = [];
      activeItem.forEach((i) => {
        const grid = parent.querySelector(`div[grid-sign='${i}']`);
        if (grid) {
          const rect = grid.getBoundingClientRect();
          const x = rect.x;
          const y = rect.y;
          const w = rect.width;
          const h = rect.height;
          result.push({ x, y, w, h });
        }
      });
      return result;
    },

    /**
     * @Description 判断单元格是不是在框选区域范围内
     * @param{Object} bound 框选范围坐标
     * @param{Boolean} compareOffset 是否是在内部框选 false 外部框选 true 内部框选
     */
    judgeGridIsBound(bound, compareOffset = false) {
      this.isBound = true;
      let { startPointX, startPointY, endPointX, endPointY } = bound;

      if (startPointX > endPointX) {
        [endPointX, startPointX] = [startPointX, endPointX];
      }
      if (startPointY > endPointY) {
        [endPointY, startPointY] = [startPointY, endPointY];
      }
      const parent = this.$refs.gridLayout.$el;
      //先清空一次
      this.activeItem = [];
      this.currentLayout.forEach((item) => {
        const grid = parent.querySelector(`div[grid-sign='${item.i}']`);
        if (grid) {
          let x = 0;
          let y = 0;
          let w = 0;
          let h = 0;
          if (compareOffset) {
            const height = this.$refs.wrapper.clientHeight;
            const width = this.$refs.wrapper.clientWidth;

            x = grid.getAttribute("grid-x");
            y = grid.getAttribute("grid-y");
            w = grid.getAttribute("grid-w");
            h = grid.getAttribute("grid-h");
            if (this.colNumUnit === "%") {
              x = Math.round((width * x) / 100);
              y = Math.round((height * y) / 100);
              w = Math.round((width * w) / 100);
              h = Math.round((height * h) / 100);
            }
          } else {
            const rect = grid.getBoundingClientRect();
            x = rect.x;
            y = rect.y;
            w = rect.width;
            h = rect.height;
          }

          const findIndex = this.activeItem.findIndex((it) => it === item.i);
          if (x > startPointX && x + w < endPointX && y > startPointY && y + h < endPointY) {
            const res = this.judgeInComposition(item.i);
            // 单元格不是锁住或者在不是锁住的组合单元格里面,同时是可见的
            if (!~findIndex && ((res && !res.static) || !item.static) && item.show != false) {
              this.activeItem.push(item.i);
            }
          }
        }
      });

      // 组合框选单元格
      this.selectComposition();
    },
    /**
     * @Description 失去聚焦
     */
    setBlur(e) {
      e = e || window.event;
      const elem = e.target;
      const targetArea = this.$refs.wrapper;
      const leftTools = document.querySelector(".dv-designer-left-outline");
      const isClickTools = leftTools ? leftTools.contains(elem) : false;
      if (!targetArea.contains(elem) && !this.isBound && !isClickTools) {
        this.activeItem = [];
        this.activeComposition = [];
      }
    },

    /**
     * @Description 是否是组合状态
     */
    isHideCommonBtn() {
      return this.activeItem.length > 1;
    },

    /**
     * @Description 隐藏混合组合按钮
     */
    isHideCompositionMix() {
      return this.activeItem.length > 0 && this.activeComposition.length == 0;
    },

    /**
     * @Description 隐藏普通组合按钮
     */
    isHideComposition() {
      return this.activeItem.length == 1 || this.activeComposition.length;
    },

    /**
     * @Description 隐藏组合右键
     */
    isHideCompositionMenu() {
      //不存在离散的单元格
      let hide = true;
      for (let i = 0; i < this.activeItem.length; i++) {
        const it = this.activeItem[i];
        if (!this.judgeInComposition(it)) {
          hide = false;
          break;
        }
      }
      return hide && this.activeComposition.length == 1;
    },

    /**
     * @Description 隐藏锁定
     */
    isHideLocked() {
      let locked = true;
      for (let i = 0; i < this.activeItemGrid.length; i++) {
        const it = this.activeItemGrid[i];
        if (!it.static) {
          locked = false;
          break;
        }
      }
      return locked;
    },
    /**
     * @Description 隐藏取消锁定
     */
    isHideUnLocked() {
      let unlocked = true;
      for (let i = 0; i < this.activeItemGrid.length; i++) {
        const it = this.activeItemGrid[i];
        if (it.static) {
          unlocked = false;
          break;
        }
      }
      return unlocked;
    },
    /**
     * @Description 是否不在组合中
     */
    isNotComposition(i) {
      const item = this.compositionLayout.find((it) => it.i.split(",").includes(i));
      return !item;
    },

    /**
     * @Description 解除组合
     * @param{Array|Object} innerComposition 组合单元格对象或兑现数组
     */
    dismissComposition(innerComposition) {
      if (!Array.isArray(innerComposition)) {
        innerComposition = this.activeComposition;
      }
      if (!innerComposition.length) return false;
      const dismiss = () => {
        innerComposition.forEach((it) => {
          const index = this.compositionLayout.findIndex((l) => l.i == it.i);
          if (~index) {
            this.compositionLayout.splice(index, 1);
          }
        });
        this.activeComposition = [];
      };

      dismiss();
      // 这里需要更新设计器左侧
      dsf.emit.$emit("update-tree-grid");
    },
    /**
     * @Description 组合单元格点击事件
     * @param{Object} evt 鼠标事件
     * @param{Object} item 组合单元格对象
     */
    handleActiveComposition(evt, item) {
      let isCtrl = false;
      if (evt.ctrlKey || evt.metaKey) {
        isCtrl = true;
      }
      // 激活activeItem
      let activeItem = [...this.activeItem];
      //清空框选
      this.selectBoundLayout = [];
      if (evt.button === 0) {
        //如果按住ctrl
        if (isCtrl) {
          const findIndex = this.activeComposition.findIndex((it) => it.i === item.i);
          if (~findIndex) {
            if (this.activeComposition.length > 0) {
              this.activeComposition.splice(findIndex, 1);
              // 移除下面的items
              item.i.split(",").forEach((i) => {
                activeItem = activeItem.filter((it) => it != i);
              });
            }
          } else {
            this.activeComposition.push(item);
          }
        } else {
          activeItem = [];
          this.activeComposition = [item];
        }

        this.activeComposition.forEach((it) => {
          activeItem.push(...it.i.split(","));
        });
        // 去重
        this.activeItem = Array.from(new Set(activeItem));
        // console.log(this.activeItem);
      }
    },

    /**
     * @Description 判断是否在组合单元格内
     */
    judgeInComposition(g) {
      for (let i = 0; i < this.compositionLayout.length; i++) {
        const item = this.compositionLayout[i];
        if (item && item.i.split(",").includes(g)) {
          return item;
        }
      }
      return false;
    },

    /**
     * @Description 混合组合 单元格+组合，组合+组合
     */
    compositionMix() {
      const activeItems = [...this.activeItem];
      const removeI = [];

      // 激活单元里面包含了整个组合单元格--需要优化
      this.compositionLayout.forEach((it) => {
        let isRemove = true;
        const arr = it.i.split(",");
        for (let j = 0; j < arr.length; j++) {
          const i = arr[j];
          if (!activeItems.includes(i)) {
            isRemove = false;
            break;
          }
        }
        if (isRemove) {
          removeI.push(it.i);
        }
      });

      //合并前移除
      removeI.forEach((i) => {
        const index = this.compositionLayout.findIndex((it) => it.i === i);
        this.compositionLayout.splice(index, 1);
      });
      this.activeComposition = [];
      this.composition();
    },

    /**
     * @Description 组合单元格
     */
    composition() {
      const letter = [...this.activeItem];
      if (letter.length <= 1) {
        dsf.layer.message({ message: "选中单元格少于2，不允许合并", type: "warning" });
        return false;
      }
      const items = [];
      letter.forEach((i) => {
        const item = this.letterMapGrids.get(i);
        item && items.push(item);
      });
      //判断是否在其他组合里面
      let hasComposition = false;
      letter.forEach((i) => {
        const res = this.judgeInComposition(i);
        if (res) {
          hasComposition = true;
        }
      });

      if (hasComposition) {
        dsf.layer.message({ message: "存在其他组合单元格", type: "warning" });
        return false;
      } else {
        const { x, y, w, h, record, zIndex } = this.updateComposition(items);

        let locked = true;

        for (let n = 0; n < items.length; n++) {
          const it = items[n];
          if (!it.static) {
            locked = false;
            break;
          }
        }
        //构造组合容器
        const composition = {
          id: dsf.uuid(),
          x,
          y,
          w,
          h,
          static: locked,
          zIndex: isNaN(zIndex) ? 100 : zIndex,
          i: letter.join(","),
          record,
        };

        this.compositionLayout.push(composition);
        //激活当前组合
        this.activeComposition.push(composition);

        // 这里需要更新设计器左侧
        dsf.emit.$emit("update-tree-grid");
      }
    },

    /**
     * @Description 框选单元格
     */
    selectComposition() {
      this.selectBoundLayout = [];
      const letter = [...this.activeItem];
      if (letter.length <= 1) {
        return false;
      }
      const items = [];
      letter.forEach((i) => {
        const item = this.letterMapGrids.get(i);
        item && items.push(item);
      });
      const { x, y, w, h, record, zIndex } = this.updateComposition(items);
      //构造组合容器
      const composition = {
        id: dsf.uuid(),
        x,
        y,
        w,
        h,
        zIndex,
        i: letter.join(","),
        record,
      };
      this.selectBoundLayout.push(composition);
    },

    /**
     * @Description 更新组合框位置
     * @param{Array} items 单元格数组
     */
    updateComposition(items) {
      let maxwidth = Number.MIN_SAFE_INTEGER;
      let maxheight = Number.MIN_SAFE_INTEGER;
      let minX = Number.MAX_SAFE_INTEGER;
      let minY = Number.MAX_SAFE_INTEGER;
      let zIndex = 1;
      //开始组合
      items.forEach((it) => {
        maxwidth = Math.max(it.w + it.x, maxwidth);
        maxheight = Math.max(it.h + it.y, maxheight);
        minX = Math.min(it.x, minX);
        minY = Math.min(it.y, minY);
        zIndex = Math.max(zIndex, it.zIndex || 1);
      });
      return {
        x: minX,
        y: minY,
        w: maxwidth - minX,
        h: maxheight - minY,
        zIndex,
        record: {
          x: minX,
          y: minY,
          w: maxwidth - minX,
          h: maxheight - minY,
        },
      };
    },
    /**
     * @Description 记录鼠标位置
     */
    recordMouse(evt) {
      const { width, height } = this.designerRatio;
      const { clientX, clientY } = evt;
      const { left, top } = this.$refs.wrapper.getBoundingClientRect();
      const offsetX = (clientX - left) / this.transformScale;
      const offsetY = (clientY - top) / this.transformScale;

      let x = 0;
      let y = 0;
      if (this.colNumUnit === "%") {
        x = (100 * offsetX) / width;
        y = (100 * offsetY) / height;
        x = Number(x.toFixed(2));
        y = Number(y.toFixed(2));
      } else {
        x = offsetX;
        y = offsetY;
      }
      this.mouseEvent.x = x;
      this.mouseEvent.y = y;
      this.mouseEvent.unit = this.colNumUnit;
    },

    layoutUpdatedEvent(args) {},
    /**
     * @Description 加载异步组件
     * @param{Array} data 组件的layout信息数组
     */
    loadAsyncComponent(data) {
      const promises = [];
      data.forEach((it) => {
        promises.push(
          new Promise((resolve) => {
            const code = it.ctrlType;
            //检查当前标签是否是异步组件
            let asyncCom = dsf.checkAsyncComponent(code);
            if (asyncCom) {
              //异步组件则请求相关属性
              dsf.requestAsyncComponents(asyncCom).then(() => {
                resolve({ code, it });
              });
            } else {
              resolve({ code, it });
            }
          })
        );
      });
      return Promise.all(promises);
    },

    // 判断letter 是否在组合框内，同时更新组合框位置
    updateCompositionByGrid(letter) {
      if (this.judgeInComposition(letter)) {
        const res = this.judgeInComposition(letter);
        const items = [];
        res.i.split(",").forEach((i) => {
          const item = this.letterMapGrids.get(i);
          item && items.push(item);
        });
        const { x, y, w, h, record, zIndex } = this.updateComposition(items);
        res.x = x;
        res.y = y;
        res.h = h;
        res.w = w;
        res.record = record;
        res.zIndex = zIndex;
      }
    },
    resizedEvent(i) {
      this.$emit("changSize", i.split(","));
      this.resetHelperLine();
    },
    resizedSelectEvent(i) {
      this.$emit("changSize", i.split(","));
      //结束再次计算正确位置
      this.resizeSelectEvent(i);
      this.resetHelperLine();
    },
    resizeSelectEvent(i) {
      // 防止拖曳抖动计算获取不是最新的位置大小
      setTimeout(() => {
        const item = this.selectBoundLayout.find((it) => it.i === i);
        if (!item) return false;
        const { x, y, record, h, w } = item;
        const { x: rx, y: ry, w: rw, h: rh } = record;
        const letters = i.split(",");

        letters.forEach((letter) => {
          const item = this.letterMapGrids.get(letter);
          // 宽度比例 保证占比不改变
          const nw = (w * item.w) / rw;
          this.$set(item, "w", nw);

          // x坐标占比
          const nx = (w * (item.x - rx)) / rw;

          this.$set(item, "x", x + nx);

          // 高度比例 保证占比不改变
          const nh = (h * item.h) / rh;
          this.$set(item, "h", nh);

          // y坐标占比
          const ny = (h * (item.y - ry)) / rh;
          this.$set(item, "y", y + ny);

          // 判断是否在组合单元格内，存在 则更新组合单元格位置
          this.updateCompositionByGrid(letter);
        });

        //记录移动结束的坐标
        record.x = x;
        record.y = y;
        record.w = w;
        record.h = h;
      });
    },
    resizeEvent(i, h, w) {
      const item = this.letterMapGrids.get(i);
      if (item) {
        this.calculateGridItem({ i, x: item.x, y: item.y, w, h });
      }
      dsf.emit.$emit("update-minimap");
    },
    resetHelperLine() {
      this.xCenterLine = false;
      this.yCenterLine = false;
      const topLine = {
        left: {
          x: 0,
          y: 0,
        },
        right: {
          x: 0,
          y: 0,
        },
      };
      const horizontalLine = {
        left: {
          x: 0,
          y: 0,
        },
        right: {
          x: 0,
          y: 0,
        },
      };

      const bottomLine = {
        left: {
          x: 0,
          y: 0,
        },
        right: {
          x: 0,
          y: 0,
        },
      };
      const verticalLine = {
        top: {
          x: 0,
          y: 0,
        },
        bottom: {
          x: 0,
          y: 0,
        },
      };
      const leftLine = {
        top: {
          x: 0,
          y: 0,
        },
        bottom: {
          x: 0,
          y: 0,
        },
      };
      const rightLine = {
        top: {
          x: 0,
          y: 0,
        },
        bottom: {
          x: 0,
          y: 0,
        },
      };
      this.topLine = topLine;
      this.leftLine = leftLine;
      this.rightLine = rightLine;
      this.bottomLine = bottomLine;
      this.horizontalLine = horizontalLine;
      this.verticalLine = verticalLine;
    },
    moveGrid(i, x, y) {
      const item = this.letterMapGrids.get(i);
      if (item) {
        this.calculateGridItem({ i, x, y, w: item.w, h: item.h });
      }
      dsf.emit.$emit("update-minimap");
    },

    /**
     * @Description 公共拖动多个单元格事件
     * @param {String} key 单元格标识
     * @param {Number} x 位置坐标x
     * @param {Number} y 位置坐标y
     * @param {Object} compositionLayout 组合布局信息
     */
    dragMultiGrid(key, x, y, compositionLayout) {
      const item = compositionLayout.find((it) => it.i == key);
      if (!item) return false;
      const isPercent = this.colNumUnit != "px";

      this.calculateGridItem({ i: item.i, x, y, w: item.w, h: item.h, isComposition: true });

      const { record, i } = item;
      const { x: rx, y: ry } = record;
      const letters = i.split(",");
      const moveX = x - rx;
      const moveY = y - ry;

      const isStopLeft = isPercent
        ? letters.some((letter) => {
            const item = this.letterMapGrids.get(letter);
            return !item || item.x <= 0;
          })
        : false;
      const isStopRight = isPercent
        ? letters.some((letter) => {
            const item = this.letterMapGrids.get(letter);
            return !item || item.x + item.w >= 100;
          })
        : false;
      const isStopUp = isPercent
        ? letters.some((letter) => {
            const item = this.letterMapGrids.get(letter);
            return !item || item.y <= 0;
          })
        : false;
      letters.forEach((letter) => {
        const item = this.letterMapGrids.get(letter);
        // 右移动
        if (moveX > 0) {
          if (!isStopRight) {
            let ry = parseInt(item.x + moveX);
            if (item.w + ry >= 100 && isPercent) {
              ry = 100 - item.w;
            }
            this.$set(item, "x", ry);
          }
          //左移动
        } else if (moveX < 0) {
          if (!isStopLeft) {
            let lx = parseInt(item.x + moveX);
            if (lx < 0 && isPercent) {
              lx = 0;
            }
            this.$set(item, "x", lx);
          }
        }
        // 下移动
        if (moveY > 0) {
          let dy = parseInt(item.y + moveY);
          this.$refs.gridLayout.updateHeight();
          this.$set(item, "y", dy);
          //上移动
        } else if (moveY < 0) {
          if (!isStopUp) {
            let uy = parseInt(item.y + moveY);
            if (uy <= 0 && isPercent) {
              uy = 0;
            }
            this.$refs.gridLayout.updateHeight();
            this.$set(item, "y", uy);
          }
        }
      });
      //记录移动结束的坐标
      record.x = x;
      record.y = y;
    },
    //拖动单元格组合容器
    dragCompositionEvent(key, x, y) {
      this.dragMultiGrid(key, x, y, this.compositionLayout);
    },
    // 拖动框选单元格
    dragSelectCompositionEvent(key, x, y) {
      this.dragMultiGrid(key, x, y, this.selectBoundLayout, true);
    },
    //清空画布
    clearLayout() {
      Object.keys(this.activeLevelLayout.layout).forEach((item) => {
        this.activeLevelLayout.layout[item];
        while (this.activeLevelLayout.layout[item].length) {
          this.activeLevelLayout.layout[item].pop();
        }
      });
      // 不消除引用
      this.compositionLayout.length = 0;
      this.activeComposition = [];
      this.activeItem = [];
      this.designer.dealSlots();
    },
    //设置事件穿透-内容超出
    setProperty() {
      const i = this.activeItem[0];
      const item = this.letterMapGrids.get(i);
      let { penetrate, overflow } = item;
      const properties = {
        penetrate,
        overflow,
      };
      const render = this.$createElement;
      ELEMENT.MessageBox({
        title: "属性设置",
        showClose: false,
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        message: render(_setting, {
          key: dsf.uuid(), // 添加唯一key
          props: {
            form: properties,
          },
        }),
        beforeClose: (action, instance, done) => {
          done();
        },
      }).then((action, instance) => {
        if (action === "confirm") {
          const { penetrate, overflow } = properties;
          this.$set(item, "penetrate", penetrate);
          this.$set(item, "overflow", overflow);
        }
      });
    },
    transformPxUnit(val, type) {
      const wrapper = this.$refs.wrapper;
      if (this.colNumUnit == "%" && wrapper) {
        const { clientWidth, clientHeight } = wrapper;
        return type == 1 ? Math.floor((val * clientWidth) / 100) : Math.floor((val * clientHeight) / 100);
      }
      return val;
    },
    //切换布局模式
    changeUnit() {
      const unit = this.colNumUnit;

      this.$openDialog({
        title: "布局设置",
        content: _select,
        height: "60px",
        width: "400px",
        params: {
          value: unit,
        },
        btns: [
          {
            text: "确定",
            type: "",
            handler: (res) => {
              const unit = res.yes();
              //老单位
              const colNumUnit = this.colNumUnit;
              const clientHeight = this.$refs.wrapper.clientHeight;
              const clientWidth = this.$refs.wrapper.clientWidth;
              const activeLevelLayout = this.activeLevelLayout;
              //从百分比切换成像素
              if (colNumUnit === "%" && unit === "px") {
                Object.keys(activeLevelLayout.layout).forEach((item) => {
                  const currentLayout = activeLevelLayout.layout[item];
                  currentLayout.forEach((it) => {
                    let { x, y, w, h } = it;
                    it.x = Math.floor((x * clientWidth) / 100);
                    it.y = Math.floor((y * clientHeight) / 100);
                    it.w = Math.floor((w * clientWidth) / 100);
                    it.h = Math.floor((h * clientHeight) / 100);
                  });
                });
                //从像素切换成百分比
              } else if (colNumUnit === "px" && unit === "%") {
                Object.keys(activeLevelLayout.layout).forEach((item) => {
                  const currentLayout = activeLevelLayout.layout[item];

                  currentLayout.forEach((it) => {
                    let { x, y, w, h } = it;
                    it.x = +((x * 100) / clientWidth).toFixed(2);
                    it.y = +((y * 100) / clientHeight).toFixed(2);
                    it.w = +((w * 100) / clientWidth).toFixed(2);
                    it.h = +((h * 100) / clientHeight).toFixed(2);

                    if (it.x + it.w >= 100) {
                      it.x = 100 - it.w < 0 ? 0 : 100 - it.w;
                    } else if (it.x < 0) {
                      it.x = 0;
                    }
                    if (it.y < 0) {
                      it.y = 0;
                    }
                  });
                });
              }
              this.activeLevelLayout.colNumUnit = unit;
              this.colNumUnit = unit;

              // 刷新一次组合
              this.refreshComposition();
            },
          },
          {
            text: "取消",
            type: "plain",
          },
        ],
      });
    },

    /**
     *  强制刷新一次组合
     */
    refreshComposition() {
      const compositionLayout = this.compositionLayout;
      const currentLayout = this.currentLayout;
      compositionLayout.forEach((item) => {
        const i = item.i;
        const items = [];
        i.split(",").forEach((i) => {
          const res = currentLayout.find((it) => it.i === i);
          res && items.push(res);
        });
        const { x, y, w, h } = this.updateComposition(items);
        item.x = x;
        item.y = y;
        item.w = w;
        item.h = h;
      });
    },

    /**
     * 设置宽高
     */
    setSize() {
      const i = this.activeItem[0];
      const item = this.letterMapGrids.get(i);
      let unit = this.activeLevelLayout.colNumUnit;
      dsf.layer.openDialog({
        title: "宽高设置",
        content: _size,
        width: "420px",
        height: "140px",
        top: "30vh",
        params: {
          width: item.w + "",
          height: item.h + "",
          unit,
        },
        btns: [
          {
            text: "确定",
            handler: async (res) => {
              const result = await res.yes();
              if (result) {
                let w = Number(result.width);
                let h = Number(result.height);
                if (!isNaN(w) && !isNaN(h)) {
                  item.w = w;
                  item.h = h;
                }
                return true;
              }
              return false;
            },
          },
          {
            text: "取消",
            handler: (res) => {},
          },
        ],
      });
    },

    /**
     * 锁住单元格
     */
    locked() {
      // 如果从框选从锁住
      if (this.selectBoundLayout.length) {
        this.selectBoundLayout = [];
      }
      const activeItem = [...this.activeItem];
      activeItem.forEach((i) => {
        const item = this.letterMapGrids.get(i);
        this.$set(item, "static", true);
      });
      //如果组合单元格内都是锁住的单元格则认为该组合是锁住的
      this.compositionLayout.forEach((item) => {
        let locked = true;
        item.i.split(",").forEach((i) => {
          const item = this.letterMapGrids.get(i);
          if (!item.static) {
            locked = false;
          }
        });
        this.$set(item, "static", locked);
      });
      this.$forceUpdate();
    },

    /**
     * 取消锁定
     */
    unLocked() {
      const activeItem = [...this.activeItem];
      activeItem.forEach((i) => {
        const item = this.letterMapGrids.get(i);
        this.$set(item, "static", false);
      });

      //如果组合单元格内有一个未锁住 则认为该组合单元格不锁
      this.compositionLayout.forEach((item) => {
        let locked = true;
        item.i.split(",").forEach((i) => {
          const item = this.letterMapGrids.get(i);
          if (!item.static) {
            locked = false;
          }
        });
        this.$set(item, "static", locked);
      });
      this.$forceUpdate();
    },

    /**
     * 上移单元
     */
    gridUp() {
      const i = this.activeItem[0];
      const item = this.letterMapGrids.get(i);

      const currentLayout = this.currentLayout;
      const sortCurrentLayout = [...currentLayout].reverse().sort((a, b) => (a.zIndex - b.zIndex > 0 ? -1 : 1));

      const index = sortCurrentLayout.findIndex((it) => it.i == i);

      if (index === -1 || index === 0) return false;
      const beforeGrid = sortCurrentLayout[index - 1];

      const start = currentLayout.findIndex((it) => it.i === i);

      // 将end和start互换
      currentLayout.splice(start, 1);
      const end = currentLayout.findIndex((it) => it.i === beforeGrid.i);
      item.zIndex = beforeGrid.zIndex;
      currentLayout.splice(end + 1, 0, item);

      // 更新左侧树的层级显示
      dsf.emit.$emit("update-tree-grid");
      this.$forceUpdate();
    },

    /**
     * 下移动单元格
     */
    gridDown() {
      const i = this.activeItem[0];
      const item = this.letterMapGrids.get(i);

      const currentLayout = this.currentLayout;
      const sortCurrentLayout = [...currentLayout].reverse().sort((a, b) => (a.zIndex - b.zIndex > 0 ? -1 : 1));

      const index = sortCurrentLayout.findIndex((it) => it.i == i);

      if (index === -1 || index === currentLayout.length - 1) return false;

      const afterGrid = sortCurrentLayout[index + 1];
      const start = currentLayout.findIndex((it) => it.i === i);
      // 将end和start互换
      currentLayout.splice(start, 1);
      const end = currentLayout.findIndex((it) => it.i === afterGrid.i);
      item.zIndex = afterGrid.zIndex;
      currentLayout.splice(end, 0, item);

      this.activeItem.shift();
      // 更新左侧树的层级显示
      dsf.emit.$emit("update-tree-grid");
      this.$forceUpdate();
    },

    /**
     * 置顶单元格
     */
    gridTop() {
      const activeItem = this.activeItem;
      // 选择中最大的层级
      let max = 1;
      activeItem.forEach((i) => {
        const item = this.letterMapGrids.get(i);
        const zIndex = item.zIndex;
        max = Math.max(zIndex, max);
      });
      // 剩余单元格最大层级
      let commonIndex = 1;
      this.currentLayout.forEach((it) => {
        if (!activeItem.includes(it.i)) {
          const zIndex = it.zIndex;
          commonIndex = Math.max(zIndex, commonIndex);
        }
      });
      if (max <= commonIndex) {
        max = commonIndex + 1;
      }

      activeItem.forEach((i) => {
        const item = this.letterMapGrids.get(i);
        this.$set(item, "zIndex", max);
      });
      // 这里需要更新设计器左侧
      dsf.emit.$emit("update-tree-grid");
      this.$forceUpdate();
    },

    /**
     * 置底单元格
     */
    gridBottom() {
      const activeItem = this.activeItem;

      this.currentLayout.forEach((it) => {
        if (activeItem.includes(it.i)) {
          it.zIndex = 1;
        } else if (it.zIndex === 1) {
          it.zIndex = it.zIndex + 1;
        }
      });
      // 这里需要更新设计器左侧
      dsf.emit.$emit("update-tree-grid");
      this.$forceUpdate();
    },

    /**
     * 新增单元格子
     */
    addGrid(w = 30, h = 30) {
      let x = this.mouseEvent.x;
      let y = this.mouseEvent.y;
      const activeLevelLayout = this.activeLevelLayout;
      const unit = activeLevelLayout.colNumUnit;
      if (unit !== "%") {
        w = 200;
        h = 200;
      }
      //判断超出边界
      if (unit === "%") {
        if (w + x > 100) {
          x = 100 - w;
        }
      }
      // 插槽名称
      const i = dsf.uuid();

      Object.keys(activeLevelLayout.layout).forEach((item) => {
        const currentLayout = activeLevelLayout.layout[item];
        let max = Math.max(...currentLayout.map((it) => it.zIndex), 0);
        if (isNaN(max)) {
          max = 0;
        }
        currentLayout.push({
          x,
          y,
          w,
          h,
          static: false,
          i,
          zIndex: max + 1,
        });
      });
      this.designer.dealSlots();
    },

    /**
     * 删除
     */
    deleteAllGrid(activeItem) {
      if (!Array.isArray(activeItem)) {
        activeItem = [...this.activeItem];
      }
      const innerComposition = [];
      activeItem.forEach((i) => {
        Object.keys(this.activeLevelLayout.layout).forEach((key) => {
          const item = this.activeLevelLayout.layout[key];
          const index = item.findIndex((it) => it.i == i);
          item.splice(index, 1);
        });

        const res = this.judgeInComposition(i);
        const composition = innerComposition.find((it) => it == res);
        if (!composition) {
          innerComposition.push(res);
        }
      });

      this.dismissComposition(innerComposition);
      this.designer.dealSlots();
      //取消选择单元格
      this.activeItem = [];
    },

    /**
     * 激活单元格子
     */
    handleActiveItem(evt, item) {
      let isCtrl = false;
      if (evt.ctrlKey || evt.metaKey) {
        isCtrl = true;
      }
      //清空框选
      this.selectBoundLayout = [];
      if (evt.button === 0) {
        //记录鼠标位置
        const { width, height } = this.designerRatio;
        let x = Number(evt.target.getAttribute("x"));
        let y = Number(evt.target.getAttribute("y"));
        if (this.colNumUnit === "%") {
          x = x + (100 * evt.offsetX) / width;
          y = y + (100 * evt.offsetY) / height;
          x = Number(x.toFixed(2));
          y = Number(y.toFixed(2));
        } else {
          x = x + evt.offsetX;
          y = y + evt.offsetY;
        }
        this.mouseEvent.x = x;
        this.mouseEvent.y = y;
        this.mouseEvent.unit = this.colNumUnit;

        //如果按住ctrl
        if (isCtrl) {
          const findIndex = this.activeItem.findIndex((it) => it === item.i);
          if (~findIndex) {
            if (this.activeItem.length > 1 && evt.button == 0) {
              this.activeItem.splice(findIndex, 1);
            }
          } else {
            this.activeItem.push(item.i);
          }
        } else {
          this.activeItem = [item.i];
          //取消组合选中
          this.activeComposition = [];
        }
        this.$emit("selectSlot", item);
      }
    },
    setContainerHeight() {
      this.containerHeight = this.$refs.wrapper.clientHeight;
    },
    /**
     * 预处理==兼容函数
     */
    preDealLayout() {
      const layouts = this.layout;
      layouts.forEach((currentLayout) => {
        let { colNum, colNumUnit, rowHeight, rowHeightUnit } = currentLayout;
        if (!rowHeightUnit) {
          rowHeightUnit = "%";
          currentLayout.rowHeightUnit = rowHeightUnit;
        }
        if (!colNumUnit) {
          colNumUnit = "%";
          currentLayout.colNumUnit = colNumUnit;
        }
        //如果是百分比,不是按照100 分的
        if (colNumUnit === "%" && rowHeightUnit === "%" && colNum != 100 && rowHeight != 1) {
          currentLayout.colNum = 100;
          currentLayout.rowHeight = 1;

          Object.keys(currentLayout.layout).forEach((key) => {
            let items = currentLayout.layout[key];
            items.forEach((it) => {
              let { h, w, x, y } = it;
              it.h = rowHeight * h;
              it.w = Math.floor((w * 100) / colNum);
              it.y = rowHeight * y;
              it.x = Math.floor((x * 100) / colNum);
              it.static = !!it.static;
            });
          });
        }
        Object.keys(currentLayout.layout).forEach((key) => {
          let items = currentLayout.layout[key];
          items.forEach((it) => {
            it.static = !!it.static;
            it.overflow = it.overflow || "hidden";
            it.penetrate = it.penetrate || false;
          });
        });
      });
    },

    /**
     * 初始当前布局参数
     */
    initCurrentLayout() {
      const activeLevel = this.activeLevel;
      const activeRatio = this.activeRatio;
      //当前激活层级布局
      const activeLevelLayout = this.layout[activeLevel - 1];
      this.activeLevelLayout = activeLevelLayout;
      this.colNum = activeLevelLayout.colNum;
      this.colNumUnit = activeLevelLayout.colNumUnit;
      this.margin = activeLevelLayout.margin;
      let rowHeight = activeLevelLayout.rowHeight;

      if (this.colNumUnit === "%") {
        this.rowHeight = +((this.containerHeight / 100) * rowHeight).toFixed(2);
      } else {
        this.rowHeight = rowHeight;
      }

      //当前分辨率布局参数
      const currentLayout = activeLevelLayout.layout[activeRatio];
      //添加层级参数
      currentLayout.forEach((item) => {
        if (item.zIndex === undefined) {
          item.zIndex = 1;
        }
      });
      this.currentLayout = currentLayout;
      if (!this.compositionLayouts[activeRatio]) {
        this.$set(this.compositionLayout, activeRatio, []);
      }
      this.compositionLayout = this.compositionLayouts[activeRatio];
      // 刷新一次组合
      this.refreshComposition();
    },
    calculateGridItem(grid) {
      const { colNumUnit, designerRatio } = this;
      const left = grid.x;
      const center = grid.x + grid.w / 2;
      const right = grid.x + grid.w;
      const top = grid.y;
      const hCenter = grid.y + grid.h / 2;
      const bottom = grid.y + grid.h;
      if (colNumUnit === "%") {
        this.xCenterLine = [left, center, right].some((it) => Math.floor(it) === 50);
        this.yCenterLine = [top, hCenter, bottom].some((it) => Math.floor(it) === 50);
      } else {
        const { width } = designerRatio;
        const height = this.containerHeight;
        // 像素增加百分之1 的误差值
        const deviationX = width * 0.01;
        const deviationY = height * 0.01;
        this.xCenterLine = [left, center, right].some((it) => Math.abs(Math.floor(it) - Math.floor(width / 2)) <= deviationX);
        this.yCenterLine = [top, hCenter, bottom].some((it) => Math.abs(Math.floor(it) - Math.floor(height / 2)) <= deviationY);
      }

      //上线
      const topLine = {
        left: {
          x: grid.x,
          y: grid.y,
        },
        right: {
          x: grid.x,
          y: grid.y,
        },
      };
      const horizontalLine = this.horizontalLine;
      horizontalLine.left.x = 0;
      horizontalLine.right.x = 0;

      const verticalLine = this.verticalLine;
      verticalLine.top.y = 0;
      verticalLine.bottom.y = 0;

      //下线
      const bottomLine = {
        left: {
          x: grid.x,
          y: grid.y + grid.h,
        },
        right: {
          x: grid.x,
          y: grid.y + grid.h,
        },
      };
      //左线
      const leftLine = {
        top: {
          x: grid.x,
          y: grid.y,
        },
        bottom: {
          x: grid.x,
          y: grid.y,
        },
      };
      //右线
      const rightLine = {
        top: {
          x: grid.x + grid.w,
          y: grid.y,
        },
        bottom: {
          x: grid.x + grid.w,
          y: grid.y,
        },
      };

      for (let i = 0; i < this.currentLayout.length; i++) {
        const it = this.currentLayout[i];
        // 如果是组合单元格，且it在其中则跳过,且单元格是可见的
        if ((grid.isComposition && grid.i.split(",").includes(it.i)) || it.show === false) {
          continue;
        }
        if (it.i != grid.i) {
          //上辅助线
          if (it.y == grid.y || it.y + it.h == grid.y) {
            topLine.left.y = grid.y;
            topLine.right.y = grid.y;
            topLine.left.x = Math.min(topLine.left.x, it.x, grid.x);
            topLine.right.x = Math.max(topLine.right.x, it.x, grid.x);
            this.compareHorizontalLine(grid, it, horizontalLine, "top");
          }
          // 下辅助线
          if (it.y == grid.y + grid.h || it.y + it.h == grid.y + grid.h) {
            bottomLine.left.y = grid.y + grid.h;
            bottomLine.right.y = grid.y + grid.h;
            bottomLine.left.x = Math.min(bottomLine.left.x, it.x, grid.x);
            bottomLine.right.x = Math.max(bottomLine.right.x, it.x, grid.x);
            this.compareHorizontalLine(grid, it, horizontalLine, "bottom");
          }
          //左辅助线
          if (it.x == grid.x || it.x + it.w == grid.x) {
            leftLine.top.x = grid.x;
            leftLine.bottom.x = grid.x;
            leftLine.top.y = Math.min(leftLine.top.y, it.y, grid.y);
            leftLine.bottom.y = Math.max(leftLine.bottom.y, it.y, grid.y);
            this.compareVerticalLine(grid, it, verticalLine, "left");
          }
          //右辅助线
          if (it.x == grid.x + grid.w || it.x + it.w == grid.x + grid.w) {
            rightLine.top.x = grid.x + grid.w;
            rightLine.bottom.x = grid.x + grid.w;
            rightLine.top.y = Math.min(rightLine.top.y, it.y, grid.y);
            rightLine.bottom.y = Math.max(rightLine.bottom.y, it.y, grid.y);
            this.compareVerticalLine(grid, it, verticalLine, "right");
          }
        }
      }

      this.topLine = topLine;
      this.bottomLine = bottomLine;
      this.leftLine = leftLine;
      this.rightLine = rightLine;
    },
    loadLib() {
      dsf.http
        .importFiles([this.$getWebPath("static/js/libs/grid/vue-grid-layout.umd.min.js", __DSF_DATAVIEW_PATH__)])
        .then(() => {
          this.dragGridLoaded = true;
        })
        .catch((err) => {
          dsf.error(err);
          dsf.layer.message("加载vue-grid-layout文件报错", false);
        });
    },
    compareVerticalLine(grid, it, verticalLine, align) {
      let isUpdateX = false;
      // grid 在上面
      if (grid.y + grid.h < it.y) {
        const height = it.y - (grid.y + grid.h);
        if (verticalLine.top.y === 0 && verticalLine.bottom.y === 0) {
          verticalLine.top.y = grid.y + grid.h;
          verticalLine.bottom.y = it.y;
          isUpdateX = true;
        } else {
          const preHeight = verticalLine.bottom.y - verticalLine.top.y;
          // 更新
          if (preHeight > height) {
            verticalLine.top.y = grid.y + grid.h;
            verticalLine.bottom.y = it.y;
            isUpdateX = true;
          }
        }
      }
      // grid 在下面
      if (grid.y > it.y + it.h) {
        const height = grid.y - (it.y + it.h);
        if (verticalLine.top.y === 0 && verticalLine.bottom.y === 0) {
          verticalLine.top.y = it.y + it.h;
          verticalLine.bottom.y = grid.y;
          isUpdateX = true;
        } else {
          const preHeight = verticalLine.bottom.y - verticalLine.top.y;
          if (preHeight > height) {
            verticalLine.top.y = it.y + it.h;
            verticalLine.bottom.y = grid.y;
            isUpdateX = true;
          }
        }
      }

      if (isUpdateX) {
        if (align === "left") {
          if (it.x == grid.x) {
            const x = it.w > grid.w ? grid.x + grid.w / 2 : it.x + it.w / 2;
            verticalLine.top.x = x;
            verticalLine.top.x = x;
          }
          if (it.x + it.w === grid.x) {
            verticalLine.top.x = grid.x;
            verticalLine.top.x = grid.x;
          }
        } else if (align === "right") {
          if (it.x + it.w == grid.x + grid.w) {
            const x = it.w > grid.w ? grid.x + grid.w / 2 : it.x + it.w / 2;
            verticalLine.top.x = x;
            verticalLine.bottom.x = x;
          }
          if (it.x == grid.x + grid.w) {
            verticalLine.top.x = it.x;
            verticalLine.bottom.x = it.x;
          }
        }
      }
    },
    compareHorizontalLine(grid, it, horizontalLine, align) {
      let isUpdateY = false;
      // grid 右边
      if (grid.x > it.x + it.w) {
        const width = grid.x - (it.x + it.w);
        //比较 width 大小，取最小值
        if (horizontalLine.left.x == 0 && horizontalLine.right.x == 0) {
          horizontalLine.left.x = it.x + it.w;
          horizontalLine.right.x = grid.x;
          isUpdateY = true;
        } else {
          const preWidth = horizontalLine.right.x - horizontalLine.left.x;
          if (preWidth > width) {
            horizontalLine.left.x = it.x + it.w;
            horizontalLine.right.x = grid.x;
            isUpdateY = true;
          }
        }
      }
      // grid 在左边
      if (grid.x + grid.w < it.x) {
        const width = it.x - (grid.x + grid.w);
        //比较 width 大小，取最小值
        if (horizontalLine.left.x == 0 && horizontalLine.right.x == 0) {
          horizontalLine.left.x = grid.x + grid.w;
          horizontalLine.right.x = it.x;
          isUpdateY = true;
        } else {
          const preWidth = horizontalLine.right.x - horizontalLine.left.x;
          if (preWidth > width) {
            horizontalLine.left.x = grid.x + grid.w;
            horizontalLine.right.x = it.x;
            isUpdateY = true;
          }
        }
      }
      if (isUpdateY) {
        if (align === "top") {
          if (it.y == grid.y) {
            const y = it.h > grid.h ? grid.y + grid.h / 2 : it.y + it.h / 2;
            horizontalLine.left.y = y;
            horizontalLine.right.y = y;
          }
          if (it.y + it.h == grid.y) {
            horizontalLine.left.y = grid.y;
            horizontalLine.right.y = grid.y;
          }
        } else if (align === "bottom") {
          if (it.y + it.h == grid.y + grid.h) {
            const y = it.h > grid.h ? grid.y + grid.h / 2 : it.y + it.h / 2;
            horizontalLine.left.y = y;
            horizontalLine.right.y = y;
          }
          if (it.y == grid.y + grid.h) {
            horizontalLine.left.y = it.y;
            horizontalLine.right.y = it.y;
          }
        }
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/pc/components/dvDesignerGridLayout.scss";
</style>

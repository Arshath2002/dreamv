
<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-07-07 14:27:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-18 14:37:43
-->
<template>
  <div class="dv-designer-left-outline" @click.stop>
    <div class="dv-design-search-box">
      <el-input size="small" v-model="keywords" class="design-search-input" clearable> </el-input>
      <el-dropdown @command="filterData">
        <DsfIcon class="filter-icon" :class="filterWords != 'all' ? 'is-active' : ''" name="shaixuan" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :style="filterWords == 'all' ? { color: 'var(--t--normal)' } : {}" command="all"><DsfIcon v-if="filterWords == 'all'" name="gouxuan" />全部组件</el-dropdown-item>
          <el-dropdown-item :style="filterWords == 'relative' ? { color: 'var(--t--normal)' } : {}" command="relative">
            <DsfIcon v-if="filterWords == 'relative'" name="gouxuan" />含依赖事件
          </el-dropdown-item>
          <el-dropdown-item :style="filterWords == 'animate' ? { color: 'var(--t--normal)' } : {}" command="animate">
            <DsfIcon v-if="filterWords == 'animate'" name="gouxuan" />含组件动画
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <dsf-virtual-scroll scroll-x scroll-y style="height: calc(100% - 50px); padding: 10px">
      <div id="dv-des-sort-layouts">
        <template v-for="(item, index) in sortPlatLayout">
          <!-- 组合单元格 -->
          <div
            v-show="judgeCompositionShow(item.i)"
            v-if="~item.i.indexOf(',')"
            @mouseover="(e) => mouseEvent(e, item.i, 'composition', 'enter')"
            @mouseleave="(e) => mouseEvent(e, item.i, 'composition', 'leave')"
            class="drag-item des-dv-left-layout-composition-grids"
            :class="{ 'is-active': isActiveComposition(item.i) }"
            :key="`${item.i}-${index}`"
          >
            <div :id="`composition-head-${item.id}`" class="composition-head">
              <div class="composition-head__left">

                <DsfIcon class="indicator" name="xiajiantou" @click.stop="doClosed(item)" />
                <DsfIcon @dblclick="editor(item)" title="组合" name="wenjianjia1"></DsfIcon>

                <input
                  :id="`composition-name_input_${item.i}`"
                  @keydown.enter="alterComposition = ''"
                  @blur="alterComposition = ''"
                  v-if="alterComposition == item.i"
                  v-model="item.name"
                  type="text"
                  class="composition-name"
                />
                <div v-else class="composition-name-read">{{ item.name }}</div>

                <DsfIcon class="hover-show" v-if="alterComposition != item.i" @click="editor(item)" name="bianji"></DsfIcon>
              </div>

              <div class="composition-head__right">
                <DsfIcon class="hover-show" title="可见" @click="setVisible(item, false)" v-if="item.show === undefined || item.show === true" name="icon-visible" style="margin-top: 1px"></DsfIcon>
                <DsfIcon title="不可见" @click="setVisible(item, true)" v-if="item.show === false" name="icon-invisible"></DsfIcon>

                <DsfIcon title="解除锁定" @click="setLocked(item, false)" v-if="item.static" name="dv-icon-suo"></DsfIcon>
                <DsfIcon title="锁定" @click="setLocked(item, true)" class="hover-show" v-if="!item.static" name="dv-icon-suozi"></DsfIcon>

                <DsfIcon class="hover-show" title="上移" @click="changeZIndex(item, 1, index)" name="shang"></DsfIcon>
                <DsfIcon class="hover-show" title="下移" @click="changeZIndex(item, 0, index)" name="xia"></DsfIcon>
                <DsfIcon class="hover-show" title="删除" @click="deleteCompositionGrids(item)" name="delete"></DsfIcon>
                <DsfIcon class="drag-handler" title="拖动" name="order"></DsfIcon>
              </div>
            </div>
            <DesDVLeftLayoutGrids
              v-for="grid in getChildrenGrids(item.i)"
              :level="activeLevel"
              :isComposition="true"
              :ref="`composition-i_${item.i}`"
              :class="{ 'is-active': activeGrids.includes(grid.i) }"
              @deleteGrids="(i) => deleteGrids(i, item)"
              @deleteComponents="deleteComponents"
              @componentClick="componentClick"
              :activeItemId="activeItemId"
              :searchWords="keywords"
              :filterWords="filterWords"
              :key="grid.i"
              :grid="grid"
            />
          </div>
          <!-- 离散单元格 -->
          <DesDVLeftLayoutGrids
            v-else
            :key="`${item.i}-${index}-else`"
            @mouseover.native="(e) => mouseEvent(e, item.i, 'single', 'enter')"
            @mouseleave.native="(e) => mouseEvent(e, item.i, 'single', 'leave')"
            class="drag-item"
            :class="{ 'is-active': activeGrids.includes(item.i) }"
            :level="activeLevel"
            :activeItemId="activeItemId"
            @deleteGrids="deleteGrids"
            @deleteComponents="deleteComponents"
            @changeZIndex="({ i, orientation }) => changeZIndex(item, orientation, index)"
            @componentClick="componentClick"
            :searchWords="keywords"
            :filterWords="filterWords"
            :grid="item"
          />
        </template>
      </div>
    </dsf-virtual-scroll>
  </div>
</template>

<script>
import DesDVLeftLayoutGrids from "./DesDVLeftLayoutGrids.vue";

const recuse = (data, arr = []) => {
  data.forEach((item) => {
    arr.push(item.caption);
    if (item.slots) {
      item.slots.forEach(({ controls }) => {
        recuse(controls, arr);
      });
    }
  });
};
export default {
  name: "DsfDataViewDesignerLeftOutline",
  components: {
    DesDVLeftLayoutGrids,
  },
  inject: {
    $designer: {
      default: null,
    },
  },

  data() {
    return {
      // 搜索关键字
      keywords: "",

      // 过滤关键字
      filterWords: "all",

      // 修改组合的名称
      alterComposition: "",

      compositionToGrid: new Map(),

      // 高亮单元格
      activeGrids: [],
      //排序组合单元格
      compositionLayout: [],

      // 当前激活层级布局信息
      activeLevelLayout: null,

      // 当前分辨率布局信息
      currentLayout: [],

      // 当前层级
      activeLevel: "",

      // 平铺排序数组
      sortPlatLayout: [],
    };
  },
  computed: {
    activeItemId() {
      let res = this.$designer.attributesOwner;
      return res.$designId || "";
    },
  },
  beforeDestroy() {
    dsf.emit.$remove("update-tree-grid", this);
    dsf.emit.$remove("update-tree-grid-active", this);
    this._sortable && this._sortable.destroy();
  },
  created() {
    dsf.emit.$on(
      "update-tree-grid-active",
      (v) => {
        this.activeGrids = v;
      },
      this
    );
    dsf.emit.$on(
      "update-tree-grid",
      () => {
        this.updateTree();
      },
      this
    );

    this.$eventBus.$on("update-desinger-outline", () => {
      const page = this.$designer.$refs.viewProxy;

      this.filterWords = "all";
      this.keywords = "";

      this.updateTree();
      this._watchResize = this.$watch(
        () => {
          const componentNames = [];
          recuse([page], componentNames);
          return componentNames;
        },
        () => {
          this.$nextTick(this.updateTree);
        },
        { deep: true }
      );
    });
  },
  mounted() {
    this.loadScript(() => {
      let layouts = document.getElementById("dv-des-sort-layouts");
      this._sortable = Sortable.create(layouts, {
        animation: 300,
        forceFallback: true,
        draggable: ".drag-item",
        handle: ".drag-handler",
        ghostClass: "ghost",
        chosenClass: "is-active",
        onEnd: ({ newIndex, oldIndex }) => {

          if(newIndex=== oldIndex) return false

          // 1 上升 0 下降
          const orientation = newIndex - oldIndex > 0 ? 0 : 1;

          const layout = this.currentLayout;

          let item = this.sortPlatLayout[oldIndex];

          let currentIndex = [layout.findIndex((l) => l.i === item.i)];

          let grids = [item];

          // 组合单元格
          if (~item.i.indexOf(",")) {
            const i = item.i;
            currentIndex = i.split(",").map((it) => layout.findIndex((l) => l.i === it));

            grids = currentIndex.map((it) => layout[it]);
          }

          let nextItem = this.sortPlatLayout[newIndex];

          // 组合单元格
          if (~nextItem.i.indexOf(",")) {
            let i = nextItem.i;
            i = this.compositionToGrid.get(i);

            nextItem = layout.find((l) => l.i === i);
          }

          // 删除old 数据
          _.pullAt(layout, ...currentIndex);

          grids.forEach((it) => (it.zIndex = nextItem.zIndex));

          const changeIndex = layout.findIndex((l) => l.i === nextItem.i);
         

          layout.splice(changeIndex + orientation, 0, ...grids);

          this.updateTree();
        },
      });
    });
  },

  methods: {
    /**
     * 判断组合是否显示
     *
     */
    judgeCompositionShow(i) {
      const refs = this.$refs[`composition-i_${i}`];
      if (!refs) return true;
      for (let i = 0; i < refs.length; i++) {
        if (refs[i].showGrids) {
          return true;
        }
      }
      return false;
    },
    /**
     * 过滤组件
     * @param {String} name
     */
    filterData(name) {
      this.filterWords = name;
    },

    /**
     * 编辑组合名称
     */
    editor(item) {
      this.alterComposition = item.i;
      this.$nextTick(() => {
        const input = document.getElementById(`composition-name_input_${item.i}`);
        input && input.focus();
      });
    },

    /**
     * 是否高亮组合
     * @param {String} i 组合单元格样式
     */
    isActiveComposition(i) {
      const arr = i.split(",");
      for (let n = 0; n < arr.length; n++) {
        if (!this.activeGrids.includes(arr[n])) return false;
      }
      return true;
    },
    /**
     * 组件点击事件
     * @param {Object} item 组件信息
     */
    componentClick(item) {
      //低版本浏览器下筛选表达式会报错故改成jquery
      this.$designer.clearSelectedSlot();
      this.$designer.clearSelectedComponent();
      let el = $(document).find(`[des-id="${item.designId}"]`);
      this.$designer.selectedComponent($(el));
    },
    /**
     * 设置单元格是否锁住
     * @param {Object} item 组合单元格
     * @param {Boolean} locked 是否锁住
     */
    setLocked(item, locked) {
      this.$set(item, "static", locked);
      // 将内部单元格重置锁住状态
      item.i.split(",").forEach((i) => {
        const item = this.currentLayout.find((it) => it.i === i);
        item && this.$set(item, "static", locked);
      });
    },

    /**
     * 设置单元格是否可见
     * @param {Object} item 组合单元格
     * @param {Boolean} show 是否显示
     */
    setVisible(item, show) {
      this.$set(item, "show", show);
      // 将内部单元格重置显示状态
      item.i.split(",").forEach((i) => {
        const item = this.currentLayout.find((it) => it.i === i);
        item && this.$set(item, "show", show);
      });
    },
    /**
     * 鼠标事件
     * @param {Object} evt 事件对象
     * @param {String} i 单元格/组合单元格标识
     * @param {String} type 单元格类型
     * @param {String} mouse 鼠标类型
     */
    mouseEvent(evt, i, type, mouse) {
      dsf.emit.$emit("designer-grid-box-highlight", {
        i,
        type,
        mouse,
      });
    },
    /**
     * 改变单元格层级
     * @param {Object} item 单元格对象
     * @param {String} orientation 方向
     * @param {Number} index 排序数组的位置
     */
    changeZIndex(item, orientation, index) {
      const sortPlatLayout = this.sortPlatLayout;
      const changeItem = orientation === 1 ? sortPlatLayout[index - 1] : sortPlatLayout[index + 1];

      changeItem && this.transpositionGrid(item, changeItem);
    },

    /**
     * 调换单元格位置
     * @param {Object} item
     * @param {Object} changeItem
     */
    transpositionGrid(item, changeItem) {
      const layout = this.currentLayout;

      // 组合单元格
      if (~item.i.indexOf(",")) {
        let i = item.i;
        i = this.compositionToGrid.get(i);
        item = layout.find((l) => l.i === i);
      }
      // 组合单元格
      if (~changeItem.i.indexOf(",")) {
        let i = changeItem.i;
        i = this.compositionToGrid.get(i);
        changeItem = layout.find((l) => l.i === i);
      }
      if (!changeItem || !item) return false;

      const currentIndex = layout.findIndex((l) => l.i === item.i);
      const currentZIndex = item.zIndex;

      const changeIndex = layout.findIndex((l) => l.i === changeItem.i);
      const changeZIndex = changeItem.zIndex;

      changeItem.zIndex = currentZIndex;
      item.zIndex = changeZIndex;

      layout[currentIndex] = changeItem;
      layout[changeIndex] = item;

      this.updateTree();
    },

    /**
     * 删除组合单元格
     * @param {Object} item 组合单元格对象
     */
    async deleteCompositionGrids(item) {
      try {
        await dsf.layer.confirm({
          title: "提醒",
          message: `是否删除该组合单元格?`,
        });
        this.dismissComposition([item]);
        const compositions = item.i.split(",");
        compositions.forEach((i) => {
          Object.keys(this.activeLevelLayout.layout).forEach((key) => {
            const grids = this.activeLevelLayout.layout[key];
            const index = grids.findIndex((it) => it.i == i);

            grids.splice(index, 1);
          });
        });

        this.$designer.dealSlots();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * @Description 删除单元格
     * @param {String} i 单元格标识
     * @param {Object} item 组合单元格信息
     */
    async deleteGrids(i, item) {
      try {
        if (item) {
          await dsf.layer.confirm({
            title: "提醒",
            message: `该单元格在组合单元之中，删除会导致组合单元格自动拆分成普通单元格，是否删除?`,
          });
          this.dismissComposition([item]);
        } else {
          await dsf.layer.confirm({
            title: "提醒",
            message: `是否删除该单元格?`,
          });
        }
        Object.keys(this.activeLevelLayout.layout).forEach((key) => {
          const item = this.activeLevelLayout.layout[key];
          const index = item.findIndex((it) => it.i == i);
          item.splice(index, 1);
        });

        this.$designer.dealSlots();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * @Description 删除组件
     */
    deleteComponents(item) {
      const ctrlMap = Object.assign({}, ..._.values(window.$components));
      const { ctrlName } = item;
      let name = ctrlMap[ctrlName]?.ctrlCaption || ctrlName;
      dsf.layer
        .confirm({
          title: "提醒",
          message: `是否删除${name}组件?`,
        })
        .then(() => {
          let target = $(document).find(`[des-id="${item.designId}"]`);

          let slotEl = target.closest("[slot-name]");
          let parent = dsf.designer.getParentControl(target);
          let slotName = slotEl.attr("slot-name");

          if (parent) {
            let realControl = parent.$$getComponent ? parent.$$getComponent() : parent;
            let slots = !realControl.slots ? realControl.slots : realControl.slots || [];

            let slotIndex = _.findIndex(slots, (s) => s.name == slotName);
            if (slots[slotIndex]) {
              const index = slots[slotIndex].controls.findIndex((it) => it.designId == item.designId);
              slots[slotIndex].controls.splice(index, 1);
            }
            Reflect.deleteProperty(this.$designer.allComponentProps, item.designId);
            this.$nextTick(() => {
              this.$designer.selectedComponent($(this.$designer.$refs.viewProxy.$el), false, true);
              this.$designer.recordPageChange();
              this.$designer.resize();
            });
          }
        });
    },

    /**
     * @Description 解除组合
     * @param{Array|Object} innerComposition 组合单元格对象或兑现数组
     */
    dismissComposition(innerComposition) {
      if (!innerComposition.length) return false;
      const dismiss = () => {
        innerComposition.forEach((it) => {
          const index = this.compositionLayout.findIndex((l) => l.i == it.i);
          if (~index) {
            this.compositionLayout.splice(index, 1);
          }
        });
      };

      dismiss();
    },
    /**
     * 获取组合单元格信息
     */
    getChildrenGrids(i) {
      const children = [];
      i.split(",").forEach((i) => {
        const item = this.currentLayout.find((it) => it.i == i);
        item && children.push(item);
      });
      return children;
    },
    /**
     * 更新树信息
     */
    updateTree() {
      let page = this.$designer.$refs.viewProxy;
      if (!page) return false;

      // 当前页面布局数组
      const layout = page.layout;
      const activeLevel = page.currentLevel;

      this.activeLevel = activeLevel;

      // 当前分辨率
      const designActive = page.designActive;
      // 组合信息
      const compositionLayouts = page.compositionLayouts;

      // 当前层级布局信息
      const activeLevelLayout = layout[activeLevel - 1];

      this.activeLevelLayout = activeLevelLayout;

      // 当前层级布局信息
      const currentLayout = activeLevelLayout.layout[designActive];

      // 当前层级分辨率布局信息
      this.currentLayout = currentLayout;

      // 组合单元格
      const compositionLayout = compositionLayouts[designActive];

      const compositions = compositionLayout.reduce((arr, item) => arr.concat(item.i.split(",")), []);

      this.compositionLayout = compositionLayout;

      // 每个组合单元格中的代表层级单元格
      const cachePresentGrids = [];

      const imapToComposition = new Map();
      // 组合对应的代表grid
      const compositionToGrid = new Map();

      // 需要找出组合中层级最高的单元格
      compositionLayout.forEach((it) => {
        // 最大单元格
        let max = null;
        let maxIndex = -1;
        it.i.split(",").forEach((i) => {
          const gridIndex = currentLayout.findIndex((l) => l.i === i);
          if (gridIndex > -1) {
            const grid = currentLayout[gridIndex];
            if (!max) {
              max = grid;
              maxIndex = gridIndex;
            } else if (max.zIndex < grid.zIndex) {
              max = grid;
              maxIndex = gridIndex;
              //  同级判断下标大小
            } else if (max.zIndex == grid.zIndex && gridIndex > maxIndex) {
              max = grid;
              maxIndex = gridIndex;
            }
          }
        });
        cachePresentGrids.push(max.i);
        imapToComposition.set(max.i, it);
        compositionToGrid.set(it.i, max.i);
      });

      this.compositionToGrid = compositionToGrid;

      // 获取离散单元格以及组合单元格的代表单元格
      const gridsLayout = currentLayout.filter((it) => !compositions.includes(it.i) || cachePresentGrids.includes(it.i));

      const sortPlatLayout = this.getSortLayout(gridsLayout, imapToComposition);

      this.sortPlatLayout = sortPlatLayout;
    },

    /**
     * @Description 获取排序布局
     * @param {Array} layouts 需要倒叙数组
     * @param {Array} imapToComposition 组合单元格
     * @return {Array[Array]} 倒叙二维数组
     */
    getSortLayout(layouts, imapToComposition) {
      const layoutCache = {};
      const sortLayout = [];
      layouts.forEach((it) => {
        const zIndex = it.zIndex || 1;
        const grids = layoutCache[zIndex] || [];

        // 判断是添加离散单元格还是组合单元格
        const composition = imapToComposition.get(it.i);

        if (composition) {
          if (!Object.prototype.hasOwnProperty.call(composition, "name")) {
            this.$set(composition, "name", "组合");
          }
          grids.unshift(composition);
        } else {
          grids.unshift(it);
        }

        layoutCache[zIndex] = grids;
      });

      Object.keys(layoutCache)
        .sort((a, b) => (a - b > 0 ? -1 : 1))
        .forEach((key) => {
          sortLayout.push(layoutCache[key]);
        });

      return sortLayout.reduce((plat, cur) => [...plat, ...cur], []);
    },
    /**
     * @Description 展开关闭方法
     * @param {Object} item 组件对象
     */
    doClosed(item) {
      const itemEl = document.querySelector(`#composition-head-${item.id}`);
      if (itemEl.classList.contains("closed")) {
        itemEl.classList.remove("closed");
      } else {
        itemEl.classList.add("closed");
      }
    },
    loadScript(callback) {
      if (window.Sortable) {
        callback?.();
      } else {
        this.$http
          .importFiles([this.$getWebPath("static/js/libs/vuedraggable/Sortable-1.13.0.js", __DSF_DATAVIEW_PATH__)])
          .then(() => {
            callback?.();
          })
          .catch((err) => {
            console.error(err);
            dsf.layer.message("加载Sortable文件报错", false);
          });
      }
    },
  },
};
</script>

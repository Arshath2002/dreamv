<!--
 * @Editor: zhanghang
 * @Description: 页面结构-单元格组件
 * @Date: 2024-11-14 17:53:18
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-11 18:45:04
-->
<template>
  <div class="des-dv-left-layout-grids" v-show="showGrids">
    <div class="composition-icon">
      <template v-if="!isComposition">
        <DsfIcon class="hover-show" title="可见" @click.stop="setVisible(grid, false)" v-if="grid.show === undefined || grid.show === true" name="icon-visible" style="margin-top: 1px"></DsfIcon>
        <DsfIcon title="不可见" @click.stop="setVisible(grid, true)" v-if="grid.show === false" name="icon-invisible"></DsfIcon>

        <DsfIcon title="解除锁定" @click="setLocked(grid, false)" v-if="grid.static" name="icon-suo"></DsfIcon>
        <DsfIcon title="锁定" @click.stop="setLocked(grid, true)" class="hover-show" v-if="!grid.static" name="icon-suozi"></DsfIcon>
        <DsfIcon class="hover-show" title="上移" @click.stop="changeZIndex(grid.i, 1)" name="shang"></DsfIcon>
        <DsfIcon class="hover-show" title="下移" @click.stop="changeZIndex(grid.i, 0)" name="xia"></DsfIcon>
      </template>
      <DsfIcon class="hover-show" title="删除" @click.stop="deleteGrids" name="delete"></DsfIcon>

      <DsfIcon v-if="!isComposition" class="drag-handler" title="拖动" name="order"></DsfIcon>
    </div>

    <DesDVLeftLayoutGridsTree :activeItemId="activeItemId" :data="getComponents()" v-on="$listeners" :isRoot="true" />
  </div>
</template>
<script>
import DesDVLeftLayoutGridsTree from "./DesDVLeftLayoutGridsTree";
import { eventKeyNames } from "_dataview/output/utils/relativeEvent";
const ctrlMap = Object.assign({}, ..._.values(window.$components));
export default {
  name: "DesDVLeftLayoutGrids",
  components: { DesDVLeftLayoutGridsTree },
  props: {
    // 过滤数据
    filterWords: {
      type: String,
      default: "",
    },

    // 离散单元格数组
    grid: {
      type: Object,
      require: true,
    },
    // 当前层级
    level: {
      type: [Number],
      default: 1,
    },
    // 是否是组合
    isComposition: {
      type: Boolean,
      default: false,
    },
    // 选中组件的designerId
    activeItemId: {
      type: String,
      default: "",
    },
    // 过滤的关键字
    searchWords: {
      type: String,
      default: "",
    },
  },
  computed: {
    showGrids() {
      const { searchWords, filterWords } = this;
      return (!searchWords && filterWords == "all") || (searchWords && this.getComponents().length) || (filterWords && this.getComponents().length);
    },
  },
  methods: {
    /**
     * 设置单元格是否可见
     * @param {Object} item 单元格
     * @param {Boolean} show 是否显示
     */
    setVisible(item, show) {
      this.$set(item, "show", show);
    },

    /**
     * 设置单元格是否锁住
     * @param {Object} item 单元格
     * @param {Boolean} locked 是否锁住
     */
    setLocked(item, locked) {
      this.$set(item, "static", locked);
    },

    /**
     * 获取组件列表
     */
    getComponents() {
      const grid = this.grid;
      const slotName = `area-${grid.i}-${this.level}`;
      const el = $(`[slot-name=${slotName}]`);
      const proxy = el.find(">.designer-ctrl-proxy");

      const result = [];
      for (let i = 0; i < proxy.length; i++) {
        if (proxy[i].__vue__) {
          const vm = proxy[i].__vue__;
          result.push(vm);
        }
      }
      return this.establishTreeData(result, [result]);
    },
    /**
     * 获取组件显示名称
     * @param {Object} item
     */
    getLabelName(item) {
      const { ctrlName, fakeCodeName } = item;
      if (item.isFormControl && item.label) {
        return item?.label || ctrlMap[ctrlName]?.ctrlCaption || ctrlName;
      } else {
        return fakeCodeName ? fakeCodeName : ctrlMap[ctrlName]?.ctrlCaption || ctrlName;
      }
    },

    /**
     * 是否包含依赖事件
     * @param {Object} component 组件对象
     */
    hasEventRelative(component) {
      if (component.hasEventRelative && component.eventRelativeDeal) {
        const keys = Object.keys(eventKeyNames);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (component.eventRelativeDeal[key] && component.eventRelativeDeal[key].fn) {
            return true;
          }
        }
      }
      return false;
    },
    /**
     * 构建过滤数据
     * @param {Array} components 组件数组
     * @param {Array} path 数据遍历路径
     * @param {Boolean} contain 父级是否包含过滤数据
     */
    establishTreeData(components, path, contain = false) {
      const result = [];
      const words = this.searchWords;
      const filterWords = this.filterWords;

      components.forEach((component) => {
        const label = this.getLabelName(component);
        let status = ~label.indexOf(words) ? true : false;

        const hasRelation = this.hasEventRelative(component);
        const hasAnimate = component.enterAnimate && component.enterAnimate.animation && component.enterAnimate.animation.length;

        switch (filterWords) {
          case "animate":
            status = status && hasAnimate;
            break;
          case "relative":
            status = status && hasRelation;
            break;
        }
        const { designId, ctrlType, slots = [], controls = [], ctrlName } = component;
        const children = [...controls];
        const item = {
          ctrlName,
          ctrlType,
          designId,
          showRelation: filterWords === "relative" && hasRelation,
          showAnimate: filterWords === "animate" && hasAnimate,
          label,
          children: [],
        };
        // 缓存路径---便于弹出
        path = [...path, result];

        result.push(item);
        _.forEach(slots, (s) => {
          s.controls && children.push(...s.controls);
        });
        item.children = this.establishTreeData(children, path, status ? status : contain);
        if (!children.length && !status && !contain) {
          // 将该路径的 item 全部抛出
          path.forEach((it) => it.pop());
          result.pop();
        }
      });

      return result;
    },

    deleteGrids() {
      this.$emit("deleteGrids", this.grid.i);
    },
    changeZIndex(i, orientation) {
      this.$emit("changeZIndex", { i, orientation });
    },
  },
};
</script>

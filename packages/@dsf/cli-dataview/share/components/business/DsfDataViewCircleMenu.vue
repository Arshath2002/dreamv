<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-10-09 15:24:23
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-16 14:28:20
-->
<template>
  <div class="data-view-item-wrap ds-control data-view-no-padding dsf-dataview-circle-menu" :style="commonMenuWrapStyle">
    <div class="menu-wrap-box" :ref="ref">
      <circleMenuSvg
        ref="menu"
        :borderWidth="borderWidth"
        :textStyle="textStyle"
        :activeTextStyle="activeTextStyle"
        :menuImgSize="iconSize"
        :defaultBackground="defaultBackground"
        :activeBackground="activeBackground"
        :handleImgSrcStr="handleImgSrcStr"
        :borderColor="borderColor"
        :outRadius="size / 2"
        :inRadius="innerSize / 2"
        :menus="menus"
        :interval="interval"
        :eventRelativeDeal="eventRelativeDeal"
        @mouseenter="({ evt, data }) => handleMouseEnter(data, evt)"
        @mouseleave="({ evt, data }) => handleMouseLeave(data, evt)"
        @selectMenu="selectMenu"
      >
        <div class="dv-circle-menu-slot" slot-name="default">
          <slot></slot>
        </div>
      </circleMenuSvg>
    </div>
  </div>
</template>
<script>
import circleMenuSvg from "./circleMenuSvg.vue";
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import { createCommonTextStyle, createMenuItem } from "_dataview/output/config/commonConfig";

import svg from "_dataview/mixins/svg.js";
import mouseEvents from "_dataview/mixins/mouseEvents.js";
import menuMixin from "_dataview/mixins/menuMixin.js";

const defaultBackground = {
  active: "color",
  color: {
    type: "linear",
    image: "linear-gradient(90deg, #222 0%,#222 100%)",
    isTheme: false,
    theme: "main",
    value: "#222",
  },
};
const activeBackground = {
  active: "color",
  color: {
    type: "linear",
    image: "linear-gradient(90deg, #8A5B00 0%,#FFD37E 100%)",
    isTheme: false,
    theme: "main",
    value: "#FFD37E",
  },
};
const borderColor = {
  active: "color",
  color: {
    type: "linear",
    image: "linear-gradient(90deg, #666 0%,#222 100%)",
    isTheme: false,
    theme: "main",
    value: "#222",
  },
};

const staticData = [
  {
    name: "趋势",
  },
  {
    name: "结构",
  },
  {
    name: "区域",
  },
  {
    name: "企业",
  },
  {
    name: "关联",

  },
];
const _privateRecurse = function (data) {
  const res = [];
  data.forEach((it) => {
    res.push(dsf.mix(true, {}, createMenuItem(), it));
  });
  return res;
};

export default dsf.component({
  name: "DsfDataViewCircleMenu",
  ctrlCaption: "环形菜单",
  mixins: [$mixins.dataView, svg, menuMixin, mouseEvents],
  components: {
    circleMenuSvg,
  },
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewCircleMenu",
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
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          click: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移入事件
          mouseenter: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移出事件
          mouseleave: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
    staticData: {
      type: Array,
      default: () => _privateRecurse(staticData),
    },
    //菜单默认背景
    defaultBackground: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
    //菜单激活背景
    activeBackground: {
      type: Object,
      default() {
        return { ...activeBackground };
      },
    },
    //边框颜色
    borderColor: {
      type: Object,
      default() {
        return {
          ...borderColor,
        };
      },
    },
    textStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          color: "#ffd480",
          fontSize: 16,
        });
      },
    },
    activeTextStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          color: "#FFF",
          fontSize: 16,
        });
      },
    },
    //图标宽度
    iconSize: {
      type: Number,
      default: 30,
    },
    //内环比例大小
    innerSizePercent: {
      type: Number,
      default: 50,
    },
    borderWidth: {
      type: Number,
      default: 2,
    },
    // 菜单之间间隔角度
    interval: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      ref: "menu-wrap",
      otherEvents: ["选中某菜单", "添加菜单", "隐藏菜单", "显示菜单", "高亮菜单", "更新菜单"],
      componentType: "navMenu",
      data: [],
      menus: [],
    };
  },
  computed: {
    size() {
      const { realWidth: width, realHeight: height } = this;
      return height > width ? width : height;
    },
    innerSize() {
      return (this.size * this.innerSizePercent) / 100;
    },
  },
  watch: {
    staticData: {
      handler(v) {
        this.init(v);
      },
      deep: true,
    },
    padding: {
      handler() {
        this.resize();
      },
      deep: true,
    },
  },
  created() {
    this.data = this.staticData;
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      this.handleEventScope();
    });
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.textStyle],
      }
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name))
      if (config._props.ctrlName !== this.ctrlName) {
        const { textStyles = [] } = config;
        groups = groups.filter(it => /布局|背景|边框设置|入场动画/.test(it.name));
        this.updateComponentStyle("textStyle", textStyles[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    init(data = this.data) {
      data = data.filter((it) => !this.isHide(it));
      this.menus = data;
    },
    isHide(tab) {
      if (!this.isDesign) {
        let v = this.$expressParams();
        return this.$eval(tab.isHide, v);
      }
      return false;
    },
    selectMenu({ evt, data }) {
      this.loadClickCellEvents(data, evt);
      this.commonLink(data);
    },
    loadClickCellEvents(data, evt) {
      if (this.isDesign) return false;
      try {
        let { fn } = this.eventRelativeDeal.click;
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data, evt);
      } catch (e) {
        console.error(e);
      }
    },
    /**
     * @Description 添加菜单伪代码
     * @param {*} menu 菜单对象或数组
     */
    handleAddMenu(menu) {
      let data = this.data;
      if (Array.isArray(menu)) {
        data.push(...menu);
      } else {
        data.push(menu);
      }
      this.init();
    },
    /**
     * @Description 隐藏菜单伪代码码
     * @param {*} id 菜单id或者数组
     */
    handleHiddenMenu(id) {
      if (Array.isArray(id)) {
        this.data.forEach((it) => {
          if (id.includes(it.id)) {
            it.isHide = "true";
          }
        });
      } else {
        this.data.forEach((it) => {
          if (id == it.id) {
            it.isHide = "true";
          }
        });
      }
      this.init();
    },
    /**
     * @Description 显示菜单伪代码码
     * @param {*} id 菜单id或者数组
     */
    handleShowMenu(id) {
      if (Array.isArray(id)) {
        this.data.forEach((it) => {
          if (id.includes(it.id)) {
            it.isHide = "false";
          }
        });
      } else {
        this.data.forEach((it) => {
          if (id == it.id) {
            it.isHide = "false";
          }
        });
      }
      this.init();
    },
    //高亮菜单
    highlightMenu(id, trigger = true) {
      let index = this.menus.findIndex((it) => it.id == id);
      if (index > -1) {
        this.$refs.menu.selectMenu(this.menus[index], index, trigger);
      }
    },
    //更新菜单
    handleUpdateMenu(data) {
      this.data = data;
      this.init();
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewCircleMenu.scss";
</style>

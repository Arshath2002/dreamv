<!--
 * @Editor: zhanghang
 * @Description: 仪表盘菜单
 * @Date: 2024-10-16 15:59:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-06 10:18:41
-->

<template>
  <div class="data-view-item-wrap dsf-dv-gauge-menu data-view-no-padding" :style="controlStyle">
    <div class="svg-wrapper" :ref="ref">
      <div class="svg-wrapper_box" :style="`bottom:-${bottomOffset}px`">
        <svgGaugeMenu
          ref="svgGaugeMenu"
          :styles="styles"
          v-if="isMounted"
          :activeMenu="activeMenu"
          :innerRadius="approximatelyRadius"
          :avgAngle="avgAngle"
          :offset="offset"
          :singleMenuLen="singleMenuLen"
          :menusWidths="menusWidths"
          :menus="staticData"
          @updateActive="updateActive"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import svg from "_dataview/mixins/svg.js";
import svgGaugeMenu from "./svgGaugeMenu.vue";
import styles from "./svgGaugeStyles.js";
import { createMenuItem } from "_dataview/output/config/commonConfig";
import menuMixin from "_dataview/mixins/menuMixin.js";
const staticData = [
  {
    name: "时空计算",
    children: [
      {
        name: "核心区",
      },
      {
        name: "青浦",
      },
      {
        name: "长宁",
      },
    ],
  },
  {
    name: "综合保障",
    children: [
      {
        name: "嘉定",
      },
      {
        name: "闵行",
      },
      {
        name: "疏导区",
      },
    ],
  },
  {
    name: "溢出效应",
  },
];
const _privateRecurse = function (data) {
  const res = [];
  data.forEach((it) => {
    const menu = dsf.mix(true, {}, it, createMenuItem({}, "simple"));
    res.push(menu);
    if (it.children && it.children.length) {
      menu.children = _privateRecurse(it.children);
    }
  });
  return res;
};
export default dsf.component({
  name: "DsfDataViewGaugeMenu",
  ctrlCaption: "仪表盘菜单",
  mixins: [$mixins.dataView, menuMixin, svg],
  components: { svgGaugeMenu },
  props: {
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
          //组件初始化事件
          mounted: {
            relatives: [],
            fn: eventTemp,
          },
          //数据点击事件
          click: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
    staticData: {
      type: Array,
      default: () => {
        return _privateRecurse(staticData);
      },
    },
    // 是否自定义内径
    isCustomRadius: {
      type: Boolean,
      default: false,
    },
    // 自定义内径
    customRadius: {
      type: Number,
      default: 200,
    },
    // 内径偏移量
    offsetPadding: {
      type: Number,
      default: 100,
    },
    // 底部偏移量
    btOffset: {
      type: Number,
      default: 0,
    },
    // 根部菜单数量
    rootNumber: {
      type: Number,
      default: 3,
    },
    // 偏移到中心量固定--0.5
    offset: {
      type: Number,
      default: 0.5,
    },
    // 内径展示菜单的角度固定--90°
    showAngle: {
      type: Number,
      default: 90,
    },
    // 菜单的大小
    widths: {
      type: String,
      default: "70,60,50",
    },
    // 菜单同等角度分割数量
    divisionLen: {
      type: String,
      default: "1,2",
    },
    // 默认高亮菜单
    defaultHighlight: {
      type: String,
      default: "",
    },
    // 菜单样式格式
    styles: {
      type: Array,
      default: () => styles(),
    },
  },
  watch: {
    defaultHighlight(v) {
      if (this.isDesign) {
        this.highlightMenu(v, false);
      }
    },
    staticData() {
      this.$refs.svgGaugeMenu && this.$refs.svgGaugeMenu.renderMenu();
    },
  },
  data() {
    return {
      isMounted: false,
      ref: "gauge-menu",
      activeMenu: [],
      otherEvents: ["高亮菜单","选中某菜单"],
      componentType: "navMenu",
    };
  },
  computed: {
    // 根部平均角度
    avgAngle() {
      return this.showAngle / this.rootNumber;
    },
    // 获取真实层级数量
    getLevels() {
      let n = 1;
      const __ = (data, l) => {
        data.forEach((it) => {
          if (it.children && it.children.length) {
            __(it.children, l + 1);
          } else {
            n = Math.max(n, l);
          }
        });
      };
      __(this.staticData, 1);
      return n;
    },
    // 实际的菜单大小层级
    menusWidths() {
      const level = this.getLevels;
      const widths = this.widths.split(",");
      const last = widths[widths.length - 1];
      const len = widths.length;
      const result = len >= level ? widths : widths.concat(new Array(level - len).fill(last));
      return result.map((it) => parseInt(it));
    },
    singleMenuLen() {
      let division = this.divisionLen.split(",");
      division = division.length == 0 ? [1] : division;
      return division.map((it) => parseInt(it));
    },
    bottomOffset() {
      return this.btOffset + this.realHeight / 2 + this.approximatelyRadius / Math.sqrt(2);
    },
    // 根菜单内径
    approximatelyRadius() {
      // 自定义内径
      if (this.isCustomRadius) {
        return this.customRadius;
      }
      const width = this.realWidth - this.offsetPadding;
      const sum = this.menusWidths.reduce((res, w) => res + w, 0);
      const res = (width / 2 - sum) ** 2 * 2;
      const r = Math.sqrt(res);
      return r;
    },
  },
  created() {
    // 默认高亮
    if (this.defaultHighlight) {
      this.highlightMenu(this.defaultHighlight, false);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleEventScope();
      //触发初始化完成
      this.loadMountedEvents();
    });
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: this.styles.map(it => it.textStyle),
      }
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|背景|边框设置|入场动画/.test(it.name));
        const { textStyles = [] } = config;
        for (let i = 0; i < this.styles.length && i < textStyles.length; i++) {
          if (this.styles[i].textStyle) {
            dsf.mix(this.styles[i].textStyle, textStyles[i]);
          }
        }
      }
      this.setComponentStyle(groups, config._props);
    },
    //初始化事件
    loadMountedEvents() {
      try {
        let { mounted } = this.eventRelativeDeal;
        if (mounted && mounted.fn) {
          const fn = mounted.fn;
          this.currentComponentData = this.staticData;
          this.handleCommonEmit(fn, this.currentComponentData);
        }
      } catch (e) {
        console.error(e);
      }
    },
    onResize() {
      this.isMounted = true;
    },
    // 高亮菜单
    highlightMenu(id, trigger = true) {
      let res = [];
      const _recurse = (data, items) => {
        for (let i = 0; i < data.length; i++) {
          const it = data[i];
          if (it.id === id) {
            const { children, ...properties } = it;
            res = [...items, properties];
            break;
          }
          if (it.children && it.children.length) {
            const { children, ...properties } = it;
            _recurse(children, [...items, properties]);
          }
        }
      };
      _recurse(this.staticData, []);
      this.activeMenu = res;

      // 触发事件
      if (trigger) {
        // 获取最后一个菜单值
        const item = res[res.length - 1];
        if (item) {
          this.$dispatch("clickItem", item);
          this.loadClickEvents(item, {});
       
          // 调用点击事件
          this.commonLink(item);
        }
      }
    },
    updateActive(data) {
      const { menus, evt } = data;
      this.activeMenu = menus;
      // 获取最后一个菜单值
      const item = menus[menus.length - 1];
      if (item) {
        this.$dispatch("clickItem", item);
        this.loadClickEvents(item, evt);
        // 调用点击事件
        this.commonLink(item);
      }
    },
    //点击依赖组件关联方法
    loadClickEvents(data, evt) {
      try {
        let { fn } = this.eventRelativeDeal.click;
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data, evt);
      } catch (e) {
        console.error(e);
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/gaugeMenu.scss";
</style>

<!--
 * @Editor: zhanghang
 * @Description: 导航菜单
 * @Date: 2024-11-05 15:06:24
 * @LastEditors: shenah
 * @LastEditTime: 2025-01-21 16:41:19
-->
<template>
  <div class="data-view-item-wrap ds-control dsf-dv-nav-menu data-view-no-padding" :style="wrapperStyle">
    <div class="nav-menu-wrap data-view-common-bg-effect" :style="menuStyle">
      <el-menu v-if="refresh" :collapse="menuMode === 'vertical' ? true : false" ref="menu" @select="selectMenu" :mode="menuMode">
        <SubNavMenuList @subClick="selectMenu" @hover="hoverMenu" @mouseLeaveItem="({ evt, item }) => handleMouseLeave(item, evt)" :popperClass="themeStyleName" :menus="data" :level="1" :mode="menuMode" />
      </el-menu>
    </div>
    <div
      class="slot-full-panel"
      v-if="isSlotFullPanel"
      slot-name="full-panel"
      :style="slotStyle"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <slot name="full-panel"></slot>
    </div>
  </div>
</template>
<script>
import SubNavMenuList from "./SubNavMenuList.vue";
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import { createCommonTextStyle, createMenuItem } from "_dataview/output/config/commonConfig";
import themeMixin from "_dataview/mixins/moreThemeMixin.js";
import menuMixin from "_dataview/mixins/menuMixin.js";
import mouseEvents from "_dataview/mixins/mouseEvents.js";
const defaultBackground = {
  active: "pattern",
  imageType: "nav",
};
const staticData = [
  {
    name: "首页",
    id: dsf.uuid(),
  },
  {
    name: "趋势",
    id: dsf.uuid(),
  },
  {
    name: "结构",
    id: dsf.uuid(),
  },
];
const _privateRecurse = function (data) {
  const res = [];
  data.forEach((it) => {
    const menu = dsf.mix(true, {}, it, createMenuItem());
    res.push(menu);
    if (it.children && it.children.length) {
      menu.children = _privateRecurse(it.children);
    }
  });
  return res;
};
const defaultCustomThemeStyle = {
  "--dv-select-dropdown-bg": "rgba(23,23,23,1)",
  "--dv-select-dropdown-border-radius": "5px 5px 5px 5px",
  "--dv-input-border-color": "transparent",
};
export default dsf.component({
  name: "DsfDataViewNavMenu",
  mixins: [$mixins.dataView, menuMixin, themeMixin, mouseEvents],
  ctrlCaption: "导航菜单",
  provide() {
    return {
      $NavMenu: this,
    };
  },
  components: {
    SubNavMenuList,
  },
  props: {
    // 关联导航组
    relativeNavComponents: {
      type: [String, Array],
      default: "",
    },
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewNavMenu",
    },
    isInvert: {
      type: Boolean,
      default: false,
    },
    slotWidth: {
      type: String,
      default: "150",
    },
    slotHeight: {
      type: String,
      default: "50",
    },
    slotMargin: {
      type: Array,
      default: () => [5, 5, 5, 5],
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "full-panel",
            controls: [],
          },
        ];
      },
    },
    isSlotFullPanel: {
      type: Boolean,
      default: false,
    },
    customThemeStyle: {
      type: Object,
      default: () => defaultCustomThemeStyle,
    },
    customVariable: {
      type: Object,
      default: () => {
        return {
          "--dv-el-menu--popup--min-width": "150px",
        };
      },
    },
    defaultHighlight: {
      type: String,
      default: "",
    },
    propStyleFakeSelect: {
      type: String,
      default: "all",
    },
    height: {
      type: String,
      default: "auto",
    },
    width: {
      type: String,
      default: "100%",
    },

    menuMode: {
      type: String,
      default: "horizontal",
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
          // 鼠标移入事件
          mouseenter: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移除事件
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
    // 导航一级菜单对齐
    navTextAlign: {
      type: Object,
      default: () => ({
        vAlign: "center",
        hAlign: "center",
      }),
    },
    // 导航一级菜字体样式
    navTextStyle: {
      type: Object,
      default: () => {
        return createCommonTextStyle({
          fontSize: 18,
        });
      },
    },
    // inferior 菜单字体样式
    subNavTextStyle: {
      type: Object,
      default: () => {
        return createCommonTextStyle({
          fontSize: 16,
        });
      },
    },
    // 菜单边距
    menuMargin: {
      type: Array,
      default: () => [5, 5, 5, 5],
    },
    // inferior 菜单边距
    subMenuMargin: {
      type: Array,
      default: () => [5, 0, 5, 0],
    },
    // 一级菜单宽度
    menuWidth: {
      type: String,
      default: "160px",
    },
    // 一级菜单高度
    menuHeight: {
      type: String,
      default: "50",
    },
    //inferior 菜单的高度
    subMenuHeight: {
      type: String,
      default: "35",
    },
    clickFlag: {
      type: Boolean,
      default: true,
    },
    clickTextStyle: {
      type: Object,
      default: () => {
        return createCommonTextStyle({
          fontSize: 20,
        });
      },
    },
    // 悬浮一级文本样式
    hoverTextStyle: {
      type: Object,
      default: () => {
        return {
          ...createCommonTextStyle({
            fontSize: 20,
          }),
          isHover: false,
        };
      },
    },
    // 悬浮其他菜单文本样式
    subHoverTextStyle: {
      type: Object,
      default: () => {
        return {
          ...createCommonTextStyle({
            fontSize: 16,
          }),
        };
      },
    },

    // 默认一级菜单背景
    defaultBackgroundConfig: {
      type: Object,
      default: () => ({
        active: "color",
        color: {
          // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
          type: "color",
          //提供给渐变使用
          image: "",
          value: "transparent",
        },
      }),
    },
    // 菜单点击背景
    clickBackgroundConfig: {
      type: Object,
      default: () => ({
        active: "color",
        color: {
          // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
          type: "color",
          //提供给渐变使用
          image: "",
          value: "transparent",
        },
      }),
    },
    // 默认其他菜单背景
    subDefaultBackgroundConfig: {
      type: Object,
      default: () => ({
        active: "color",
        color: {
          // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
          type: "color",
          //提供给渐变使用
          image: "",
          value: "transparent",
        },
      }),
    },
    // 激活其他菜单背景
    subHoverBackgroundConfig: {
      type: Object,
      default: () => ({
        active: "color",
        color: {
          // 选色方式 默认为空 单色色盘选择 color  线性渐变 linear  径向渐变 radial
          type: "color",
          //提供给渐变使用
          image: "",
          value: "transparent",
        },
      }),
    },
    panelBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
    // 一级菜单对齐方式
    textAlign: {
      type: String,
      default: "center",
    },
    // 一级菜单内边距
    textPadding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    // 一级菜单图标内边距
    iconPadding: {
      type: Array,
      default: () => [5, 5, 5, 5],
    },
    // inferior 菜单对齐方式
    subTextAlign: {
      type: String,
      default: "left",
    },
    // inferior 菜单内边距
    subTextPadding: {
      type: Array,
      default: () => [5, 10, 5, 10],
    },
    // inferior 菜单图标内边距
    subIconPadding: {
      type: Array,
      default: () => [5, 5, 5, 5],
    },
  },
  data() {
    return {
      refresh: true,
      activeId: "",
      activePath: [],
      hoverPath: [],
      // 用于判断是否离开菜单
      isHover: false,
      // 收集二级菜单id
      subMenus: [],

      data: [],

      otherEvents: ["选中某菜单", "添加菜单", "隐藏菜单", "显示菜单", "高亮菜单", "更新菜单"],
      componentType: "navMenu",
    };
  },
  computed: {
    // 是否有二级菜单
    hasChild() {
      let res = false;
      this.data.forEach((it) => {
        if (it.children && it.children.length) {
          res = true;
        }
      });
      return res;
    },
    slotStyle() {
      return {
        height: dsf.dataview.utils.transformPx(this.slotHeight),
        width: dsf.dataview.utils.transformPx(this.slotWidth),
        margin: dsf.dataview.utils.transformArrayPx(this.slotMargin),
      };
    },
    wrapperStyle() {
      const controlStyle = this.controlStyle;
      let background = this.panelBackgroundConfig;
      let style = {
        ...controlStyle,
        ...this.dvBackgroundFormat(background, {
          isBgInfoVar: true,
        }),
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
      return style;
    },
    menuStyle() {
      let style = {}
      if (this.menuMode === "horizontal") {
        style.flexDirection = "row";
        style.alignItems = this.navTextAlign.vAlign;
        style.justifyContent = this.navTextAlign.hAlign;
      } else {
        style.flexDirection = "column";
        style.alignItems = this.navTextAlign.hAlign;
        style.justifyContent = this.navTextAlign.vAlign;
      }
      return style;
    },
  },
  watch: {
    staticData: {
      handler(staticData) {
        if (this.isDesign) {
          this.data = staticData;
          if (!this.hasChild) {
            this.$emit("update:propStyleFakeSelect", "all");
          }
        }
      },
      deep: true,
    },
    relationStyle() {
      if (this.isDesign) {
        // 主题变量--提供给弹框背景
        this.initCreateThemeVar();
      }
    },
    customThemeStyle: {
      handler() {
        if (this.isDesign) {
          // 主题变量--提供给弹框背景
          this.initCreateThemeVar();
        }
      },
      deep: true,
    },
    customVariable: {
      handler() {
        if (this.isDesign) {
          // 主题变量--提供给弹框背景
          this.initCreateThemeVar();
        }
      },
      deep: true,
    },
    defaultHighlight(v) {
      if (this.isDesign && v) {
        this.highlightMenu(v, false);
      }
    },
    menuMode() {
      if (this.isDesign) {
        // 重新挂载一下
        this.refresh = false;
        this.$nextTick(() => {
          this.refresh = true;
        });
      }
    },
  },
  created() {
    let staticData = this.staticData;
    if (!this.isDesign) {
      // 兼容一级菜单-无id的情况
      staticData = this.staticData.map((it) => {
        it.id = it.id === undefined ? dsf.uuid() : it.id;
        return it;
      });
    }
    this.data = staticData;

    this.subMenus = this.collectSubmenus();

    if (this.isDesign && !this.hasChild) {
      this.$emit("update:propStyleFakeSelect", "all");
    }
    if (this.isDesign && !this.defaultHighlight) {
      const data = this.data;
      this.$emit("update:defaultHighlight", data[0] ? data[0].id : "");
    }

    // 默认高亮
    if (this.defaultHighlight) {
      this.highlightMenu(this.defaultHighlight, false);
      const menu = this.findMenuById(this.activeId);
      this.currentComponentData = menu;
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
        textStyles: [this.navTextStyle, this.subNavTextStyle],
        textAligns: [this.textAlign, this.subTextAlign],
        backgrounds: [this.panelBackgroundConfig],
        itemBackgrounds: [this.defaultBackgroundConfig, this.subDefaultBackgroundConfig],
      }
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|背景|边框设置|入场动画/.test(it.name));
        const { textStyles = [], textAligns = [], backgrounds = [], itemBackgrounds = [] } = config;
        this.updateComponentStyle("navTextStyle", textStyles[0]);
        this.updateComponentStyle("subNavTextStyle", textStyles[1]);
        this.updateComponentStyle("textAlign", textAligns[0]);
        this.updateComponentStyle("subTextAlign", textAligns[1]);
        this.updateComponentStyle("panelBackgroundConfig", backgrounds[0]);
        this.updateComponentStyle("defaultBackgroundConfig", itemBackgrounds[0]);
        this.updateComponentStyle("subDefaultBackgroundConfig", itemBackgrounds[1]);
      }
      this.setComponentStyle(groups, config._props);
    },
    /**
     * @Description 添加导航组列表
     * @param {object} data
     */
    addComponents(data) {
      const options = [];
      dsf.designer.recursionLayoutTree(this.$designer.$refs.viewProxy, null, null, (it) => {
        if (it.isDataViewControl && it.ctrlName === "DsfDataViewNavMenu" && it != this) {
          options.push({
            text: it.fakeCodeName,
            value: it.caption,
          });
        }
      });
      data.dictionary = options;
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
    },
    /**
     * @Description 隐藏菜单伪代码码
     * @param {*} id 菜单id或者数组
     */
    handleHiddenMenu(id) {
      if (Array.isArray(id)) {
        id.forEach((it) => {
          const item = this.findMenuById(it);
          item && this.$set(item, "isHide", "true");
        });
      } else {
        const item = this.findMenuById(id);
        item && this.$set(item, "isHide", "true");
      }
    },
    /**
     * @Description 显示菜单伪代码码
     * @param {*} id 菜单id或者数组
     */
    handleShowMenu(id) {
      if (Array.isArray(id)) {
        id.forEach((it) => {
          const item = this.findMenuById(it);
          item && this.$set(item, "isHide", "false");
        });
      } else {
        const item = this.findMenuById(id);
        item && this.$set(item, "isHide", "false");
      }
    },
    /**
     * @Description 更新菜单伪代码
     * @param {Array} data 菜单数组
     */
    handleUpdateMenu(data) {
      this.data = data;
    },
    /**
     * @Description 收集inferior 菜单的id
     */
    collectSubmenus() {
      const res = [];
      const collect = (data) => {
        data.forEach((it) => {
          if (it.children && it.children.length) {
            res.push(it.id);
            collect(it.children);
          }
        });
      };
      collect(this.data);
      return res;
    },
    /**
     * @Description 是否隐藏
     * @param {Object} menu
     */
    isHide(menu) {
      if (!this.isDesign) {
        let v = this.$expressParams();
        return this.$eval(menu.isHide, v);
      }
      return false;
    },
    /**
     * @Description 初始化事件
     */
    loadMountedEvents() {
      try {
        let { mounted } = this.eventRelativeDeal;
        if (mounted && mounted.fn) {
          const fn = mounted.fn;
          this.currentComponentData = this.data;
          this.handleCommonEmit(fn, this.currentComponentData);
        }
      } catch (e) {
        console.error(e);
      }
    },
    /**
     * @Description 选中菜单
     * @param {String} id 激活菜单id
     * @param {Boolean} trigger 是否触发事件
     */
    highlightMenu(id, trigger = true) {
      const indexPath = this.findPathById(id, this.data, []);
      if (trigger) {
        this.selectMenu(id, indexPath);
      } else {
        this.activePath = indexPath;
        this.activeId = id;

        this.clearNavComponentStatus();
      }
    },
    /**
     * @Description 清空组件高亮状态
     *
     */
    clearNavComponentStatus() {
      if (this.isDesign || !this.relativeNavComponents.length || (!this.$page.$vm && !this.$page.$vm)) return false;
      const vm = this.$page.$vm;
      let relativeNavComponents = this.relativeNavComponents;
      if (!Array.isArray) {
        relativeNavComponents = [relativeNavComponents];
      }
      relativeNavComponents.forEach((element) => {
        const component = vm.$refs[element];
        if (component) {
          component.activeId = "";
          component.activePath = [];
        }
      });
    },
    /**
     * @Description 选择菜单
     * @param {String} 激活菜单id
     * @param {Array} indexPath 菜单路径数组
     */
    selectMenu(activeId, indexPath) {
      if (this.isInvert && this.activeId === activeId) {
        this.activePath = [];
        this.activeId = "";
      } else {
        this.activePath = indexPath;
        this.activeId = activeId;
      }

      const menu = this.findMenuById(activeId);
      menu.showName = this.dataviewAnalysisSpecialVar(menu.name);
      this.clickItem({}, menu);
      this.clearNavComponentStatus();
    },
    /**
     * @Description 选择菜单触发事件
     * @param {Object} evt 鼠标对象
     * @param {Object} item 菜单对象
     */
    clickItem(evt, item) {
      this.$dispatch("clickItem", item);
      this.loadClickEvents(item, evt);
      this.commonLink(item);
    },

    /**
     * @Description 点击依赖组件关联方法
     * @param {Object} data 菜单对象
     * @param {Object} evt 鼠标对象
     */
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
    /**
     * @Description 通过id 寻找菜单对象
     * @param {String} 菜单id
     */
    findMenuById(id) {
      let item = null;
      const recurse = function (data) {
        for (let i = 0; i < data.length; i++) {
          const it = data[i];
          if (it.id === id) {
            item = it;
            break;
          } else if (it.children && it.children.length) {
            recurse(it.children);
          }
        }
      };
      recurse(this.data);
      return item;
    },
    /**
     * @Description 通过id 寻找路径
     * @param {String} 菜单id
     * @param {Array} data 菜单树目录
     * @param {Array} path 路径数组
     */
    findPathById(id, data, arr) {
      for (let i = 0; i < data.length; i++) {
        const it = data[i];
        if (id === it.id) {
          arr.push(it.id);
          return arr;
        } else if (it.children && it.children.length) {
          arr.push(it.id);
          const res = this.findPathById(id, it.children, [...arr]);
          if (res.length === arr.length) {
            arr.pop();
          } else {
            // 根路径
            return res;
          }
        }
      }
      return arr;
    },
    /**
     * @Description 悬浮菜单
     * @param {String} 菜单id
     */
    hoverMenu(id, evt) {
      if (id === undefined) {
        // console.log("触发");
        this.isHover = false;
        setTimeout(() => {
          if (!this.isHover) {
            // 清空路径
            this.hoverPath = [];
            this.subMenus.forEach((m) => {
              this.$refs.menu.close(m);
            });
          }
        }, 400);
      } else {
        this.isHover = true;
        this.hoverPath = this.findPathById(id, this.data, []);

        // 鼠标移入事件
        const data = this.findMenuById(id);
        this.handleMouseEnter(data || {}, evt);
      }
    },
    afterChangeStyle() {
      // 主题变量--提供给弹框背景
      this.initCreateThemeVar();
    },
    // 自定义
    specialAddStyle() {
      const config = dsf.mix(true, {}, this.customVariable, defaultCustomThemeStyle, this.customThemeStyle);
      config["--dv-select-dropdown-border-radius"] = dsf.dataview.utils.transformArrayPx(config["--dv-select-dropdown-border-radius"]);
      this.addStyle(config);
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/navMenu.scss";
</style>

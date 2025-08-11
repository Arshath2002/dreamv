<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-10-28 10:00:11
 * @LastEditors: shenah
 * @LastEditTime: 2024-12-02 10:50:05
-->
<template>
  <div
    class="data-view-item-wrap ds-control dsf-dataview-nav-tab data-view-no-padding data-view-parent-slot-wrap"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <div
      class="slot-top-left"
      v-if="isSlotTopLeft"
      :style="slotTopLeftStyle"
      slot-name="header-top-left"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <div class="slot-content-wrap">
        <!-- 插槽内容可正常显示 -->
        <slot name="header-top-left"></slot>
        <!-- 覆盖在选项卡区域的透明层，确保点击事件传递 -->
        <div class="transparent-overlay"></div>
      </div>
    </div>
    <div
      class="slot-top-right"
      v-if="isSlotTopRight"
      slot-name="header-top-right"
      :style="slotTopRightStyle"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <div class="slot-content-wrap">
        <!-- 插槽内容可正常显示 -->
        <slot name="header-top-right"></slot>
        <!-- 覆盖在选项卡区域的透明层，确保点击事件传递 -->
        <div class="transparent-overlay"></div>
      </div>
    </div>
    <div class="click-layer"></div>
    <el-tabs
      :style="{
        'z-index': isDesign ? 98 : 101,
        ...this.getBoxShadowConfig(false),
      }"
      :class="[
        `tab_positions_${navPosition}`,
        contentFit,
        `business-nav-tab-default`,
        { 'business-nav-tab-default-none': !isDesign && isHideHeader },
      ]"
      v-model="activeName"
      :tab-position="tabPosition"
      :closable="false"
      @tab-click="tabClick"
      @tab-remove="tabRemove"
    >
      <slot name="default"></slot>
      <el-tab-pane
        v-for="(d, index) in navSlots.filter((tab) => {
          return isHide(tab) !== true;
        })"
        :key="d.name"
        :disabled="isDisable(d)"
        :label="d.title"
        :name="d.name"
        :slot-name="d.name"
        :lazy="isLazy(d)"
        :style="getPlanStyle"
      >
        <div
          v-show="(!isDesign && !isHideHeader) || isDesign"
          class="panel-label"
          slot="label"
          :class="activeName === d.name ? 'is-actived' : ''"
          :style="getTabStyle(d, index)"
        >
          {{ d.title }}
        </div>
        <slot :name="d.name"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import navTabControl from "_dataview/mixins/navTabControl.js";
import slotPageManage from "_dataview/mixins/slotPageManage.js";
export default dsf.component({
  name: "DsfDataViewNavTab",
  ctrlCaption: "选项卡",
  mixins: [$mixins.dataView, navTabControl, slotPageManage],
  props: {
    styleMapKey:{
      type: String,
      default: "dataviewNavTab",
    },
    //盒子状态 dv_auto 全显示 dv_hidden 隐藏---针对移动端
    contentFit: {
      type: String,
      default: "dv_hidden",
    },
    slotTopLeftHeight: {
      type: String,
      default: "30",
    },
    slotTopRightHeight: {
      type: String,
      default: "30",
    },
    isHideHeader: {
      type: Boolean,
      default: false,
    },
    //选项卡头部下边框
    navBorder: {
      type: Object,
      default() {
        return {
          width: 1,
          color: "transparent",
        };
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
          //数据点击事件
          click: {
            relatives: [],
            fn: eventTemp,
          },
          change: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
  },
  watch: {
    navBorder: {
      handler() {
        this.changeNavBorderStyle();
      },
      deep: true,
    },
  },
  computed: {
    getPlanStyle() {
      let { contentPadding, planStyle } = this;
      let backgroundObj =
        this.dvBackgroundFormat(planStyle) || {};
      return {
        padding: dsf.dataview.utils.transformArrayPx(contentPadding),
        ...backgroundObj,
      };
    }
  },
  mounted() {
    this.changeNavBorderStyle();
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.noSelectStyle],
        backgrounds: [this.planStyle],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.updateComponentStyle("noSelectStyle", textStyles[0]);
        this.updateComponentStyle("planStyle", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    changeNavBorderStyle() {
      let { width, color } = this.navBorder;
      width = dsf.dataview.utils.transformPx(width);
      let topBorder = {
        "border-bottom": `${width} solid ${color}`,
      };
      let leftBorder = {
        "border-right": `${width} solid ${color}`,
      };
      this.$el && $(this.$el).find(".el-tabs__nav-wrap.is-top").css(topBorder);

      this.$el &&
        $(this.$el).find(".el-tabs__nav-wrap.is-left").css(leftBorder);
    },
    //切换选项卡
    handleChange(active) {
      this.activeName = active;
    },
    // 获取当前值
    handleGetValue() {
      return this.activeName;
    },
    //加载依赖组件关联方法
    loadChangeEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.change;
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
    //点击依赖组件关联方法
    loadClickEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.click;
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
    init() {},
    updateChildComp() {
      this.$nextTick(() => {
        let el = this.$el;
        this.slots.forEach((it) => {
          let controls = it.controls;
          controls.forEach((_it) => {
            let name = _it.caption;
            let vmDom = $(el).find(
              ".data-view-item-wrap[ctrl-id='" + name + "']"
            )[0];
            let vm = null;
            if (vmDom) {
              vm = vmDom.__vue__;
              vm.init?.();
            }
          });
        });
      });
    },
    changeActiveHandler(activeName) {
      this.activeName = activeName;
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/navTab.scss";
</style>

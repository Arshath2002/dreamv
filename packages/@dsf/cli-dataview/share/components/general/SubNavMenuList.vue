<!--
 * @Editor: zhanghang
 * @Description: 导航下来菜单
 * @Date: 2024-11-05 15:07:03
 * @LastEditors: shenah
 * @LastEditTime: 2025-01-21 16:39:16
-->
<template>
  <div @mouseleave="handleMouseLeave" class="dv-el-menu-box" :class="{ 'el-menu--horizontal': level === 1 && menuMode === 'horizontal' }">
    <template v-for="item in menus">
      <el-menu-item :index="item.id" v-if="!$NavMenu.isHide(item) && (!item.children || item.children.length === 0)" :key="item.id">
        <div class="nav-item" @mouseleave="(e) => handleMouseMenuLeave(item, e)" @mouseenter="handleMouseEnter(item.id)" :style="level === 1 ? getFirstLevelStyleItem(item) : getOtherStyleItem(item)">
          <div class="nav-item-inner data-view-common-bg-effect" :style="getStyleItemInner">
            <div class="nav-item-block" :style="getItemBlockStyle(item)">
              <!-- 前缀 上缀 -->
              <template v-if="item.valueShowPosition == 'before' || item.valueShowPosition == 'top'">
                <template v-if="item.valueShowType === 'img'">
                  <img
                    v-if="item.valueImgObj && item.valueImgObj.defaultValue"
                    :src="$NavMenu.handleImgSrcStr(item.valueImgObj.defaultValue)"
                    :style="getImgStyle(item.valueImgObj)"
                    class="show-img before"
                  />
                </template>
                <DsfIcon
                  v-if="item.valueShowType === 'icon' && item.valueIconObj && item.valueIconObj.defaultValue"
                  :name="item.valueIconObj.defaultValue"
                  :style="getIconStyle(item)"
                  class="show-icon before menu-icon"
                />
              </template>
              <div class="nav-item-text" :style="getItemTextStyle(item)">
                {{ $NavMenu.dataviewAnalysisSpecialVar(item.name) }}
              </div>
              <!-- 后缀 下缀 -->
              <template v-if="item.valueShowPosition == 'after' || item.valueShowPosition == 'bottom'">
                <template v-if="item.valueShowType === 'img'">
                  <img
                    v-if="item.valueImgObj && item.valueImgObj.defaultValue"
                    :src="$NavMenu.handleImgSrcStr(item.valueImgObj.defaultValue)"
                    :style="getImgStyle(item.valueImgObj)"
                    class="show-img before"
                  />
                </template>
                <DsfIcon
                  v-if="item.valueShowType === 'icon' && item.valueIconObj && item.valueIconObj.defaultValue"
                  :style="getIconStyle(item)"
                  :name="item.valueIconObj.defaultValue"
                  class="show-icon before menu-icon"
                />
              </template>
            </div>
          </div>
        </div>
      </el-menu-item>
      <el-submenu
        :popperAppendToBody="true"
        :popperClass="`dsf-dv-nav-sub-menu ${popperClass}`"
        :index="item.id"
        v-else-if="!$NavMenu.isHide(item) && item.children && item.children.length"
        :key="`sub_${item.id}`"
      >
        <template slot="title">
          <div
            class="nav-item"
            @click="handleClick(item,e)"
            @mouseleave="(e) => handleMouseMenuLeave(item, e)"
            @mouseenter="handleMouseEnter(item.id)"
            :style="level === 1 ? getFirstLevelStyleItem(item) : getOtherStyleItem(item)"
          >
            <div class="nav-item-inner data-view-common-bg-effect" :style="getStyleItemInner">
              <div class="nav-item-block" :style="getItemBlockStyle(item)">
                <!-- 前缀 上缀 -->
                <template v-if="item.valueShowPosition == 'before' || item.valueShowPosition == 'top'">
                  <template v-if="item.valueShowType === 'img'">
                    <img
                      v-if="item.valueImgObj && item.valueImgObj.defaultValue"
                      :src="$NavMenu.handleImgSrcStr(item.valueImgObj.defaultValue)"
                      :style="getImgStyle(item.valueImgObj)"
                      class="show-img before"
                    />
                  </template>
                  <DsfIcon
                    v-if="item.valueShowType === 'icon' && item.valueIconObj && item.valueIconObj.defaultValue"
                    :name="item.valueIconObj.defaultValue"
                    :style="getIconStyle(item)"
                    class="show-icon before menu-icon"
                  />
                </template>
                <div class="nav-item-text" :style="getItemTextStyle(item)">
                  {{ $NavMenu.dataviewAnalysisSpecialVar(item.name)}}
                </div>
                <!-- 后缀 下缀 -->
                <template v-if="item.valueShowPosition == 'after' || item.valueShowPosition == 'bottom'">
                  <template v-if="item.valueShowType === 'img'">
                    <img
                      v-if="item.valueImgObj && item.valueImgObj.defaultValue"
                      :src="$NavMenu.handleImgSrcStr(item.valueImgObj.defaultValue)"
                      :style="getImgStyle(item.valueImgObj)"
                      class="show-img before"
                    />
                  </template>
                  <DsfIcon
                    v-if="item.valueShowType === 'icon' && item.valueIconObj && item.valueIconObj.defaultValue"
                    :style="getIconStyle(item)"
                    :name="item.valueIconObj.defaultValue"
                    class="show-icon before menu-icon"
                  />
                </template>
              </div>
            </div>
          </div>
        </template>
        <SubNavMenuList v-on="$listeners" :menus="item.children" :popperClass="popperClass" :level="level + 1" />
      </el-submenu>
    </template>
  </div>
</template>
<script>
export default {
  name: "SubNavMenuList",
  inject: ["$NavMenu"],
  props: {
    popperClass: {
      type: String,
      default: "",
    },

    menus: {
      type: Array,
      require: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    mode: {
      type: String,
      default: "",
    },
  },
  computed: {
    // 对齐方式
    getStyleItemInner() {
      const align = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      return {
        justifyContent: this.level === 1 ? align[this.textAlign] : align[this.subTextAlign],
      };
    },

    clickFlag() {
      return this.$NavMenu.clickFlag;
    },
    menuMode() {
      return this.$NavMenu.menuMode;
    },
    textPadding() {
      return this.$NavMenu.textPadding;
    },
    textAlign() {
      return this.$NavMenu.textAlign;
    },
    iconPadding() {
      return this.$NavMenu.iconPadding;
    },

    subTextPadding() {
      return this.$NavMenu.textPadding;
    },
    subTextAlign() {
      return this.$NavMenu.subTextAlign;
    },
    subIconPadding() {
      return this.$NavMenu.iconPadding;
    },
    subMenuMargin() {
      return this.$NavMenu.subMenuMargin;
    },
    menuWidth() {
      return this.$NavMenu.menuWidth;
    },
    menuHeight() {
      return this.$NavMenu.menuHeight;
    },
    menuMargin() {
      return this.$NavMenu.menuMargin;
    },
    subMenuHeight() {
      return this.$NavMenu.subMenuHeight;
    },
    navTextStyle() {
      return this.$NavMenu.navTextStyle;
    },
    subNavTextStyle() {
      return this.$NavMenu.subNavTextStyle;
    },
    hoverTextStyle() {
      return this.$NavMenu.hoverTextStyle;
    },
    subHoverTextStyle() {
      return this.$NavMenu.subHoverTextStyle;
    },

    clickTextStyle() {
      return this.$NavMenu.clickTextStyle;
    },

    // 激活菜单路径
    activePath() {
      return this.$NavMenu.activePath;
    },
    // 激活菜单的一级菜单
    activeFirstLevel() {
      return this.$NavMenu.activePath[0];
    },
    // hover菜单的路径
    hoverPath() {
      return this.$NavMenu.hoverPath;
    },
    // 默认菜单背景
    defaultBackgroundConfig() {
      return this.$NavMenu.defaultBackgroundConfig;
    },
    // 激活菜单背景
    clickBackgroundConfig() {
      return this.$NavMenu.clickBackgroundConfig;
    },
    subDefaultBackgroundConfig() {
      return this.$NavMenu.subDefaultBackgroundConfig;
    },
    subHoverBackgroundConfig() {
      return this.$NavMenu.subHoverBackgroundConfig;
    },
  },
  methods: {
    // 菜单块样式
    getItemBlockStyle(item) {
      let { textPadding, subTextPadding } = this.$NavMenu;
      const style = {
        flexDirection: ["before", "after"].includes(item.valueShowPosition) ? "row" : "column",
      };
      if (this.level == 1) {
        style.margin = dsf.dataview.utils.transformArrayPx(textPadding);
      } else {
        style.margin = dsf.dataview.utils.transformArrayPx(subTextPadding);
      }
      return style;
    },
    handleMouseEnter(id) {
      this.$emit("hover", id);
    },
    handleMouseLeave() {
      this.$emit("hover", undefined);
    },
    handleMouseMenuLeave(item, evt) {
      this.$emit("mouseLeaveItem", { evt, item });
    },
    handleClick(item){
      let activeId = item.id;
      let indexPath = this.$NavMenu.findPathById(item.id,this.$NavMenu.data,[]);
      this.$emit("subClick", activeId,indexPath);
    },
    getIconStyle(item) {
      let { iconPadding, navTextStyle, clickTextStyle, subNavTextStyle, subHoverTextStyle, level } = this;
      let style = {};
      let isActive = item.id && (this.activePath.includes(item.id) || this.hoverPath.includes(item.id));
      if (level == 1) {
        style = navTextStyle;
        // 悬浮效果
        if (this.hoverTextStyle.isHover && this.hoverPath.includes(item.id)) {
          const hoverStyle = dsf.dataview.utils.transformTextStyle(this.hoverTextStyle);
          style = hoverStyle;
        }
        //选中效果
        if (item.id && this.activePath.includes(item.id)) {
          style = clickTextStyle;
        }
  
      } else {
        style = isActive ? subHoverTextStyle : subNavTextStyle;
      }

      return {
        ...style,
        margin: dsf.dataview.utils.transformArrayPx(iconPadding),
      };
    },
    getImgStyle(item) {
      let { iconPadding } = this;
      let style = {
        width: dsf.dataview.utils.transformPx(item.imgWidth),
        height: dsf.dataview.utils.transformPx(item.imgHeight),
        margin: dsf.dataview.utils.transformArrayPx(iconPadding),
        ...dsf.dataview.utils.getBgAnimation(item.defaultValue),
      };
      return style;
    },

    /**
     * @Description 其他菜单样式
     *
     */
    getOtherStyleItem(item) {
      const { subMenuHeight } = this;
      let isActive = item.id && (this.activePath.includes(item.id) || this.hoverPath.includes(item.id));
      const transformStyle = isActive ? dsf.dataview.utils.transformTextStyle(this.subHoverTextStyle, ["color"]) : dsf.dataview.utils.transformTextStyle(this.subNavTextStyle, ["color"]);
      const style = {
        ...style,
        ...transformStyle,
      };
      style.height = dsf.dataview.utils.transformPx(subMenuHeight);
      const background = isActive ? this.subHoverBackgroundConfig : this.subDefaultBackgroundConfig;

      style.margin = dsf.dataview.utils.transformArrayPx(this.subMenuMargin);
      return {
        ...style,
        ...this.$NavMenu.dvBackgroundFormat(background, {}),
      };
    },
    /**
     * @Description 一级菜单样式
     * @param {Object} item 菜单对象
     */
    getFirstLevelStyleItem(item) {
      const { menuHeight, menuMargin, menuWidth } = this;

      let style = {};
      let background = {};

      style.height = dsf.dataview.utils.transformPx(menuHeight);
      style.width = dsf.dataview.utils.transformPx(menuWidth);
      style.margin = dsf.dataview.utils.transformArrayPx(menuMargin);

      let isActive = item.id && item.id == this.activeFirstLevel && this.clickFlag;
      const transformStyle = isActive ? dsf.dataview.utils.transformTextStyle(this.clickTextStyle, ["color"]) : dsf.dataview.utils.transformTextStyle(this.navTextStyle, ["color"]);
      style = {
        ...style,
        ...transformStyle,
      };
      style.width = dsf.dataview.utils.transformPx(this.menuWidth);
      background = item.id && item.id == this.activeFirstLevel && this.clickFlag ? this.clickBackgroundConfig : this.defaultBackgroundConfig;

      style = {
        ...style,
        ...this.$NavMenu.dvBackgroundFormat(background, {
          isBgInfoVar: true,
        }),
      };

      return style;
    },
    /**
     * @Description 名字样式
     * @param {Object} item 菜单对象
     */
    getItemTextStyle(item) {
      let style = {};

      // 一级菜单文本样式
      if (this.level === 1) {
        style = dsf.dataview.utils.getTextColor(this.navTextStyle.color);
        if (item.id && this.hoverTextStyle.isHover && this.hoverPath.includes(item.id)) {
          const hoverStyle = dsf.dataview.utils.transformTextStyle(this.hoverTextStyle);
          style = hoverStyle;
        }
        let isActive = item.id && item.id == this.activeFirstLevel && this.clickFlag;
        style = isActive ? dsf.dataview.utils.getTextColor(this.clickTextStyle.color) : style;
   
        // 其他菜单文本样式
      } else {
        style = dsf.dataview.utils.transformTextStyle(this.subNavTextStyle);
        if (item.id && (this.hoverPath.includes(item.id) || this.activePath.includes(item.id))) {
          style = dsf.dataview.utils.transformTextStyle(this.subHoverTextStyle);
        }
      }

      return style;
    },
  },
};
</script>

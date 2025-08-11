<template>
  <div class="dsf-dv-circle-menu" :style="setSize(outRadius)">
    <svg :width="outRadius * 2 + 'px'" :height="outRadius * 2 + 'px'">
      <defs>
        <radialGradient :id="defaultMenuId" gradientUnits="userSpaceOnUse">
          `
          <stop offset="0%" :stop-color="defaultBgColor[0]" />
          <stop offset="100%" :stop-color="defaultBgColor[1]" />
        </radialGradient>
        <radialGradient :id="menuId" gradientUnits="userSpaceOnUse">
          `
          <stop offset="0%" :stop-color="activeBgColor[0]" />
          <stop offset="100%" :stop-color="activeBgColor[1]" />
        </radialGradient>
        <radialGradient :id="defaultLineId" gradientUnits="userSpaceOnUse">
          `
          <stop offset="0%" :stop-color="normalLineColor[0]" />
          <stop offset="100%" :stop-color="normalLineColor[1]" />
        </radialGradient>
        <radialGradient :id="lineId" gradientUnits="userSpaceOnUse">
          `
          <stop offset="0%" :stop-color="normalLineColor[0]" />
          <stop offset="100%" :stop-color="normalLineColor[1]" />
        </radialGradient>
      </defs>
      <!-- 扇形 -->
      <path
        v-for="(item, index) in shapes.filter((index) => activeIndex !== index)"
        :key="`path_${index}`"
        :d="drawPath(item)"
        :fill="`url(#${defaultMenuId})`"
        class="dsf-dv-circle-menu-shape"
        :stroke="activeIndex === index ? activeBgColor[1] : 'url(#' + lineId + ')'"
        :stroke-width="borderWidth"
      />
      <!-- 线条 -->
      <path v-for="(item, index) in shapes" :key="`border_${index}`" :d="drawLinePath(item)" :class="{ 'dsf-dv-circle-menu-line': activeIndex !== index }" :stroke-width="borderWidth" />
      <!-- 激活扇形 -->
      <path :d="drawPath(activeShape)" class="dsf-dv-circle-menu-shape__active" :fill="`url(#${menuId})`" :stroke="activeBgColor[1]" :stroke-width="borderWidth" />
    </svg>
    <!-- 菜单 -->
    <div class="dsf-dv-circle-menu-content" :style="setSize(outRadius)">
      <div
        @mouseenter="mouseenter($event, index)"
        @mouseleave="mouseleave($event, index)"
        @click="selectMenu($event, index)"
        v-for="(item, index) in menus"
        :key="item.name"
        class="dsf-dv-circle-menu-content-item"
        :style="setTextStyle(index, item)"
      >
        <DsfIcon
          :style="{ fontSize: menuImgSize + 'px' }"
          v-if="item.valueShowPosition === 'before' && item.valueShowType === 'icon' && item.valueIconObj.defaultValue"
          :name="item.valueIconObj.defaultValue"
        />
        <img
          v-if="item.valueShowPosition === 'before' && item.valueShowType === 'img' && item.valueImgObj && item.valueImgObj.defaultValue"
          :src="handleImgSrcStr(item.valueImgObj.defaultValue)"
          :style="getImgStyle(item.valueImgObj)"
        />
        <div>{{ item.name }}</div>
        <DsfIcon
          :style="{ fontSize: menuImgSize + 'px' }"
          v-if="item.valueShowPosition === 'after' && item.valueShowType === 'icon' && item.valueIconObj.defaultValue"
          :name="item.valueIconObj.defaultValue"
        />
        <img
          v-if="item.valueShowPosition === 'after' && item.valueShowType === 'img' && item.valueImgObj && item.valueImgObj.defaultValue"
          :src="handleImgSrcStr(item.valueImgObj.defaultValue)"
          :style="getImgStyle(item.valueImgObj)"
        />
      </div>
    </div>
    <!-- 插槽 -->
    <div class="dsf-dv-circle-menu-center" :style="setSize(inRadius - borderWidth / 2)">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "circleMenuSvg",
  props: {
    eventRelativeDeal: {
      type: Object,
      require: true,
    },
    handleImgSrcStr: {
      type: Function,
      require: true,
    },
    //默认字体
    textStyle: {
      type: Object,
      require: true,
    },
    //激活字体
    activeTextStyle: {
      type: Object,
      require: true,
    },
    //默认菜单颜色
    defaultBackground: {
      type: Object,
      require: true,
    },
    //激活菜单颜色
    activeBackground: {
      type: Object,
      require: true,
    },
    borderColor: {
      type: Object,
      require: true,
    },
    // 菜单数据
    menus: {
      type: Array,
      default: () => [],
    },
    // 菜单图片大小
    menuImgSize: {
      type: Number,
      default: 30,
    },
    // 外半径
    outRadius: {
      type: Number,
      default: 200,
    },
    // 内半径
    inRadius: {
      type: [Number, String],
      default: 100,
    },

    borderWidth: {
      type: Number,
      default: 2,
    },
    // 间距角度
    interval: {
      type: Number,
      default: 20,
    },
    fontColor: {
      type: String,
      default: "#ffd480",
    },
    activeFontColor: {
      type: String,
      default: "#FFF",
    },
  },
  data() {
    let uuid = dsf.uuid();
    return {
      menuId: `menu-active-${uuid}`,
      defaultMenuId: `menu-default-${uuid}`,
      lineId: `menu-line-${uuid}`,
      defaultLineId: `menu-line-default-${uuid}`,
      // svg图形数据
      shapes: [],
      // 激活下标
      activeIndex: -1,
    };
  },
  watch: {
    outRadius() {
      this.getPointers();
    },
    inRadius() {
      this.getPointers();
    },
    menus: {
      handler() {
        this.getPointers();
      },
      deep: true,
    },
    interval() {
      this.getPointers();
    },
  },
  created() {
    this.getPointers();
  },
  computed: {
    normalLineColor() {
      const image = this.borderColor.color.image;
      const reg = /(#[0-9A-Za-z]{3,})|(rgb(?:a)?\(.+?\))/g;
      const result = image.match(reg);
      if (result && result.length) {
        return result.slice(0, 2);
      }
      return ["#666", "#222"];
    },
    defaultBgColor() {
      const image = this.defaultBackground.color.image;
      const reg = /(#[0-9A-Za-z]{3,})|(rgb(?:a)?\(.+?\))/g;
      const result = image.match(reg);
      if (result && result.length) {
        return result.slice(0, 2);
      }
      return ["#222", "#222"];
    },
    //激活背景颜色
    activeBgColor() {
      const image = this.activeBackground.color.image;
      const reg = /(#[0-9A-Za-z]{3,})|(rgb(?:a)?\(.+?\))/g;
      const result = image.match(reg);
      if (result && result.length) {
        return result.slice(0, 2);
      }
      return ["#8A5B00", "#FFD37E"];
    },
    // 旋转平均角度
    avgAngle() {
      return (360 / this.menus.length).toFixed(2) - this.interval;
    },
    // 外圈半径
    center() {
      return [this.outRadius, this.outRadius];
    },
    activeShape() {
      return this.shapes[this.activeIndex];
    },
  },
  methods: {
    mouseenter(evt, index) {
      this.$emit("mouseenter", { evt, data: this.menus[index] });
    },
    mouseleave(evt, index) {
      this.$emit("mouseleave", { evt, data: this.menus[index] });
    },
    getImgStyle(obj) {
      return {
        width: dsf.dataview.utils.transformPx(obj.imgWidth),
        height: dsf.dataview.utils.transformPx(obj.imgHeight),
        padding: dsf.dataview.utils.transformArrayPx(this.iconPadding),
        ...dsf.dataview.utils.getBgAnimation(obj.defaultValue),
      };
    },
    selectMenu(evt, index, trigger = true) {
      if (trigger) {
        this.$emit("selectMenu", { evt, data: this.menus[index] });
      }
      this.activeIndex = index;
    },
    // 根据菜单数量计算svg扇形点位信息
    getPointers(outRadius = this.outRadius, inRadius = this.inRadius) {
      const sectorCounts = this.menus.length;
      const points = [];
      const [centerX, centerY] = this.center;
      // 根据角度计算点位置
      const setPoint = function (angle) {
        const radian = (angle * Math.PI) / 180;
        let sin = Math.sin(radian);
        let cos = Math.cos(radian);
        return [
          [centerX + sin * outRadius, centerY - cos * outRadius],
          [centerX + sin * inRadius, centerY - cos * inRadius],
        ];
      };
      for (let i = 0; i < sectorCounts; i++) {
        let startPoints = [];
        let endPoints = [];
        const startAngle = this.avgAngle * i + i * this.interval;
        const endtAngle = startAngle + this.avgAngle;
        if (startAngle === 0) {
          startPoints = [
            [centerX, centerY - outRadius],
            [centerX, centerY - inRadius],
          ];
        } else {
          // 若存在间隔属性，则重新计算开始点位。
          if (this.interval) {
            startPoints = setPoint(startAngle);
          } else {
            startPoints = points[i - 1][1];
          }
        }
        // 结束点位计算
        endPoints = setPoint(endtAngle);
        points.push([startPoints, endPoints]);
      }
      this.shapes = points;
    },
    drawPath(points) {
      if (!points) return false;
      let [[startOutPoint, startInPoint], [endOutPoint, endInPoint]] = points;
      return `M ${startOutPoint[0]} ${startOutPoint[1]} A ${this.outRadius} ${this.outRadius} 0 0 1 ${endOutPoint[0]} ${endOutPoint[1]} L ${endInPoint[0]} ${endInPoint[1]} A ${this.inRadius} ${this.inRadius} 0 0 0 ${startInPoint[0]} ${startInPoint[1]} z`;
    },
    drawLinePath(points) {
      let [[startOutPoint, startInPoint], [endOutPoint, endInPoint]] = points;
      return `M ${startInPoint[0]} ${startInPoint[1]} L ${startOutPoint[0]} ${startOutPoint[1]} M ${endInPoint[0]} ${endInPoint[1]} L ${endOutPoint[0]} ${endOutPoint[1]}`;
    },
    setTextStyle(index, item) {
      const angle = ((this.avgAngle * index + this.avgAngle / 2 + this.interval * index) * Math.PI) / 180;
      const length = (this.outRadius + this.inRadius) / 2;
      let sin = Math.sin(angle);
      let cos = Math.cos(angle);
      let fontStyle = this.activeIndex === index ? dsf.dataview.utils.transformTextStyle(this.activeTextStyle) : dsf.dataview.utils.transformTextStyle(this.textStyle);
      let style = {
        left: this.center[0] + sin * length + "px",
        top: this.center[1] - cos * length + "px",
        ...fontStyle,
      };
      if (item.interactType !== "-1" || dsf.dataview.utils.isCursorPointer([this.eventRelativeDeal?.click])) {
        style["cursor"] = "pointer";
      }
      return style;
    },
    // 设置尺寸
    setSize(size) {
      return {
        width: `${size * 2}px`,
        height: `${size * 2}px`,
      };
    },
  },
};
</script>

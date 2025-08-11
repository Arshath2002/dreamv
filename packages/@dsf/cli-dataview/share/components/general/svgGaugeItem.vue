<!--
 * @Editor: zhanghang
 * @Description: 单个菜单
 * @Date: 2024-10-14 09:48:01
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-10-17 17:56:28
-->
<template>
  <div class="svg-gauge-menu-item">
    <svg v-if="isRoot" class="svg-gauge-menu-item_svg_line" :width="Math.floor(radius * 2)" :height="Math.floor(radius * 2)" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient :id="lineId">
          <stop offset="0%" :stop-color="outLineColor[0]" />
          <stop offset="50%" :stop-color="outLineColor[1]" />
          <stop offset="100%" :stop-color="outLineColor[0]" />
        </linearGradient>
      </defs>
      <path :stroke="`url(#${lineId})`" fill="transparent" :stroke-width="borderWidth" :d="drawOutCircle()"></path>
    </svg>
    <svg
      :style="svgStyle"
      class="svg-gauge-menu-item_svg"
      :class="{ 'transition-none': transitionNone }"
      :width="Math.floor(radius * 2)"
      :height="Math.floor(radius * 2)"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient :id="defaultMenuId" :cx="Math.floor(radius * 2)/2" :cy="Math.floor(radius * 2)/2" :r="Math.floor(radius)" gradientUnits="userSpaceOnUse">
          <stop :offset="`${(innerRadius * 100) / radius}%`" :stop-color="backgroundColor[0]" />
          <stop offset="100%" :stop-color="backgroundColor[1]" />
        </radialGradient>

        <radialGradient :id="activeMenuId" :cx="Math.floor(radius * 2)/2" :cy="Math.floor(radius * 2)/2" :r="Math.floor(radius)" gradientUnits="userSpaceOnUse">
          <stop :offset="`${(innerRadius * 100) / radius}%`" :stop-color="activeBackgroundColor[0]" />
          <stop offset="100%" :stop-color="activeBackgroundColor[1]" />
        </radialGradient>
      </defs>

      <path v-for="(item, index) in textPathPoints" :key="index" fill="transparent" :id="`${textPathId}_${index}`" :d="drawTextPath(item)"></path>

      <!-- 菜单扇形 -->
      <path @click="changeIndex($event, index)" v-for="(item, index) in shapes" :key="`shape_${index}`" :d="drawMenu(item)" :fill="`url(#${activeIndex === index ? activeMenuId : defaultMenuId})`" style=" cursor: pointer;"/>
      <template v-if="isRoot">
        <!-- 菜单下划线 -->
        <path
          v-for="(item, index) in shapes"
          :key="`shape_line_${index}`"
          :d="drawMenuBottomLine(item)"
          fill="transparent"
          :stroke-width="activeIndex === index ? borderWidth * 1.5 : borderWidth"
          :stroke="`${activeIndex === index ? bottomLineColor[1] : bottomLineColor[0]}`"
        />
      </template>

      <!-- 菜单名称 -->
      <text
        :style="activeIndex === index ? activeText : defaultTextStyle"
        :fill="activeIndex === index ? activeText.color : defaultTextStyle.color"
        v-for="(item, index) in showMenus"
        :key="`${textPathId}_${index}`"
      >
        <textPath startOffset="50%" :xlink:href="`#${textPathId}_${index}`">
          {{ item.name }}
        </textPath>
      </text>
    </svg>
  </div>
</template>
<script>
export default {
  name: "svgGaugeItem",
  props: {
    // 激活菜单数组
    activeMenu: {
      type: Array,
      default() {
        return [];
      },
    },
    // 菜单等级
    level: {
      type: Number,
      default: 0,
    },
    // 是否是根菜单
    isRoot: {
      type: Boolean,
      default: true,
    },
    // 根菜单边线颜色
    bottomLineColor: {
      type: Array,
      default() {
        return ["#3F5E77", "#01EAED"];
      },
    },
    // 根菜单外圈颜色
    outLineColor: {
      type: Array,
      default() {
        return ["rgba(100,148,234,0.2)", "rgba(79,174,255,1)"];
      },
    },
    backgroundColor: {
      type: Array,
      default() {
        return ["rgba(100,148,234,0.1)", "rgba(79,174,255,0.5)"];
      },
    },
    activeBackgroundColor: {
      type: Array,
      default() {
        return ["rgba(33,128,246,0.6)", "rgba(79,174,255,0.5)"];
      },
    },
    textStyle: {
      type: Object,
      default() {
        return {
          // 采用单色,渐变等
          color: "#fff",
          fontWeight: "normal", // 是否加粗
          fontStyle: "normal", // 是否斜体
          textDecoration: "none", // 是否下划线
          fontFamily: "Microsoft Yahei", // 字体
          fontSize: "16", // 字号
        };
      },
    },
    activeTextStyle: {
      type: Object,
      default() {
        return {
          // 采用单色,渐变等
          color: "#01EAED",
          fontWeight: "normal", // 是否加粗
          fontStyle: "normal", // 是否斜体
          textDecoration: "none", // 是否下划线
          fontFamily: "Microsoft Yahei", // 字体
          fontSize: "16", // 字号
        };
      },
    },
    // 边框
    borderWidth: {
      type: Number,
      default: 2,
    },
    // 半径
    radius: {
      type: Number,
      default: 260,
    },
    // 内径
    innerRadius: {
      type: Number,
      default: 200,
    },
    // 菜单角度大小
    avgAngle: {
      type: Number,
      default: 30,
    },
    // 菜单数组
    menus: {
      type: Array,
      default() {
        return [
          {
            name: "时空计算",
          },
          {
            name: "综合保障",
          },
          {
            name: "溢出效应",
          },
        ];
      },
    },
    offset: {
      type: Number,
      default: 0.5,
    },
    fontSize: {
      type: Number,
      default: 16,
    },
  },
  data() {
    const textPathId = Math.random().toString(16).substring(9);
    const defaultMenuId = Math.random().toString(16).substring(9);
    const activeMenuId = Math.random().toString(16).substring(9);
    const lineId = Math.random().toString(16).substring(9);
    return {
      activeIndex: -1,
      lineId,
      // 文本路径
      textPathId,
      // 菜单默认背景色
      defaultMenuId,
      // 菜单激活背景色
      activeMenuId,
      // 展示的菜单
      showMenus: [],
      // 菜单4个点坐标
      shapes: [],
      // 文本路径
      textPathPoints: [],
      // 旋转角
      triangle: 0,

      transitionNone: false,
    };
  },
  watch: {
    activeMenu: {
      handler(v, o) {
        if (!_.isEqual(v, o)) {
          this.activeIndex = -1;
          this.$nextTick(this.init);
        }
      },
    },
    menus: {
      handler() {
        // 菜单改变
        this.activeIndex = -1;
        this.$nextTick(this.init);
      },
      deep: true,
    },
    radius() {
      this.$nextTick(this.calculateShapes);
    },
    innerRadius() {
      this.$nextTick(this.calculateShapes);
    },
    avgAngle() {
      this.$nextTick(this.init);
    },
  },
  created() {
    this.init();
  },
  computed: {
    svgStyle() {
      return {
        transform: `rotate(${this.triangle}deg)`,
      };
    },
    count() {
      const avgAngle = this.avgAngle;
      const count = Math.floor(360 / avgAngle);
      return count;
    },
    defaultTextStyle() {
      const style = dsf.dataview.utils.transformTextStyle(this.textStyle);
      style["dominant-baseline"] = "middle";
      style["text-anchor"] = "middle";
      return style;
    },
    activeText() {
      const style = dsf.dataview.utils.transformTextStyle(this.activeTextStyle);
      style["dominant-baseline"] = "middle";
      style["text-anchor"] = "middle";
      return style;
    },
  },
  methods: {
    init() {
      this.calculateMenus();
      this.calculateShapes();

      const { activeMenu, level, menus } = this;

      const current = activeMenu[level];

      if (current) {
        this.activeIndex = menus.findIndex((it) => it.id === current.id);
      }
      // 计算开始旋转角
      const activeIndex = this.activeIndex === -1 ? 0 : this.activeIndex;
      const startTriangle = -this.avgAngle * this.offset;
      this.triangle = startTriangle - activeIndex * this.avgAngle;
    },
    calculateMenus() {
      const menus = this.menus;
      const count = this.count;

      let showMenus = [];
      // 菜单不足补充
      if (menus.length < count) {
        for (let i = 0; i < count; i++) {
          showMenus.push(menus[i % menus.length]);
        }
      } else {
        showMenus = menus.slice(0, count);
      }
      this.showMenus = showMenus;
    },
    calculateShapes() {
      const avgAngle = this.avgAngle;
      const count = this.count;
      const shapes = [];
      const centerX = this.radius;
      const centerY = this.radius;
      const radius = this.radius - this.borderWidth;
      const innerRadius = this.innerRadius;
      // 根据角度计算点位置
      const setPoint = function (angle) {
        const radian = (angle * Math.PI) / 180;
        const sin = Math.sin(radian);
        const cos = Math.cos(radian);
        return [
          [centerX + sin * radius, centerY - cos * radius],
          [centerX + sin * innerRadius, centerY - cos * innerRadius],
        ];
      };
      // 处理菜单文字路径
      const textR = Math.round((radius + innerRadius) / 2) - 8;
      const textPathPoints = [];
      let sp = null;
      for (let i = 0; i < count; i++) {
        let startPoints = [];
        let endPoints = [];
        const startAngle = avgAngle * i;

        const endAngle = startAngle + avgAngle;

        if (startAngle === 0) {
          startPoints = [
            [centerX, centerY - radius],
            [centerX, centerY - innerRadius],
          ];
          sp = [centerX, centerY - textR];
        } else {
          startPoints = shapes[i - 1][1];
        }
        // 结束点位计算
        endPoints = setPoint(endAngle);
        shapes.push([startPoints, endPoints]);

        const x = centerX + textR * Math.sin((endAngle * Math.PI) / 180);
        const y = centerY - textR * Math.cos((endAngle * Math.PI) / 180);
        const ep = [x, y];
        textPathPoints.push([sp, ep]);
        sp = ep;
      }
      this.shapes = shapes;
      this.textPathPoints = textPathPoints;
    },
    // 绘制菜单
    drawMenu(item) {
      if (!item) return false;
      const radius = this.radius - this.borderWidth;
      const innerRadius = this.innerRadius;
      const [[startOutPoint, startInPoint], [endOutPoint, endInPoint]] = item;
      return `M ${startOutPoint[0]} ${startOutPoint[1]} A ${radius} ${radius} 0 0 1 ${endOutPoint[0]} ${endOutPoint[1]} L ${endInPoint[0]} ${endInPoint[1]} A ${innerRadius} ${innerRadius} 0 0 0 ${startInPoint[0]} ${startInPoint[1]} z`;
    },
    // 绘制菜单名称路径
    drawTextPath(item) {
      if (!item) return false;
      const radius = this.radius - this.borderWidth;
      const innerRadius = this.innerRadius;
      // 处理菜单文字路径
      const textR = Math.round((radius + innerRadius) / 2);
      return `M ${item[0][0]} ${item[0][1]} A ${textR} ${textR},  0, 0, 1, ${item[1][0]} ${item[1][1]}`;
    },
    // 绘制菜单下划线
    drawMenuBottomLine(item) {
      if (!item) return false;
      const innerRadius = this.innerRadius;
      const [[startOutPoint, startInPoint], [endOutPoint, endInPoint]] = item;
      return `M ${endInPoint[0]} ${endInPoint[1]} A ${innerRadius} ${innerRadius} 0 0 0 ${startInPoint[0]} ${startInPoint[1]}`;
    },
    // 绘制渐变外圈
    drawOutCircle() {
      const interval = this.borderWidth;
      const radius = Math.floor(this.radius) - interval;
      return `M ${interval} ${radius + interval} A ${radius} ${radius}, 0 0 1 ${radius * 2 + interval * 2} ${radius + interval} `;
    },
    // 点击切换事件
    changeIndex(evt, index) {
      const activeMenu = this.activeMenu;
      const item = this.showMenus[index];

      let isChange = true;
      if (activeMenu[this.level] && activeMenu[this.level].id == item.id) {
        isChange = false;
      }

      this.$set(activeMenu, this.level, item);
      if (isChange) {
        this.$emit("updateActive", {
          menus: activeMenu.slice(0, this.level + 1),
          evt,
        });
      }

      this.transitionNone = false;
      const avgAngle = this.avgAngle;
      const activeIndex = this.activeIndex === -1 ? 0 : this.activeIndex;
      const startTriangle = -avgAngle * this.offset;

      const distance = index - activeIndex;

      const count = this.count;
      const boundary = Math.floor(count / 4);

      if (Math.abs(distance) > boundary) {
        const t = index > activeIndex ? index - count - activeIndex : count - activeIndex + index + count - 1;

        const triangle = startTriangle - t * avgAngle;

        this.triangle = triangle;
        this.activeIndex = index;

        setTimeout(() => {
          this.transitionNone = true;
          const _triangle = startTriangle - index * avgAngle;
          this.triangle = _triangle;
        }, 200);
      } else {
        this.activeIndex = index;
        const triangle = startTriangle - index * avgAngle;
        this.triangle = triangle;
      }
    },
  },
};
</script>

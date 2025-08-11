<!--
 * @Description: 色阶显示图
 * @Author: shenah
 * @Date: 2023-10-23 14:44:01
 * @LastEditors: shenah
 * @LastEditTime: 2023-10-25 14:37:30
-->

<template>
  <div class="dsf-es-dv-color-level" v-if="show" :style="getColorLevelStyle">
    <div v-if="title" class="title" :style="getTitleStyle">{{ title }}</div>
    <div class="color-level-items" :style="getColorLevelItemsStyle">
      <!-- 色阶组 -->
      <template v-if="colorType === 'colorGroup'">
        <div
          class="color-group"
          v-for="(arr, index) in colorRules"
          :key="index"
        >
          <div class="show-color" :style="getShowColorStyle(arr[1])"></div>
          <div class="name" :style="getNameStyle">{{ arr[2] }}</div>
        </div>
      </template>
      <template v-else-if="colorType === 'gradient'">
        <!-- 渐变组 -->
        <div class="gradient-wrap">
          <div class="gradient" :style="getGradientStyle"></div>
          <div class="high">高</div>
          <div class="el-icon-caret-left low">低</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "ColorLevel",
  components: {},
  data() {
    return {};
  },
  props: {
    titleColor: {
      type: String,
      default: "blue",
    },
    title: {
      type: String,
      default: "",
    },
    textColor: {
      type: String,
      default: "black",
    },
    top: {
      type: String,
      default: "auto",
    },
    left: {
      type: String,
      default: "auto",
    },
    right: {
      type: String,
      default: "auto",
    },
    bottom: {
      type: String,
      default: "auto",
    },
    //horizontal、vertical
    direction: {
      type: String,
      default: "vertical",
    },
    show: {
      type: Boolean,
      default: true,
    },
    colorRules: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    getColorLevelStyle() {
      let style = {
        top: this.top,
        left: this.left,
        right: this.right,
        bottom: this.bottom,
      };
      let x = 0;
      let y = 0;
      if (this.top === "center") {
        style.top = "50%";
        y = "-50%";
      }
      if (this.left === "center") {
        style.left = "50%";
        x = "-50%";
      }
      style.transform = `translate(${x}, ${y})`;
      return style;
    },
    getColorLevelItemsStyle() {
      let style = {
        display: "flex",
      };
      if (this.direction === "horizontal") {
        style.flexDirection = "row";
        style.alignItems = "center";
        style.justifyContent = "flex-start";
      } else {
        style.flexDirection = "column";
        style.alignItems = "flex-start";
        style.justifyContent = "center";
      }
      return style;
    },
    getTitleStyle() {
      return {
        color: this.titleColor,
      };
    },
    getNameStyle() {
      return {
        color: this.textColor,
      };
    },
    getGradientStyle() {
      if (this.colorRules && this.colorRules.length) {
        const gradientValue = this.colorRules
          .map(
            (item, index) =>
              `${item} ${(index / this.colorRules.length) * 100}%`
          )
          .join();
        ``;
        return {
          "background-color": this.colorRules[0],
          "background-image": `linear-gradient(to top, ${gradientValue})`,
        };
      } else {
        return {};
      }
    },
    colorType() {
      if (this.colorRules.length) {
        let obj = this.colorRules[0];
        if (typeof obj === "string") {
          return "gradient";
        } else if (Array.isArray(obj)) {
          return "colorGroup";
        }
      }
      return "";
    },
  },
  mounted() {},
  methods: {
    getShowColorStyle(color) {
      let style = {};
      style.backgroundColor = color;
      return style;
    },
  },
};
</script>

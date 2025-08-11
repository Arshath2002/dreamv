<!--
 * @Description: 单多选风格
 * @Author: shenah
 * @Date: 2024-03-13 17:29:31
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-14 14:32:34
-->
<template>
  <div class="dsf-single-more-select">
    <div class="single-more-select-item" v-for="item in list" :key="item[valueField]" :style="singleMoreSelectItemStyle" :class="singleMoreSelectItemClass(item)" @click="itemClick(item)">
      <div class="text-wrap">
        <div v-if="item.color && item.color.length" class="color-wrap">
          <div class="top-half-circle" :style="circleStyle('top', item)"></div>
          <div class="bottom-half-circle" :style="circleStyle('bottom', item)"></div>
        </div>
        <DsfIcon v-if="item.icon" class="text-icon" :name="item.icon"></DsfIcon>
        <div class="text">{{ item[labelField] }}</div>
      </div>
      <DsfIcon class="gouxuan"></DsfIcon>
    </div>
  </div>
</template>

<script>
export default {
  name: "singleMoreSelect",
  components: {},
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    itemWidth: {
      type: [Number, String],
    },
    value: {
      type: [String, Number, Array],
    },
    valueField: {
      type: String,
      default: "value",
    },
    labelField: {
      type: String,
      default: "label",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    // 只对单选有效
    isCancel: {
      type: Boolean,
      default: false,
    },
    // 只对多选有效
    leastNumber: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    singleMoreSelectItemStyle() {
      let style = {};
      let width = parseInt(this.itemWidth);
      if (width) {
        style.width = `${width}px`;
      }
      return style;
    },
    currentData: {
      get() {
        let flag = Array.isArray(this.value);
        let nowVal = this.value;
        // 初始化
        if (this.multiple) {
          if (nowVal === "" || nowVal === null || nowVal === undefined) {
            nowVal = [];
          } else if (!flag) {
            nowVal = [this.value];
          }
          return nowVal;
        } else {
          if (flag) {
            nowVal = "";
          }
          return nowVal;
        }
      },
      set(v) {
        this.changeValue(v);
      },
    },
  },
  methods: {
    singleMoreSelectItemClass(item) {
      let nowVal = item[this.valueField];
      let flag = false;
      if (this.multiple) {
        let index = this.currentData.findIndex((one) => one === nowVal);
        flag = index > -1;
      } else {
        flag = this.currentData === nowVal;
      }
      return flag ? "active" : "";
    },
    itemClick(item) {
      let nowVal = item[this.valueField];
      let leastNumber = this.leastNumber;
      if (this.multiple) {
        // 多选
        let index = this.currentData.findIndex((val) => val === nowVal);
        if (index === -1) {
          this.currentData.push(nowVal);
          this.changeValue(this.currentData);
        } else {
          if (this.currentData.length > leastNumber) {
            this.currentData.splice(index, 1);
            this.changeValue(this.currentData);
          }
        }
      } else {
        // 单选
        let isCancel = this.isCancel;
        let flag = this.currentData === nowVal; // 是否选中
        if (flag) {
          // 证明是有的
          if (isCancel) {
            this.currentData = "";
          }
        } else {
          this.currentData = nowVal;
        }
      }
    },
    circleStyle(type, item) {
      let style = {};
      let colorArr = item.color;
      if (colorArr.length) {
        let oneBg = colorArr[0];
        let twoBg = colorArr[1] ? colorArr[1] : oneBg;
        let bg = type === "bottom" ? twoBg : oneBg;
        style.backgroundColor = bg;
      }
      return style;
    },
    changeValue(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/common/singleMoreSelect.scss";
</style>
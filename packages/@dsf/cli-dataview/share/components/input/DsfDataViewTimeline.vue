<!--
 * @Description: 时间线
 * @Author: shenah
 * @Date: 2023-05-05 17:41:31
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-09 18:53:47
-->

<template>
  <div
    class="dsf-input-timeline ds-control data-view-common-bg-effect"
    :style="controlOuterStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <DsfEmptyData v-if="!hasData" />
    <div class="time-line" v-show="hasData" :style="{ pointerEvents: this.isDesign ? 'none' : 'default' }">
      <!-- 横线 -->
      <div class="h-line" :style="getHLine">
        <!-- 播放与暂停按钮 -->
        <div class="play-pause-wrap" v-show="config.isAuto && isOverOne">
          <i class="play-pause-icon el-icon-video-pause" v-if="isPlay" :style="getIconStyle" @click="pause()"></i>
          <i class="play-pause-icon el-icon-video-play" :style="getIconStyle" @click="paly()" v-else></i>
        </div>
        <!-- 竖向的线 -->
        <div class="v-line-wrap">
          <div class="v-line-outer" @click.stop="setPosition(index)" :style="getVLineOuterStyle(index)" v-for="(item, index) in data" :key="index">
            <div :ref="`slider${index}`" class="v-line" :style="getVLineStyle(index)"></div>
          </div>
        </div>
        <!-- 描述 -->
        <div class="des-wrap" v-show="isShowText">
          <div class="des" v-for="(item, index) in data" :key="index" :style="getVLineDesStyle(index)" @click.stop="setPosition(index)">
            {{ getFormat(item) }}
          </div>
        </div>
        <!-- 滑块 -->
        <div class="slider-wrap" ref="sliderWrap" v-show="isOverOne">
          <div class="slider" :style="getSliderStyle" ref="slider"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 支持数组里面是字符串以及数组里面的第一个是对象{startVal,endVal}
const staticExcelDataKeyDic = {
  year: "年份",
};
const staticExcelData = new Array(7).fill(2012).map((item, index) => ({
  year: item + index + "",
}));
const staticData = ["2012", "2013", "2014", "2015", "2016", "2017", "2018"];
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
export default dsf.component({
  name: "DsfDataViewTimeline",
  ctrlCaption: "时间线",
  mixins: [$mixins.dataView, dataAnalysis],
  props: {
    staticData: {
      type: Array,
      default: () => staticData,
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticExcelData, staticExcelDataKeyDic);
      },
    },
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
           //组件初始化事件
          mounted: {
            relatives: [],
            fn: eventTemp,
          },
          //数据加载完成事件
          dataLoad: {
            relatives: [],
            fn: eventTemp,
          },
          //数据处理完成事件
          load: {
            relatives: [],
            fn: eventTemp,
          },
          change: {
            relatives: [],
            fn: eventTemp,
          },
          click: {
            relatives: [],
            fn: eventTemp,
            hidden: true,
          },
        };
      },
    },
    height: {
      type: String,
      default: "auto",
    },
    padding: {
      type: Array,
      default: () => [40, 40, 60, 40],
    },
    margin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    colorProgress: {
      type: String,
      default: "#00ffff",
    },
    textStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          fontSize: 16,
        });
      },
    },
    textRotate: {
      type: Number,
      default: 0,
    },
    textMargin: {
      type: Array,
      default: () => [10, 0, 0, 0],
    },
    isShowText: {
      type: Boolean,
      default: true,
    },
    showTextStr: {
      typeof: String,
      default: "",
    },
    config: {
      type: Object,
      default: () => ({
        isAuto: true,
        step: 1,
        isLoop: false,
        autoTime: 2000,
        separator: "/",
      }),
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "值",
            value: "year",
            map: "year",
          },
        ];
      },
    },
    // 整体背景
    controlBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
  },
  computed: {
    isOverOne() {
      return this.data.length > 1;
    },
    eachNum() {
      return Math.round(100 / (this.data.length - 1), 1);
    },
    getSliderStyle() {
      return {
        left: this.sliderPosition + "%",
      };
    },
    controlStyle() {
      const style = {
        padding: dsf.dataview.utils.transformArrayPx(this.padding),
        margin: dsf.dataview.utils.transformArrayPx(this.margin),
      };
      if (!this.isDesign) {
        style.height = dsf.dataview.utils.transformPx(this.height);
      }
      return style;
    },
    includeEvents() {
      return ["刷新", "设置值", "获取当前值"];
    },
    getIconStyle() {
      return {
        color: this.colorProgress,
      };
    },
    getHLine() {
      return {
        "background-color": this.colorProgress,
      };
    },
  },
  watch: {
    currentIndex: {
      handler(val) {
        this.$dispatch("change", this.data[val]);
        this.loadChangeEvents(this.data[val]);
      },
    },
    config: {
      handler() {
        if (this.isDesign) {
          this.resetStatus();
          this.init();
        }
      },
      deep: true,
    },
    staticData: {
      handler() {
        if (this.isDesign) {
          this.resetStatus();
          this.init();
        }
      },
    },
  },
  data() {
    return {
      timeType: "",
      originData: [],
      data: [],
      isPlay: false,
      currentIndex: 0, // 当前滑块对应的下标
      sliderPosition: 0, // 滑块的left的百分比
      timer: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const slider = this.$refs.slider;
      slider.addEventListener("mousedown", this.handleMouseDown);
    });
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  },
  beforeDestroy() {
    // 计时器等
    clearInterval(this.timer);
    this.timer = null;
    this.$refs.slider.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.textStyle],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.updateComponentStyle("textStyle", textStyles[0]);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    getFormat(str) {
      let newStr = str;
      let arr = this.showTextStr
        .trim()
        .split(",")
        .map((str) => this.removeSymbols(str));
      if (this.timeType !== "year") {
        newStr = str.replaceAll("/", this.config.separator);
      }
      if (this.showTextStr === "") {
        return newStr;
      }
      if (arr.length) {
        let diffStr = this.removeSymbols(newStr);
        if (arr.indexOf(diffStr) > -1) {
          return newStr;
        }
        return "";
      }
    },
    dataAnalysis(data) {
      this.resetStatus();
      if (!data.length) {
        this.hasData = false;
        return;
      }
      let arr = [];
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        let valKey = this.mapRelations[0].map;
        arr = data.map((item) => item[valKey]);
      } else {
        arr = this.handleData(data);
      }
      // 解析年月日
      arr = this.handleStep(arr);
      this.data = arr;
    },
    removeSymbols(str) {
      let pattern = /[^\u4e00-\u9fa5a-zA-Z0-9]/g;
      return str.replace(pattern, "");
    },
    // 解析年月
    judgeDate(str) {
      let result = this.removeSymbols(str);
      let month = result.slice(4, 6);
      if (month) {
        this.timeType = "month";
      } else {
        this.timeType = "year";
      }
    },
    handleStep(data) {
      let arr = [];
      let step = this.config.step;
      for (let i = 0; i < data.length; i++) {
        let one = data[i * step];
        if (!one) {
          break;
        }
        arr.push(one);
      }
      return arr;
    },
    getDomAttr() {
      let arr = [];
      for (let i = 0; i < this.data.length; i++) {
        let sliderDom = this.$refs[`slider${i}`][0];
        let rect = sliderDom.getBoundingClientRect();
        arr.push(rect.left);
      }
      return arr;
    },
    handleData(data) {
      let arr = data;
      let obj = data[0];
      if (obj && typeof obj === "object") {
        this.judgeDate(obj.startVal);
        let startVal = obj.startVal;
        let endVal = obj.endVal;
        if (this.timeType === "year") {
          let newStartVal = (startVal + "").slice(0, 4);
          let newEndVal = (endVal + "").slice(0, 4);
          arr = [];
          let diff = newEndVal - newStartVal + 1;
          if (diff >= 0) {
            for (let i = 0; i < diff; i++) {
              let one = newStartVal * 1 + i + "";
              arr.push(one);
            }
          }
        } else if (this.timeType === "month") {
          arr = this.getMonthArr(startVal, endVal);
        }
      } else {
        this.judgeDate(obj);
        if (this.timeType === "month") {
          arr = arr.map((str) => `${str.slice(0, 4)}/${str.slice(str.length - 2, str.length)}`);
        }
      }
      return arr;
    },
    getVLineDesStyle(index) {
      let left = this.calcLeft(index) + "%";
      const style = dsf.dataview.utils.transformTextStyle(this.textStyle);
      return {
        transform: `translateX(-50%) rotate(${this.textRotate}deg)`,
        margin: dsf.dataview.utils.transformArrayPx(this.textMargin),
        left,
        ...style,
      };
    },
    getVLineOuterStyle(index) {
      let left = this.calcLeft(index) + "%";
      return {
        left,
      };
    },
    getVLineStyle() {
      return {
        "background-color": this.colorProgress,
      };
    },
    calcLeft(index) {
      let left = this.eachNum * index;
      if (this.data.length - 1 === index && this.data.length !== 1) {
        left = 100;
      }
      return left;
    },
    handleMouseDown(event) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.newStartLocation = this.currentIndex;
    },
    handleMouseMove(event) {
      if (!this.isDragging) {
        return;
      }
      if (this.isPlay) {
        clearInterval(this.timer);
        this.timer = null;
      }
      const deltaX = event.clientX - this.startX;
      let newLocation = 0;
      let domAttr = this.getDomAttr();
      let firstDomAttr = domAttr[0];
      let lastDomAttr = domAttr[domAttr.length - 1];
      let arr = this.findRange(domAttr, event.clientX);
      if (deltaX > 0) {
        // 向右
        if (arr) {
          newLocation = arr[1];
        } else {
          if (event.clientX <= firstDomAttr) {
            newLocation = 0;
          } else {
            newLocation = this.data.length - 1;
          }
        }
      } else if (deltaX < 0) {
        if (arr) {
          newLocation = arr[0];
        } else {
          if (event.clientX >= lastDomAttr) {
            newLocation = this.data.length - 1;
          } else {
            newLocation = 0;
          }
        }
      } else {
        newLocation = this.newStartLocation;
      }
      this.currentIndex = newLocation;
      this.updateSliderPosition();
      this.startX = event.clientX;
      this.newStartLocation = this.currentIndex;
    },
    //查找范围
    findRange(arr, target) {
      let left = 0;
      let right = arr.length - 1;
      // 使用二分查找算法查找目标数在数组中的位置
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
          return [mid, mid];
        } else if (arr[mid] < target) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      // 如果目标数小于数组中的最小值，或者大于数组中的最大值，则返回一个消息表示目标数不在数组中
      if (target < arr[0]) {
        return false;
      } else if (target > arr[arr.length - 1]) {
        return false;
      }
      // 如果目标数不在数组中，则返回目标数在哪两个位置之间
      if (left === 0) {
        return [left, right];
      } else if (right === arr.length - 1) {
        return [left - 1, right];
      } else {
        return [left - 1, left];
      }
    },
    handleMouseUp() {
      this.isDragging = false;
      if (this.isPlay) {
        this.paly();
      }
    },
    setPosition(index) {
      this.currentIndex = index;
      this.updateSliderPosition();
    },
    updateSliderPosition() {
      let left = this.calcLeft(this.currentIndex);
      this.sliderPosition = left;
    },
    calcIndex() {
      let index = ++this.currentIndex;
      if (index > this.data.length - 1) {
        if (this.config.isLoop) {
          index = 0;
        } else {
          index = -1;
        }
      }
      return index;
    },
    paly() {
      this.isPlay = true;
      if (!this.timer) {
        this.timer = setInterval(() => {
          let index = this.calcIndex();
          if (this.config.isLoop) {
            this.currentIndex = index;
          } else {
            if (index > -1) {
              this.currentIndex = index;
            } else {
              clearInterval(this.timer);
              this.timer = null;
              this.isPlay = false;
              this.currentIndex = 0;
            }
          }
          this.updateSliderPosition();
        }, this.config.autoTime);
      }
    },
    getMonthArr(start, end) {
      let arr = [];
      if (typeof start === "string" && typeof end === "string") {
        let startLength = start.length;
        let endLength = end.length;
        let startVal = `${start.slice(0, 4)}/${start.slice(startLength - 2, startLength)}`;
        let endVal = `${end.slice(0, 4)}/${end.slice(endLength - 2, endLength)}`;
        arr = this.monthRange(startVal, endVal);
      }
      return arr;
    },
    monthRange(startVal, endVal) {
      // 创建一个空数组来储存月份
      let months = [];
      // 确定开始和结束年月
      let startDate = new Date(startVal);
      let endDate = new Date(endVal);
      // 循环遍历日期计算月份并存储到数组中
      let currentDate = startDate;
      while (currentDate <= endDate) {
        let formattedMonth = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1 < 10 ? "0" : ""}${currentDate.getMonth() + 1}`;
        // 将格式化的月份添加到数组中
        months.push(formattedMonth);
        // 增加时间到下个月
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      return months;
    },
    pause() {
      clearInterval(this.timer);
      this.timer = null;
      this.isPlay = false;
    },
    resetStatus() {
      clearInterval(this.timer);
      this.timer = null;
      this.currentIndex = 0;
      this.sliderPosition = 0;
      this.isPlay = false;
    },
    // 重写事件依赖的方法
    refreshDataEvent() {
      this.resetStatus();
      this.init();
      return this;
    },
    setDataEvent(data) {
      if (typeof data === "number") {
        if (data >= 0 && data <= this.data.length) {
          this.currentIndex = data;
          this.updateSliderPosition();
        }
      } else if (typeof data === "string") {
        let newList = this.data.map((item) => this.getFormat(item));
        let index = newList.findIndex((str) => str === data);
        if (index > -1) {
          this.currentIndex = index;
          this.updateSliderPosition();
        }
      }
      return this;
    },
    // 获取当前的值
    handleGetValue() {
      return this.data[this.currentIndex];
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/timeline.scss";
</style>


<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-11-23 14:43:12
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-08 09:45:45
-->
<template>
  <div
    class="data-view-item-wrap dsf-dv-carousel-panel ds-control data-view-no-padding"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <div
      class="dsf-dv-carousel-panel-wrap"
      :class="direction"
    >
      <div
        v-if="isCarousel && changeBtnShow"
        class="carousel-arrow"
      >
        <div
          @click="next"
          :style="getLeftArrowStyle"
        >
          <DsfIcon
            :style="{ color: fontColor, 'font-size': transFontSize }"
            :name="leftArrowIcon"
          />
        </div>
      </div>
      <div
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend"
        ref="swiper"
        class="carousel-wrapper"
        :style="calculateHeight"
      >
        <div
          class="carousel-indicates"
          v-if="indicate"
        >
          <template v-if="changeType == 'single'">
            <div
              class="indicate-dot"
              @click="indicateChange(it - 1)"
              :class="{ active: activeIndex === -(it - 1) || activeIndex === slots.length - it + 1 }"
              :key="it"
              v-for="it in getSingleIndicateDots"
              :style="indicateDotStyle"
            ></div>
          </template>
          <template v-if="changeType == 'screen'">
            <div
              class="indicate-dot"
              :style="indicateDotStyle"
              @click="indicateChange(it - 1)"
              :class="{ active: -activeIndex / sliderCount === it - 1 }"
              :key="it"
              v-for="it in Math.ceil(slots.length / this.sliderCount)"
            ></div>
          </template>
        </div>
        <div
          class="swiper-container"
          @mouseleave="startInterval"
          @mouseover="stopInterval"
        >
          <div
            class="swiper-container__wrapper"
            ref="wrapper"
            :style="wrapperStyle"
          >
            <!-- 轮播补位 -->
            <template v-if="!isDesign && loop && changeType != 'screen'">
              <div
                class="pre-slider swiper-slider"
                :style="offsetStyle(replenishNum + sliderCount - index)"
                :key="`before_${item.name}`"
                v-for="(item, index) in slots.slice(-(replenishNum + sliderCount))"
              >
                <div
                  class="swiper-container__wrapper_item"
                  :slot-name="item.name"
                >
                  <slot :name="item.name">
                    <div class="empty-slot">
                      {{ isDesign ? item.name : "" }}
                    </div>
                  </slot>
                </div>
              </div>
            </template>
            <!-- 一屏轮播补位 -->
            <template v-if="!isDesign && loop && changeType == 'screen'">
              <div
                class="pre-slider swiper-slider"
                :style="offsetStyle(sliderCount - index)"
                :key="`before_${item.name}`"
                v-for="(item, index) in replenishNum === 0 ? slots.slice(-sliderCount) : slots.slice(-replenishNum)"
              >
                <div
                  class="swiper-container__wrapper_item"
                  :slot-name="item.name"
                >
                  <slot :name="item.name">
                    <div class="empty-slot">
                      {{ isDesign ? item.name : "" }}
                    </div>
                  </slot>
                </div>
              </div>
              <div
                class="pre-slider swiper-slider"
                :style="offsetStyle(1 + (sliderCount - replenishNum) - item)"
                :key="`before_${item}`"
                v-for="item in replenishNum"
              ></div>
            </template>

            <div
              :style="sliderStyle"
              v-for="item in slots"
              class="swiper-slider"
              :key="item.name"
            >
              <div
                class="swiper-container__wrapper_item"
                :slot-name="item.name"
              >
                <slot :name="item.name">
                  <div class="empty-slot">
                    {{ isDesign ? item.name : "" }}
                  </div>
                </slot>
              </div>
            </div>
            <!-- 轮播补位 -->
            <template v-if="!isDesign && loop && changeType != 'screen'">
              <div
                :style="sliderStyle"
                :key="`after_${item.name}`"
                v-for="item in slots.slice(0, replenishNum + sliderCount)"
                class="swiper-slider"
              >
                <div
                  class="swiper-container__wrapper_item"
                  :slot-name="item.name"
                >
                  <slot :name="item.name">
                    <div class="empty-slot">
                      {{ isDesign ? item.name : "" }}
                    </div>
                  </slot>
                </div>
              </div>
            </template>
            <!-- 一屏轮播补位 -->
            <template v-if="!isDesign && loop && changeType == 'screen'">
              <!-- 刚好满足，不需要补空 -->
              <template v-if="replenishNum">
                <div
                  :style="sliderStyle"
                  :key="`after_${item}`"
                  v-for="item in sliderCount - replenishNum"
                  class="swiper-slider"
                ></div>
              </template>
              <div
                :style="sliderStyle"
                :key="`after_${item.name}`"
                v-for="item in slots.slice(0, sliderCount)"
                class="swiper-slider"
              >
                <div
                  class="swiper-container__wrapper_item"
                  :slot-name="item.name"
                >
                  <slot :name="item.name">
                    <div class="empty-slot">
                      {{ isDesign ? item.name : "" }}
                    </div>
                  </slot>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div
        v-if="isCarousel && changeBtnShow"
        class="carousel-arrow"
      >
        <div
          @click="prev"
          :style="getRightArrowStyle"
        >
          <DsfIcon
            :style="{ color: fontColor, 'font-size': transFontSize }"
            :name="rightArrowIcon"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import defaultBackgroundConfig from "_dataview/share/components/common/backgroundDefault.js";
export default dsf.component({
  name: "DsfDataViewCarouselPanel",
  ctrlCaption: "轮播容器",
  mixins: [$mixins.dataView],
  props: {
    customIndicate: {
      type: Object,
      default: () => ({
        flag: false,
        selectColor: "rgba(153, 169, 191,1)",
        notSelectColor: "rgba(153, 169, 191,0.3)",
        size: "12",
      })
    },
    sliderCount: {
      type: Number,
      default: 1,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 300,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    direction: {
      type: String,
      default: "horizontal",
    },
    changeType: {
      type: String,
      default: "single",
    },

    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    changeBtnShow: {
      type: Boolean,
      default: true,
    },
    fontColor: {
      type: String,
      default: "rgb(96, 98, 102)",
    },
    carouselItemPadding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    autoplay: {
      type: Boolean,
      default: false,
    },

    arrowWidth: {
      type: [String, Number],
      default: "20",
    },

    arrowHeight: {
      type: [String, Number],
      default: "50",
    },
    iconMargin: {
      type: Array,
      default: () => [0, 5, 0, 5],
    },
    leftRadius: {
      type: Array,
      default: () => [5, 0, 0, 5],
    },
    rightRadius: {
      type: Array,
      default: () => [0, 5, 5, 0],
    },
    leftArrowIcon: {
      type: String,
      default: "shuangjiantouzuo",
    },
    rightArrowIcon: {
      type: String,
      default: "shuangjiantouyou",
    },
    leftArrowIconBackground: {
      type: Object,
      default() {
        return dsf.mix(true, {}, defaultBackgroundConfig);
      },
    },
    rightArrowIconBackground: {
      type: Object,
      default() {
        return dsf.mix(true, {}, defaultBackgroundConfig);
      },
    },
    indicate: {
      type: Boolean,
      default: true,
    },
    slots: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      wrapperWidth: 0,
      wrapperHeight: 0,

      componentType: "carousel",
      activeIndex: 0,

      //滑动开始坐标
      startDistanceX: "",
      startDistanceY: "",
      //滑动结束坐标
      endDistanceX: "",
      endDistanceY: "",
    };
  },
  watch: {
    direction() {
      this.$nextTick(this.resize);
    },
    sliderCount() {
      this.activeIndex = 0;
      this.$nextTick(this.resize);
    },
    changeBtnShow() {
      this.$nextTick(this.resize);
    },
    slots() {
      this.activeIndex = 0;
      this.$nextTick(this.resize);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.wrapperWidth = this.$refs.wrapper.clientWidth;
      this.wrapperHeight = this.$refs.wrapper.clientHeight;
    });
    if (this.autoplay && !this.isDesign) {
      this.timer = setInterval(() => {
        this.prev();
      }, this.interval);
    }
  },
  beforeDestroy() {
    this.stopInterval();
  },
  computed: {
    indicateDotStyle() {
      let style = {};
      if (this.indicate && this.customIndicate.flag) {
        style = {
          width: dsf.dataview.utils.transformPx(this.customIndicate.size),
          height: dsf.dataview.utils.transformPx(this.customIndicate.size),
          "--custom-indicate-not-select-color": this.customIndicate.notSelectColor,
          "--custom-indicate-select-color": this.customIndicate.selectColor
        }
      }
      return style
    },
    getSingleIndicateDots() {
      let len = this.slots.length;
      let loop = this.loop;
      let sliderCount = this.sliderCount;
      return loop ? len : len - sliderCount + 1;
    },
    isCarousel() {
      return this.slots.length > this.sliderCount;
    },
    // 纵向需要计算高度
    calculateHeight() {
      if (this.direction === "horizontal") {
        return {
          height: "100%",
        };
      } else {
        const gap = this.arrowHeight * 2 + this.iconMargin[0] * 1 + this.iconMargin[2] * 1;
        return {
          height: this.isCarousel && this.changeBtnShow ? `calc(100% - ${gap}px)` : "100%",
        };
      }
    },
    //余数
    replenishNum() {
      return this.slots.length % this.sliderCount;
    },
    wrapperStyle() {
      const activeIndex = this.activeIndex;
      const size = (this.direction === "horizontal" ? this.wrapperWidth : this.wrapperHeight) * (1 / this.sliderCount);
      const duration = (this.duration / 1000).toFixed(1);
      const translate = size * activeIndex;
      const style = {
        transition: `transform ${duration}s`,
      };
      if (this.direction === "horizontal") {
        style.transform = `translateX(${translate}px)`;
      } else {
        style.transform = `translateY(${translate}px)`;
      }
      return style;
    },
    sliderStyle() {
      const size = (1 / this.sliderCount) * 100;
      const padding = dsf.dataview.utils.transformArrayPx(this.carouselItemPadding);
      if (this.direction === "horizontal") {
        return {
          width: size.toFixed(2) + "%",
          padding,
        };
      } else {
        return {
          height: size.toFixed(2) + "%",
          padding,
        };
      }
    },

    getArrowStyle() {
      let { arrowWidth, arrowHeight, iconMargin } = this;
      arrowWidth = dsf.dataview.utils.transformPx(arrowWidth);
      arrowHeight = dsf.dataview.utils.transformPx(arrowHeight);
      iconMargin = dsf.dataview.utils.transformArrayPx(iconMargin);
      return {
        width: arrowWidth,
        height: arrowHeight,
        margin: iconMargin,
      };
    },
    getLeftArrowStyle() {
      let { leftArrowIconBackground, getArrowStyle, leftRadius } = this;
      let background = this.dvBackgroundFormat(leftArrowIconBackground);
      let radius = dsf.dataview.utils.transformArrayPx(leftRadius);
      return {
        ...getArrowStyle,
        ...background,
        borderRadius: radius,
      };
    },
    getRightArrowStyle() {
      let { rightArrowIconBackground, getArrowStyle, rightRadius } = this;
      let background = this.dvBackgroundFormat(rightArrowIconBackground);
      let radius = dsf.dataview.utils.transformArrayPx(rightRadius);
      return {
        ...getArrowStyle,
        ...background,
        borderRadius: radius,
      };
    },
    isAutoplay() {
      return this.isDesign ? false : this.autoplay;
    },
  },
  created() {
    if (this.slots.length == 0) {
      let v = this.slots;
      for (let i = 0; i < 2; i++) {
        v.push({
          label: "carousel_" + (i + 1),
          name: "carousel_" + (i + 1),
          controls: [],
        });
      }
      this.slots = v;
    }
  },
  methods: {
    startInterval() {
      this.stopInterval();
      if (this.autoplay && !this.isDesign) {
        this.timer = setInterval(() => {
          this.prev();
        }, this.interval);
      }
    },
    stopInterval() {
      clearInterval(this.timer);
    },
    touchstart(e) {
      this.startDistanceX = e.touches[0].screenX;
      this.startDistanceY = e.touches[0].screenY;
    },
    touchmove(e) {
      //预留在这
    },
    touchend(e) {
      this.endDistanceX = e.changedTouches[0].screenX;
      this.endDistanceY = e.changedTouches[0].screenY;
      const moveDistanceX = this.startDistanceX - this.endDistanceX;
      const moveDistanceY = this.startDistanceY - this.endDistanceY;
      const distance = this.direction === "horizontal" ? moveDistanceX : moveDistanceY;

      //如果移动距离大于三分之一
      if (Math.abs(distance) > 50) {
        if (distance > 0) {
          this.prev();
        } else {
          this.next();
        }
      }
    },
    offsetStyle(index) {
      const size = (1 / this.sliderCount) * 100;
      if (this.direction === "horizontal") {
        return {
          width: size.toFixed(2) + "%",
          left: -index * size.toFixed(2) + "%",
        };
      } else {
        return {
          height: size.toFixed(2) + "%",
          top: -index * size.toFixed(2) + "%",
        };
      }
    },
    indicateChange(index) {
      this.stopInterval();
      if (this.changeType === "single") {
        this.activeIndex = -index;
      } else {
        this.activeIndex = -this.sliderCount * index;
      }
      this.startInterval();
    },
    prev() {
      if (!this.isCarousel) return false;
      const duration = (this.duration / 1000).toFixed(1);
      let len = this.slots.length;

      const total = this.sliderCount;
      let activeIndex = Math.abs(this.activeIndex);
      //如果是循环增加一屏的个数
      if (this.loop && !this.isDesign) {
        len += total;
      }
      const num = this.changeType === "screen" ? this.sliderCount : 1;
      if (len - activeIndex > this.sliderCount) {
        this.activeIndex -= num;
        if (this.loop && !this.isDesign && len - activeIndex - num <= this.sliderCount) {
          setTimeout(() => {
            this.$refs.wrapper.style.transition = "none";
            this.activeIndex = 0;
            this.$nextTick(() => {
              //强制回流
              this.$refs.wrapper.clientWidth;
              this.$refs.wrapper.style.transition = `transform ${duration}s`;
            });
          }, this.duration);
        }
      }
    },
    next() {
      if (!this.isCarousel) return false;
      const duration = (this.duration / 1000).toFixed(1);
      //支持轮播的情况
      if (this.loop && !this.isDesign) {
        let total = this.replenishNum + this.sliderCount;
        if (this.activeIndex < total) {
          if (this.changeType === "screen") {
            this.activeIndex += this.sliderCount;
            total = this.sliderCount;
          } else {
            this.activeIndex++;
          }
          if (this.activeIndex === total) {
            setTimeout(() => {
              this.$refs.wrapper.style.transition = "none";

              if (this.changeType === "screen") {
                let index = parseInt(this.slots.length / this.sliderCount);
                index = this.replenishNum === 0 ? index - 1 : index;
                this.activeIndex = -index * this.sliderCount;
              } else {
                this.activeIndex = -(this.slots.length - total);
              }
              this.$nextTick(() => {
                //强制回流
                this.$refs.wrapper.clientWidth;
                this.$refs.wrapper.style.transition = `transform ${duration}s`;
              });
            }, this.duration);
          }
        }
      } else {
        if (this.activeIndex < 0) {
          if (this.changeType === "screen") {
            this.activeIndex += this.sliderCount;
          } else {
            this.activeIndex++;
          }
        }
      }
    },
    changeActive(activeIndex) {
      this.activeIndex = -activeIndex * (this.changeType === "screen" ? this.sliderCount : 1);
    },
    resize() {
      this.wrapperWidth = this.$refs.wrapper.clientWidth;
      this.wrapperHeight = this.$refs.wrapper.clientHeight;
      //先只弄第一层
      if (this.isDesign) {
        let el = this.$el;
        this.slots.forEach((it) => {
          let controls = it.controls;
          controls.forEach((_it) => {
            let designId = _it.designId;
            let vmDom = $(el).find(".data-view-item-wrap[des-id='" + designId + "']")[0];
            let vm = null;
            if (vmDom) {
              vm = vmDom.__vue__;
              vm.resize?.();
            }
          });
        });
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewCarouselPanel.scss";
</style>

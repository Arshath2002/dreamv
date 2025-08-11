<!--
 * @Description: 动画列表--基于Animate.css动画库
 * @Author: shenah
 * @Date: 2024-09-04 10:25:53
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:54:34
-->

<template>
  <div class="des-dv-animate-list">
    <div class="attr-wrap">
      <div class="ds-designer-property property-item"  style="position: relative;left: -20px;">
        <div class="property-item-name">持续<span>： </span></div>
        <DesDVNumber
          :config="{ min:1, unit: 's' }"
          v-model="currentData.duration"
        />
      </div>
      <div
        class="ds-designer-property property-item"
        style="position: relative;left: -30px;"
      >
        <div class="property-item-name">间隔<span>： </span></div>
        <DesDVNumber
          :config="{ min: 0, unit: 's' }"
          v-model="currentData.delay"
        />
      </div>
    </div>
    <div
      class="ds-designer-property property-item"
      v-if="currentConfig.pageType === 'page'"
      style="position: relative;left: 6px;"
    >
      <div class="property-item-name">按序展示<span>： </span></div>
      <DesDVSwitch
        v-model="currentData.isOrder"
      />
      <DesDVToolTipsIcon
        :data="{
          desc:'<div>开启时，先进行页面动画再组件动画；</div><div>关闭时，与组件动画同时进行。</div>'
        }"
      >
      </DesDVToolTipsIcon>
    </div>
    <!-- 入场动画 -->
    <div class="enter-animate-items">
      <div
        class="enter-animate-item"
        v-for="(item) in showOptionList"
        :key="item.id"
      >
        <div
          class="enter-animate-title"
          v-if="item.label"
        >{{ item.label }}</div>
        <div class="content-items">
          <div
            class="content-item"
            :class="getContentItemClass(one)"
            v-for="one in item.list"
            :key="one.value"
            @click.stop="clickItem(one)"
          >{{ one.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import propertyMixin from "./propertyMixin";
import { createCommonAnimateCss } from "_dataview/output/config/commonConfig";
export default {
  name: "DesDVAnimateList",
  mixins: [propertyMixin],
  props: {
    value: {
      type: Object,
    },
  },
  watch: {
  },
  data() {
    return {
      defaultConfig: {
        type: 1, // 1代表入场动画2代表出场动画3代表页面动画
      },
      // 入场
      enterOptions: [
        {
          label: "滑动入场",
          id: "slideInId",
          list: [
            {
              label: "向上滑动",
              value: "slideInUp",
            },
            {
              label: "向下滑动",
              value: "slideInDown",
            },
            {
              label: "向左滑动",
              value: "slideInLeft",
            },
            {
              label: "向右滑动",
              value: "slideInRight",
            }
          ],
        },
        {
          label: "渐变入场",
          id: "fadeInId",
          list: [
            {
              label: "淡入",
              value: "fadeIn",
            },
            {
              label: "向上淡入",
              value: "fadeInUp",
            },
            {
              label: "向下淡入",
              value: "fadeInDown",
            },
            {
              label: "向左淡入",
              value: "fadeInLeft",
            },
            {
              label: "向右淡入",
              value: "fadeInRight",
            }
          ],
        },
        {
          label: "缩放入场",
          id: "zoomInId",
          list: [
            {
              label: "放大进入",
              value: "zoomIn",
            },
            {
              label: "向上放大",
              value: "zoomInUp",
            },
            {
              label: "向下放大",
              value: "zoomInDown",
            },
            {
              label: "向左放大",
              value: "zoomInLeft",
            },
            {
              label: "向右放大",
              value: "zoomInRight",
            }
          ],
        },
        {
          label: "翻转入场",
          id: "flipInId",
          list: [
            {
              label: "360°翻转",
              value: "flip",
            },
            {
              label: "x轴翻转",
              value: "flipInX",
            },
            {
              label: "y轴翻转",
              value: "flipInY",
            }
          ],
        },
        {
          label: "旋转入场",
          id: "rotateInId",
          list: [
            {
              label: "旋转进入",
              value: "rotateIn",
            },
            {
              label: "左上旋转",
              value: "rotateInUpLeft",
            },
            {
              label: "左下旋转",
              value: "rotateInDownLeft",
            },
            {
              label: "右上旋转",
              value: "rotateInUpRight",
            },
            {
              label: "右下旋转",
              value: "rotateInDownRight",
            },
          ],
        },
        {
          label: "弹跳入场",
          id: "bounceInId",
          list: [
            {
              label: "弹跳进入",
              value: "bounceIn",
            },
            {
              label: "向上弹跳",
              value: "bounceInUp",
            },
            {
              label: "向下弹跳",
              value: "bounceInDown",
            },
            {
              label: "向左弹跳",
              value: "bounceInLeft",
            },
            {
              label: "向右弹跳",
              value: "bounceInRight",
            },
          ],
        }
      ],
      // 出场动画
      outerOptions: [
        {
          label: "滑动退出",
          id: "slideOutId",
          list: [
            {
              label: "向上滑动",
              value: "slideOutUp",
            },
            {
              label: "向下滑动",
              value: "slideOutDown",
            },
            {
              label: "向左滑动",
              value: "slideOutLeft",
            },
            {
              label: "向右滑动",
              value: "slideOutRight",
            }
          ],
        },
        {
          label: "渐变出场",
          id: "fadeOutId",
          list: [
            {
              label: "淡入",
              value: "fadeOut",
            },
            {
              label: "向上淡入",
              value: "fadeOutUp",
            },
            {
              label: "向下淡入",
              value: "fadeOutDown",
            },
            {
              label: "向左淡入",
              value: "fadeOutLeft",
            },
            {
              label: "向右淡入",
              value: "fadeOutRight",
            }
          ],
        },
        {
          label: "缩放出场",
          id: "zoomOutId",
          list: [
            {
              label: "放大进入",
              value: "zoomOut",
            },
            {
              label: "向上放大",
              value: "zoomOutUp",
            },
            {
              label: "向下放大",
              value: "zoomOutDown",
            },
            {
              label: "向左放大",
              value: "zoomOutLeft",
            },
            {
              label: "向右放大",
              value: "zoomOutRight",
            }
          ],
        },
        {
          label: "翻转出场",
          id: "flipOutId",
          list: [
            {
              label: "x轴翻转",
              value: "flipOutX",
            },
            {
              label: "y轴翻转",
              value: "flipOutY",
            }
          ],
        },
        {
          label: "旋转出场",
          id: "rotateOutId",
          list: [
            {
              label: "旋转进入",
              value: "rotateOut",
            },
            {
              label: "左上旋转",
              value: "rotateOutUpLeft",
            },
            {
              label: "左下旋转",
              value: "rotateOutDownLeft",
            },
            {
              label: "右上旋转",
              value: "rotateOutUpRight",
            },
            {
              label: "右下旋转",
              value: "rotateOutDownRight",
            },
          ],
        },
        {
          label: "弹跳出场",
          id: "bounceOutId",
          list: [
            {
              label: "弹跳进入",
              value: "bounceOut",
            },
            {
              label: "向上弹跳",
              value: "bounceOutUp",
            },
            {
              label: "向下弹跳",
              value: "bounceOutDown",
            },
            {
              label: "向左弹跳",
              value: "bounceOutLeft",
            },
            {
              label: "向右弹跳",
              value: "bounceOutRight",
            },
          ],
        }
      ],
      // 页面动画
      pageOptions: [
        {
          label: "",
          id: "pageId",
          list: [
            {
              label: "默认",
              value: "default",
            },
          ],
        },
      ],
      currentData: {},

    };
  },
  computed: {
    showOptionList() {
      let mapping = {
        1: "enterOptions",
        2: "outerOptions",
        3: "pageOptions",
      }
      return this[mapping[this.currentConfig.type]]
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let defaultObj = createCommonAnimateCss();
      this.currentData = this.value;
      Object.keys(defaultObj).forEach(key => {
        let flag = key in this.value;
        if (!flag) {
          this.$set(this.value, key, defaultObj[key])
        }
      });

    },
    getContentItemClass(item) {
      let list = this.currentData.animation;
      if (list.indexOf(item.value) > -1) {
        return "active"
      }
      return ""
    },
    clickItem(item) {
      // 目前单选把
      let flag = this.currentData.animation.indexOf(item.value) > -1;
      if (flag) {
        this.currentData.animation = [];
      } else {
        this.currentData.animation = [item.value]
      }
      this.$emit("change", this.currentData);
      this.$emit("input", this.currentData);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/dsfAnimateList.scss";
</style>

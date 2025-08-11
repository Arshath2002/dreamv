<!--
 * @Editor: zhanghang
 * @Description: 生成大屏组件列表
 * @Date: 2025-04-01 13:49:54
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-23 09:53:10
-->
<template>
  <div class="chat-dv-component-wrap" v-if="data.length">
    <div class="chat-dv-component-wrap__title">推荐看板：</div>
    <div class="chat-dv-component-wrap__list">
      <span @click="leftClick" v-if="hasArrow" :class="{ disabled: index >= 0 }">
        <DsfIcon name="nav_arrow_left" />
      </span>
      <div class="chat-dv-component-wrap__list__content" :style="contentStyle">
        <div class="chat-dv-component-wrap__list__content__inner" :style="innerStyle">
          <el-tooltip popper-class="ai-dv-popper" effect="dark" v-for="item in data" :key="item.id" :content="item.modelArgs.title" placement="top">
            <DragThumbnail @click.native="selectComponent(item)" :style="itemStyle" :item="item"> </DragThumbnail>
          </el-tooltip>
        </div>
      </div>
      <span v-if="hasArrow" :class="{ disabled: !allowRightArrow }" @click="rightClick"> <DsfIcon name="nav_arrow_right" /></span>
    </div>
  </div>
</template>
<script>
import DragThumbnail from "./DragThumbnail.vue";
export default {
  name: "RecommendComponentList",
  components: { DragThumbnail },
  props: {
    contentWidth: {
      type: Number,
      default: 300,
    },
    width: {
      type: Number,
      default: 65,
    },
    height: {
      type: Number,
      default: 50,
    },
    margin: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      index: 0,
      dataMap: {},
      popperOptions: { boundariesElement: document.querySelector(".dsf-iagent-global-ai-chat"), gpuAcceleration: false },
    };
  },
  computed: {
    itemStyle() {
      const { width, height, margin } = this;
      return {
        width: width + "px",
        height: height + "px",
        margin: `0 ${margin}px`,
      };
    },
    itemWidth() {
      return this.width + this.margin * 2;
    },
    contentStyle() {
      return {
        width: this.contentWidth + "px",
      };
    },
    innerStyle() {
      const { index, itemWidth } = this;
      return {
        transform: `translateX(${index * itemWidth}px)`,
      };
    },
    hasArrow() {
      const { itemWidth, data, contentWidth } = this;
      return data.length * itemWidth > contentWidth;
    },
    allowRightArrow() {
      const { index, itemWidth, data, contentWidth } = this;
      if ((data.length + index) * itemWidth > contentWidth) {
        return true;
      }
      return false;
    },
    data() {
      const data = this.dataMap;
      return Object.values(data);
    },
  },
  created() {
    dsf.emit.$on(
      "aiModelData",
      (item) => {
        this.generateData(item);
      },
      this._uid
    );
  },

  beforeDestroy() {
    dsf.emit.$remove("aiModelData", this._uid);
  },
  methods: {
    reset() {
      this.dataMap = {};
      this.index = 0;
    },
    leftClick() {
      if (this.index < 0) {
        this.index++;
      }
    },
    rightClick() {
      if (this.allowRightArrow) {
        this.index--;
      }
    },
    generateData(item) {
      const { el, modelArgs } = item;
      const dataMap = dsf.mix(true, {}, this.dataMap);

      const compKey = $(el).closest(".dsf-dv-md-component")[0].getAttribute("comp-key");

      if (!item.el || !item.el.clientWidth || !item.el.clientHeight) return false;
      const result = {
        id: dsf.uuid(),
        image: "",
        modelArgs: modelArgs,
      };

      if (el.querySelector("canvas")) {
        const canvas = el.querySelector("canvas");
        result.image = canvas.toDataURL("image/jpeg");
      } else {
        result.dom = el.cloneNode(true);
        const x = 65 / el.clientWidth;
        const y = 50 / el.clientHeight;
        result.style = {
          transform: `scaleX(${x}) scaleY(${y})`,
          transformOrigin: "0 0",
          width: el.clientWidth + "px",
          height: el.clientHeight + "px",
          position: "relative",
        };
      }
      dataMap[compKey] = result;
      this.dataMap = dataMap;
    },

    /**
     * 选中推荐看板组件
     */
    selectComponent(item) {
      try {
        const chatText = this.$parent.getInputText();
        this.$parent.insertInputText(chatText + ` ${item.modelArgs.title} `);
      } catch (error) {
        console.warn(`error-${error}`);
      }
    },
  },
};
</script>
<style lang="scss">
// 推荐组件列表样式
.chat-dv-component-wrap {
  display: flex;
  width: calc(100% - 48px);
  max-width: 896px;
  margin: 18px auto 10px;

  // user-select: none;
  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__list {
    display: flex;
    align-items: center;
    flex: 1;

    > span {
      flex-shrink: 0;
      width: 20px;
      text-align: center;
      cursor: pointer;

      &.disabled {
        color: #ddd;
        cursor: not-allowed;
      }
    }

    &__content {
      overflow: hidden;

      &__inner {
        display: flex;
        transition: transform 0.2s;

        .item {
          flex-shrink: 0;
          background-size: 100% 100%;
          background-color: #ededed;
          cursor: move;
          font-size: 12px;
          position: relative;

          > span {
            margin-top: 5px;
          }
        }
      }
    }
  }
}

.ai-dv-popper {
  z-index: 500000 !important;
}
</style>

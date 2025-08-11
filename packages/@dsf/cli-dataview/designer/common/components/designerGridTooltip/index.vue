<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-10-21 13:39:27
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 10:51:50
-->
<template>
  <div class="dv-designer-grid-tooltip" v-show="display" :style="location">
    <div title="左对齐" class="item" :class="{ disabled: !allowAlign }" @click="clickItem(1)">
      <DsfIcon name="dv-icon-zuoduiqi" />
    </div>
    <div title="水平居中" class="item" :class="{ disabled: !allowAlign }" @click="clickItem(2)">
      <DsfIcon name="dv-icon-zuoyoujuzhongduiqi" />
    </div>
    <div title="右对齐" class="item" :class="{ disabled: !allowAlign }" @click="clickItem(3)">
      <DsfIcon name="dv-icon-youduiqi" />
    </div>

    <div title="顶端对齐" class="item" :class="{ disabled: !allowAlign }" @click="clickItem(4)">
      <DsfIcon name="dv-icon-dingduiqi" />
    </div>
    <div title="垂直居中" class="item" :class="{ disabled: !allowAlign }" @click="clickItem(5)">
      <DsfIcon name="dv-icon-shangxiajuzhongduiqi" />
    </div>
    <div title="底端对齐" class="item" :class="{ disabled: !allowAlign }" @click="clickItem(6)">
      <DsfIcon name="dv-icon-diduiqi" />
    </div>
    <div title="中心对齐" class="item" :class="{ disabled: !allowAlign }" @click="clickItem(7)">
      <DsfIcon name="dv-icon-shangxiazuoyoujuzhongduiqi" />
    </div>

    <div title="横向均等分布" class="item" :class="{ disabled: !allowAlign }" @click="clickItem(12)">
      <DsfIcon name="dv-icon-hengxiangjunyunfenbu" />
    </div>
    <div title="纵向均等分布" class="item" :class="{ disabled: !allowAlign }" @click="clickItem(13)">
      <DsfIcon name="dv-icon-zongxiangjunyunfenbu" />
    </div>

    <div v-if="allowComposition" title="组合" class="item" @click="clickItem(8)">
      <DsfIcon name="icon-replace" />
    </div>
    <div v-if="!allowComposition" title="取消组合" class="item" @click="clickItem(9)">
      <DsfIcon name="dv-icon-zuhe" />
    </div>

    <div v-if="allowLocked" title="锁住" class="item" @click="clickItem(10)">
      <DsfIcon name="dv-icon-suozi" />
    </div>
    <div v-if="!allowLocked" title="解除锁" class="item" @click="clickItem(11)">
      <DsfIcon name="dv-icon-suo" />
    </div>
  </div>
</template>
<script>
export default {
  name: "DesignerGridTooltip",
  data() {
    return {
      x: 0,
      y: 0,
      callback: null,
      display: false,
      allowAlign: true,
      allowComposition: true,
      allowLocked: true,
    };
  },
  computed: {
    location() {
      const { x, y } = this;
      return {
        top: `${y}px`,
        left: `${x}px`,
      };
    },
  },
  methods: {
    show(x, y, opt) {
      this.x = x;
      this.y = y;
      const { callback, allowAlign = true, allowComposition = true, allowLocked = true } = opt;
      this.callback = callback;
      this.allowAlign = allowAlign;
      this.allowComposition = allowComposition;
      this.allowLocked = allowLocked;
      this.display = true;
    },
    hide() {
      this.display = false;
    },
    clickItem(type) {
      if (type < 8 && !this.allowAlign) return false;

      dsf.isFunction(this.callback) && this.callback(type);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesGridTooltip.scss";
</style>

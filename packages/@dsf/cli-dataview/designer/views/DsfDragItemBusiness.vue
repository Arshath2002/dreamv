<!--
 * @Author: dengqirui
 * @Date: 2024-09-25 11:48:07
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-18 17:05:22
-->
<template>
  <div :name="data.name" class="ds-tool-item ds-desinger-drag-component ds-tool-itemBusiness ds-tool-itemBusiness-height" @mouseleave.stop="mouseLeaveHandler" @mouseenter.stop="mouseEnterHandler">
    <el-popover :disabled="!show" width="260" placement="right" trigger="hover">
      <div>
        <div v-if="data.data && data.data.thumbnail && data.data.thumbnail != '[]'" style="width: 100%">
          <img :src="data.data.thumbnail | imgDVFormat" style="width: 100%" alt="img" />
        </div>
        <div v-else class="business_no_img"></div>
        <div>
          <label>标识：</label><span>{{ data.data.code }}</span>
        </div>
        <div>
          <label>名称：</label><span>{{ data.name }}</span>
        </div>
        <div v-if="data.remark" style="margin-top: 10px">
          <span v-html="data.remark"></span>
        </div>
      </div>
      <div slot="reference">
        <div class="itemBusiness" v-if="data.data && data.data.thumbnail && data.data.thumbnail != '[]'" style="width: 100%">
          <img class="sortImg" :src="data.data.thumbnail | imgDVFormat" style="width: 100%" alt="img" />
        </div>
        <div v-else class="itemBusiness business_no_img"></div>
        <div class="ellipsis itemBusinessName">{{ data.name || data.id }}</div>
      </div>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: "DsfDesignerDragItemBusiness",
  props: {
    data: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    title() {
      let { data, id, name, remark } = this.data;
      return ["ID：", id, "\n", "标识：", data.code, "\n", "名称：", name, "\n", "说明：", remark || "暂无"].join("");
    },
  },
  methods: {
    mouseEnterHandler(evt) {
      this.show = true;
    },
    mouseLeaveHandler(evt) {
      this.show = false;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/dragItemBusiness.scss";
</style>

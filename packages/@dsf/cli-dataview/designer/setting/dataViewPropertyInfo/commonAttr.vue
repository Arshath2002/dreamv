<!--
 * @Description: 读取设计器右侧属性,通过某个属性提取出
 * @Author: shenah
 * @Date: 2023-07-10 09:47:31
 * @LastEditors: shenah
 * @LastEditTime: 2024-04-03 14:11:44
-->

<template>
  <div class="data-view-common-attr">
    <el-form
      ref="form"
      label-width="130px"
      inline
      size="small"
      class="data-view-common-attr-form"
    >
      <el-form-item
        :label="item.text"
        v-for="(item, index) in attrList"
        :key="index"
        :class="getElFormItem(item)"
        v-show="judgeShow(item)"
      >
        <CommonAttrItem
          :item="item"
          :form="form"
          @change="commonAttrItemChange"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CommonAttrItem from "./commonAttrItem";
export default {
  name: "commonAttr",
  components: { CommonAttrItem },
  props: {
    attrList: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    getElFormItem(attr) {
      if (attr.showType === "multipleText") {
        // 独占一行
        return "exclusive-row";
      }
      return "";
    },
    judgeShow(attr) {
      let showExpress = attr.showExpress;
      if (showExpress) {
        try {
          let flag = this.$eval(showExpress, this.form);
          return flag;
        } catch (error) {
          // console.log("judgeShow", error);
        }
      }
      return true;
    },
    commonAttrItemChange(obj) {
      this.$emit("change", obj);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/commonAttr.scss";
</style>
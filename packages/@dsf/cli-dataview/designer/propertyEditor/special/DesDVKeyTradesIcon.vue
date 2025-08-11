<template>
  <div class="des-dv-layout-img-wrapper" style="width: 100%;">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        <span>图片上传：</span>
      </div>
      <div class="des-dv-icon-add" @click="addItem">
        <i class="add-btn el-icon-plus"></i>
      </div>
    </div>
    <div class="single-layout-item" v-show="value.length">
      <div class="single-layout-item-img-wrapper">
        <DesDVMoreImg
          v-model="value"
          :config="{ ...currentConfig, noStyle: true, backgroundTypes: ['boardIcon'] }"
          @change="changeImage"
          noAddBtn
          ref="uploader"
        />
      </div>
    </div>
  </div>
</template>
<script>
import propertyMixin from "_dataview/designer/common/components/propertyMixin";
export default {
  name: "DesDVKeyTradesIcon",
  mixins: [propertyMixin],
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    addItem() {
      this.$refs.uploader.selectImg();
    },
    deleteItem(index) {
      this.value.splice(index, 1);
      this.$emit("input", this.value);
      this.$emit("change", this.value);
    },
    changeImage(val) {
      this.$emit("input", this.value);
      this.$emit("change", this.value);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/moreImg.scss";
</style>

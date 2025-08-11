<!--
 * @Description: 通用分页
 * @Author: shenah
 * @Date: 2024-01-31 15:50:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-07 17:03:01
-->

<template>
  <div
    class="data-view-item-wrap ds-control data-view-universal-pagination data-view-no-padding"
    :style="controlStyle"
  >
    <Pagination
      :config="config"
      :selectTheme="selectTheme"
      :queryParam="queryParam"
      :total="total"
    ></Pagination>
  </div>
</template>
<script>
//TODO:以后来进行集成(config目前单独出来)
import Pagination from "_dataview/share/components/data/common/pagination";
export default dsf.component({
  name: "DsfDataViewUniversalPagination",
  ctrlCaption: "通用分页",
  components: {
    Pagination,
  },
  mixins: [$mixins.dataView],
  props: {
    height: {
      type: String,
      default: "auto",
    },
    config: {
      type: Object,
      default: () => ({}),
    },
    selectTheme: {
      type: String,
      default: "lanse",
    },
    queryParam: {
      type: Object,
      default: () => ({
        pageSize: 10,
        pageNum: 1,
      }),
    },
  },
  watch: {},
  computed: {},
  data() {
    return {
      total: 0,
    };
  },
  created() {
    // 兼容以后新增
    this.compatiblePropAttr();
  },
  methods: {
    compatiblePropAttr() {
      let config = dsf.mix(true, {}, createPageConfig(), this.config);
      this.$emit("update:config", config);
    },
  },
});
</script>

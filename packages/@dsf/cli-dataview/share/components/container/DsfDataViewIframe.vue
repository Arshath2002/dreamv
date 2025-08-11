<template>
  <div class="ds-control data-view-no-padding ds-iframe" :style="getStyle">
    <div class="ds-designer-box" v-if="isDesign">
      <span style="margin: auto">【iframe】{{ url }}</span>
    </div>
    <iframe v-else :src="realUrl" frameborder="0" v-bind="iframeAttr"></iframe>
  </div>
</template>

<script>
export default dsf.component({
  name: "DsfDataViewIframe",
  ctrlCaption: "iframe容器",
  mixins: [$mixins.dataView],
  props: {
    margin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    padding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    url: {
      type: String,
      default: "",
    },
    iframeAttr: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    realUrl() {
      return this.$replace(this.url);
    },
    getStyle() {
      if (this.isDesign) {
        return {
          ...this.controlStyle,
          height: "100%",
        };
      } else {
        return this.controlStyle;
      }
    },
  },
  created() {},
  methods: {},
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/DsfDataViewIframe.scss";
</style>

<template>
  <div
    class="data-view-item-wrap dsf-dv-change-business ds-control data-view-no-padding"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <component-business-tree v-if="content" ref="comp" :is-design="isDesign" :component-props="content" />
    <div v-else class="dsf-dv-des-empty">
      <span>暂未选定业务组件</span>
    </div>
  </div>
</template>
<script>
import componentBusinessTree from "./componentBusinessTree.vue";
export default dsf.component({
  name: "DsfDataViewChangeBusiness",
  ctrlCaption: "业务组件",
  mixins: [$mixins.dataView],
  components: {
    componentBusinessTree,
  },
  props: {
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    defaultValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      value: "",
      content: null,
      componentType: "changeBusiness",
    };
  },
  watch: {
    defaultValue() {
      if (this.isDesign) {
        this.value = this.defaultValue;
      }
    },
    value() {
      this.getContent();
    },
  },
  created() {
    this.value = this.defaultValue;
  },
  methods: {
    loadChangeEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.change;
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
    /**
     * @param {String} value 业务组件id
     */
    changeComponent(value) {
      this.value = value;
    },
    /**
     * 获取业务组件内容
     */
    getContent() {
      const id = this.value;
      this.content = null;
      if (!id) {
        return false;
      }
      const url = dsf.url.getWebPath("/meta/data", $$webRoot.platform);
      const params = {
        id,
        pageName: "bcedit",
        namespace: "dsfa.rm.ctl.list",
        data: JSON.stringify({ _id: id }),
      };
      this.$http.get(url, params).done((res) => {
        if (res.success) {
          const content = res.data["dsfa_rm_ctl_list.content"];
          const code = res.data["dsfa_rm_ctl_list.code"];
          // 业务组件
          if (content) {
            this.content = JSON.parse(content);
            // 普通组件
          } else if(code) {
            const options = dsf.getComponentOptions(code);
            this.content = {
              ctrlType: code,
              ctrlName: options.ctrlName,
            };
          }
        }
      });
    },
    resize() {
      this.$refs.comp && this.$refs.comp.resize();
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewChangeBusiness.scss";
</style>

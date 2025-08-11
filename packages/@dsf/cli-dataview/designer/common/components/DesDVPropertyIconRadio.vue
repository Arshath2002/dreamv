<!--
 * @Editor: zhanghang
 * @Description: 图标选择
 * @Date: 2024-03-19 17:52:20
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:03:09
-->
<template>
  <div class="property-dv-icon-radio" :style="wrapperStyle">
    <div class="property-dv-icon-radio__wrapper">
      <div
        class="property-dv-icon-radio__item"
        v-context-menu="getContentMenu(option)"
        @click="change(option)"
        :class="[{ 'is-active': option.value === value }, config.size]"
        v-for="(option, $index) in dictionary"
        :key="$index"
      >
        <el-tooltip v-if="config.descType == 'hover'" effect="dark" placement="top">
          <div slot="content">{{ option.desc }}</div>
          <DsfIcon :name="option.icon" :style="option.style" />
        </el-tooltip>
        <DsfIcon :name="option.icon" v-else :style="option.style" />
        <el-divider direction="vertical" v-if="$index != dictionary.length - 1"></el-divider>
      </div>
    </div>
    <div class="property-dv-icon-radio__desc" v-if="config.descType !== 'hover'">{{ desc }}</div>
  </div>
</template>
<script>
import propertyMixin from "./propertyMixin";
export default {
  name: "DesDVPropertyIconRadio",
  mixins:[propertyMixin],
  props: {
    value: {
      type: String,
      default: "",
    },
    owner: {
      type: Object,
      require: true,
    },
  },
  computed: {
    dictionary() {
      return this.data.dictionary;
    },
    wrapperStyle() {
      const config = this.config;
      return config.align === "center" ? "margin:auto" : `align-items:${config.align}`;
    },
    desc() {
      return this.dictionary.find((it) => it.value === this.value)?.desc;
    },
  },
  methods: {
    change(item) {
      this.$emit("change", item.value);
    },
    getContentMenu(item) {
      const data = [];
      const contentMenu = { data };
      if (Array.isArray(item.contentMenu)) {
        item.contentMenu.forEach((menu) => {
          const { handler, hide, args, ...properties } = menu;
          data.push({
            ...properties,
            hide: dsf.isFunction(this.owner[hide]) ? () => this.owner[hide](item) : () => {},
            handler: dsf.isFunction(this.owner[handler]) ? () => this.owner[handler](item) : () => {},
          });
        });
      }
      return contentMenu;
    },
  },
};
</script>

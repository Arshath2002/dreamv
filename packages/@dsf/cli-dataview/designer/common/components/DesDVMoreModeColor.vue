<!--
 * @Description: 多种模式颜色
 * @Author: shenah
 * @Date: 2024-03-18 10:41:11
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-08 11:18:50
-->

<template>
  <div class="dsf-more-mode-color-icon dsf-more-mode-color">
    <!-- 这里用index作位key--防止颜色改变视图更新导致颜色弹框消失 -->
    <DesDVColorPicker v-for="(item, index) in currentData" :key="index" :value="item.value" :config="currentConfig" @change="(val) => changeSingleColor(val, item)">
      <template v-slot="{ openPopover, backgroundStyle }">
        <div class="color-icon-item" :style="{ background: backgroundStyle }" @click="openPopover">
          <DsfIcon class="del-icon select-icon" name="shanchu1" @click.stop="delOne(index)" v-if="isDel && currentConfig.allowDelete"></DsfIcon>
        </div>
      </template>
    </DesDVColorPicker>
    <div class="des-dv-icon-add" @click="add" v-if="showAdd">
      <i class="add-btn el-icon-plus"></i>
    </div>
  </div>
</template>
<script>
import propertyMixin from "./propertyMixin";
import DesDVColorPicker from "./colorPicker/index.vue";
export default {
  name: "DesDVMoreModeColor",
  mixins: [propertyMixin],
  props: {
    value: {
      type: Array,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DesDVColorPicker,
  },
  watch: {
    "config.colors"(val) {
      this.currentConfig.colors = val;
    },
  },
  data() {
    return {
      defaultConfig: {
        type: "color",
        limit: null,
        colors: [],
        lastOneDel: false,
        allowDelete: true,
      },
      defaultColor: "rgba(0,0,0,1)",
    };
  },
  computed: {
    currentData: {
      get() {
        let value = this.value || [];
        const { limit } = this.currentConfig;
        if (dsf.isNumber(limit)) {
          value = value.slice(0, limit);
        }

        return value.map((item) => ({
          value: typeof item === "string" ? item : this.getNextColor(),
        }));
      },
    },
    showAdd() {
      const { limit } = this.currentConfig;
      if (!limit || !dsf.isNumber(Number(limit))) {
        return true;
      }
      return this.currentData.length < Number(limit);
    },
    isDel() {
      return this.currentData.length > 1 || this.currentConfig.lastOneDel;
    },
  },
  methods: {
    initValue() {},
    getNextColor() {
      const colors = this.currentConfig.colors;
      if (colors && colors.length) {
        return colors[this.currentData.length % colors.length];
      }
      return "rgba(0,0,0,1)";
    },
    add() {
      let obj = {};
      let lastOne = this.currentData[this.currentData.length - 1];
      const colors = this.currentConfig.colors;
      obj.value = colors.length || !lastOne ? this.getNextColor() : lastOne.value;
      this.currentData.push(obj);
      this.changeValue();
    },
    delOne(index) {
      this.currentData.splice(index, 1);
      this.changeValue();
      //强制刷新一下视图
      this.$forceUpdate();
    },
    changeSingleColor(val, item) {
      if (val.replace(/\s/g, "") !== item.value.replace(/\s/g, "")) {
        item.value = val;
        this.changeValue();
      }
    },
    changeValue() {
      let nowData = this.currentData.map((item) => item.value);
      this.$emit("input", nowData);
      this.$emit("change", nowData);
    },
  },
};
</script>

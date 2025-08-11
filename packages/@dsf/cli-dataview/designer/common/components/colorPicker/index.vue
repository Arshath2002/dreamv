<template>
  <div class="ds-color-picker" ref="root">
    <el-popover ref="popover" v-model="isActive" placement="left" width="300" trigger="manual" popper-class="designer-page-bg-setting-popper">
      <DsfColorPickerPanel v-clickoutside="closePopover" v-model="currentData" v-bind="$attrs" :options="currentConfig.typeOptions.map(it => it.value)" :type.sync="activeType">
        <template #header v-if="currentConfig.type === 'both' || (dsf.isArray(currentConfig.type) && currentConfig.type.length > 1)">
          <DesDVRadioGroup v-model="activeType" :data="{ dictionary: currentConfig.typeOptions }"  autofit stroke style="margin-bottom: 10px"></DesDVRadioGroup>
        </template>
      </DsfColorPickerPanel>
      <div slot="reference" class="ds-preview-content" :class="{ active: isActive, 'ds-no-arrow': currentConfig.noArrow }">
        <slot :openPopover="openPopover" :backgroundStyle="currentData">
          <div class="ds-preview-color" :style="{ background: currentData }" @click="openPopover">
            <DsfIcon name="xia1" class="arrow-down-up"></DsfIcon>
          </div>
          <el-input v-show="activeType === 'color' && !currentConfig.noInput" class="ds-hex-input"  v-model="currentData" size="mini"></el-input>
        </slot>
      </div>
    </el-popover>
  </div>
</template>

<script>
import DsfColorPickerPanel from "./Picker.vue";
import clickoutside from "element-ui/src/utils/clickoutside";
import propertyMixin from "../propertyMixin";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
export default {
  name: "DesDVColorPicker",
  directives: {
    clickoutside,
  },
  mixins: [propertyMixin],
  components: {
    DsfColorPickerPanel,
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String, Object],
      default: "#fff",
    },
  },
  data() {
    return {
      changeData: this.value,
      defaultConfig: {
        type: "both", // 选择模式：color / linear / radial / both
        noArrow: false, // 是否显示箭头图标
        noInput: false, // 是否显示输入框
        typeOptions: [
          {
            text: "单色",
            value: "color",
          },
          {
            text: "线性渐变",
            value: "linear",
          },
          {
            text: "径向渐变",
            value: "radial",
          },
        ], // tab 选项
      },
      isActive: false,
      activeType: "color",
    };
  },
  computed: {
    currentData: {
      get() {
        let val = this.changeData;
        let result = "";
        if (dsf.isString(val)) {
          result = val;
        } else if (dsf.isObject(val) && val.color) {
          if (["linear", "radial"].includes(val.color.type)) {
            result = val.color.image;
          } else {
            result = val.color.value;
          }
        }
        return result;
      },
      set(v) {
        this.changeValue(v);
      },
    },
  },
  created() {
    this.initValue();
  },
  watch: {
    value: {
      handler() {
        this.initValue();
      },
      deep: true,
    },
  },
  methods: {
    initValue() {
      let val = this.value;
      this.changeData = val;
      if (dsf.isString(val)) {
        // 渐变模式初始化处理
        if (/gradient/.test(val)) {
          this.activeType = val.slice(0, 6);
        } else {
          this.activeType = "color";
        }
      } else if (dsf.isObject(val) && val.color) {
        this.activeType = val.color.type || "color";
      }

      // 处理type为数组
      let type = this.currentConfig.type;
      if (dsf.isArray(type)) {
        let typeOptions = [];
        _.each(this.currentConfig.typeOptions, (item) => {
          if (type.includes(item.value)) {
            typeOptions.push(item);
          }
        });
        this.currentConfig.typeOptions = typeOptions;
      }
    },
    closePopover() {
      this.isActive = false;
      // if (this.changeData != this.value) {
      //   this.$emit("change", this.changeData);
      // }
    },
    openPopover() {
      this.isActive = !this.isActive;
    },
    replaceSpace(str) {
      return str.replace(/\s+/g, "");
    },
    changeValue(result) {
      const value = this.value;
      let changeData = result;
      if (dsf.isObject(value)) {
        if (!value.color) {
          changeData = dsf.mix(true, {}, defaultBackground, value);
        } else {
          changeData = value;
        }
        changeData.color.type = this.activeType;
        if (["linear", "radial"].includes(this.activeType)) {
          changeData.color.image = result;
        } else {
          changeData.color.image = "";
          changeData.color.value = result;
        }
        changeData.color.isTheme = false;
      }
      this.changeData = changeData;

      if (dsf.isObject(value) && this.changeData != this.value) {
        this.$emit("change", this.changeData);
      } else if (dsf.isString(value) && this.replaceSpace(this.changeData) != this.replaceSpace(this.value)) {
        this.$emit("change", this.changeData);
      }
    },
  },
};
</script>

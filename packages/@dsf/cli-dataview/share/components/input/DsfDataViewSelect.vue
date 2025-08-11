<template>
  <div
    class="dsf-dv-input-select data-view-item-wrap ds-control data-view-no-padding data-view-common-bg-effect"
    :style="dsfInputSelectStyle"
    :class="[relationStyle ? 'data-view-select-theme' : 'not-relation']"
  >
    <div
      v-if="isDesign"
      class="select-wrap"
      :style="controlStyle"
    >
      <label
        v-if="nameTextStyle.isShow"
        :style="labelStyle"
      >
        {{ nameTextStyle.content }}
      </label>
      <el-select
        ref="selects"
        :placeholder="placeholder"
        :style="selectBoxStyle"
        v-model="value"
        class="select-box"
        value-key="text"
        filterable
      >
        <el-option
          v-for="item in dataItems"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <!-- 下拉 -->
    <div
      v-else
      class="select-wrap"
      :style="controlStyle"
    >
      <label
        v-if="nameTextStyle.isShow"
        :style="labelStyle"
      >
        {{ nameTextStyle.content }}
      </label>
      <el-select
        ref="selects"
        :multiple="multiple"
        :placeholder="placeholder"
        v-model="value"
        @change="changeItem"
        class="select-box"
        value-key="text"
        :style="selectBoxStyle"
        visible-change
        filterable
        :popper-class="[
          'data-view-select-theme__popper',
          themeStyleName,
          dropDownClass,
        ].join(' ')"
        :popper-append-to-body="popperAppendToBody"
      >
        <el-option
          v-for="item in dataItems"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import mixins from "./mixins";
import themeMixin from "_dataview/mixins/moreThemeMixin.js";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
const defaultCustomThemeStyle = {
  "--dv-select-dropdown-bg": "rgba(23,23,23,1)",
  "--dv-select-dropdown-border-radius": "10px 10px 10px 10px",
  "--dv-select-dropdown-text-color": "rgba(255,255,255,1)",
  "--dv-active-select-dropdown-bg": "rgba(255,255,255,0.1)",
  "--dv-active-multiple-dropdown-text-color": "rgba(236,189,99,1)",
  "--dv-select-dropdown-bg-box-shadow": "none",
  "--dv-select-dropdown-border-color": "rgba(255,255,255,0)",
  "--dv-select-dropdown-arrow-display": "none",
  "--dv-select-dropdown-scrollbar-color": "rgba(255,255,255,0)",
};
export default dsf.component({
  name: "DsfDataViewSelect",
  ctrlCaption: "下拉框",
  mixins: [$mixins.dataView, mixins, themeMixin],
  props: {
    width: {
      type: String,
      default: "auto",
    },
    //风格
    styleMapKey: {
      type: String,
      default: "select",
    },
    customThemeStyle: {
      type: Object,
      default: () => defaultCustomThemeStyle,
    },
    selectTextStyle: {
      type: Object,
      default: () => ({
        fontSize: "16",
        fontFamily: "Microsoft Yahei",
        fontWeight: "normal",
        fontStyle: "normal",
      }),
    },
    nameTextStyle: {
      type: Object,
      default: () => ({
        isShow: false,
        content: "下拉选项：",
        fontSize: "16",
        fontFamily: "Microsoft Yahei",
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#fff",
      }),
    },

    dropDownClass: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "auto",
    },
    inputHeight: {
      type: String,
      default: "40px",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    align: {
      type: String,
      default: "center",
    },
    padding: {
      type: Array,
      default: () => [8, 6, 8, 6],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    selectWidth: {
      type: String,
      default: "100%",
    },
    // 默认值
    defaultValue: {
      type: [String, Number],
      default: "",
    },
    borderConfig: {
      type: Object,
      default: () => ({
        border: "1px solid #DCDFE6",
      }),
    },
    borderRadius: {
      type: Array,
      default() {
        return [0, 0, 0, 0]
      },
    },
    // 背景
    controlBackgroundConfig: {
      type: Object,
      default() {
        return defaultBackground;
      }
    },
  },
  data() {
    return {
      value: [],
    };
  },
  watch: {
    inputHeight: {
      handler(val) {
        if (typeof val === 'string' && val.includes("%")) {
          this.$emit("update:height", "100%");
        } else {
          this.$emit("update:height", "auto");
        }
      },
      immediate: true,
    },
  },
  created() {
    this.compatibleProp();
    // 请求走接口
    this.initData();
  },
  mounted() {
    //加载完成依赖事件-----start
    if (!this.isDesign) {
      let defaultValue = this.defaultValue;
      if (this.multiple) {
        if (defaultValue) {
          defaultValue = defaultValue.split(",");
        } else {
          defaultValue = [];
        }
      } else {
        defaultValue = defaultValue.split(",")[0];
      }
      this.value = defaultValue;

      let data = Array.isArray(this.value) ? this.value : [this.value];

      this.$nextTick(() => {
        this.loadCompleteEvents(data);
      });
    }
    //加载完成依赖事件-----end
  },
  computed: {
    labelStyle() {
      return dsf.dataview.utils.transformTextStyle(this.nameTextStyle);
    },
    selectBoxStyle() {
      let { borderRadius, selectWidth } = this;
      const width = dsf.dataview.utils.transformPx(selectWidth);
      borderRadius = dsf.dataview.utils.transformArrayPx(borderRadius);
      if (this.relationStyle) {
        return { width, borderRadius,height:this.inputHeight.includes("%")?"100%":"inherit" };
      }
      return {
        width,
        borderRadius,
        ...this.borderConfig,
        height:this.inputHeight.includes("%")?"100%":"inherit"
      };
    },
    dsfInputSelectStyle() {
      return {
        ...this.getCommonEnterAnimateStyle,
        ...this.marginAndPadding,
        height: dsf.dataview.utils.transformPx(this.height),
        ...this.dvBackgroundFormat(this.controlBackgroundConfig, { isBgInfoVar: true }),
        ...this.getBoxShadowConfig(true),
      };
    },
    controlStyle() {
      let { align, inputHeight, multiple } = this;
      if (/\d+$/g.test(inputHeight)) {
        inputHeight += "px";
      }
      const selectTextStyle = dsf.dataview.utils.transformTextStyle(
        this.selectTextStyle
      );
      return {
        textAlign: align,
        height: multiple ? "auto" : inputHeight,
        ...selectTextStyle,
      };
    },
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      const _props = this.getComponentStyle();
      _props.height = this.inputHeight;
      _props.width = this.selectWidth;
      return {
        _props,
        // 固定为数组格式，按主、次顺序
        textStyles: [this.nameTextStyle],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [], _props = {} } = config;
        this.updateComponentStyle("nameTextStyle", textStyles[0]);
        this.updateComponentStyle("inputHeight", _props.height);
        this.updateComponentStyle("selectWidth", _props.width);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    compatibleProp() {
      // 兼容之前有的属性
      if (this.$attrs.selectFontFamily) {
        this.selectTextStyle.fontFamily = this.$attrs.selectFontFamily;
        this.selectTextStyle.fontSize = this.fontSize; // fontsize不一样因为混合引入了
        this.$emit("update:selectTextStyle", this.selectTextStyle);
      }
      // 兼容名称
      if (this.$attrs.nameFontFamily) {
        this.nameTextStyle.isShow = !!this.$attrs.label;
        this.nameTextStyle.content = this.$attrs.label;
        this.nameTextStyle.fontFamily = this.$attrs.nameFontFamily;
        this.nameTextStyle.color = this.$attrs.nameColor;
        this.nameTextStyle.fontSize = this.$attrs.nameFontSize;
      }
    },
    // 自定义
    specialAddStyle() {
      let nowConfig = dsf.mix(
        true,
        {},
        defaultCustomThemeStyle,
        this.customThemeStyle
      );
      nowConfig[
        "--dv-select-dropdown-border-radius"
      ] = dsf.dataview.utils.transformArrayPx(
        nowConfig["--dv-select-dropdown-border-radius"]
      );
      if (!this.popperAppendToBody) {
        this.styleList = dsf.mix(true, {}, this.styleList, nowConfig);
      }
      this.addStyle(nowConfig);
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/select.scss";
</style>


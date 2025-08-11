<!--
 * @Editor: zhanghang
 * @Description: 图表提示框
 * @Date: 2024-04-18 14:45:25
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-23 17:02:07
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">提示框<span>： </span></div>
      <DesDVSwitch v-model="tooltip.show" @change="changeValue($event, tooltip, 'show')" />
    </div>
    <div class="ds-designer-property property-item" v-if="tooltip.show">
      <div class="property-item-name">格式化<span>： </span></div>
      <DesDVSwitch v-model="tooltip.isFormatter" @change="changeIsFormatter($event, tooltip, 'isFormatter')" />
    </div>
    <div class="ds-designer-property property-item" v-if="tooltip.show && tooltip.isFormatter">
      <DsfDVChartRichText
        :useStyle="{ minHeight: '100px' }"
        @changeFieldsStyleRules="changeFormatter"
        @change="changeFormatter"
        :fieldsStyleRules.sync="fieldsStyleRules"
        v-model="tooltip.formatterHtml"
        :fields="toolTipFields"
        :owner="owner"
      />
    </div>
    <div class="ds-designer-property property-item" v-if="tooltip.show">
      <div class="property-item-name">风格<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="tooltip.styleType" @change="changeStyle($event, tooltip, 'styleType')" />
    </div>
    <template v-if="tooltip.styleType == 'custom' && tooltip.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">字体<span>： </span></div>
        <DesDVNumber :config="{ min: 12, unit: 'px' }" :value="tooltip.itemStyle.fontSize" @change="changeValue($event, tooltip.itemStyle, 'fontSize')" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name"></div>
        <DesDVColorPicker :config="colorConfig" :value="tooltip.itemStyle.color" @change="changeValue($event, tooltip.itemStyle, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">边框颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" :value="tooltip.itemStyle.borderColor" @change="changeValue($event, tooltip.itemStyle, 'borderColor')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">边框宽度<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="tooltip.itemStyle.borderWidth" @change="changeValue($event, tooltip.itemStyle, 'borderWidth')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">背景颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" :value="tooltip.itemStyle.backgroundColor" @change="changeValue($event, tooltip.itemStyle, 'backgroundColor')" />
      </div>
    </template>
    <div class="ds-designer-property property-item flex-center ml20" v-if="tooltip.show">
      <div class="property-item-name flex-center">内边距<span>： </span></div>
      <DesDVMargins :value="tooltip.itemStyle.padding" @change="changeValue($event, tooltip.itemStyle, 'padding')" />
    </div>
  </div>
</template>
<script>
import DsfDVChartRichText from "../echarts/DsfDVChartRichText.vue";
export default {
  name: "DesDVThreeMapTooltip",
  components: { DsfDVChartRichText },
  props: {
    owner: {
      type: Object,
      require: true,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      threeOptions: this.owner.threeOptions,
      colorConfig: {
        type: "color",
      },
      dictionary: [
        {
          text: "浅色",
          value: "0",
        },
        {
          text: "深色",
          value: "1",
        },
        {
          text: "自定义",
          value: "custom",
        },
      ],
      styleOptions: [
        {
          text: "浅色",
          value: "0",
          config: {
            backgroundColor: "#ffffff",
            borderColor: "#ffffff",
            color: "#333333",
            fontSize: 14,
          },
        },
        {
          text: "深色",
          value: "1",
          config: {
            backgroundColor: "rgba(50,50,50,0.7)",
            borderColor: "#333333",
            color: "#ffffff",
            fontSize: 14,
          },
        },
      ],
      //默认提示框额外的字段
      toolTipExtraFields: [
        {
          name: "系列名",
          value: "seriesName",
        },
      ],
    };
  },
  created() {
    //在数据配置完成时候，接受一次最新的chart
    dsf.emit.$on(
      "updatePropertyThree",
      () => {
        this.threeOptions = this.owner.threeOptions;
        this._updateThree();
      },
      this.owner.$children[0]
    );
    this._updateThree = _.debounce(this.updateThree, 500);
  },
  beforeDestroy() {
    dsf.emit.$remove("updatePropertyThree", this.owner.$children[0]);
  },
  computed: {
    toolTipFields() {
      let staticFields = [];
      //如果地图是静态的
      if (this.owner.dataType === "static") {
        staticFields.push({
          name: "值",
          value: "value",
        });
      }
      let mapFieldList = this.owner.$children[0].getDesignerMapFieldList();
      return this.toolTipExtraFields.concat(mapFieldList).concat(staticFields);
    },
    fieldsStyleRules: {
      get() {
        return this.owner.fieldsStyleRules;
      },
      set(val) {
        this.owner.fieldsStyleRules = val;
      },
    },
    config() {
     let config = this.data.config;
      return config || {};
    },
    tooltip() {
      const key = this.config.tooltip || "tooltip";
      return this.threeOptions[key];
    },
  },
  methods: {
    setFormatter() {
      let tooltip = this.tooltip;
      let _formatter = tooltip.formatter;
      let formatterHtml = tooltip.formatterHtml;
      let hasContent = dsf.dataview.utils.hasTextContent(formatterHtml);
      let fieldsStyleRules = this.fieldsStyleRules;
      let rulesString = dsf.unEval(fieldsStyleRules);
      if (hasContent) {
        let code = `var formatterHtml = ${JSON.stringify(formatterHtml)};
                    var fieldsStyleRules = ${rulesString};
                var html= dsf.dataview.utils.analyzeToolTipHTMLAttr(
                formatterHtml,
                params,
                "three",
                [],
                fieldsStyleRules
              );

            return html;`;
        this.$set(tooltip, "formatter", new Function("params", code));
      } else {
        this.$set(tooltip, "formatter", _formatter);
      }
      this._updateThree();
    },
    changeFormatter() {
      this.setFormatter();
    },
    changeStyle(val, item, key) {
      let style = this.styleOptions.find((it) => it.value == val);
      this.$set(item, key, val);
      if (style) {
        const config = style.config;
        this.tooltip.itemStyle = dsf.mix(true, {}, this.tooltip.itemStyle, config);
      }
      this._updateThree();
    },
    changeValue(val, item, key) {
      if (!_.isEqual(item[key], val)) {
        this.$set(item, key, val);
        this._updateThree();
      }
    },
    changeIsFormatter(val, item, key) {
      if (val && this.tooltip.formatterHtml) {
        this.setFormatter();
      } else {
        this.$set(this.tooltip, "formatter", function (data) {
          var name = data.name || "-- ";
          var value = data.value === undefined ? "-- " : data.value;
          return "<span>" + name + "：</span>" + "<span>" + value + "</span>";
        });
        this._updateThree();
      }
    },
    updateThree() {
      dsf.emit.$emit(
        "updateThree",
        {
          threeOptions: this.threeOptions,
        },
        [this.owner.$children[0]]
      );
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>

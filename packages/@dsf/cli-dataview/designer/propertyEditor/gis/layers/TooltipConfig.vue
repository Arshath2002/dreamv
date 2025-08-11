<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-06-12 13:41:39
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-12 15:34:02
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">提示框显示<span>： </span></div>
      <DesDVSwitch :value="tooltip.show" @change="changeValue($event, tooltip, 'show')" />
    </div>
    <template v-if="tooltip.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">样式<span>： </span></div>
        <DesDVTextStyle :config="textConfig" class="min" v-model="textStyle"></DesDVTextStyle>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">背景色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="tooltip.itemStyle.backgroundColor" @change="changeValue($event, tooltip.itemStyle, 'backgroundColor')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">边框颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" :value="tooltip.itemStyle.borderColor" @change="changeValue($event, tooltip.itemStyle, 'borderColor')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">边框宽度<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="tooltip.itemStyle.borderWidth" @change="changeValue($event, tooltip.itemStyle, 'borderWidth')" />
      </div>
      <div class="ds-designer-property property-item" v-if="tooltip.show">
        <div class="property-item-name">格式化<span>： </span></div>
        <DesDVSwitch v-model="tooltip.isFormatter" @change="changeFormatValue($event, tooltip, 'isFormatter')" />
      </div>
      <div class="ds-designer-property property-item" v-if="tooltip.show && tooltip.isFormatter">
        <DsfDVChartRichText
          @changeFieldsStyleRules="changeFieldsStyleRules"
          :useStyle="{ minHeight: '100px' }"
          @change="changeFormatter"
          :fieldsStyleRules.sync="fieldsStyleRules"
          v-model="tooltip.formatterHtml"
          :fields="toolTipFields"
          :owner="owner"
        />
      </div>
    </template>
  </div>
</template>
<script>
import DsfDVChartRichText from "../../echarts/DsfDVChartRichText.vue";
export default {
  name: "TooltipConfig",
  components: { DsfDVChartRichText },
  inject: ["owner"],
  props: {
    tooltip: {
      type: Object,
      require: true,
    },
  },
  computed: {
    toolTipFields() {
      const res = [
        {
          name: "系列名",
          value: "seriesName",
        },
        {
          name: "名称",
          value: "name",
        },
        {
          name: "值",
          value: "value",
        },
        ...this.owner.$children[0].getDesignerMapFieldList(),
      ];
      return res;
    },
    textStyle: {
      get() {
        const { color, fontSize, fontFamily = "Microsoft Yahei" } = this.tooltip.itemStyle;
        return {
          color,
          fontSize,
          fontFamily,
        };
      },
      set(v) {
        Object.assign(this.tooltip.itemStyle, v);
        this.$emit("updateGisLayer");
      },
    },
    fieldsStyleRules: {
      get() {
        return this.owner.fieldsStyleRules;
      },
      set(val) {
        this.owner.fieldsStyleRules = val;
      },
    },
  },
  data() {
    return {
      colorConfig: {
        type: "color",
      },

      textConfig: {
        picker: { type: "color" },
        isShowFontWeight: false,
        isShowItalics: false,
        isShowUnderline: false,
        isShowShadow: false,
      },
    };
  },

  methods: {
    changeFieldsStyleRules() {
      this.changeFormatter();
    },
    changeFormatter() {
      const flag = this.tooltip.isFormatter;
      let formatterHtml = this.tooltip.formatterHtml;

      let hasContent = dsf.dataview.utils.hasTextContent(formatterHtml);

      if (flag && !hasContent) {
        const code = `
        var t = params;
        var e = t.properties.name || "-- ", i = void 0 === t.properties.value ? "-- " : t.properties.value; 
        return "<span>" + e + "：</span><span>" + i + "</span>"
        `;

        this.$set(this.tooltip, "formatter", new Function("params", code));
        this.updateGisLayer();
        return;
      }

      let fieldsStyleRules = this.fieldsStyleRules;
      let rulesString = dsf.unEval(fieldsStyleRules);

      if (flag && hasContent) {
        let code = `var formatterHtml = ${JSON.stringify(formatterHtml)};
                    var fieldsStyleRules = ${rulesString};
                  var html = dsf.dataview.utils.analyzeToolTipHTMLAttr(
                              formatterHtml,
                              params,
                              "gis",
                              [],
                              fieldsStyleRules
                            );
                  return html;`;
        this.$set(this.tooltip, "formatter", new Function("params", code));
      }

      this.updateGisLayer();
    },
    updateGisLayer() {
      this.$emit("updateGisLayer");
    },
    changeFormatValue(val, item, key) {
      this.$set(item, key, val);
      if (!val) {
        this.tooltip.formatterHtml = "";
        const code = `
        var t = params;
        var e = t.properties.name || "-- ", i = void 0 === t.properties.value ? "-- " : t.properties.value; 
        return "<span>" + e + "：</span><span>" + i + "</span>"
        `;

        this.$set(this.tooltip, "formatter", new Function("params", code));
      }
      this.updateGisLayer();
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.updateGisLayer();
    },
  },
};
</script>

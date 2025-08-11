<!--
 * @Editor: zhanghang
 * @Description: 图表提示框
 * @Date: 2024-04-18 14:45:25
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:25:46
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">提示框展示<span>： </span></div>
      <DesDVSwitch v-model="tooltip.show" @change="changeValue($event, tooltip, 'show')" />
    </div>
    <div class="ds-designer-property property-item" v-if="tooltip.show">
      <div class="property-item-name">格式化<span>： </span></div>
      <DesDVSwitch v-model="tooltip.isFormatter" @change="changeIsFormatter($event, tooltip, 'isFormatter')" />
    </div>
    <div class="ds-designer-property property-item" v-if="tooltip.show && tooltip.isFormatter">
      <DsfDVChartRichText
        :useStyle="{ minHeight: '100px' }"
        @changeFieldsStyleRules="changeFieldsStyleRules"
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
        <DesDVNumber :config="{ min: 12, unit: 'px' }" :value="tooltip.textStyle.fontSize" @change="changeValue($event, tooltip.textStyle, 'fontSize')" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name"></div>
        <DesDVColorPicker :config="colorConfig" :value="tooltip.textStyle.color" @change="changeValue($event, tooltip.textStyle, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">边框颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" :value="tooltip.borderColor" @change="changeValue($event, tooltip, 'borderColor')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">边框宽度<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="tooltip.borderWidth" @change="changeValue($event, tooltip, 'borderWidth')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">背景颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" :value="tooltip.backgroundColor" @change="changeValue($event, tooltip, 'backgroundColor')" />
      </div>
    </template>
    <div class="ds-designer-property property-item flex-center" v-if="tooltip.show">
      <div class="property-item-name flex-center">内边距<span>： </span></div>
      <DesDVMargins :value="tooltip.padding" @change="changeValue($event, tooltip, 'padding')" />
    </div>
  </div>
</template>
<script>
import DsfDVChartRichText from "./DsfDVChartRichText.vue";
export default {
  name: "DesDVChartTooltip",
  components: { DsfDVChartRichText },
 
  props: {
    owner: {
      type: Object,
      require: true,
    },
    //是否开启多个series 图例 系列名字段解析
    isOpenSeries: {
      type: Boolean,
      default: true,
    },
    deleteShowProperty: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const options = {
      backgroundColor: "#ffffff",
      borderColor: "#ffffff",
      borderWidth: "0",
      padding: [10, 10, 10, 10],
      textStyle: {
        color: "#333333",
        fontSize: 14,
      },
      styleType: "0",
      formatterHtml: "",
    };
    if (!this.deleteShowProperty) {
      options.show = true;
    }
    return {
      chart: this.owner.chart,
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
            textStyle: {
              color: "#333333",
              fontSize: 14,
            },
          },
        },
        {
          text: "深色",
          value: "1",
          config: {
            backgroundColor: "rgba(50,50,50,0.7)",
            borderColor: "#333333",
            textStyle: {
              color: "#ffffff",
              fontSize: 14,
            },
          },
        },
      ],

      options: options,
      //默认提示框额外的字段
      toolTipExtraFields: [
        {
          name: "图例",
          value: "marker",
        },
        {
          name: "系列名",
          value: "seriesName",
        },
        {
          name: "名称",
          value: "name",
        },
      ],
    };
  },
  created() {
    this._updateChart = _.debounce(this.updateChart, 500);

    this.chart.tooltip = dsf.mix(true, {}, this.options, this.chart.tooltip);
    // this._updateChart();
    //在数据配置完成时候，接受一次最新的chart
    dsf.emit.$on(
      "updatePropertyChart",
      () => {
        this.chart = this.owner.chart;
        this.chart.tooltip = dsf.mix(true, {}, this.options, this.chart.tooltip);
        this._updateChart();
      },
      this.owner.$children[0]
    );
  },
  beforeDestroy() {
    dsf.emit.$remove("updatePropertyChart", this.owner.$children[0]);
  },
  computed: {
    getSeriesFields() {
      const series = this.chart.series;
      // maker字段
      let makers = [];
      //系列名
      let seriesNames = [];
      //名称字段
      let names = [];
      if (series.length > 1 && this.isOpenSeries) {
        for (let i = 1; i < series.length; i++) {
          makers.push({
            name: `图例_${i + 1}`,
            value: `marker_${i + 1}`,
          });
          seriesNames.push({
            name: `系列名_${i + 1}`,
            value: `seriesName_${i + 1}`,
          });
          names.push({
            name: `名称_${i + 1}`,
            value: `name_${i + 1}`,
          });
        }
      }

      return makers.concat(seriesNames).concat(names);
    },
    toolTipFields() {
      let staticFields = [];
      //如果图表是静态的,那么允许读取data中的字段
      if (this.owner.dataType === "static") {
        this.chart.series.forEach((item) => {
          let data = item.data;
          if (data.length && dsf.isObject(data[0])) {
            staticFields.push(...Object.keys(data[0]));
          }
        });
        staticFields.push({
          name: "值",
          value: "value",
        });
      }
      let mapFieldList = this.owner.$children[0].getDesignerMapFieldList();
      return this.toolTipExtraFields.concat(this.getSeriesFields).concat(mapFieldList).concat(staticFields);
    },
    fieldsStyleRules: {
      get() {
        return this.owner.fieldsStyleRules;
      },
      set(val) {
        this.owner.fieldsStyleRules = val;
      },
    },
    tooltip() {
      return this.chart.tooltip;
    },
  },
  methods: {
    changeFieldsStyleRules() {
      this.changeFormatter(true, "isFormatter");
    },
    changeFormatter(val, type) {
      let tooltip = this.tooltip;
      if (type === "isFormatter" && !val) {
        this.$set(tooltip, "formatter", undefined);
        return;
      }
      let _formatter = tooltip.formatter;
      let formatterHtml = tooltip.formatterHtml;
      let hasContent = dsf.dataview.utils.hasTextContent(formatterHtml);
      let fieldsStyleRules = this.fieldsStyleRules;
      let rulesString = dsf.unEval(fieldsStyleRules);
      if (hasContent) {
        let code = `var formatterHtml = ${JSON.stringify(formatterHtml)};
                    var fieldsStyleRules = ${rulesString};
                    var html = "";
            if (Array.isArray(params)) {
                //取第一个的params,同时注入多个marker 对象 多个系列名 多个名称
                var _params = params[0]
                if(params.length>1){
                  for(let i=1;i<params.length;i++){
                      let param = params[i]
                      _params["marker_"+(i+1)] = param.marker
                      //处理marker 颜色
                      _params["color_"+(i+1)] = param.color

                      _params["seriesName_"+(i+1)] = param.seriesName
                      _params["name_"+(i+1)] = param.name
                  }
                }
                params = _params
              }
              html= dsf.dataview.utils.analyzeToolTipHTMLAttr(
                formatterHtml,
                params,
                "chart",
                [],
                fieldsStyleRules
              );
            
            return html;`;
        this.$set(tooltip, "formatter", new Function("params", code));
      } else {
        this.$set(tooltip, "formatter", _formatter);
      }
      this._updateChart();
    },
    changeStyle(val, item, key) {
      let style = this.styleOptions.find((it) => it.value == val);
      this.$set(item, key, val);
      if (style) {
        const config = style.config;
        this.chart.tooltip = dsf.mix(true, {}, this.chart.tooltip, config);
      }
      this._updateChart();
    },
    changeValue(val, item, key) {
      if (!_.isEqual(item[key], val)) {
        this.$set(item, key, val);
        this._updateChart();
      }
    },
    changeIsFormatter(val, item, key) {
      if (!val) {
        this.$delete(this.tooltip, "formatter");
      }
      this.changeValue(val, item, key);
    },
    updateChart() {
      dsf.emit.$emit(
        "updateChart",
        {
          chart: this.chart,
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

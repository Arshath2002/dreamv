<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标记类型<span>： </span></div>
      <DesDVSelect :data="{ dictionary: dictionary }" :value="getSymbol(series.symbol)" @change="changeSymbol($event, series)" />
    </div>
    <div class="ds-designer-property property-item" v-show="getSymbol(series.symbol) === 'custom'">
      <div class="property-item-name">上传<span>： </span></div>
      <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="series.symbol"></el-input>
      <button class="upload-button el-button el-button--small">
        <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
        <input @change="changeSymbolImage($event, series, callBack)" type="file" class="upload-input" style="display: none" />
      </button>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标记大小<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolSize" @change="changeValue($event, series, 'symbolSize')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标记颜色<span>： </span></div>
      <DesDVColorPicker ref="tag" :config="bothConfig" v-model="tagColor" @change="changeColor($event, series.itemStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item ml10 float-one-row">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolOffset[0]" @change="changeArray($event, series, 'symbolOffset', 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolOffset[1]" @change="changeArray($event, series, 'symbolOffset', 1)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">使用基准值<span>： </span></div>
      <DesDVSwitch v-model="series.isBaseValue" @change="changeValue($event, series, 'isBaseValue')" />
    </div>
    <div class="ds-designer-property property-item float-one-row ml20" v-if="series.isBaseValue">
      <div class="property-item-name">基准值<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '' }" :value="series.baseValue" @change="changeValue($event, series, 'baseValue')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签<span>： </span></div>
      <DesDVSwitch v-model="series.label.show" @change="changeValue($event, series.label, 'show')" />
    </div>

    <template v-if="series.label.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">标签内容<span>： </span></div>
        <div>
          <div style="display: flex; align-items: center; margin-bottom: 5px" v-for="(formatter, index) in series.label.formatters" :key="index">
            <el-input size="small" :value="formatter" @input="changeFormatterValue($event, index)" class="data-view-text"></el-input>
            <div class="des-dv-icon-add" v-if="index == 0" @click="addFormat" style="margin: 0 5px">
              <i class="add-btn el-icon-plus"></i>
            </div>
            <div class="des-dv-icon-add" v-if="index > 0" @click="deleteItem(index)" style="margin: 0 5px">
              <i class="add-btn el-icon-minus"></i>
            </div>
          </div>
        </div>
        <DesDVToolTipsIcon
          style="margin-top: 1px"
          :data="{
            desc: '{a}=系列名; {b}=数据名; {c}=数据值;',
          }"
        ></DesDVToolTipsIcon>
      </div>

      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">字体<span>： </span></div>
        <DesDVNumber :config="{ min: 12, unit: 'px' }" :value="series.label.fontSize" @change="changeValue($event, series.label, 'fontSize')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name"></div>
        <DesDVColorPicker :config="colorConfig" v-model="series.label.color" @change="changeValue($event, series.label, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">偏移X<span>： </span></div>
        <DesDVNumber class="min" :config="{ min: 0, unit: 'px' }" :value="series.label.offset[0]" @change="changeArray($event, series.label, 'offset', 0)" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">偏移Y<span>： </span></div>
        <DesDVNumber class="min" :config="{ min: 0, unit: 'px' }" :value="series.label.offset[1]" @change="changeArray($event, series.label, 'offset', 1)" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">自定义<span>： </span></div>
        <DesDVSwitch :value="series.label.isFormatter" @change="changeValue($event, series.label, 'isFormatter')" />
        <DesDVToolTipsIcon
          style="margin-top: 1px"
          :data="{
            desc: '自定义标签内容，以配置总览函数为准',
          }"
        ></DesDVToolTipsIcon>
      </div>
    </template>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">动效<span>： </span></div>
      <DesDVSwitch v-model="hasEffect" @change="changeType" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="hasEffect">
      <div class="property-item-name">波纹类型<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: radios }" v-model="series.rippleEffect.brushType" @change="changeValue($event, series.rippleEffect, 'brushType')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="hasEffect">
      <div class="property-item-name">动画时长<span>： </span></div>
      <DesDVNumber :config="{ min: 1, unit: 's' }" :value="series.rippleEffect.period" @change="changeValue($event, series.rippleEffect, 'period')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="hasEffect">
      <div class="property-item-name">扩散比例<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '' }" :value="series.rippleEffect.scale" @change="changeValue($event, series.rippleEffect, 'scale')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="hasEffect">
      <div class="property-item-name">波纹颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="series.rippleEffect.color" @change="changeValue($event, series.rippleEffect, 'color')" />
    </div>
  </div>
</template>
<script>
import DesDVPixel from "../../../common/components/DesDVPixel.vue";
import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js";

export default {
  name: "DesDVScatterMap",
  components: { DesDVPixel },
  mixins: [svgAndImageUpload],
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  computed: {
    hasEffect: {
      get() {
        return this.series.type === "effectScatter";
      },
    },
  },
  data() {
    return {
      radios: [
        {
          text: "线",
          value: "stroke",
        },
        {
          text: "填充",
          value: "fill",
        },
      ],
      tagColor: "",
      bothConfig: {
        type: "both",
      },
      colorConfig: {
        type: "color",
      },
      symbols: ["circle", "rect", "roundRect", "triangle", "diamond", "pin", "arrow", "none"],
      dictionary: [
        {
          text: "圆",
          value: "circle",
        },
        {
          text: "矩形",
          value: "rect",
        },
        {
          text: "圆角矩形",
          value: "roundRect",
        },
        {
          text: "三角",
          value: "triangle",
        },
        {
          text: "钻石",
          value: "diamond",
        },
        {
          text: "默认",
          value: "pin",
        },
        {
          text: "箭头",
          value: "arrow",
        },
        {
          text: "自定义",
          value: "custom",
        },
        {
          text: "无",
          value: "none",
        },
      ],
    };
  },
  created() {
    const tagColor = this.series.itemStyle.color;
    this.tagColor = dsf.dataview.utils.convertChartToCSSColor(tagColor);

    this.init();
  },
  methods: {
    init() {
      const series = this.series;
      if (!Array.isArray(series.label.formatters)) {
        this.$set(this.series.label, "formatters", ["{b}:{c}"]);
      }
      // 是否自定义formatter
      if (Object.prototype.hasOwnProperty.call(this.series.label, "isFormatter")) {
        this.$set(this.series.label, "isFormatter", false);
      }
    },
    addFormat() {
      this.series.label.formatters.push("");
    },
    deleteItem(index) {
      this.series.label.formatters.splice(index, 1);
      this.$emit("updateChart");
    },
    changeFormatterValue(value, index) {
      this.$set(this.series.label.formatters, index, value);
      this.$emit("updateChart");
    },
    changeArray(val, item, key, index) {
      let arr = item[key];
      arr[index] = val;
      this.$set(item, key, arr);
      this.$emit("updateChart");
    },
    changeColor(val, item, key) {
      const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      if (!_.isEqual(item[key], color)) {
        this.$set(item, key, color);
        this.$emit("updateChart");
      }
    },
    getSymbol($symbol) {
      if (!this.symbols.includes($symbol)) {
        return "custom";
      } else {
        return $symbol;
      }
    },
    changeSymbol(e, item) {
      let val = "";
      if (e !== "custom") {
        val = e;
        this.$set(item, "symbol", val);
        this.$emit("updateChart");
      } else {
        this.$set(item, "symbol", val);
      }
    },
    callBack(val) {
      this.$set(this.series, "symbol", val);
      this.$emit("updateChart");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
    changeType(v) {
      if (v) {
        this.series.type = "effectScatter";
        this.$set(this.series, "effectType", "ripple");
        this.$set(this.series, "showEffectOn", "render");
        this.$set(this.series, "rippleEffect", {
          color: "rgb(255, 211, 126)",
          period: 4,
          scale: 5,
          brushType: "stroke",
        });
      } else {
        this.series.type = "scatter";
      }
      this.$emit("updateChart");
    },
  },
};
</script>

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">飞行线颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="series.lineStyle.color" @change="changeValue($event, series.lineStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name" style="margin-left: 0">飞行线宽度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.lineStyle.width" @change="changeValue($event, series.lineStyle, 'width')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">幅度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '', step: 0.1 }" :value="series.lineStyle.curveness" @change="changeValue($event, series.lineStyle, 'curveness')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">尾迹线透明度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '', step: 0.1 }" :value="series.lineStyle.opacity" @change="changeValue($event, series.lineStyle, 'opacity')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">两端标记类型<span>： </span></div>
      <DesDVSelect :data="{ dictionary: dictionary }" :value="getSymbol(series.symbol)" @change="changeSymbol($event, series)" />
    </div>
    <div class="ds-designer-property property-item" v-show="getSymbol(series.symbol) === 'custom'">
      <div class="property-item-name">上传<span>： </span></div>
      <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="series.symbol"></el-input>
      <button class="upload-button el-button el-button--small">
        <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 上传图片或svg </span>
        <input @change="changeSymbolImage($event, series, callBack)" type="file" class="upload-input" style="display: none" />
      </button>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name" style="margin-left: 0">两端标记大小<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.symbolSize" @change="changeValue($event, series, 'symbolSize')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">飞行动效<span>： </span></div>
      <DesDVSwitch v-model="series.effect.show" @change="changeValue($event, series.effect, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.effect.show">
      <div class="property-item-name">动效类型<span>： </span></div>
      <DesDVSelect :data="{ dictionary: dictionary }" :value="getSymbol(series.effect.symbol)" @change="changeSymbol($event, series.effect)" />
    </div>
    <div class="ds-designer-property property-item" v-show="series.effect.show && getSymbol(series.effect.symbol) === 'custom'">
      <div class="property-item-name">上传<span>： </span></div>
      <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="series.effect.symbol"></el-input>
      <button class="upload-button el-button el-button--small">
        <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 上传图片或svg </span>
        <input @change="changeSymbolImage($event, series.effect, callBack2)" type="file" class="upload-input" style="display: none" />
      </button>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.effect.show">
      <div class="property-item-name">图形大小<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.effect.symbolSize" @change="changeValue($event, series.effect, 'symbolSize')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.effect.show">
      <div class="property-item-name">动效时长<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 's' }" :value="series.effect.period" @change="changeValue($event, series.effect, 'period')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.effect.show">
      <div class="property-item-name">尾迹长度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px', step: 0.1 }" :value="series.effect.trailLength" @change="changeValue($event, series.effect, 'trailLength')" />
    </div>
  </div>
</template>
<script>


import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js";

export default {
  name: "DesDVFlyMap",
  mixins: [svgAndImageUpload],

  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
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
  methods: {
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
    callBack2(val) {
      this.$set(this.series.effect, "symbol", val);
      this.$emit("updateChart");
    },
    callBack(val) {
      this.$set(this.series, "symbol", val);
      this.$emit("updateChart");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
  },
};
</script>

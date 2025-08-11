<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">形状<span>： </span></div>
      <DesDVSelect :data="{ dictionary: markers }"  :value="getSymbol(series.symbol)" @change="changeSymbol($event, series)" />
    </div>
    <div class="ds-designer-property property-item" v-if="getSymbol(series.symbol) === 'custom'">
      <div class="property-item-name">上传<span>： </span></div>
      <el-input readonly="readonly" style="width: 108px; margin: 0 5px" placeholder="请输入内容" size="small" :value="series.symbol"></el-input>
      <button class="upload-button el-button el-button--small">
        <span @click.stop="uploadClick" style="display: flex; width: 100%; height: 100%"> 点击上传 </span>
        <input @change="changeSymbolImage($event, series)" type="file" class="upload-input" style="display: none" />
      </button>
    </div>
    <div class="ds-designer-property property-item ml20 float-one-row">
      <div class="property-item-name">宽度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0 }" :value="series.symbolSize[0]" @change="changeValue($event, series.symbolSize, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">高度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0 }" :value="series.symbolSize[1]" @change="changeValue($event, series.symbolSize, 1)" />
    </div>
    <div class="ds-designer-property property-item ml10 float-one-row">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVNumber class="min" :value="series.offset[0]" @change="changeValue($event, series.offset, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVNumber class="min" :value="series.offset[1]" @change="changeValue($event, series.offset, 1)" />
    </div>

    <commonLabel :label="series.label" @updateLabel="updateLabel" />
  </div>
</template>
<script>

import commonLabel from "./commonLabel.vue";
export default {
  name: "DesDVThreeMapMarker",
  components: {
 
    commonLabel
  },
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      symbols: ["default"],
       textConfig: {
        picker: { type: "color" },
      },
      markers: [
        {
          text: "默认",
          value: "default",
        },

        {
          text: "自定义",
          value: "custom",
        },
      ],
    };
  },
  methods: {
    updateLabel(){
      this.$emit("updateThree");
    },
    uploadClick(e) {
      if ($(e.target).next()?.click) {
        $(e.target).next().click();
      }
    },
    changeSymbolImage(e, item) {
      let file = e.target.files[0];
      const reader = new FileReader();
      // image转化逻辑
      reader.readAsDataURL(file);
      reader.onloadend = (ev) => {
        const result = ev.target.result;
        e.target.value = "";
        item.symbol = result;
        this.$emit("updateThree");
      };
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
        this.$emit("updateThree");
      } else {
        this.$set(item, "symbol", val);
      }
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateThree");
    },
  },
};
</script>

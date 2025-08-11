<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-07-11 10:54:12
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-12 18:53:02
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启热力<span>： </span></div>
      <DesDVSwitch v-model="visualMap.show" @change="changeValue($event, visualMap, 'show')" />
    </div>
    <template v-if="visualMap.show">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">热力模式<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: dictionary }"  :value="visualMap.mode" @change="changeValue($event, visualMap, 'mode')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="visualMap.mode == 'range'">
        <div class="property-item-name">渐变颜色<span>： </span></div>
        <DesDVMoreModeColor :config="{ limit: 2,allowDelete:false }" v-model="visualMap.color" @change="changeValue($event, visualMap, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-else>
        <DesThreePiecewise :pieces="visualMap.rules" @change="changeValue($event, visualMap, 'rules')" />
      </div>
      <div class="ds-designer-property property-item ml20 float-one-row" v-if="visualMap.mode == 'range'">
        <div class="property-item-name" style="min-width: 60px">最大值<span>： </span></div>
        <el-input style="width: 60px" class="data-view-dv-dsf-pixel" v-model="visualMap.max" @change="changeValue($event, visualMap, 'max')"></el-input>
      </div>
      <div class="ds-designer-property property-item ml10 float-one-row" v-if="visualMap.mode == 'range'">
        <div class="property-item-name">最小值<span>： </span></div>
        <el-input style="width: 60px" class="data-view-dv-dsf-pixel" v-model="visualMap.min" @change="changeValue($event, visualMap, 'max')"></el-input>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">标注<span>： </span></div>
        <DesDVSwitch v-model="visualMap.visualMap.show" @change="changeValue($event, visualMap.visualMap, 'show')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="visualMap.visualMap.show">
        <div class="property-item-name">两端文字<span>： </span></div>
        <el-input style="width: 60px" class="data-view-dv-dsf-pixel" v-model="visualMap.visualMap.maxText" @change="changeValue($event, visualMap.visualMap, 'maxText')"></el-input>
        <el-input style="width: 60px; margin-left: 10px" class="data-view-dv-dsf-pixel" v-model="visualMap.visualMap.minText" @change="changeValue($event, visualMap.visualMap, 'minText')"></el-input>
      </div>
      <div class="ds-designer-property property-item ml20" v-if="visualMap.visualMap.show">
        <div class="property-item-name">样式<span>： </span></div>
        <DesDVTextStyle v-model="visualMap.visualMap.textStyle" @change="changeValue($event, visualMap.visualMap, 'textStyle')"></DesDVTextStyle>
      </div>
      <div class="ds-designer-property property-item ml20 float-one-row" v-if="visualMap.visualMap.show">
        <div class="property-item-name">偏移X<span>： </span></div>
        <DesDVNumber class="min" :config="{ min: 0, unit: '%' }" :value="visualMap.visualMap.left | valueFilter" @change="changeValue($event + '%', visualMap.visualMap, 'left')" />
      </div>
      <div class="ds-designer-property property-item float-one-row" v-if="visualMap.visualMap.show">
        <div class="property-item-name">偏移Y<span>： </span></div>
        <DesDVNumber class="min" :config="{ min: 0, unit: '%' }" :value="visualMap.visualMap.top | valueFilter" @change="changeValue($event + '%', visualMap.visualMap, 'top')" />
      </div>
    </template>
  </div>
</template>
<script>

import DesThreePiecewise from "./piecewise.vue";
export default {
  name: "DesDVThreeHeatMap",
  components: {

    DesThreePiecewise,
    
  
  },
  props: {
    visualMap: {
      type: Object,
      require: true,
    },
  },
  filters: {
    valueFilter(val) {
      return +(val + "").replace(/%/g, "");
    },
  },
  data() {
    return {
      dictionary: [
        { text: "渐变", value: "range" },
        { text: "分段", value: "separate" },
      ],
    };
  },
  methods: {
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateThree");
    },
  },
};
</script>

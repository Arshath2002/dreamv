<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">形状<span>： </span></div>
      <DesDVSelect  :data="{ dictionary: dictionary }"  v-model="series.prismType" @change="changeValue($event, series, 'prismType')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">大小<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 5 }" v-model="series.size" @change="changeValue($event, series, 'size')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">最大高度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1 }" v-model="series.maxHeight" @change="changeValue($event, series, 'maxHeight')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">最小高度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1 }" v-model="series.minHeight" @change="changeValue($event, series, 'minHeight')" />
    </div>
    <div class="ds-designer-property property-item ml10 float-one-row">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVNumber class="min" :value="series.offset[0]" @change="changeValue($event, series.offset, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVNumber class="min" :value="series.offset[1]" @change="changeValue($event, series.offset, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体颜色<span>： </span></div>
    </div>
    <template v-if="series.prismType == 1">
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name">正面<span>： </span></div>
        <DesDVColorPicker class="cube-color" :config="{ type: 'linear', noArrow: true }" v-model="series.itemStyle.color[0]" @change="changeValue($event, series.itemStyle.color, 0)" />
      </div>
    </template>
    <template v-if="series.prismType == 2">
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name">正面<span>： </span></div>
        <DesDVColorPicker class="cube-color" :config="{ type: 'linear', noArrow: true }" v-model="series.itemStyle.color[0]" @change="changeValue($event, series.itemStyle.color, 0)" />
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name">顶面<span>： </span></div>
        <DesDVColorPicker class="cube-color" :config="{ type: 'linear', noArrow: true }" v-model="series.itemStyle.color[1]" @change="changeValue($event, series.itemStyle.color, 1)" />
      </div>
    </template>
    <template v-if="series.prismType == 3">
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name">正面<span>： </span></div>
        <DesDVColorPicker class="cube-color" :config="{ type: 'linear', noArrow: true }" v-model="series.itemStyle.color[0]" @change="changeValue($event, series.itemStyle.color, 0)" />
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name">侧面<span>： </span></div>
        <DesDVColorPicker class="cube-color" :config="{ type: 'linear', noArrow: true }" v-model="series.itemStyle.color[1]" @change="changeValue($event, series.itemStyle.color, 1)" />
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name">顶面<span>： </span></div>
        <DesDVColorPicker class="cube-color" :config="{ type: 'linear', noArrow: true }" v-model="series.itemStyle.color[2]" @change="changeValue($event, series.itemStyle.color, 2)" />
      </div>
    </template>

    <commonLabel :label="series.label" @updateLabel="updateLabel" />
  </div>
</template>
<script>



import commonLabel from "./commonLabel.vue";

export default {
  name: "DesDVThreeMapPrism",
  components: {   commonLabel },
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      dictionary: [
        {
          text: "平面柱",
          value: 1,
        },
        {
          text: "圆柱",
          value: 2,
        },
        {
          text: "棱柱",
          value: 3,
        },
      ],
    };
  },
  methods: {
    updateLabel() {
      this.$emit("updateThree");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateThree");
    },
  },
};
</script>

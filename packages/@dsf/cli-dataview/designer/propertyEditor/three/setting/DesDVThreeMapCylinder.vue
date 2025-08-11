<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-10-12 14:42:21
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:45:52
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">类型<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }"   :value="series.mode" @change="changeValue($event, series, 'mode')" />
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
    <div class="ds-designer-property property-item" v-if="series.mode === 'tower'">
      <div class="property-item-name">光柱颜色<span>： </span></div>
      <DesDVColorPicker :config="{ type: 'color' }" v-model="series.towerColor" @change="changeValue($event, series, 'towerColor')" />
    </div>
    <div class="ds-designer-property property-item" v-if="series.mode === 'cylinder'">
      <div class="property-item-name">圆柱颜色<span>： </span></div>
      <DesDVColorPicker key="linear" :config="{ type: 'linear' }" v-model="colorFilter" />
    </div>

    <commonLabel :label="series.label" @updateLabel="updateLabel" />
  </div>
</template>
<script>
//



import commonLabel from "./commonLabel.vue";
export default {
  name: "DesDVThreeMapCylinder",
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
          text: "圆柱",
          value: "cylinder",
        },
        {
          text: "光柱",
          value: "tower",
        },
      ],
    };
  },
  computed: {
    colorFilter: {
      get() {
        const val = this.series.color;
        return `linear-gradient(0deg,${val[0]} 0%, ${val[1]} 100%)`;
      },
      set(val) {
        const reg = /(rgb[a]?\(.*?\)|#[0-9A-z]{3,6})/g;
        const result = (val + "").match(reg);
        const [old_b, old_t] = this.series.color;
        if (result && result.length > 1) {
          const color = [result[0], result[1]];
          if (old_b != result[0] || old_t != result[1]) {
            this.$set(this.mapOptions.mirror, "color", color);
            this.$emit("updateThree");
          }
        }
      },
    },
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

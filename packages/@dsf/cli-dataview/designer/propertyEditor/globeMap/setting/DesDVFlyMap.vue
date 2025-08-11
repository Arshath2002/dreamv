<!--
 * @Description: echarts-gl 飞行线的属性
 * @Author: shenah
 * @Date: 2024-07-24 17:26:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:40:06
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">飞行线<span>： </span></div>
    </div>
    <!-- 飞行线 -->
    <template>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">颜色<span>： </span></div>
        <DesDVColorPicker
          :config="colorConfig"
          v-model="series.lineStyle.color"
          @change="changeValue($event, series.lineStyle, 'color')"
        />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div
          class="property-item-name"
          style="margin-left: 0"
        >宽度<span>： </span></div>
        <DesDVNumber
          :config="{ min: 0, unit: 'px' }"
          :value="series.lineStyle.width"
          @change="changeValue($event, series.lineStyle, 'width')"
        />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">透明度<span>： </span></div>
        <DesDVNumber
          :config="{ min: 0, unit: '', step: 0.1 }"
          :value="series.lineStyle.opacity"
          @change="changeValue($event, series.lineStyle, 'opacity')"
        />
      </div>
    </template>
    <!-- 动效 -->
    <div class="ds-designer-property property-item">
      <div class="property-item-name">尾迹<span>： </span></div>
      <DesDVSwitch
        v-model="series.effect.show"
        @change="changeValue($event, series.effect, 'show')"
      />
    </div>
    <template v-if="series.effect.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">长度<span>： </span></div>
        <DesDVNumber
          :config="{ min: 0, unit: 'px', step: 0.1 }"
          :value="series.effect.trailLength"
          @change="changeValue($event, series.effect, 'trailLength')"
        />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">宽度<span>： </span></div>
        <DesDVNumber
          :config="{ min: 1,step: 1 }"
          :value="series.effect.trailWidth "
          @change="changeValue($event, series.effect, 'trailWidth')"
        />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">颜色<span>： </span></div>
        <DesDVColorPicker
          :config="colorConfig"
          v-model="series.effect.trailColor"
          @change="changeValue($event, series.effect, 'trailColor')"
        />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">透明度<span>： </span></div>
        <DesDVNumber
          :config="{ min: 0, unit: '', step: 0.1 }"
          :value="series.effect.trailOpacity"
          @change="changeValue($event, series.effect, 'trailOpacity')"
        />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">速度<span>： </span></div>
        <DesDVNumber
          :config="{ min: 0, unit: 's' }"
          :value="series.effect.period"
          @change="changeValue($event, series.effect, 'period')"
        />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">颜色模式<span>： </span></div>
      <DesDVRadioGroup
        :data="{ dictionary: blendModeOptions }"
        :value="series.blendMode"
        @change="changeValue($event, series, 'blendMode')"
      ></DesDVRadioGroup>
    </div>
  </div>
</template>
<script>


export default {
  name: "DesDVFlyMap",
  mixins: [],

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
      blendModeOptions: [
        {
          text: "混合",
          value: "source-over",
        },
        {
          text: "叠加",
          value: "lighter",
        },
      ]
    };
  },
  methods: {
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
  },
};
</script>

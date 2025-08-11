<!--
 * @Description: 雷达盘
 * @Author: shenah
 * @Date: 2024-05-09 16:46:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 10:39:27
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">形状<span>： </span></div>
      <DesDVRadioGroup
        :data="{ dictionary: shapeOptions }"
        :value="series.shape"
        :fieldMap="{
          text: 'label',
          value: 'value',
        }"
        @change="changeItemValue($event, series, 'shape')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">大小<span>： </span></div>
      <DesDVPixel :options="percentOptions" :value="series.radius" @change="changeItemValue($event, series, 'radius')"></DesDVPixel>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">旋转角度<span>： </span></div>
      <DesDVNumber
        :value="series.startAngle"
        :config="{
          unit: '°',
        }"
        @change="changeItemValue($event, series, 'startAngle')"
      />
    </div>
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name">顶点字体<span>： </span></div>
      <DesDVPixel :value="series.name.textStyle.fontSize" :options="fontSizeUnitOptions" @change="changeItemValue($event, series.name.textStyle, 'fontSize')"></DesDVPixel>
    </div>
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name" style="min-width: 0px; display: none">
        顶点字体
        <span>： </span>
      </div>
      <DesDVColorPicker
        :config="{
          ...colorConfig,
          noInput: true,
        }"
        v-model="series.name.textStyle.color"
        @change="changeItemValue($event, series.name.textStyle, 'color')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        轴线颜色
        <span>： </span>
      </div>
      <DesDVColorPicker
        :config="{
          ...colorConfig,
          noInput: true,
        }"
        v-model="series.axisLine.lineStyle.color"
        @change="changeItemValue($event, series.axisLine.lineStyle, 'color')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        底盘颜色
        <span>： </span>
      </div>
      <DesDVMoreModeColor :config="colorConfig" :value="series.splitArea.areaStyle.color" @change="changeItemValue($event, series.splitArea.areaStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">分割份数<span>： </span></div>
      <DesDVNumber
        :value="series.splitNumber"
        :config="{
          unit: '份',
        }"
        @change="changeItemValue($event, series, 'splitNumber')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        分割线
        <span>： </span>
      </div>
      <DesDVColorPicker :config="colorConfig" v-model="series.splitLine.lineStyle.color" @change="changeItemValue($event, series.splitLine.lineStyle, 'color')" />
    </div>
    <!-- 轴线刻度 -->
    <template v-if="series.indicator && series.indicator.length > 0 && series.indicator[0].axisLabel">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">轴线刻度<span>： </span></div>
        <DesDVSwitch :value="series.indicator[0].axisLabel.show" @change="changeItemValue($event, series.indicator[0].axisLabel, 'show')" />
      </div>
      <!-- 轴线刻度 -->
      <template v-if="series.indicator[0].axisLabel.show">
        <div class="ds-designer-property property-item float-one-row">
          <div class="property-item-name ml20">轴线刻度字体<span>： </span></div>
          <DesDVPixel :value="series.indicator[0].axisLabel.fontSize" :options="fontSizeUnitOptions" @change="changeItemValue($event, series.indicator[0].axisLabel, 'fontSize')"></DesDVPixel>
        </div>
        <div class="ds-designer-property property-item float-one-row ml20">
          <div class="property-item-name" style="min-width: 0px; display: none">
            轴线刻度字体
            <span>： </span>
          </div>
          <DesDVColorPicker
            :config="{
              ...colorConfig,
              noInput: true,
            }"
            v-model="series.indicator[0].axisLabel.color"
            @change="changeItemValue($event, series.indicator[0].axisLabel, 'color')"
          />
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
export default {
  name: "DsfDVChartRadarDish",
  mixins: [itemMixin],
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      shapeOptions: [
        {
          label: "圆形",
          value: "circle",
        },
        {
          label: "区域形",
          value: "polygon",
        },
      ],
    };
  },
  computed: {},
  created() {},
  methods: {},
};
</script>

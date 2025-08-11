<!--
 * @Description: 词云系列详细属性
 * @Author: shenah
 * @Date: 2024-05-09 09:32:59
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-22 17:48:47
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">排列方式<span>： </span></div>
      <DesDVSelect
        :value="series.arrayMethod"
        :data="{ dictionary: arrayMOptions }"
        :fieldMap="{
          text: 'label',
          value: 'value',
        }"
        @change="changeItemValue($event, series, 'arrayMethod')"
      ></DesDVSelect>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示形状<span>： </span></div>
      <DesDVSelect
        :value="series.shape"
        :data="{ dictionary: shapeOptions }"
        :fieldMap="{
          text: 'label',
          value: 'value',
        }"
        @change="changeItemValue($event, series, 'shape')"
      ></DesDVSelect>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">字号范围<span>： </span></div>
      <DesDVNumber
        :value="series.sizeRange[0]"
        :config="{
          unit: 'px',
        }"
        @change="changeItemValue($event, series.sizeRange, 0)"
      ></DesDVNumber>
      <span class="ml10 mr10">-</span>
      <DesDVNumber
        :value="series.sizeRange[1]"
        :config="{
          unit: 'px',
        }"
        @change="changeItemValue($event, series.sizeRange, 1)"
      ></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">系列颜色<span>： </span></div>
      <DesDVMoreModeColor
        :config="{
          type: 'color',
          lastOneDel: true,
          colors: chartColorList,
        }"
        v-model="singleData"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">字体阴影<span>： </span></div>
      <DesDVSwitch :value="series.textStyle.showTextShadow" @change="changeItemValue($event, series.textStyle, 'showTextShadow')" />
    </div>
    <!-- 字体阴影 -->
    <template v-if="series.textStyle.showTextShadow">
      <div class="ds-designer-property property-item">
        <div class="property-item-name ml20">阴影颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="series.textStyle.textShadowColor" @change="changeItemValue($event, series.textStyle, 'textShadowColor')" />
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name" style="margin-left: 40px">
          位移X
          <span>：</span>
        </div>
        <DesDVNumber
          :value="series.textStyle.textShadowOffsetX"
          :config="{
            unit: 'px',
          }"
          @change="changeItemValue($event, series.textStyle, 'textShadowOffsetX')"
        ></DesDVNumber>
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name ml20">
          Y
          <span>：</span>
        </div>
        <DesDVNumber
          :value="series.textStyle.textShadowOffsetY"
          :config="{
            unit: 'px',
          }"
          @change="changeItemValue($event, series.textStyle, 'textShadowOffsetY')"
        ></DesDVNumber>
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name" style="margin-left: 34px">
          模糊度
          <span>：</span>
        </div>
        <DesDVNumber :value="series.textStyle.textShadowBlur" @change="changeItemValue($event, series.textStyle, 'textShadowBlur')"></DesDVNumber>
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">字体间距<span>： </span></div>
      <DesDVNumber class="min" :config="{ unit: 'px', min: 0 }" :value="series.gridSize" @change="changeItemValue($event, series, 'gridSize')" />
    </div>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
export default {
  name: "DsfDVChartWordCloudItem",
  mixins: [itemMixin],
  inject: ["owner"],
  props: {
    series: {
      type: Object,
      require: true,
    },
    chart: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      colors: [],
      arrayMethodObj: {
        horizontal: {
          rotationRange: [0, 0],
          rotationStep: 0,
        },
        vertical: {
          rotationRange: [90, 90],
          rotationStep: 0,
        },
        diagonal: {
          rotationRange: [45, 135],
          rotationStep: 90,
        },
        mixin: {
          rotationRange: [0, 90],
          rotationStep: 90,
        },
      },
      arrayMOptions: [
        {
          label: "横向",
          value: "horizontal",
        },
        {
          label: "竖向",
          value: "vertical",
        },
        {
          label: "对角线",
          value: "diagonal",
        },
        {
          label: "横竖混排",
          value: "mixin",
        },
      ],
      shapeOptions: [
        {
          label: "圆形",
          value: "circle",
        },
        {
          label: "心形",
          value: "cardioid",
        },
        {
          label: "砖石",
          value: "diamond",
        },
        {
          label: "向前三角形",
          value: "triangle-forward",
        },
        {
          label: "三角形",
          value: "triangle",
        },
        {
          label: "五边形",
          value: "pentagon",
        },
        {
          label: "星形",
          value: "star",
        },
      ],
    };
  },
  computed: {
    chartColorList() {
      return this.chart.color;
    },
    singleData: {
      get() {
        const colorList = this.chart.color;
        let singleData = this.series.singleData || [];
        singleData = singleData.length
          ? singleData
          : colorList.map((it) => {
              return {
                textStyle: {
                  color: it,
                },
              };
            });

        return singleData.map((item) => item.textStyle.color);
      },
      set(v) {
        const singleData = [];
        v.forEach((it) => {
          const color = dsf.dataview.utils.convertCSSToEChartsColor(it);
          singleData.push({
            textStyle: {
              color,
            },
          });
        });
        const len = singleData.length;
        this.series.data.forEach((it, index) => {
          if (singleData[index]) {
            it.textStyle = singleData[index % len].textStyle;
          }
        });
        this.series.singleData = singleData;
        this.$emit("updateChart");
      },
    },
  },
  methods: {
    getRandomColor() {
      const r = Math.floor(Math.random() * 256); //生成红色0-255
      const g = Math.floor(Math.random() * 256); //生成绿色0-255
      const b = Math.floor(Math.random() * 256); //生成蓝色0-255
      return `rgb(${r},${g},${b})`;
    },
    changeSpecialItemKey(val, item, key) {
      if (key === "arrayMethod") {
        let oneObj = this.arrayMethodObj[val];
        item.rotationRange = oneObj.rotationRange;
        item.rotationStep = oneObj.rotationStep;
      } else if (key === "showTextShadow") {
        let textShadowColor = item.textShadowColor;
        let copyTextShadowColor = item.copyTextShadowColor;
        if (val) {
          item.textShadowColor = copyTextShadowColor;
        } else {
          if (textShadowColor) {
            item.copyTextShadowColor = textShadowColor;
            item.textShadowColor = "";
          }
        }
      } else if (key === "isRandomColor") {
        if (val) {
          // 随机颜色
          item.oldColor = item.color;
          item.color = this.getRandomColor();
        } else {
          item.color = item.oldColor || this.chart.color[0];
        }
      }
    },
  },
};
</script>

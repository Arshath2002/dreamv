<!--
 * @Description: 热词的属性
 * @Author: shenah
 * @Date: 2024-04-26 16:19:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:19:36
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">布局方式<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: layoutOptions }"  v-model="series.layout" @change="changeItemValue($event, series, 'layout')" />
    </div>
    <template v-if="series.layout === 'force'">
      <div class="ds-designer-property property-item">
        <div class="property-item-name ml20">节点斥力<span>： </span></div>
        <DesDVNumber :value="series.force.repulsion" @change="changeItemValue($event, series.force, 'repulsion')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">气泡大小<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: bubbleSizeOptions }" v-model="series.bubbleSizeType" @change="changeItemValue($event, series, 'bubbleSizeType')" />
    </div>
    <div class="ds-designer-property property-item float-one-row" v-if="series.layout == 'force'">
      <div class="property-item-name">大小数值<span>： </span></div>
      <DesDVNumber :value="series.maxSymbolSize" @change="changeItemValue($event, series, 'maxSymbolSize')" />
    </div>
    <div class="ds-designer-property property-item float-one-row" v-if="series.layout == 'none'">
      <div class="property-item-name">间隙<span>： </span></div>
      <DesDVNumber :value="series.padding || 10" @change="changeItemValue($event, series, 'padding')" />
      <DesDVToolTipsIcon
        :data="{
          desc: '默认布局大小通过间隙控制',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div style="clear: both"></div>
    <div class="property-flex-wrap">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">名称字体<span>： </span></div>
        <DesDVNumber
          :value="series.nameFontSize || 14"
          :config="{
            unit: 'px',
          }"
          @change="changeItemValue($event, series, 'nameFontSize')"
        ></DesDVNumber>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name two" style="min-width: 0px; display: none">
          名称字体
          <span>： </span>
        </div>
        <DesDVColorPicker
          :config="{
            ...colorConfig,
            noInput: true,
          }"
          v-model="series.nameColor"
          @change="changeItemColor($event, series, 'nameColor')"
        />
      </div>
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name ml20">
        名称换行字数
        <span>： </span>
      </div>
      <DesDVNumber
        :value="series.nameSplit"
        :config="{
          unit: '字',
        }"
        @change="changeItemValue($event, series, 'nameSplit')"
      ></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        数值
        <span>： </span>
      </div>
      <DesDVSwitch :value="valueFlag" @change="changeItemValue($event, series, 'valueFlag')" />
    </div>
    <!-- 数值开启 -->
    <template v-if="valueFlag">
      <div class="property-flex-wrap">
        <div class="ds-designer-property property-item">
          <div class="property-item-name" style="margin-left: 30px">数值字体<span>： </span></div>
          <DesDVNumber
            :value="series.valueFontSize || 14"
            :config="{
              unit: 'px',
            }"
            @change="changeItemValue($event, series, 'valueFontSize')"
          ></DesDVNumber>
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name two" style="min-width: 0px; display: none">
            数值字体
            <span>： </span>
          </div>
          <DesDVColorPicker
            :config="{
              ...colorConfig,
              noInput: true,
            }"
            v-model="series.valueColor"
            @change="changeItemColor($event, series, 'valueColor')"
          />
        </div>
      </div>
      <div class="property-flex-wrap">
        <div class="ds-designer-property property-item">
          <div class="property-item-name" style="margin-left: 30px">单位字体<span>： </span></div>
          <DesDVNumber
            :value="series.unitFontSize || 14"
            :config="{
              unit: 'px',
            }"
            @change="changeItemValue($event, series, 'unitFontSize')"
          ></DesDVNumber>
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name two" style="min-width: 0px; display: none">
            单位字体
            <span>： </span>
          </div>
          <DesDVColorPicker
            :config="{
              ...colorConfig,
              noInput: true,
            }"
            v-model="series.unitColor"
            @change="changeItemColor($event, series, 'unitColor')"
          />
        </div>
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        占比
        <span>： </span>
      </div>
      <DesDVSwitch :value="proportionFlag" @change="changeItemValue($event, series, 'proportionFlag')" />
    </div>
    <!-- 占比开启 -->
    <template v-if="proportionFlag">
      <div class="property-flex-wrap">
        <div class="ds-designer-property property-item">
          <div class="property-item-name ml20">字体<span>： </span></div>
          <DesDVNumber
            :value="series.proportionFontSize || 12"
            :config="{
              unit: 'px',
            }"
            @change="changeItemValue($event, series, 'proportionFontSize')"
          ></DesDVNumber>
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name two" style="min-width: 0px; display: none">
            字体
            <span>： </span>
          </div>
          <DesDVColorPicker
            :config="{
              ...colorConfig,
              noInput: true,
            }"
            v-model="series.proportionColor"
            @change="changeItemColor($event, series, 'proportionColor')"
          />
        </div>
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        TOP排名
        <span>： </span>
      </div>
      <DesDVSwitch :value="topFlag" @change="changeItemValue($event, series, 'topFlag')" />
    </div>
    <!-- TOP排名开启 -->
    <template v-if="topFlag">
      <div class="ds-designer-property property-item">
        <div class="property-item-name ml20">显示TOP<span>： </span></div>
        <DesDVNumber
          :value="series.topNum || 3"
          :config="{
            unit: '个',
          }"
          @change="changeItemValue($event, series, 'topNum')"
        ></DesDVNumber>
      </div>
      <div class="property-flex-wrap">
        <div class="ds-designer-property property-item">
          <div class="property-item-name ml20">字体<span>： </span></div>
          <DesDVNumber
            :value="series.topFontSize || 14"
            :config="{
              unit: 'px',
            }"
            @change="changeItemValue($event, series, 'topFontSize')"
          ></DesDVNumber>
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name two" style="min-width: 0px; display: none">
            字体
            <span>： </span>
          </div>
          <DesDVColorPicker
            :config="{
              ...colorConfig,
              noInput: true,
            }"
            v-model="series.topColor"
            @change="changeItemColor($event, series, 'topColor')"
          />
        </div>
      </div>
    </template>
    <!-- 系列色 -->
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        系列颜色
        <span>： </span>
      </div>
      <DesDVMoreModeColor
        ref="DesDVMoreModeColor"
        :config="{
          type: 'both',
          colors: chartColorList,
        }"
        :value="seriesColorList"
        @change="changeItemValue($event, series, 'seriesColorList')"
      />
    </div>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
export default {
  name: "DesDVChartHotWordItem",
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
      layoutOptions: [
        {
          text: "默认布局",
          value: "none",
        },
        {
          text: "力引导布局",
          value: "force",
        },
      ],
      bubbleSizeOptions: [
        {
          text: "数值计算",
          value: "auto",
        },
        {
          text: "固定大小",
          value: "fixed",
        },
      ],
    };
  },
  computed: {
    seriesColorList: {
      get() {
        return this.series.seriesColorList || [];
      },
      set(v) {
        this.$set(this.series, "seriesColorList", seriesColorList);
      },
    },
    valueFlag() {
      if (typeof this.series.valueFlag === "boolean") {
        return this.series.valueFlag;
      }
      return true;
    },
    proportionFlag() {
      if (typeof this.series.proportionFlag === "boolean") {
        return this.series.proportionFlag;
      }
      return true;
    },
    topFlag() {
      if (typeof this.series.topFlag === "boolean") {
        return this.series.topFlag;
      }
      return true;
    },
    chartColorList() {
      return this.chart.color;
    },
  },
  created() {
    if (this.series.colorList) {
      const seriesColorList = this.series.colorList.map((item) => `radial-gradient(circle at 50% 50%,${item.startColor} 0%, ${item.endColor} 100%)`);
      this.$set(this.series, "seriesColorList", seriesColorList);
      Reflect.deleteProperty(this.series,'colorList')
    }
  
  },

  methods: {
    changeSeriesColor(val, item, key) {
      let oldFlag = _.isEqual(item[key], val);
      if (!oldFlag) {
        val.forEach((str, index) => {
          const color = dsf.dataview.utils.convertCSSToEChartsColor(str);
          let one = this.series.data[index];
          if (one) {
            if (one.itemStyle) {
              this.$set(one.itemStyle, "color", color);
            } else {
              this.$set(one, "itemStyle", {
                color,
              });
            }
          }
        });
        this.$set(item, key, val);
        this.$emit("updateChart");
      }
    },
    changeSpecialItemKey(val, item, key) {
      if (key === "maxSymbolSize") {
        val = Number(val);
        this.series.data.forEach((v) => {
          v.symbolSize = 100 * val;
        });
        this.$set(this.series, "data", this.series.data);
      }
    },
  },
};
</script>

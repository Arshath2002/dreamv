<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-06-12 20:12:56
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 10:06:49
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体类型<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="flatBar.barType" @change="changeValue($event, flatBar, 'barType')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">宽<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="flatBar.itemStyle.width" @change="changeValue($event, flatBar.itemStyle, 'width')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">偏移量<span>： </span></div>
      <DesDVNumber v-model="flatBar.itemStyle.offset[0]" @change="changeValue($event, flatBar.itemStyle.offset, 0)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">大小模式<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: size }" :value="flatBar.itemStyle.isCalcHeight" @change="changeModelValue($event, flatBar.itemStyle, 'isCalcHeight')" />
    </div>
    <template v-if="flatBar.itemStyle.isCalcHeight">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">基础值<span>： </span></div>
        <DesDVNumber :config="{ min: 0 }" v-model="flatBar.itemStyle.basicHeight" @change="changeValue($event, flatBar.itemStyle, 'basicHeight')" />
        <DesDVToolTipsIcon
          style="margin-top: 2px"
          :data="{
            desc: '计算公式：大小范围的最大值 *值/基准值',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">大小范围<span>： </span></div>
        <DesDVNumber :config="{ min: 0 }" v-model="flatBar.itemStyle.heightMin" @change="changeValue($event, flatBar.itemStyle, 'heightMin')" />&nbsp;~&nbsp;
        <DesDVNumber :config="{ min: 0 }" v-model="flatBar.itemStyle.heightMax" @change="changeValue($event, flatBar.itemStyle, 'heightMax')" />
      </div>
    </template>
    <div class="ds-designer-property property-item ml20" v-else>
      <div class="property-item-name">圆柱高度<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="flatBar.itemStyle.height" @change="changeValue($event, flatBar.itemStyle, 'height')" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启色阶<span>： </span></div>
      <DesDVSwitch :value="flatBar.itemStyle.range.show" @change="changeValue($event, flatBar.itemStyle.range, 'show')" />
    </div>
    <template v-if="flatBar.itemStyle.range.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">色阶模式<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: colorDictionary }" :value="flatBar.itemStyle.range.mode" @change="changeValue($event, flatBar.itemStyle.range, 'mode')" />
      </div>
      <template v-if="flatBar.itemStyle.range.mode == 'range'">
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">渐变颜色<span>： </span></div>
          <DesDVMoreModeColor :config="{ limit: 2, allowDelete: false }" v-model="flatBar.itemStyle.range.color" @change="changeValue($event, flatBar.itemStyle.range, 'color')" />
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">范围值<span>： </span></div>
          <DesDVNumber :config="{ min: 0 }" v-model="flatBar.itemStyle.range.min" @change="changeValue($event, flatBar.itemStyle.range, 'min')" />&nbsp;~&nbsp;
          <DesDVNumber :config="{ min: 0 }" v-model="flatBar.itemStyle.range.max" @change="changeValue($event, flatBar.itemStyle.range, 'max')" />
        </div>
      </template>

      <div class="ds-designer-property property-item ml20" v-else>
        <DesDVThreePiecewise :pieces="flatBar.itemStyle.range.rules" @change="changeValue($event, flatBar.itemStyle.range, 'rules')" />
      </div>
    </template>
    <template v-else>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">{{ flatBar.barType == 1 ? "圆柱颜色" : "顶面颜色" }}<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="flatBar.itemStyle.topColor" @change="changeValue($event, flatBar.itemStyle, 'topColor')" />
      </div>

      <div class="ds-designer-property property-item" v-if="flatBar.barType == 2">
        <div class="property-item-name">柱体颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="flatBar.itemStyle.sideLeftColor" @change="changeValue($event, flatBar.itemStyle, 'sideLeftColor')" />
      </div>
      <template v-if="flatBar.barType == 3">
        <div class="ds-designer-property property-item">
          <div class="property-item-name">左侧颜色<span>： </span></div>
          <DesDVColorPicker :config="colorConfig" v-model="flatBar.itemStyle.sideLeftColor" @change="changeValue($event, flatBar.itemStyle, 'sideLeftColor')" />
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">右侧颜色<span>： </span></div>
          <DesDVColorPicker :config="colorConfig" v-model="flatBar.itemStyle.sideRightColor" @change="changeValue($event, flatBar.itemStyle, 'sideRightColor')" />
        </div>
      </template>
      <template v-if="flatBar.barType == 1">
        <div class="ds-designer-property property-item">
          <div class="property-item-name">轮廓宽度<span>： </span></div>
          <DesDVNumber :config="{ min: 0 }" v-model="flatBar.itemStyle.borderWidth" @change="changeValue($event, flatBar.itemStyle, 'borderWidth')" />
        </div>
        <div class="ds-designer-property property-item">
          <div class="property-item-name">轮廓颜色<span>： </span></div>
          <DesDVColorPicker :config="colorConfig" v-model="flatBar.itemStyle.borderColor" @change="changeValue($event, flatBar.itemStyle, 'borderColor')" />
        </div>
      </template>
    </template>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示层级<span>： </span></div>
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="flatBar.zooms[0]" @change="changeValue($event, flatBar.zooms, 0)" />&nbsp;~&nbsp;
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="flatBar.zooms[1]" @change="changeValue($event, flatBar.zooms, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图例显示<span>： </span></div>
      <DesDVSwitch :value="legend.show" @change="changeValue($event, legend, 'show')" />
    </div>
  </div>
</template>
<script>
import DesDVThreePiecewise from "../../three/setting/piecewise.vue";
export default {
  name: "FlatBarLayer",
  components: { DesDVThreePiecewise },
  props: {
    layer: {
      type: Object,
      require: true,
    },
  },
  computed: {
    flatBar() {
      return this.layer.flatBar;
    },

    legend() {
      return this.layer.legend;
    },
  },
  data() {
    return {
      colorConfig: {
        type: "color",
      },
      size: [
        { text: "固定大小", value: false },
        { text: "自定计算", value: true },
      ],
      colorDictionary: [
        { text: "渐变", value: "range" },
        { text: "分段", value: "separate" },
      ],
      dictionary: [
        { text: "平面柱", value: "1" },
        { text: "圆柱", value: "2" },
        { text: "三棱柱", value: "3" },
      ],
    };
  },
  methods: {
    changeModelValue(val, item, key) {
      this.$set(item, key, val);
      if (!val) {
        this.$set(this.flatBar.itemStyle, "height", 100);
      } else {
        this.setDynamicHeight();
      }
      this.updateGisLayer();
    },

    setDynamicHeight() {
      const val = this.flatBar.itemStyle.isCalcHeight;
      if (val) {
        const min = this.flatBar.itemStyle.heightMin;
        const max = this.flatBar.itemStyle.heightMax;
        const basic = this.flatBar.itemStyle.basicHeight;
        const code = `var min = ${min};
                  var max = ${max};
                  var basic = ${basic};
                  var val = f.properties.value * 1;
                  if (dsf.isNumber(val)) {
                    var size = val / basic * max;
                    if (size > max) {
                      size = max;
                    } else if (size < min) {
                      size = min;
                    }
                    return size
                  } else {
                    return min;
                  } `;
        this.$set(this.flatBar.itemStyle, "height", new Function("f", code));
      }
    },

    updateGisLayer() {
      this.$emit("updateGisLayer");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);

      this.setDynamicHeight();

      this.updateGisLayer();
    },
  },
};
</script>

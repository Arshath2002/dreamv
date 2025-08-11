<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-06-12 16:05:45
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 09:45:44
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">圆点颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="point.itemStyle.color" @change="changeValue($event, point.itemStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启悬浮<span>： </span></div>
      <DesDVSwitch :value="point.emphasis.show" @change="changeValue($event, point.emphasis, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="point.emphasis.show">
      <div class="property-item-name">悬浮颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="point.emphasis.itemStyle.color" @change="changeValue($event, point.emphasis.itemStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">圆点轮廓<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="point.itemStyle.borderWidth" @change="changeValue($event, point.itemStyle, 'borderWidth')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">轮廓颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="point.itemStyle.borderColor" @change="changeValue($event, point.itemStyle, 'borderColor')" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">大小模式<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="point.itemStyle.isCalcSize" @change="changeModelValue($event, point.itemStyle, 'isCalcSize')" />
    </div>
    <template v-if="point.itemStyle.isCalcSize">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">基础值<span>： </span></div>
        <DesDVNumber :config="{ min: 0 }" v-model="point.itemStyle.basicSize" @change="changeValue($event, point.itemStyle, 'basicSize')" />
        <DesDVToolTipsIcon
          style="margin-top: 2px"
          :data="{
            desc: '计算公式：大小范围的最大值 *值/基准值',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">大小范围<span>： </span></div>
        <DesDVNumber :config="{ min: 0 }" v-model="point.itemStyle.sizeMin" @change="changeValue($event, point.itemStyle, 'sizeMin')" />&nbsp;~&nbsp;
        <DesDVNumber :config="{ min: 0 }" v-model="point.itemStyle.sizeMax" @change="changeValue($event, point.itemStyle, 'sizeMax')" />
      </div>
    </template>
    <div class="ds-designer-property property-item ml20" v-else>
      <div class="property-item-name">圆点大小<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="point.itemStyle.size" @change="changeValue($event, point.itemStyle, 'size')" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示层级<span>： </span></div>
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="point.zooms[0]" @change="changeValue($event, point.zooms, 0)" />&nbsp;~&nbsp;
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="point.zooms[1]" @change="changeValue($event, point.zooms, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图例显示<span>： </span></div>
      <DesDVSwitch :value="legend.show" @change="changeValue($event, legend, 'show')" />
    </div>
    <!-- 标签设置 -->
    <LabelConfig :label="label" @updateGisLayer="updateGisLayer" />
  </div>
</template>
<script>
import LabelConfig from "./LabelConfig.vue";
export default {
  name: "PointLayer",
  props: {
    layer: {
      type: Object,
      require: true,
    },
  },
  components: { LabelConfig },
  computed: {
    point() {
      return this.layer.point;
    },
    label() {
      return this.layer.label;
    },
    legend() {
      return this.layer.legend;
    },
  },
  data() {
    return {
      dictionary: [
        { text: "固定大小", value: false },
        { text: "自定计算", value: true },
      ],
      colorConfig: {
        type: "color",
      },
    };
  },
  methods: {
    changeModelValue(val, item, key) {
      this.$set(item, key, val);
      if (!val) {
        this.$set(this.point.itemStyle, "size", 20);
      } else {
        this.setDynamicSize();
      }
      this.updateGisLayer();
    },

    setDynamicSize() {
      const itemStyle = this.point.itemStyle;
      const val = this.point.itemStyle.isCalcSize;
      if (val) {
        const min = itemStyle.sizeMin;
        const max = itemStyle.sizeMax;
        const basic = itemStyle.basicSize;
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
        this.$set(itemStyle, "size", new Function("f", code));
      }
    },

    updateGisLayer() {
      this.$emit("updateGisLayer");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.setDynamicSize()
      this.updateGisLayer();
    },
  },
};
</script>

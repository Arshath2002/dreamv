<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-24 11:21:32
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:20:21
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item" v-if="axis.type !== 'category'">
      <div class="property-item-name">分割段数<span>： </span></div>
      <DesDVNumber :config="{ min: 1 }" :value="axis.splitNumber" @change="changeValue($event, axis, 'splitNumber')" />
      <DesDVToolTipsIcon
        :data="{
          desc: '这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整',
        }"
      >
      </DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">展示位置<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" v-model="axis.position" @change="changeValue($event, axis, 'position')" />
    </div>

    <template v-if="isValue">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">轴起始值<span>： </span></div>
        <DesDVPixel
          :options="[
            {
              value: '',
              label: 'fx',
            },
          ]"
          :value="axis.min"
          @change="changeValue($event, axis, 'min')"
        />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">轴最大值<span>： </span></div>
        <DesDVPixel
          :options="[
            {
              value: '',
              label: 'fx',
            },
          ]"
          :value="axis.max"
          @change="changeValue($event, axis, 'max')"
        />
      </div>
    </template>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">轴数据反转<span>： </span></div>
      <DesDVSwitch :value="axis.inverse" @change="changeValue($event, axis, 'inverse')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">轴标签展示<span>： </span></div>
      <DesDVSwitch v-model="axis.axisLabel.show" @change="changeValue($event, axis.axisLabel, 'show')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.axisLabel.show">
      <div class="property-item-name">自适应展示<span>： </span></div>
      <DesDVSwitch :config="{ activeValue: 0, inactiveValue: 1 }" v-model="axis.axisLabel.interval" @change="changeValue($event, axis.axisLabel, 'interval')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.axisLabel.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="textStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.axisLabel.show">
      <div class="property-item-name">标签旋转<span>： </span></div>
      <DesDVNumber :config="{ min: -90, unit: 'deg' }" :value="axis.axisLabel.rotate" @change="changeValue($event, axis.axisLabel, 'rotate')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">轴名称展示<span>： </span></div>
      <DesDVSwitch v-model="nameShow"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item float-one-row ml40" v-if="nameShow">
      <div class="property-item-name">名称<span>： </span></div>
      <SelectInput :value="axis.name" v-if="isX" :mapFieldList="mapFieldList" @input="changeValue($event, axis, 'name')" />
      <SelectInput :value="axis.nameRelation" v-else :mapFieldList="mapFieldList" @input="changeValue($event, axis, 'nameRelation')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="nameShow">
      <div class="property-item-name">名称样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.nameShow">
      <div class="property-item-name"></div>
      <Direction
        class="horizontal-items"
        type="horizontal"
        v-if="isX"
        v-model="axis.nameLocation"
        :mapData="[
          { mapName: 'start', mapKey: 'left' },
          { mapName: 'center', mapKey: 'center' },
          { mapName: 'end', mapKey: 'right' },
        ]"
        @input="changeValue($event, axis, 'nameLocation')"
      ></Direction>
      <Direction
        class="vertical-items"
        type="vertical"
        v-else
        v-model="axis.nameLocation"
        :mapData="[
          { mapName: 'start', mapKey: 'bottom' },
          { mapName: 'center', mapKey: 'middle' },
          { mapName: 'end', mapKey: 'top' },
        ]"
        @input="changeValue($event, axis, 'nameLocation')"
      ></Direction>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.nameShow">
      <div class="property-item-name">名称轴距<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="axis.nameGap" @change="changeValue($event, axis, 'nameGap')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示轴线<span>： </span></div>
      <DesDVSwitch v-model="axis.axisLine.show" @change="changeValue($event, axis.axisLine, 'show')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.axisLine.show">
      <div class="property-item-name">轴线颜色<span>： </span></div>
      <DesDVColorPicker v-model="axis.axisLine.lineStyle.color" :config="colorConfig" @change="changeValue($event, axis.axisLine.lineStyle, 'color')"></DesDVColorPicker>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示刻度<span>： </span></div>
      <DesDVSwitch v-model="axis.axisTick.show" @change="changeValue($event, axis.axisTick, 'show')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.axisTick.show">
      <div class="property-item-name">刻度对齐<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: algins }" v-model="axis.axisTick.alignWithLabel" @change="changeValue($event, axis.axisTick, 'alignWithLabel')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示分割线<span>： </span></div>
      <DesDVSwitch v-model="axis.splitLine.show" @change="changeValue($event, axis.splitLine, 'show')"></DesDVSwitch>
    </div>
    <template v-if="axis.splitLine.show">
      <div class="ds-designer-property property-item ml10">
        <div class="property-item-name">分割线颜色<span>： </span></div>
        <DesDVColorPicker v-model="axis.splitLine.lineStyle.color" :config="colorConfig" @change="changeValue($event, axis.splitLine.lineStyle, 'color')"></DesDVColorPicker>
      </div>
      <div class="ds-designer-property property-item ml10">
        <div class="property-item-name">分割线类型<span>： </span></div>
        <DesDVRadioGroup
          :data="{ dictionary: borderTypeList }"
          :fieldMap="{
            text: 'label',
            value: 'value',
          }"
          v-model="axis.splitLine.lineStyle.type"
          @change="changeValue($event, axis.splitLine.lineStyle, 'type')"
        />
      </div>
    </template>
  </div>
</template>
<script>
import { borderTypeList } from "../attrConfig.js";

import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";

import SelectInput from "_dataview/designer/setting/graph/selectInput";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "chartAxis",
  components: { Direction, SelectInput },
  mixins: [commonMixin],
  props: {
    mapFieldList: {
      type: Array,
      require: true,
    },
    axis: {
      type: Object,
      require: true,
    },
    chart: {
      type: Object,
      require: true,
    },
    //是否是x轴数据
    isX: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      borderTypeList,
      seriesTypes: {
        bar: "柱体",
        line: "折线",
      },
      colorConfig: {
        type: "color",
      },
      algins: [
        { text: "对齐", value: true },
        { text: "不对齐", value: false },
      ],
    };
  },
  computed: {
    nameShow: {
      get() {
        let val = this.axis.nameRelation;
        return !!val || this.axis.nameShow;
      },
      set(v) {
        let field = "nameRelation";
        if (!v) {
          this.$set(this.axis, field, "");
          this.$set(this.axis, "nameShow", false);
        } else {
          this.$set(this.axis, "nameShow", true);
        }
        this.$emit("updateChart");
      },
    },
    //是否是数值轴
    isValue() {
      return this.axis.type === "value";
    },
    textStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.axis.axisLabel;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.axis.axisLabel, v);
        this.$emit("updateChart");
      },
    },
    nameTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.axis.nameTextStyle;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.axis.nameTextStyle, v);
        this.$emit("updateChart");
      },
    },
    dictionary() {
      return this.isX
        ? [
            { text: "下方", value: "bottom" },
            { text: "上方", value: "top" },
          ]
        : [
            { text: "左方", value: "left" },
            { text: "右方", value: "right" },
          ];
    },
  },
  methods: {
    changeValue(val, item, key) {
      if (["min", "max"].indexOf(key) > -1 && val?.length === 0) {
        this.$set(item, key, undefined);
      } else {
        this.$set(item, key, val);
      }
      this.$emit("updateChart");
    },
  },
};
</script>

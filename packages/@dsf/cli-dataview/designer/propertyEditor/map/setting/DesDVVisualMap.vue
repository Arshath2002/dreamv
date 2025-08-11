<!--
 * @Editor: zhanghang
 * @Description:热力图
 * @Date: 2024-04-15 10:16:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-23 11:27:36
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启热力<span>： </span></div>
      <DesDVSwitch v-model="isVisualMap" />
    </div>
    <template v-if="isVisualMap">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">热力模式<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="visualMap.type" @change="changeValue($event, visualMap, 'type')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="visualMap.type == 'continuous'">
        <div class="property-item-name">渐变颜色<span>： </span></div>
        <DesDVMoreModeColor ref="DesDVMoreModeColor" v-model="visualMap.inRange.color" @change="changeColors($event)" />
      </div>
      <div class="ds-designer-property property-item ml20" v-else>
        <DesDVPiecewise :pieces="visualMap.pieces" @change="changeValue($event, visualMap, 'pieces')" />
      </div>
      <!-- 整体标注 -->
      <template v-if="isShowAnnotation">
        <div class="ds-designer-property property-item">
          <div class="property-item-name">标注<span>： </span></div>
          <DesDVSwitch v-model="visualMap.show" @change="changeValue($event, visualMap, 'show')" />
        </div>
        <div class="ds-designer-property property-item" v-if="visualMap.show">
          <div class="property-item-name">排列<span>： </span></div>
          <DesDVRadioGroup :data="{ dictionary: direction }" :value="visualMap.orient" @change="changeValue($event, visualMap, 'orient')" />
        </div>
        <div class="ds-designer-property property-item ml20 float-one-row" v-if="visualMap.show">
          <div class="property-item-name" style="min-width: 60px">最大值<span>： </span></div>
          <el-input style="width: 60px" class="data-view-dv-dsf-pixel" v-model="visualMap.max" @change="changeValue($event, visualMap, 'max')"></el-input>
        </div>
        <div class="ds-designer-property property-item ml10 float-one-row" v-if="visualMap.show">
          <div class="property-item-name">最小值<span>： </span></div>
          <el-input style="width: 60px" class="data-view-dv-dsf-pixel" v-model="visualMap.min" @change="changeValue($event, visualMap, 'max')"></el-input>
        </div>
        <div class="ds-designer-property property-item ml20" v-if="visualMap.show">
          <div class="property-item-name">两端文字<span>： </span></div>
          <el-input style="width: 60px" class="data-view-dv-dsf-pixel" v-model="visualMap.text[0]" @change="changeText($event, 0)"></el-input>
          <el-input style="width: 60px; margin-left: 10px" class="data-view-dv-dsf-pixel" v-model="visualMap.text[1]" @change="changeText($event, 1)"></el-input>
        </div>
        <div class="ds-designer-property property-item ml20" v-if="visualMap.show">
          <div class="property-item-name">字体<span>： </span></div>
          <DesDVNumber :config="{ min: 12, unit: 'px' }" :value="visualMap.textStyle.fontSize" @change="changeValue($event, visualMap.textStyle, 'fontSize')" />
        </div>
        <div class="ds-designer-property property-item ml20" v-if="visualMap.show">
          <div class="property-item-name"></div>
          <DesDVColorPicker :config="colorConfig" v-model="visualMap.textStyle.color" @change="changeValue($event, visualMap.textStyle, 'color')" />
        </div>
        <div class="ds-designer-property property-item ml20" v-if="visualMap.show">
          <div class="property-item-name">位置<span>： </span></div>
          <div class="des-dv-text-align">
            <!-- 对齐方式选择 -->
            <div class="align-wrap">
              <!-- 水平位置 -->
              <Direction
                class="horizontal-items"
                v-model="visualMap.left"
                type="horizontal"
                @input="changeValue($event, visualMap, 'left')"
                :mapData="[
                  { mapName: 'left', mapKey: 'left' },
                  { mapName: 'center', mapKey: 'center' },
                  { mapName: 'right', mapKey: 'right' },
                ]"
              ></Direction>
              <!-- 垂直位置 -->
              <Direction class="vertical-items" v-model="visualMap.top" type="vertical" @input="changeValue($event, visualMap, 'top')"></Direction>
            </div>
          </div>
        </div>
        <div class="ds-designer-property property-item" v-if="visualMap.show && visualMap.type == 'continuous'">
          <div class="property-item-name">显示手柄<span>： </span></div>
          <DesDVSwitch v-model="visualMap.calculable" @change="changeValue($event, visualMap, 'calculable')" />
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import DesDVPiecewise from "../piecewise.vue";
import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";
export default {
  name: "DesDVVisualMap",
  inject: ["owner"],
  props: {
    visualMap: {
      type: Object,
      require: true,
    },
    //3D地球仪不需要这个
    isShowAnnotation: {
      type: Boolean,
      default: true,
    },
  },
  components: {   DesDVPiecewise,  Direction },
  computed: {
    colors() {
      return this.visualMap.inRange;
    },
    isVisualMap: {
      get() {
        return !this.visualMap.seriesIndex;
      },
      set(val) {
        if (val) {
          this.visualMap.seriesIndex = 0;
          this.visualMap.show = true;
        } else {
          this.visualMap.seriesIndex = [];
          this.visualMap.show = false;
        }
        this.$emit("updateChart");
      },
    },
  },
  data() {
    return {
      colorConfig: {
        type: "color",
      },
      dictionary: [
        { text: "渐变", value: "continuous" },
        { text: "分段", value: "piecewise" },
      ],
      direction: [
        { text: "横向", value: "horizontal" },
        { text: "纵向", value: "vertical" },
      ],
    };
  },
  methods: {
    changeText(val, index) {
      let text = this.visualMap.text;
      text[index] = val;
      this.$set(this.visualMap.inRange, "text", text);
      this.$emit("updateChart");
    },
    changeColors(colors) {
      this.$set(this.visualMap.inRange, "color", colors);
      this.$emit("updateChart");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
  },
};
</script>

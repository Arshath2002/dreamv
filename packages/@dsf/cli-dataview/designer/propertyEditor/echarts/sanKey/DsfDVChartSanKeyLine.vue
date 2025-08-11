<!--
 * @Description: 桑基图-关系边样式
 * @Author: shenah
 * @Date: 2024-05-07 10:16:58
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:26:37
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        边的颜色
        <span>：</span>
      </div>
      <DesDVRadioGroup

        :data="{ dictionary: borderColorTypeOptions }"
        :fieldMap="{
          text: 'label',
          value: 'value',
        }"
        :value="series.lineStyle.isCustomColor"
        @change="changeCustomColor($event, series.lineStyle, 'isCustomColor')"
      />
    </div>
    <!-- 是否自定义 -->
    <div class="ds-designer-property property-item">
      <div class="property-item-name" style="opacity: 0">
        边的颜色
        <span>：</span>
      </div>
      <template v-if="series.lineStyle.isCustomColor">
        <DesDVColorPicker
          :config="bothConfig"
          v-model="itemLineColor"
          @change="changeItemColor($event, series.lineStyle, 'color')"
        />
      </template>
      <template v-else>
        <DesDVSelect
          :value="series.lineStyle.color"
          :data="{ dictionary: colorDesList }"
          :fieldMap="{
            text: 'label',
            value: 'value',
          }"
          @change="changeItemValue($event, series.lineStyle, 'color')"
        ></DesDVSelect>
      </template>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name" style="margin-left: 70px">
        透明度
        <span>：</span>
      </div>
      <DesDVNumber
        :value="series.lineStyle.opacity"
        @change="changeItemValue($event, series.lineStyle, 'opacity')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        边的曲度
        <span>：</span>
      </div>
      <DesDVNumber
        :value="series.lineStyle.curveness"
        @change="changeItemValue($event, series.lineStyle, 'curveness')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        标签
        <span>：</span>
      </div>
      <DesDVSwitch
        :value="series.edgeLabel.show"
        @change="changeItemValue($event, series.edgeLabel, 'show')"
      />
    </div>
    <!-- 矩形标签 -->
    <template v-if="series.edgeLabel.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">
          内容
          <span>：</span>
        </div>
        <el-input
          v-model="series.edgeLabel.formatter"
          class="data-view-text"
          placeholder="请输入"
          @change="changeLabel($event, series.edgeLabel, 'formatter')"
        />
        <DesDVToolTipsIcon
          :data="{
            desc: '{a}=系列名; {b}=数据名; {c}=数据值;',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">字体 <span>： </span></div>
        <DesDVPixel
          :value="series.edgeLabel.fontSize"
          :options="fontSizeUnitOptions"
          @change="changeItemValue($event, series.edgeLabel, 'fontSize')"
        ></DesDVPixel>
        <DesDVColorPicker
          :config="{
            ...colorConfig,
            noInput: true,
          }"
          class="ml10"
          v-model="series.edgeLabel.color"
          @change="changeItemValue($event, series.edgeLabel, 'color')"
        />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div
        class="property-item-name"
        style="min-width: 0; margin-right: 0"
      ></div>
      <dsfButtonDialog
        @click="settingLine"
        :hasValue="lineCustom"
        :config="{
          buttonText: '自定义',
        }"
      >
      </dsfButtonDialog>
    </div>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
import {
  sanKeyBorderColorTypeOptions,
  sanKeyColorDesList,
} from "../attrConfig";
const DsfDVChartSanKeyLineCustom = Vue.defineAsyncComponent(() =>
  import(
    /* webpackChunkName: "dataview_design_private" */ "./DsfDVChartSanKeyLineCustom.vue"
  )
);
export default {
  name: "DsfDVChartSanKeyLine",
  mixins: [itemMixin],
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      borderColorTypeOptions: sanKeyBorderColorTypeOptions,
      colorDesList: sanKeyColorDesList,
      dataList: [],
      itemLineColor: "",
    };
  },
  computed: {
    borderFlag() {
      return this.series.itemStyle.borderWidth !== 0;
    },
    lineCustom() {
      return !!(
        this.series.lineStyle.customList?.length ||
        this.series.edgeLabel.customList?.length
      );
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      // 所有数据
      this.dataList = this.series.data;
      if (
        this.series.lineStyle.isCustomColor &&
        this.series.lineStyle.startColor
      ) {
        this.itemLineColor = `linear-gradient(90deg,${this.series.lineStyle.startColor} 0%, ${this.series.lineStyle.endColor} 100%)`;
        delete this.series.lineStyle.startColor;
        delete this.series.lineStyle.endColor;
        delete this.series.lineStyle.isShade;
      } else if (this.series.lineStyle.isCustomColor) {
        this.itemLineColor = dsf.dataview.utils.convertChartToCSSColor(
          this.series.lineStyle.color
        );
      }
    },
    changeCustomColor(val, item, key) {
      if (val) {
        this.itemLineColor = `linear-gradient(90deg,#5470c6 0%, #5470c6 100%)`;
      } else {
        this.series.lineStyle.color = "gradient";
      }
      this.changeItemValue(val, item, key);
    },
    changePositionFlag(val, item, key) {
      if (val) {
        this.series.label.position = [0, 0];
      } else {
        this.series.label.position = "right";
      }
      this.changeItemValue(val, item, key);
    },
    changeLabel(val, item, key) {
      if (typeof val === "string" && val.trim()) {
        this.changeItemValue(val, item, key);
      } else {
        this.changeItemValue(null, item, key);
      }
    },
    settingLine() {
      let self = this;
      this.$openDialog({
        title: "节点样式自定义",
        content: DsfDVChartSanKeyLineCustom,
        params: {
          currentData: this.series,
          dataList: this.dataList,
        },
        width: "980px",
        height: "60vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let i = res.yes();
                if (i) {
                  let edgeLabelCustomList = i.edgeLabelCustomList;
                  let lineStyleCustomList = i.lineStyleCustomList;
                  self.changeItemValue(
                    edgeLabelCustomList,
                    self.series.edgeLabel,
                    "customList"
                  );
                  self.changeItemValue(
                    lineStyleCustomList,
                    self.series.lineStyle,
                    "customList"
                  );
                }
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
  },
};
</script>

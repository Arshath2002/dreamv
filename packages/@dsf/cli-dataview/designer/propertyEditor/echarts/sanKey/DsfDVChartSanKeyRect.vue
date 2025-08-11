<!--
 * @Description: 桑基图-节点样式
 * @Author: shenah
 * @Date: 2024-05-07 10:16:58
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:27:33
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        迭代次数
        <span>：</span>
      </div>
      <DesDVNumber
        :value="series.layoutIterations"
        @change="changeItemValue($event, series, 'layoutIterations')"
      />
      <DesDVToolTipsIcon
        :data="{
          desc: '迭代优化图中节点和边的位置，以减少节点和边之间的相互遮盖。 如果希望图中节点的顺序是按照原始data中的顺序排列的，可设该值为0',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        矩形颜色
        <span>：</span>
      </div>
      <DesDVColorPicker
        :config="colorConfig"
        v-model="series.itemStyle.color"
        @change="changeItemValue($event, series.itemStyle, 'color')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        矩形边框
        <span>：</span>
      </div>
      <DesDVSwitch
        :value="borderFlag"
        @change="changeBorder($event, series.itemStyle, 'borderWidth')"
      />
    </div>
    <!-- 边框 -->
    <template v-if="borderFlag">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">类型<span>： </span></div>
        <DesDVRadioGroup
          :options="borderTypeList"
          :fieldMap="{
            text: 'label',
            value: 'value',
          }"
          v-model="series.itemStyle.borderType"
          @change="changeItemValue($event, series.itemStyle, 'borderType')"
        />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">线宽<span>： </span></div>
        <DesDVNumber
          :value="series.itemStyle.borderWidth"
          @change="changeItemValue($event, series.itemStyle, 'borderWidth')"
        />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">颜色<span>： </span></div>
        <DesDVColorPicker
          :config="bothConfig"
          v-model="itemBorderColor"
          @change="changeItemColor($event, series.itemStyle, 'borderColor')"
        />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        标签
        <span>：</span>
      </div>
      <DesDVSwitch
        :value="series.label.show"
        @change="changeItemValue($event, series.label, 'show')"
      />
    </div>
    <!-- 矩形标签 -->
    <template v-if="series.label.show">
      <div class="ds-designer-property property-item">
        <div class="property-item-name ml20">
          自定义位置
          <span>：</span>
        </div>
        <DesDVSwitch
          :value="series.label.customPosition"
          @change="changePositionFlag($event, series.label, 'customPosition')"
        />
      </div>
      <template v-if="series.label.customPosition">
        <div class="ds-designer-property property-item float-one-row">
          <div class="property-item-name ml20">
            位移X
            <span>：</span>
          </div>
          <DesDVPixel
            :options="pixelNoUnitOptions"
            :value="series.label.position[0]"
            @change="changeItemValue($event, series.label.position, 0)"
          ></DesDVPixel>
        </div>
        <div class="ds-designer-property property-item float-one-row">
          <div class="property-item-name ml20">
            Y
            <span>：</span>
          </div>
          <DesDVPixel
            :options="pixelNoUnitOptions"
            :value="series.label.position[1]"
            @change="changeItemValue($event, series.label.position, 1)"
          ></DesDVPixel>
        </div>
      </template>
      <template v-else>
        <div class="ds-designer-property property-item">
          <div class="property-item-name ml20">
            位置
            <span>：</span>
          </div>
          <DesDVSelect
            :value="series.label.position"
     
            :data="{ dictionary: labelPosition }"
            :fieldMap="{
              text: 'label',
              value: 'value',
            }"
            @change="changeItemValue($event, series.label, 'position')"
          ></DesDVSelect>
        </div>
      </template>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">
          内容
          <span>：</span>
        </div>
        <el-input
          v-model="series.label.formatter"
          class="data-view-text"
          placeholder="请输入"
          @change="changeLabel($event, series.label, 'formatter')"
        />
        <DesDVToolTipsIcon
          :data="{
            desc: '{a}=系列名; {b}=数据名; {c}=数据值;',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name">字体<span>： </span></div>
        <DesDVPixel
          :value="series.label.fontSize"
          :options="fontSizeUnitOptions"
          @change="changeItemValue($event, series.label, 'fontSize')"
        ></DesDVPixel>
      </div>
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name" style="min-width: 0px; display: none">
          字体
          <span>： </span>
        </div>
        <DesDVColorPicker
          :config="{
            ...colorConfig,
            noInput: true,
          }"
          v-model="series.label.color"
          @change="changeItemValue($event, series.label, 'color')"
        />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div
        class="property-item-name"
        style="min-width: 0; margin-right: 0"
      ></div>
      <dsfButtonDialog
        @click="settingReact"
        :hasValue="reactCustom"
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
const DsfDVChartSanKeyRectCustom = Vue.defineAsyncComponent(() =>
  import(
    /* webpackChunkName: "dataview_design_private" */ "./DsfDVChartSanKeyRectCustom.vue"
  )
);
export default {
  name: "DsfDVChartSanKeyRect",
  mixins: [itemMixin],
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      itemBorderColor:"",
      dataList: [],
    };
  },
  computed: {
    borderFlag() {
      return this.series.itemStyle.borderWidth !== 0;
    },
    reactCustom() {
      return !!(
        this.series.itemStyle.customList?.length ||
        this.series.label.customList?.length
      );
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.dataList = this.series.data;
    },
    changeBorder(val, item, key) {
      let width = val ? 1 : 0;
      this.changeItemValue(width, item, key);
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
    settingReact() {
      let self = this;
      this.$openDialog({
        title: "节点样式自定义",
        content: DsfDVChartSanKeyRectCustom,
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
                  let labelCustomList = i.labelCustomList;
                  let itemStyleCustomList = i.itemStyleCustomList;
                  self.changeItemValue(
                    labelCustomList,
                    self.series.label,
                    "customList"
                  );
                  self.changeItemValue(
                    itemStyleCustomList,
                    self.series.itemStyle,
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

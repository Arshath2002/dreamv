<template>
  <div class="dsf-single-table-style dsf-datetime-weather-style">
    <!-- 树形 -->
    <el-tree
      class="single-table-tree"
      ref="tree"
      :data="value"
      :highlight-current="true"
      :expand-on-click-node="false"
      :render-after-expand="true"
      :default-expand-all="true"
      node-key="id"
      :current-node-key="currentNodeKey"
      :props="defaultProps"
      @node-click="nodeClick"
    >
      <span slot-scope="{ data }" class="custom-tree-node">
        <span :class="`tree-label${data.id}`">
          {{ data.value | typeFormatter }}
        </span>
      </span>
    </el-tree>
    <!-- 属性 -->
    <div v-if="form" :key="form.id">
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name">排列：</div>
        <DesDVRadioGroup :data="{ dictionary: dicOptions }" v-model="widthType" @change="widthTypeChange"></DesDVRadioGroup>
      </div>
      <div class="ds-designer-property property-item float-one-row ml10" v-if="widthType === 'fixed'">
        <DesDVPixel v-model.trim="form.style.width"></DesDVPixel>
      </div>
      <!-- 内容样式 -->
      <div class="ds-designer-property property-item" v-if="form.value !== 'WEATHER-ICON'">
        <div class="property-item-name">字体：</div>
        <DesDVTextStyle v-model="form.style"></DesDVTextStyle>
      </div>
      <!-- 图标大小 -->
      <div class="ds-designer-property property-item" v-if="form.value === 'WEATHER-ICON'">
        <div class="property-item-name">图标大小：</div>
        <DesDVNumber
          v-model="form.style.size"
          :config="{
            unit: 'px',
          }"
        ></DesDVNumber>
      </div>
      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name" style="margin-left: 0; width: 75px">位移X：</div>
        <DesDVNumber
          v-model="form.style.left"
          :config="{
            unit: 'px',
          }"
        ></DesDVNumber>
      </div>
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name">Y：</div>
        <DesDVNumber
          v-model="form.style.top"
          :config="{
            unit: 'px',
          }"
        ></DesDVNumber>
      </div>
    </div>
  </div>
</template>

<script>
const TypeMap = {
  "YMD-HMS": "年月日时分秒",
  YMD: "年月日",
  YM: "年月",
  HM: "时分",
  HMS: "时分秒",
  WEEK: "星期",
  "WEATHER-NAME": "天气名称",
  "WEATHER-ICON": "天气图标",
  TEMP: "温度",
  "TEMP-RANGE": "温度范围",
  "LOCAL-NAME": "地区",
};

export default {
  name: "DesDVDateTimeWeatherStyle",
  filters: {
    typeFormatter(val) {
      return TypeMap[val];
    },
  },
  props: {
    value: {
      type: Array,
    },
    config: {
      type: Object,
    },
  },
  watch: {
    "value.length": function (nv) {
      this.checkNode(nv - 1);
    },
    form: {
      handler(val, oldVal) {
        if (val) {
          if (oldVal && val.id === oldVal.id) {
            this.changeValue();
          }
          this.widthType = /^100%|auto$/.test(val.style.width) ? "auto" : "fixed";
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      currentNodeKey: "",
      attributes: [],
      defaultProps: {
        children: "children",
        label: "value",
      },
      form: null,
      widthType: "auto",
      dicOptions: [
        {
          text: "整行",
          value: "auto",
        },
        {
          text: "自定义",
          value: "fixed",
        },
      ],
    };
  },
  created() {
    this.checkNode();
  },
  methods: {
    checkNode(idx = 0) {
      if (this.value.length) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.value[idx].id);
          this.nodeClick(this.value[idx]);
        });
      }
    },
    nodeClick(data) {
      this.currentNodeKey = data.id;
      this.form = data;
    },
    changeValue() {
      let val = this.value;
      this.$emit("input", val);
      this.$emit("change", val);
    },
    widthTypeChange(val) {
      if (val === "auto") {
        this.form.style.width = "100%";
      } else {
        this.form.style.width = "30%";
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/DesDVSingleTableStyle.scss";
</style>

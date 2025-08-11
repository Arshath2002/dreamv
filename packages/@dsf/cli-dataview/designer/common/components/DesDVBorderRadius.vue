<template>
  <div class="ds-des-border-radius" :class="{ 'ds-nano': currentConfig.nano }">
    <div class="ds-left-controls">
      <div class="ds-radio-group-wrap">
        <DesDVRadioGroup v-model="curType" :data="{ dictionary: options }" v-slot="scope" @change="changeCurType" :config="{ nano: currentConfig.nano }">
          <el-tooltip v-if="scope.data.desc" :content="scope.data.desc" placement="top" effect="light">
            <DsfIcon :name="scope.data.icon" />
          </el-tooltip>
          <DsfIcon v-else :name="scope.data.icon" />
        </DesDVRadioGroup>
        <el-input-number v-if="currentConfig.fourInOne && curType === 'round'" v-model="tRadiusTemp" :min="0" :max="50" :controls="false" size="mini" step-strictly></el-input-number>
      </div>
      <el-slider v-if="curType === 'round'" :max="50" v-model="tRadiusTemp" @change="changeSlider"></el-slider>
    </div>
    <div class="ds-right-inputs" v-if="!currentConfig.fourInOne && curType === 'round'">
      <el-input-number
        v-for="(it, index) in radiusGroup"
        v-model="radiusGroup[index]"
        :key="index"
        :min="0"
        :controls="false"
        :max="50"
        @change="changeBorderRadius($event, index)"
        size="mini"
        step-strictly
      />
    </div>
  </div>
</template>

<script>
import propertyMixin from "./propertyMixin";
export default {
  name: "DesDVBorderRadius",
  mixins: [propertyMixin],

  model: {
    prop: "value",
    event: "change",
  },
  props: {
    // none
    value: {
      type: [String, Array],
      default: "none",
    },
  },
  data() {
    return {
      curType: "rect",
      tRadiusTemp: 0,
      tRadiusTempCache: 0,
      groupCache: [],
      options: [
        {
          value: "rect",
          desc: "直角",
          icon: "xingzhuang-juxing",
        },
        {
          value: "round",
          desc: "圆角",
          icon: "saoma",
        },
      ],
      defaultConfig: {
        unit: "px", // 单位 px / %
        nano: false, // 极小尺寸
        fourInOne: false, // 四合一
      },
    };
  },
  computed: {
    isArrayValue() {
      return Array.isArray(this.value);
    },
    radiusGroup: {
      get() {
        const val = this.value;
        if (this.isArrayValue) {
          return val.slice(0).map((it) => parseFloat(it));
        }
        // 字符串
        let group = val.split(" ");
        if (group.length == 4) {
          return group.map((it) => parseFloat(it));
        } else {
          return new Array(4).fill(parseFloat(val) || 0);
        }
      },
      set(val) {
        this.$emit("change", val);
      },
    },
  },
  created() {
    const val = this.value;
    if (Array.isArray(val)) {
      this.tRadiusTemp = parseFloat(val[0] || 0);
      let isRect = this.radiusGroup.every((it) => !it);
      this.curType = isRect ? "rect" : "round";
    } else {
      this.tRadiusTemp = parseFloat(val);
      this.curType = this.value === "none" || this.value === "0px 0px 0px 0px" ? "rect" : "round";
    }
  },
  methods: {
    changeSlider(val) {
      this.tRadiusTemp = val;
      this.changeRadius(val);
    },
    //滑块改变圆角
    changeRadius(val) {
      //如果是数组
      if (this.isArrayValue) {
        this.radiusGroup = new Array(4).fill(val);
      } else if (this.currentConfig.fourInOne) {
        this.radiusGroup = val + this.currentConfig.unit;
      } else {
        this.radiusGroup = new Array(4)
          .fill(val)
          .map((it) => it + this.currentConfig.unit)
          .join(" ");
      }
    },
    changeCurType(value) {
      if (value === "rect") {
        this.tRadiusTempCache = this.tRadiusTemp;
        this.groupCache = this.radiusGroup;
        this.tRadiusTemp = 0;
        this.changeRadius(0);
      } else {
        this.tRadiusTemp = this.tRadiusTempCache;
        this.radiusGroup = this.groupCache;
      }
    },
    changeBorderRadius(val, index) {
      const radiusGroup = this.radiusGroup;
      radiusGroup[index] = val;
      this.radiusGroup = radiusGroup;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVBorderRadius.scss";
</style>

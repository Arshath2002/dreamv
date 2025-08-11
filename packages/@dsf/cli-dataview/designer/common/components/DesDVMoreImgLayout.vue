<!--
 * @Description: 多张图片
 * @Author: shenah
 * @Date: 2024-03-18 16:13:18
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 11:07:22
-->

<template>
  <div class="des-dv-layout-img-wrapper">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        <span>单个卡片 <span>： </span></span>
      </div>
      <div class="des-dv-icon-add" @click="addItem">
        <i class="add-btn el-icon-plus"></i>
      </div>
    </div>
    <template v-if="value && value.length">
      <div class="single-layout-item" v-for="(it, index) in value" :key="index">
        <div class="single-layout-item-img-wrapper">
          <DesDVMoreImg
            v-model="it.bgImgObj"
            :config="currentConfig"
            @change="changeImage($event, it)"
          />
          <DesDVColorPicker
            v-model="it.bgImgObj"
            @change="changeImage($event, it)"
            :config="{
              noInput:true
            }"
            class="single-layout-item-color-picker"
          ></DesDVColorPicker>
        </div>
        <div class="single-layout-item-info">
          <el-row>
            <el-col :span="11">
              <span>宽</span>
              <DesDVPixel class="min" v-model="it.wH[0]" />
            </el-col>
            <el-col :span="11">
              <span>高</span>
              <DesDVPixel class="min" v-model="it.wH[1]" />
            </el-col>
            <el-col :span="11">
              <span>X</span>
              <DesDVPixel class="min" v-model="it.relative[0]" />
            </el-col>
            <el-col :span="11">
              <span>Y</span>
              <DesDVPixel class="min" v-model="it.relative[1]" />
            </el-col>
            <el-col :span="24">
              <DesDVBorderRadius v-model="it.borderRadius" />
            </el-col>
          </el-row>
        </div>
        <div class="des-dv-icon-add" @click="deleteItem(index)">
          <i class="add-btn el-icon-minus"></i>
        </div>
      </div>
    </template>
  </div>
</template>
<script>

import propertyMixin from "./propertyMixin";
import createBackground from "_dataview/output/config/backgroundExtend.js";
export default {
  name: "DesDVMoreImgLayout",
  mixins: [propertyMixin],
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      defaultConfig: {
        limitImg: 1,
        isTemp: true,
      },
      defaultValue: {
        borderRadius: [],
        margin: [],
        padding: [],
        wH: ["", ""],
        relative: ["", ""],
        bgImgObj: createBackground(),
      },
    };
  },
  created() {
    if (this.value.some((it) => !it)) {
      this.value.forEach((it, index, arr) => {
        if (!it) {
          arr[index] = {
            borderRadius: [],
            margin: [],
            padding: [],
            wH: ["", ""],
            relative: ["", ""],
            bgImgObj: createBackground(),
          };
        }
      });
      this.$emit("input", this.value);
      this.$emit("change", this.value);
    }
    this.value.forEach((it) => {
      Object.keys(this.defaultValue).forEach((key) => {
        if (it[key] == undefined) {
          this.$set(it, key, this.defaultValue[key]);
        }
      });
    });
    // console.log(this.value)
  },
  methods: {
    addItem() {
      this.value.push({
        borderRadius: [],
        margin: [],
        padding: [],
        wH: ["", ""],
        relative: ["", ""],
        bgImgObj: createBackground(),
      });
      this.$emit("input", this.value);
      this.$emit("change", this.value);
    },
    deleteItem(index) {
      this.value.splice(index, 1);
      this.$emit("input", this.value);
      this.$emit("change", this.value);
    },
    changeImage(val, it) {
      this.$set(it, "bgImgObj", val);
      this.$emit("input", this.value);
      this.$emit("change", this.value);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/layoutImg.scss";
</style>


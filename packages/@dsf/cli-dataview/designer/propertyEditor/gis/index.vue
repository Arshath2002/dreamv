<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-14 09:52:08
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-14 11:21:58
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">自定义风格<span>： </span></div>
      <DesDVSwitch v-model="owner.isCustomMapStyle" />
    </div>
    <div class="ds-designer-property property-item" v-if="owner.isCustomMapStyle">
      <div class="property-item-name">风格地址<span>： </span></div>
      <el-input placeholder="请输入自定义风格链接" v-model="owner.customStyleUrl" style="margin-top: 4px" class="custom-input" clearable> </el-input>
    </div>

    <div class="ds-designer-property property-item" v-if="!owner.isCustomMapStyle">
      <div class="property-item-name">地图风格<span>： </span></div>
      <el-select size="small" v-model="owner.mapStyle">
        <el-option v-for="item in mapStyleList" :key="item.value" :value="item.value" :label="item.name"></el-option>
      </el-select>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">地图要素<span>： </span></div>
      <el-checkbox-group @click.native.stop style="margin-top: 7px" v-model="owner.features">
        <el-checkbox @click.native.stop v-for="it in featureList" :key="it.value" :label="it.value">
          {{ it.name }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>

import mapProperties from "_dataview/output/gis/staticProperties.js";
export default {
  name: "DesDVGisInfo",

  props: {
    owner: {
      type: Object,
      require: true,
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    mapType() {
      return this.owner.mapType;
    },
    mapStyleList() {
      return mapProperties.get(this.owner.mapType).styleList;
    },
    featureList() {
      return mapProperties.get(this.owner.mapType).featureList;
    },
  },
  watch: {
    mapType() {
      this.owner.mapStyle = this.mapStyleList[0].value;
      this.owner.isCustomMapStyle = false;
      this.owner.customMapStyleUrl = "";
    },
    "owner.isCustomMapStyle"(v) {
      this.owner.customMapStyleUrl = "";
      this.owner.mapStyle = null;
      if (!v) {
        this.owner.mapStyle = this.mapStyleList[0].value;
      }
    },
  },
};
</script>

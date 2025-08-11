<!--
 * @Editor: zhanghang
 * @Description: gis 组件的数据映射
 * @Date: 2024-04-26 17:19:02
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 11:45:15
-->
<template>
  <div class="des-dv-gis-relation">
    <SettingDataOrigin class="data-setting" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="nav-btn__wrapper">
          <div class="nav-btn__wrapper-item" v-for="it in layersDic" :key="it.value" @click="addLayer(it.value)">{{ it.name }}</div>
        </div>
        <div class="map-relation__item" v-for="(item, key) in layerStyles" :key="key">
          <div class="delete-icon" @click="deleteLayer(key)">
            <DsfIcon name="del1"></DsfIcon>
          </div>
          <div class="map-relation__item-name">
            <div class="item-type">{{ layersDic.find((it) => it.value === item.seriesType).alias }}</div>
            <div class="item-name">[{{ item[item.seriesType].id }}]</div>
          </div>
          <div class="map-relation__item-input">
            <el-row>
              <el-col :span="8">
                <div class="cell-item">
                  <div class="config-title">加载方式</div>
                  <DesDVRadioGroup :data="{ dictionary }" v-model="item.dataConfig.status"></DesDVRadioGroup>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="cell-item">
                  <div class="config-title">数据类型</div>
                  <DesDVRadioGroup :data="{ dictionary: dataTypeDic }" v-model="item.dataConfig.dataType"></DesDVRadioGroup>
                </div>
              </el-col>

              <el-col :span="8">
                <div class="cell-item">
                  <div class="config-title">图层标识</div>
                  <el-input size="small" class="mtext" v-model="item[item.seriesType].id"></el-input>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="cell-item">
                  <div class="config-title">图层名称</div>
                  <el-input size="small" class="mtext" v-model="item[item.seriesType].seriesName"></el-input>
                </div>
              </el-col>

              <!-- 面图层的行政编码 -->
              <template v-if="item.dataConfig.dataType === 'code' && item.seriesType === 'polygon'">
                <el-col :span="8">
                  <div class="cell-item">
                    <div class="config-title">区域范围</div>
                    <el-cascader size="small" v-model="item.dataConfig.districtCode" :options="districtTree" :props="cascaderProps" clearable></el-cascader>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cell-item">
                    <div class="config-title">抽稀系数</div>
                    <el-input size="small" class="mtext" v-model="item.dataConfig.tolerance"></el-input>
                  </div>
                </el-col>
              </template>
              <!-- 面图层区域经纬度数据方式 -->
              <template v-if="item.seriesType === 'polygon' && item.dataConfig.dataType === 'lnglat'">
                <el-col :span="8">
                  <div class="cell-item">
                    <div class="config-title">区域经纬度字段</div>
                    <SelectInput v-model="item.dataConfig.districtRelation" :mapFieldList="mapFieldList" />
                  </div>
                </el-col>
              </template>
              <!-- 区域图层和点位类型位置编码方式 -->
              <template v-if="item.seriesType !== 'pulseLink' && item.dataConfig.dataType === 'code'">
                <el-col :span="8">
                  <div class="cell-item">
                    <div class="config-title">地区(点位)字段</div>
                    <SelectInput v-model="item.dataConfig.adCodeRelation" :mapFieldList="mapFieldList" />
                  </div>
                </el-col>
              </template>
              <!-- 点位类型图层位置映射字段 -->
              <template v-if="!['pulseLink', 'polygon'].includes(item.seriesType) && item.dataConfig.dataType === 'lnglat'">
                <el-col :span="8">
                  <div class="cell-item">
                    <div class="config-title">经度字段</div>
                    <SelectInput v-model="item.dataConfig.lngRelation" :mapFieldList="mapFieldList" />
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cell-item">
                    <div class="config-title">纬度字段</div>
                    <SelectInput v-model="item.dataConfig.latRelation" :mapFieldList="mapFieldList" />
                  </div>
                </el-col>
              </template>
              <!-- 飞行线 -->
              <template v-if="item.seriesType === 'pulseLink'">
                <el-col :span="8">
                  <div class="cell-item">
                    <div class="config-title">起飞点字段</div>
                    <SelectInput v-model="item.dataConfig.startRelation" :mapFieldList="mapFieldList" />
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cell-item">
                    <div class="config-title">降落点字段</div>
                    <SelectInput v-model="item.dataConfig.endRelation" :mapFieldList="mapFieldList" />
                  </div>
                </el-col>
              </template>
              <!-- geo 数据和飞行线图层没有改字段 -->
              <template v-if="item.dataConfig.dataType !== 'geo' && item.seriesType != 'pulseLink'">
                <el-col :span="8">
                  <div class="cell-item">
                    <div class="config-title">数值字段</div>
                    <SelectInput v-model="item.dataConfig.valueRelation" :mapFieldList="mapFieldList" />
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cell-item">
                    <div class="config-title">名称字段（选填）</div>
                    <SelectInput v-model="item.dataConfig.nameRelation" :mapFieldList="mapFieldList" />
                  </div>
                </el-col>
              </template>
            </el-row>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import dataAnalysisHelper from "../dataAnalysisOptionHelper";
// 图层配置
import createPolygon from "_dataview/share/components/gis/options/polygon.js";
import createPoint from "_dataview/share/components/gis/options/point.js";
import createScatter from "_dataview/share/components/gis/options/scatter.js";
import createHeatMap from "_dataview/share/components/gis/options/heatMap.js";
import createPulseLink from "_dataview/share/components/gis/options/pulseLink.js";
import createFlatBar from "_dataview/share/components/gis/options/flatBar.js";
import createIcon from "_dataview/share/components/gis/options/icon.js";

const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../graph/selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVGisRelation",
  mixins: [$mixins.propertyDialogSetting, dataAnalysisHelper],
  components: { SettingDataOrigin, SelectInput },
  data() {
    return {
      layerStyles: {},
      districtTree: [],
      cascaderProps: {
        checkStrictly: true,
        emitPath: false,
        value: "adcode",
        label: "name",
        children: "districtList",
      },

      dictionary: [
        {
          text: "初始化",
          value: "load",
        },
        {
          text: "手动切换",
          value: "none",
        },
      ],
      dataTypeDic: [
        {
          text: "行政编码",
          value: "code",
        },
        {
          text: "经纬度",
          value: "lnglat",
        },
        {
          text: "geojson",
          value: "geo",
        },
      ],
      layersDic: [
        {
          name: "添加区域图层",
          value: "polygon",
          alias: "区域",
        },
        {
          name: "添加点图层",
          value: "point",
          alias: "点",
        },
        {
          name: "添加贴地点图层",
          value: "scatter",
          alias: "贴地点",
        },
        {
          name: "添加热力图层",
          value: "heatMap",
          alias: "热力图",
        },
        {
          name: "添加柱体图层",
          value: "flatBar",
          alias: "柱体",
        },
        {
          name: "添加飞行线图层",
          value: "pulseLink",
          alias: "飞行线",
        },
        {
          name: "添加图标图层",
          value: "icon",
          alias: "图标",
        },
      ],
    };
  },
  computed: {
    mapType() {
      return this.owner.getMapType();
    },
  },
  created() {
    if (this.mapType === "BMap") {
      this.cascaderProps.children = "districts";
    }
    this.layerStyles = this.currentData;
    this.getDistrictList();
  },
  methods: {
    /**
     * 获取全国区域列表
     */
    getDistrictList() {
      this.owner.queryDistrictListByCode("100000").then((res) => {
        this.districtTree = res;
      });
    },
    /**
     * 添加图层
     * @param {String} type 图层类型
     */
    addLayer(type) {
      const id = `${type}_${dsf.uuid(6)}`;
      switch (type) {
        case "polygon":
          const polygon = createPolygon();
          polygon.polygon.id = id;
          this.$set(this.layerStyles, id, polygon);
          break;
        case "point":
          const point = createPoint();
          point.point.id = id;
          this.$set(this.layerStyles, id, point);
          break;
        case "scatter":
          const scatter = createScatter();
          scatter.scatter.id = id;
          this.$set(this.layerStyles, id, scatter);
          break;
        case "heatMap":
          const heatMap = createHeatMap();
          heatMap.heatMap.id = id;
          this.$set(this.layerStyles, id, heatMap);
          break;
        case "flatBar":
          const flatBar = createFlatBar();
          flatBar.flatBar.id = id;
          this.$set(this.layerStyles, id, flatBar);
          break;
        case "pulseLink":
          const pulseLink = createPulseLink();
          pulseLink.pulseLink.id = id;
          this.$set(this.layerStyles, id, pulseLink);
          break;
        case "icon":
          const icon = createIcon();
          icon.icon.id = id;
          this.$set(this.layerStyles, id, icon);
          break;
      }
    },

    clearMapFieldList() {},

    /**
     * 删除图层
     */
    deleteLayer(key) {
      this.$delete(this.layerStyles, key);
    },
    yes() {
      const layerStyles = this.layerStyles;
      const res = {};

      Object.keys(layerStyles).forEach((key) => {
        const item = layerStyles[key];
        const type = item.seriesType;
        let id = item[type].id;
        if (id) {
          res[id] = item;
        }
      });
      // 移除所有图层
      this.owner.handleDeleteMapLayer();
      this.beforeYes();
      return res;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVGisRelation.scss";
</style>

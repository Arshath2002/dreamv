<!--
 * @Description:基础地图字段映射配置
 * @Author: zhanghang
 * @Date: 2021-07-28 14:38:59
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-11 14:33:30
-->
<template>
  <div class="des-dv-chart-edit-container">
    <SettingDataOrigin class="data-setting" @updateStatic="updateStatic" :owner="owner" @update-field-list="clearMapFieldList"></SettingDataOrigin>
    <div class="right">
      <el-scrollbar class="right-scroller">
        <div class="nav-btn__wrapper">
          <div class="nav-btn__wrapper-item" @click="addSeries('marker')">增加标记</div>
          <div class="nav-btn__wrapper-item" @click="addSeries('flight')">增加飞行线</div>
          <div class="nav-btn__wrapper-item" @click="addSeries('scatter')">增加动效点</div>
          <div class="nav-btn__wrapper-item" @click="addSeries('lightBar')">增加光柱</div>
        </div>
        <!-- 基础地图 -->
        <div class="map-relation__item" v-if="threeOptions.world">
          <div class="map-relation__item-name">
            <div class="item-type">世界轮廓</div>
            <div class="item-name">[{{ threeOptions.world.seriesName }}]</div>
          </div>
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title first">系列名称</div>
              <SelectInput v-model="threeOptions.world.seriesName" :mapFieldList="[]" />
            </div>
            <div class="cell-item">
              <div class="config-title">地区</div>
              <SelectInput v-model="threeOptions.world.districtRelation" :mapFieldList="mapFieldList" />
              <el-tooltip effect="light" placement="bottom">
                <div slot="content">
                  <div>地区字段仅支持国家中文名称</div>
                </div>
                <DsfIcon style="margin-left: 5px; cursor: pointer" name="bangzhuzhongxin"></DsfIcon>
              </el-tooltip>
            </div>
            <div class="cell-item">
              <div class="config-title">值</div>
              <SelectInput v-model="threeOptions.world.valueRelation" :mapFieldList="mapFieldList" />
            </div>
          </div>
        </div>
        <div class="map-relation__item" v-for="(item, index) in threeOptions.series" :key="`s_${index}`">
          <div class="delete-series" @click="deleteSeries(index)" v-if="item.type != 'map'">
            <DsfIcon name="del1" />
          </div>
          <div class="map-relation__item-name">
            <div class="item-type">{{ getTypeName(item) }}</div>
            <div class="item-name">[{{ item.seriesName }}]</div>
          </div>
          <div class="map-relation__item-input">
            <div class="cell-item">
              <div class="config-title first">系列名称</div>
              <SelectInput v-model="item.seriesName" :mapFieldList="[]" />
            </div>
            <template v-if="item.type === 'flight'">
              <div class="cell-item">
                <div class="config-title">起点</div>
                <SelectInput v-model="item.startRelation" :mapFieldList="mapFieldList" />
                <el-tooltip effect="light" placement="bottom">
                  <div slot="content">
                    <div>字段仅支持经纬度</div>
                  </div>
                  <DsfIcon style="margin-left: 5px; cursor: pointer" name="bangzhuzhongxin"></DsfIcon>
                </el-tooltip>
              </div>
              <div class="cell-item">
                <div class="config-title">终点</div>
                <SelectInput v-model="item.endRelation" :mapFieldList="mapFieldList" />
              </div>
            </template>
            <template v-else>
              <div class="cell-item">
                <div class="config-title">地区</div>
                <SelectInput v-model="item.districtRelation" :mapFieldList="mapFieldList" />
                <el-tooltip effect="light" placement="bottom">
                  <div slot="content">
                    <div>地区字段仅支持经纬度</div>
                  </div>
                  <DsfIcon style="margin-left: 5px; cursor: pointer" name="bangzhuzhongxin"></DsfIcon>
                </el-tooltip>
              </div>
              <div class="cell-item">
                <div class="config-title">值</div>
                <SelectInput v-model="item.valueRelation" :mapFieldList="mapFieldList" />
              </div>
            </template>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import createFlight from "_dataview/output/earth/createFlight.js";
import createMarker from "_dataview/output/earth/createMarker.js";
import createScatter from "_dataview/output/earth/createScatter.js";
import createLightBar from "_dataview/output/earth/createLightBar.js";
const SelectInput = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../graph/selectInput.vue"));
const SettingDataOrigin = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "../settingDataOrigin.vue"));
export default {
  name: "DesDVThreeEarthRelation",
  mixins: [$mixins.propertyDialogSetting],
  provide() {
    return {
      owner: this.owner,
      mapFieldList: () => this.mapFieldList,
    };
  },
  data() {
    return {
      //映射列表
      mapFieldList: [],
      threeOptions: {},
    };
  },
  components: {
    SettingDataOrigin,
    SelectInput,
  },
  computed: {
    dataType() {
      return this.owner.$children[0].dataType;
    },
  },
  created() {
    this.reloadFieldList();

    //重新使用字符串计算chart对象
    this.threeOptions = dsf.eval(this.owner.threeString);

    dsf.emit.$on(
      "reloadFields",
      () => {
        this.$nextTick(() => {
          this.reloadFieldList();
        });
      },
      this.owner.$children[0]
    );
    this.owner.$$wholeOptions = this.threeOptions;
  },
  beforeDestroy() {
    dsf.emit.$remove("reloadFields", this.owner.$children[0]);
    Reflect.deleteProperty(this.owner, "$$wholeOptions");
  },
  methods: {
    clearMapFieldList() {},
    updateStatic(threeOptions) {
      this.owner.$$wholeOptions = threeOptions;
      this.threeOptions = threeOptions;
    },
    //读取映射字段
    reloadFieldList() {
      this.mapFieldList = this.owner.$children[0].getDesignerMapFieldList();
    },
    dealThreeOption(vm) {
      vm.threeString = dsf.dataview.utils.objectToString(this.threeOptions, true);
      //在option 获取之后执行
      setTimeout(() => {
        vm.$children[0].middleWareData(vm.$children[0].serviceData);
        //更新右侧属性值
        this.$nextTick(() => {
          dsf.emit.$emit("updatePropertyThree", {}, [this.owner.$children[0]]);
        });
      });
    },
    yes() {
      //处理图表chart字符串
      this.dealThreeOption(this.owner);
      return this.threeOptions;
    },
    deleteSeries(index) {
      this.threeOptions.series.splice(index, 1);
    },
    getTypeName(item) {
      let name = "";
      switch (item.type) {
        case "flight":
          name = "飞行线";
          break;
        case "scatter":
          name = "动效点";
          break;
        case "marker":
          name = "标记";
          break;
        case "lightBar":
          name = "光柱";
          break;
      }
      return name;
    },
    addSeries(type) {
      let name = "";
      let series = null;
      switch (type) {
        case "marker":
          name = "标记" + Math.random().toString(16).slice(12);
          series = createMarker();
          series.name = name;
          break;

        case "flight":
          name = "飞行线" + Math.random().toString(16).slice(12);
          series = createFlight();
          series.name = name;
          break;
        case "scatter":
          name = "动效点" + Math.random().toString(16).slice(12);
          series = createScatter();
          series.name = name;
          break;
        case "lightBar":
          name = "光柱" + Math.random().toString(16).slice(12);
          series = createLightBar();
          series.name = name;
          break;
      }
      series && this.threeOptions.series.push(series);
    },
  },
};
</script>

<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapRelation.scss";
</style>

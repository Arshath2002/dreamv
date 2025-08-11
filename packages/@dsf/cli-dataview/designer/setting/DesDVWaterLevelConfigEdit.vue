<!--
 * @Description: 水位图配置项
 * @Author: shenah
 * @Date: 2023-06-19 09:14:27
 * @LastEditors: shenah
 * @LastEditTime: 2023-09-20 14:18:21
-->

<template>
  <div class="des-dv-water-level-config-setting">
    <div class="header-title">
      <h2>水位图详情配置</h2>
      <div class="btn-list">
        <el-button
          size="small"
          type="text"
          icon="el-icon-plus"
          @click="addConfig"
        >
          添加配置项
        </el-button>
      </div>
    </div>
    <el-card class="common-card" v-for="(item, index) in list" :key="item.id">
      <div slot="header" class="title">
        <div class="left-title">第{{ index + 1 }}项</div>
        <div v-if="list.length > 1">
          <el-button
            size="small"
            icon="el-icon-delete"
            @click="removeConfig(index)"
            type="danger"
            circle
          ></el-button>
        </div>
      </div>
      <el-form
        :inline="true"
        :show-message="false"
        label-width="100px"
        size="small"
      >
        <el-form-item label="水位图形状" class="common-form-item">
          <el-select v-model="item.shape" class="common-width">
            <el-option
              v-for="one in shapeOptions"
              :key="one.value"
              :label="one.label"
              :value="one.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="波纹数量" class="common-form-item">
          <el-input-number
            class="common-width"
            v-model="item.waveNum"
            :controls="false"
            :max="20"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="波纹高度" class="common-form-item">
          <el-input v-model="item.waveHeight" class="common-width"></el-input>
        </el-form-item>
        <el-form-item label="波纹透明度" class="common-form-item">
          <el-input-number
            class="common-width"
            v-model="item.waveOpacity"
            :controls="false"
            :max="100"
            :min="10"
          ></el-input-number>
        </el-form-item>
        <el-row>
          <el-form-item label="水波色值" class="common-form-item bg-form-item">
            <div class="common-bg-icon-wrap">
              <el-button
                class="bg-icon-btn"
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="small"
                @click="addOneColor(item)"
              >
                添加背景色
              </el-button>
              <div class="bg-icon-items">
                <div
                  class="bg-icon-wrap"
                  v-for="(color, colorIndex) in item.colors"
                  :key="color.uuid"
                >
                  <i
                    class="close el-icon-close"
                    @click.stop="removeOneColor(item, colorIndex)"
                    v-if="item.colors.length > 1"
                  ></i>
                  <el-color-picker
                    show-alpha
                    v-model="color.value"
                    class="bg-color-item"
                  ></el-color-picker>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "DesDVWaterLevelConfigEdit",
  mixins: [$mixins.propertyDialogSetting],
  components: {},
  data() {
    return {
      shapeOptions: [
        {
          label: "矩形",
          value: "rect",
        },
        {
          label: "圆角矩形",
          value: "roundRect",
        },
        {
          label: "圆形",
          value: "round",
        },
      ],
      list: [],
    };
  },
  created() {
    this.list = this.currentData?.map((item) => ({
      ...this.createOne(),
      ...item,
      colors: item.colors.map((color) => ({
        id: dsf.uuid(),
        value: color,
      })),
    }));
  },
  methods: {
    createOne() {
      return {
        id: dsf.uuid(),
        //水位形状
        shape: "rect",
        //波纹数量
        waveNum: 3,
        //波纹高度
        waveHeight: 10,
        // 波纹透明度
        waveOpacity: 40,
        //水位图配色
        colors: [
          {
            id: dsf.uuid(),
            value: "#3DE7C9",
          },
          {
            id: dsf.uuid(),
            value: "#00BAFF",
          },
        ],
      };
    },
    addConfig() {
      let one = this.createOne();
      this.list.push(one);
    },
    removeConfig(index) {
      this.list.splice(index, 1);
    },
    addOneColor(row) {
      row.colors.push({
        id: dsf.uuid(),
        value: "",
      });
    },
    removeOneColor(row, index) {
      row.colors.splice(index, 1);
    },
    yes() {
      let arr = this.list.map((item) => ({
        ...item,
        colors: item.colors.map((item) => item.value),
      }));
      return arr;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVWaterLevelConfigEdit.scss";
</style>

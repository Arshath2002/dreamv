<!--
 * @Description: 图片上传支持路径
 * @Author: shenah
 * @Date: 2023-07-31 09:23:11
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-03 10:41:00
-->

<template>
  <div class="data-view-img-arr-path-edit">
    <div class="imgs-box" v-for="item in list" :key="item.id">
      <div class="imgs-box-inner" v-if="item.value">
        <el-image style="width: 100px; height: 100px" :src="getImageSrc(item.value)" fit="fill"></el-image>
        <div class="btn-wrap">
          <el-button class="btn" @click="open(item)">上传</el-button>
        </div>
      </div>
      <div v-else>
        <div class="upload-card-wrap">
          <div class="plus" @click="open(item)">
            <DsfIcon name="hao"></DsfIcon>
          </div>
          <el-button class="btn" @click="open(item)">上传</el-button>
        </div>
      </div>
      <DsfIcon @click="reduce(item.id)" v-if="list.length > 1" class="reduce" name="close"></DsfIcon>
    </div>
    <div class="plus" @click="plus">
      <DsfIcon name="hao"></DsfIcon>
    </div>
  </div>
</template>
<script>
export default {
  name: "DesDVImgBatchPathEdit",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      list: [],
      upIndex: null,
    };
  },
  created() {
    let oldList = this.currentData?.colors || [];
    this.list = dsf.mix(true, [], oldList).map((it) => {
      return {
        value: dsf.dataview.utils.compatiblePathToExtendImg(it),
        id: dsf.uuid(32),
      };
    });
  },
  methods: {
    getImageSrc(item) {
      const url = item[item.active].image;
      return dsf.url.getWebPath(url);
    },
    open(row) {
      let currentData = row.value || { active: "custom" };
      this.$openDialog({
        title: "图片设置",
        content: "DesDVBgSettingExtend",
        width: "710px",
        height: "400px",
        params: {
          currentData,
          onlyImage: true,
          backgroundTypes: ["boardIcon"],
          hasColor: false,
        },
        btns: [
          {
            text: "确定",
            handler: (res) => {
              let result = res.yes();
              if (result) {
                row.value = result;
              }
            },
          },
        ],
      });
    },
    reduce(id) {
      this.list = this.list.filter((it) => it.id != id);
    },
    plus() {
      if (this.currentData?.data && this.colors.length >= this.currentData?.data.length) {
        dsf.layer.message("图片数量已到最大数量", false);
        return;
      }
      this.list.push({
        value: null,
        id: dsf.uuid(32),
      });
    },
    yes() {
      return {
        colors: this.list.map((it) => it.value),
        data: this.currentData?.data,
      };
    },
  },
};
</script>

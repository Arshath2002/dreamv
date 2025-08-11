<!--
 * @Description: 自定义图表配置编辑器
 * @Author: zhanghang
 * @Date: 2021-07-21 14:43:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-09 10:04:14
-->
<template>
  <div class="des-dv-map-select">
    <el-form ref="form" :model="form" size="small" style="width: 98%">
      <el-form-item label="地区选择">
        <el-select v-model="form.area" placeholder="地区" @change="transCustomMap">
          <el-option v-for="it in districtOptions" :key="it.value" :label="it.name" :value="it.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="开启静态">
        <el-switch class="des-dv-switch" v-model="staticFile"></el-switch>
        <p class="des-dv-warn-tip" v-if="staticFile">{{ filesArgs.msg }}</p>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" style="align-items: center">
          <el-link class="theme-color" style="margin: 0 10px 0 auto" :underline="false" @click="addCustomMap()"> 新增地区 </el-link>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-container>
          <el-main style="padding: 0px">
            <el-table :data="form.areaList" border>
              <el-table-column label="默认" width="50" align="center">
                <template v-slot:default="scope">
                  <el-checkbox :value="scope.row === checkRow" @change="changeCustomMap($event, scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="地区名称" width="160">
                <template v-slot:default="scope">
                  <el-input v-model="scope.row.text" placeholder="请输入地区名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="地区行政编码" width="160">
                <template v-slot:default="scope">
                  <el-input v-model="scope.row.code" placeholder="请输入地区行政编码"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="地区链接url" width="auto">
                <template v-slot:default="scope">
                  <el-input v-model="scope.row.value" placeholder="请输入地区链接">
                    <el-upload
                      slot="append"
                      class="upload-demo"
                      :action="uploadAction"
                      :headers="headers"
                      :show-file-list="false"
                      :on-progress="uploadProgress"
                      :on-success="uploadSuccess(scope.row)"
                      :on-error="uploadError"
                      accept=".json"
                      :data="extraData"
                    >
                      <el-button>上传</el-button>
                    </el-upload>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="80">
                <template v-slot:default="scope">
                  <DsfIcon class="theme-color" name="hao" @click="addCustomMap(scope.$index)"> </DsfIcon>
                  <DsfIcon class="theme-color" name="shanchu" @click="delCustomMap(scope.$index, scope.row)"> </DsfIcon>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { chartDistrict, threeDistrict } from "./district.js";
export default {
  name: "DesDVMapDataEdit",
  mixins: [$mixins.propertyDialogSetting],
  computed: {
    filesArgs() {
      return dsf.dataview.utils.getDataViewUploadFilesArgs.call(this, this.staticFile);
    },
    uploadAction() {
      return this.filesArgs.url;
    },
    headers() {
      return this.filesArgs.headers;
    },
    extendData() {
      return this.filesArgs.extraData;
    },

    districtOptions() {
      let options = [];
      switch (this.type) {
        case "chart":
          options = chartDistrict;
          break;
        case "three":
          options = threeDistrict;
          break;
      }
      return options;
    },
  },
  data() {
    return {
      chartDistrict,
      threeDistrict,

      staticFile: dsf.config.setting_dataview_upload_static == 1 || false,

      type: "chart",
      form: {
        area: "custom",
        url: "", // 字符串
        showName: "", // 名称
        static: true,
        // 自定义上传列表
        areaList: [],
      },
      checkRow: null,
    };
  },

  created() {
    this.form = dsf.mix(true, {}, this.form, this.currentData);

    if (this.form.area == "custom" && Array.isArray(this.form.url)) {
      const { showName, url } = this.form;
      this.form.areaList = url.map((it) => {
        return {
          code: "",
          ...it,
        };
      });
      const urlItem = url.find((it) => it.text == showName);
      this.form.url = urlItem ? urlItem.value : "";
    }
    const url = this.form.url;
    const areaList = this.form.areaList;
    const item = areaList.find((it) => it.value === url);
    this.checkRow = url ? item : null;

    if (this.config.type) {
      this.type = this.config.type;
    }
  },
  methods: {
    transCustomMap(value) {
      this.checkRow = null;
      this.form.showName = this.districtOptions.find((it) => it.value === value).name;
    },
    changeCustomMap(evt, row) {
      this.checkRow = evt ? row : null;
    },
    addCustomMap(index) {
      if (index === undefined) {
        this.form.areaList.push({
          text: "",
          code: "",
          value: "",
        });
      } else {
        this.form.areaList.splice(index + 1, 0, {
          text: "",
          code: "",
          value: "",
        });
      }
    },
    delCustomMap(idx, row) {
      if (row === this.checkRow) {
        this.checkRow = null;
      }
      this.form.areaList.splice(idx, 1);
    },
    uploadProgress() {
      this.loading = dsf.layer.loading();
    },
    uploadSuccess(row) {
      return ({ data }) => {
        dsf.layer.closeLoading(this.loading);
        this.loading = undefined;
        this.$set(row, "value", this.filesArgs.getFilePath(data));
      };
    },
    getUploadSuccess(row) {
      return function (res) {
        this.uploadSuccess(res, row);
      };
    },
    uploadError() {
      dsf.layer.closeLoading(this.loading);
      this.loading = undefined;
      dsf.layer.message("文件上传失败", false);
    },
    yes() {
      const form = this.form;
      const checkRow = this.checkRow;

      if (checkRow) {
        form.url = checkRow.value;
        form.showName = checkRow.text;
      } else {
        const value = form.area;
        const area = this.districtOptions.find((it) => it.value === value);
        form.url = "";
        form.showName = area ? area.name : "";
      }
      return form;
    },
  },
};
</script>

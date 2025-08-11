<!--
 * @Description: 视频上传
 * @Author: shenah
 * @Date: 2023-05-22 10:51:32
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-09 10:03:40
-->

<template>
  <div class="data-view-video-upload">
    <el-form ref="form" :model="form" label-width="120px" size="small">
      <el-form-item label="开启静态">
        <el-switch class="des-dv-switch" v-model="staticFile"></el-switch>
        <p class="des-dv-warn-tip" v-if="staticFile">{{ filesArgs.msg }}</p>
      </el-form-item>
      <el-form-item label="视频链接">
        <el-input v-model="form.src" placeholder="请输入视频链接" style="width: 260px">
          <el-upload
            slot="append"
            class="upload-demo"
            :action="uploadAction"
            :headers="headers"
            :show-file-list="false"
            :on-progress="uploadProgress"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
            accept="video/*"
            :data="extraData"
          >
            <el-button>上传</el-button>
          </el-upload>
        </el-input>
      </el-form-item>
      <el-form-item label="支持的视频格式">
        <p>video/*</p>
      </el-form-item>
      <el-form-item label="视频大小限制">
        <p>{{ limitsize }}Mb以下</p>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "DesDVVideoUpload",
  mixins: [$mixins.propertyDialogSetting],

  props: {
    limitsize: {
      type: [String, Number],
      default: 512,
    },
  },
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
  },
  data() {
    return {
      form: {
        src: "",
        static: true,
      },
      staticFile: dsf.config.setting_dataview_upload_static == 1 || false,
    };
  },
  created() {
    this.form = this.currentData;
  },
  methods: {
    clearUrl() {
      this.form.src = "";
    },
    beforeUpload(file) {
      let isLimited = file.size < this.limitsize * 1024 * 1024;
      if (!isLimited) {
        this.$message(`大小不能超过 ${this.limitsize} Mb！`, false);
      }
      return isLimited;
    },
    uploadProgress() {
      this.loading = dsf.layer.loading();
    },
    uploadSuccess({ data, success, message }) {
      if (success) {
        this.form.src = this.filesArgs.getFilePath(data);
      } else {
        this.$message(message, false);
      }
      dsf.layer.closeLoading(this.loading);
      this.loading = undefined;
    },
    uploadError() {
      dsf.layer.closeLoading(this.loading);
      this.loading = undefined;
      dsf.layer.message("视频上传失败", false);
    },
    yes() {
      return this.form;
    },
  },
};
</script>

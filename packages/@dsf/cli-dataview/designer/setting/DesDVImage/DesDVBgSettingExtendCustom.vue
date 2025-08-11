<!--
 * @Description: 
 * @Author: dengqirui
 * @Date: 2024-11-12 16:24:34
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-08 17:17:03
-->
<template>
  <div class="designer-page-bg-setting">
    <el-form ref="form" :model="$custom" label-width="100px" size="small">
      <el-form-item label="开启静态">
        <el-switch class="des-dv-switch" v-model="staticFile"></el-switch>
        <p class="des-dv-warn-tip" v-if="staticFile">{{ filesArgs.msg }}</p>
      </el-form-item>
      <el-form-item label="图片链接">
        <el-input v-model="$custom.image" placeholder="请输入图片链接" style="width: 260px" @click.native.stop>
          <el-upload
            slot="append"
            class="upload-demo"
            :action="uploadAction"
            :headers="headers"
            :show-file-list="false"
            :on-progress="uploadProgress"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :data="extendData"
            accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
          >
            <el-button>上传</el-button>
          </el-upload>
        </el-input>
      </el-form-item>
      <el-form-item label="图片预览">
        <el-image :src="$custom.image | getWebPath" style="width: 200px; height: 100px">
          <div slot="error" class="el-image__error">无效图片</div>
        </el-image>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import createBackground from "_dataview/output/config/backgroundExtend.js";
export default {
  name: "DesDVBgSettingExtendCustom",
  mixins: [$mixins.propertyDialogSetting],
  components: {},
  props: {
    custom: {
      type: Object,
      default: () => {
        return createBackground().custom;
      },
    },
  },
  computed: {
    $custom: {
      get() {
        return this.custom;
      },
      set(v) {
        this.$emit("update:custom", v);
      },
    },
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
      staticFile: dsf.config.setting_dataview_upload_static == 1 || false,
    };
  },
  methods: {
    uploadProgress() {
      this.loading = dsf.layer.loading();
    },
    uploadSuccess({ data }) {
      dsf.layer.closeLoading(this.loading);
      this.loading = undefined;
      this.$set(this.$custom, "image", this.filesArgs.getFilePath(data));
    },
    uploadError() {
      dsf.layer.closeLoading(this.loading);
      this.loading = undefined;
      dsf.layer.message("图片上传失败", false);
    },
  },
};
</script>

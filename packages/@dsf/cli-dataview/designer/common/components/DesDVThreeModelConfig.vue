<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-12-30 16:32:40
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-08 17:15:38
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启静态<span>： </span></div>
      <DesDVSwitch v-model="staticFile" />
      <DesDVToolTipsIcon
        style="margin-top: 2px"
        :data="{
          desc: `${filesArgs.msg}`,
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">模型地址<span>： </span></div>
      <el-input class="dsf-input-upload" @change="changeValue($event, model, 'url')" v-model="model.url" size="small">
        <el-upload slot="append" :action="uploadAction" :headers="headers" :data="extendData" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError">
          <DsfIcon size="small" name="yunduanshangchuan" />
        </el-upload>
      </el-input>
      <DesDVToolTipsIcon
        :data="{
          desc: '<div>支持上传glb，gltf格式模型文件。</div>',
        }"
      >
      </DesDVToolTipsIcon>
    </div>
    <template v-if="ambientLight">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">环境光<span>： </span></div>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">颜色<span>： </span></div>
        <DesDVColorPicker :config="{ type: 'color' }" v-model="ambientLight.color" @change="changeValue($event, ambientLight, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">强度<span>： </span></div>
        <DesDVNumber v-model="ambientLight.intensity" @change="changeValue($event, ambientLight, 'intensity')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启旋转<span>： </span></div>
      <DesDVSwitch :value="viewControl.autoRotate" @change="changeValue($event, viewControl, 'autoRotate')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="viewControl.autoRotate">
      <div class="property-item-name">旋转方向<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: radios }" v-model="viewControl.autoRotateDirection" @change="changeValue($event, viewControl, 'autoRotateDirection')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="viewControl.autoRotate">
      <div class="property-item-name">旋转速度<span>： </span></div>
      <DesDVNumber :config="{ min: 1 }" v-model="viewControl.autoRotateSpeed" @change="changeValue($event, viewControl, 'autoRotateSpeed')" />
    </div>
  </div>
</template>
<script>
export default {
  name: "DesDVThreeModelConfig",
  props: {
    owner: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      staticFile: dsf.config.setting_dataview_upload_static == 1 || false,
      radios: [
        {
          text: "顺时针",
          value: "cw",
        },
        {
          text: "逆时针",
          value: "cww",
        },
      ],
      threeOptions: {},
    };
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
    ambientLight() {
      return this.threeOptions.lights[0];
    },
    viewControl() {
      return this.threeOptions.viewControl;
    },
    model() {
      return this.threeOptions.model;
    },
  },
  created() {
    this.threeOptions = this.owner.threeOptions;
    dsf.emit.$on(
      "updatePropertyThree",
      () => {
        this.threeOptions = this.owner.threeOptions;
      },
      this.owner.$children[0]
    );
    this._updateThree = _.debounce(this.updateThree, 500);
  },
  methods: {
    uploadSuccess(res) {
      const data = res.data;
      if (!res.success) {
        return dsf.layer.message(res.message, false);
      }
      dsf.layer.message("上传成功", true);
      this.$set(this.threeOptions.model, "url", this.filesArgs.getFilePath(data));
      this._updateThree();
    },
    uploadError() {
      dsf.layer.message("模型上传失败", false);
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this._updateThree();
    },
    updateThree() {
      dsf.emit.$emit(
        "updateThree",
        {
          threeOptions: this.threeOptions,
        },
        [this.owner.$children[0]]
      );
    },
  },
  beforeDestroy() {
    dsf.emit.$remove("updatePropertyThree", this.owner.$children[0]);
  },
};
</script>

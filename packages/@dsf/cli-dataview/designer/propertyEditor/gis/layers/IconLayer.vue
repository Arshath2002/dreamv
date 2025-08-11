<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">宽<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="icon.itemStyle.iconSize[0]" @change="changeValue($event, icon.itemStyle.iconSize, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">高<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="icon.itemStyle.iconSize[1]" @change="changeValue($event, icon.itemStyle.iconSize, 1)" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">图标图片<span>： </span></div>
      <DesDVSelect :data="{ dictionary: markers }" :value="getSymbol(icon.itemStyle.icon)" @change="changeSymbol($event, icon.itemStyle)" />
    </div>
    <div class="ds-designer-property property-item" v-if="getSymbol(icon.itemStyle.icon) != 'default'">
      <div class="property-item-name">开启静态<span>： </span></div>
      <DesDVSwitch v-model="staticFile" />
      <DesDVToolTipsIcon
        style="margin-top: 2px"
        :data="{
          desc: `${filesArgs.msg}`,
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="getSymbol(icon.itemStyle.icon) != 'default'">
      <div class="property-item-name">上传<span>： </span></div>
      <div class="image-upload-wrap">
        <el-upload
          class="img-wrap"
          :action="uploadAction"
          :headers="headers"
          :show-file-list="false"
          :on-success="(e) => uploadSuccess(e, icon.itemStyle)"
          :on-error="uploadError"
          :data="extendData"
          accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
        >
          <el-image fit="container" v-if="icon.itemStyle.icon" :src="icon.itemStyle.icon | getWebPath">
            <div slot="error" class="el-image__error">无效图片</div>
          </el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <DsfIcon class="del-icon" name="close" v-if="icon.itemStyle.icon" @click.stop="clearImage(icon.itemStyle)"> </DsfIcon>
      </div>
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示层级<span>： </span></div>
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="icon.zooms[0]" @change="changeValue($event, icon.zooms, 0)" />&nbsp;~&nbsp;
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="icon.zooms[1]" @change="changeValue($event, icon.zooms, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图例显示<span>： </span></div>
      <DesDVSwitch :value="legend.show" @change="changeValue($event, legend, 'show')" />
    </div>
    <!-- 标签设置 -->
    <LabelConfig :label="label" @updateGisLayer="updateGisLayer" />
  </div>
</template>
<script>
import LabelConfig from "./LabelConfig.vue";
export default {
  name: "IconLayer",
  props: {
    layer: {
      type: Object,
      require: true,
    },
  },
  components: { LabelConfig },
  computed: {
    icon() {
      return this.layer.icon;
    },
    label() {
      return this.layer.label;
    },
    legend() {
      return this.layer.legend;
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
      markers: [
        {
          text: "默认",
          value: "default",
        },

        {
          text: "自定义",
          value: "custom",
        },
      ],
      symbols: ["default"],
    };
  },
  methods: {
    clearImage(item) {
      this.$set(item, "icon", "");
      this.updateGisLayer();
    },
    uploadSuccess({ data }, item) {
      this.$set(item, "icon", this.filesArgs.getFilePath(data));
      this.updateGisLayer();
    },
    uploadError() {
      dsf.layer.message("图片上传失败", false);
    },
    getSymbol($symbol) {
      if (!this.symbols.includes($symbol)) {
        return "custom";
      } else {
        return $symbol;
      }
    },
    changeSymbol(e, item) {
      let val = "";
      if (e !== "custom") {
        val = e;
        this.$set(item, "icon", val);
        this.updateGisLayer();
      } else {
        this.$set(item, "icon", val);
      }
    },
    updateGisLayer() {
      this.$emit("updateGisLayer");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.updateGisLayer();
    },
  },
};
</script>

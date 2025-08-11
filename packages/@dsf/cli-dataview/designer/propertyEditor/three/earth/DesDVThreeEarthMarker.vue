<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">形状<span>： </span></div>
      <DesDVSelect :data="{ dictionary: markers }"  :value="getSymbol(series.symbol)" @change="changeSymbol($event, series)" />
    </div>
    <template v-if="getSymbol(series.symbol) === 'custom'">
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
        <div class="property-item-name">上传<span>： </span></div>
        <div class="image-upload-wrap">
          <el-upload
            class="img-wrap"
            :action="uploadAction"
            :headers="headers"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :data="extendData"
            accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
          >
            <el-image fit="container" v-if="series.symbol" :src="series.symbol | getWebPath">
              <div slot="error" class="el-image__error">无效图片</div>
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <DsfIcon class="del-icon" name="close" v-if="series.symbol" @click.stop="clearImage"> </DsfIcon>
        </div>
      </div>
    </template>
    <div class="ds-designer-property property-item ml20 float-one-row">
      <div class="property-item-name">宽度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0 }" :value="series.symbolSize[0]" @change="changeValue($event, series.symbolSize, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">高度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0 }" :value="series.symbolSize[1]" @change="changeValue($event, series.symbolSize, 1)" />
    </div>
    <div class="ds-designer-property property-item ml20 float-one-row">
      <div class="property-item-name">缩放<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0 }" :value="series.scale" @change="changeValue($event, series, 'scale')" />
    </div>
    <commonLabel :label="series.label" @updateLabel="updateLabel" />
  </div>
</template>
<script>
import commonLabel from "../setting/commonLabel.vue";

export default {
  name: "DesDVThreeEarthMarker",
  components: {
    commonLabel,
  },
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      staticFile: dsf.config.setting_dataview_upload_static == 1 || false,
      symbols: ["default"],
      textConfig: {
        picker: { type: "color" },
      },
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
  },
  methods: {
    clearImage() {
      this.$set(this.series, "symbol", "");
      this.$emit("updateThree");
    },
    uploadSuccess({ data }) {
      this.$set(this.series, "symbol", this.filesArgs.getFilePath(data));
      this.$emit("updateThree");
    },
    uploadError() {
      dsf.layer.message("图片上传失败", false);
    },
    updateLabel() {
      this.$emit("updateThree");
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
        this.$set(item, "symbol", val);
        this.$emit("updateThree");
      } else {
        this.$set(item, "symbol", val);
      }
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateThree");
    },
  },
};
</script>

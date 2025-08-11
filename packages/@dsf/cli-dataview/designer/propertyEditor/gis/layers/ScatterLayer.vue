<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">宽<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="scatter.itemStyle.size[0]" @change="changeValue($event, scatter.itemStyle.size, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">高<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="scatter.itemStyle.size[1]" @change="changeValue($event, scatter.itemStyle.size, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启纹理<span>： </span></div>
      <DesDVSwitch :value="scatter.itemStyle.useDefaultTexture" @change="changeValue($event, scatter.itemStyle, 'useDefaultTexture')" />
    </div>
    <!-- 图片 -->
    <template v-if="scatter.itemStyle.useDefaultTexture">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">贴地点图片<span>： </span></div>
        <DesDVSelect :data="{ dictionary: markers }" :value="getSymbol(scatter.itemStyle.texture)" @change="changeSymbol($event, scatter.itemStyle)" />
      </div>
      <div class="ds-designer-property property-item" v-if="getSymbol(scatter.itemStyle.texture) != 'default'">
        <div class="property-item-name">开启静态<span>： </span></div>
        <DesDVSwitch v-model="staticFile" />
        <DesDVToolTipsIcon
          style="margin-top: 2px"
          :data="{
            desc: `${filesArgs.msg}`,
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item ml20" v-if="getSymbol(scatter.itemStyle.texture) != 'default'">
        <div class="property-item-name">上传<span>： </span></div>
        <div class="image-upload-wrap">
          <el-upload
            class="img-wrap"
            :action="uploadAction"
            :headers="headers"
            :show-file-list="false"
            :on-success="(e) => uploadSuccess(e, scatter.itemStyle)"
            :on-error="uploadError"
            :data="extendData"
            accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
          >
            <el-image fit="container" v-if="scatter.itemStyle.texture" :src="scatter.itemStyle.texture | getWebPath">
              <div slot="error" class="el-image__error">无效图片</div>
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <DsfIcon class="del-icon" name="close" v-if="scatter.itemStyle.texture" @click.stop="clearImage(scatter.itemStyle)"> </DsfIcon>
        </div>
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">开启动画<span>： </span></div>
        <DesDVSwitch :value="scatter.itemStyle.animate" @change="changeAnimateValue($event, scatter.itemStyle, 'animate')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="scatter.itemStyle.animate">
        <div class="property-item-name">动画时长(ms)<span>： </span></div>
        <DesDVNumber :config="{ min: 0 }" v-model="scatter.itemStyle.duration" @change="changeValue($event, scatter.itemStyle, 'duration')" />
      </div>
    </template>
    <!-- 不使用图片 -->
    <template v-else>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">贴地点颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="scatter.itemStyle.color" @change="changeValue($event, scatter.itemStyle, 'color')" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">开启悬浮<span>： </span></div>
        <DesDVSwitch :value="scatter.emphasis.show" @change="changeValue($event, scatter.emphasis, 'show')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="scatter.emphasis.show">
        <div class="property-item-name">悬浮颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="scatter.emphasis.itemStyle.color" @change="changeValue($event, scatter.emphasis.itemStyle, 'color')" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">贴地点轮廓<span>： </span></div>
        <DesDVNumber :config="{ min: 0 }" v-model="scatter.itemStyle.borderWidth" @change="changeValue($event, scatter.itemStyle, 'borderWidth')" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">轮廓颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="scatter.itemStyle.borderColor" @change="changeValue($event, scatter.itemStyle, 'borderColor')" />
      </div>
    </template>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示层级<span>： </span></div>
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="scatter.zooms[0]" @change="changeValue($event, scatter.zooms, 0)" />&nbsp;~&nbsp;
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="scatter.zooms[1]" @change="changeValue($event, scatter.zooms, 1)" />
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
  name: "ScatterLayer",
  props: {
    layer: {
      type: Object,
      require: true,
    },
  },
  components: { LabelConfig },
  computed: {
    scatter() {
      return this.layer.scatter;
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
      colorConfig: {
        type: "color",
      },
    };
  },
  methods: {
    clearImage(item) {
      this.$set(item, "texture", "");
      this.updateGisLayer();
    },
    uploadSuccess({ data }, item) {
      this.$set(item, "texture", this.filesArgs.getFilePath(data));
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
        this.$set(item, "texture", val);
        this.updateGisLayer();
      } else {
        this.$set(item, "texture", val);
      }
    },
    updateGisLayer() {
      this.$emit("updateGisLayer");
    },
    changeAnimateValue(val, item, key) {
      this.$set(item, key, val);
      if (val) {
        this.$set(this.scatter.itemStyle, "duration", 2000);
      } else {
        this.$set(this.scatter.itemStyle, "duration", 0);
      }
      this.updateGisLayer();
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.updateGisLayer();
    },
  },
};
</script>

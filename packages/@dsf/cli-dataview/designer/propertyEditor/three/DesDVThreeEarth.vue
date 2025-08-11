<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">地图半径<span>： </span></div>
      <DesDVNumber :config="{ min: 10 }" v-model="configEarth.radius" @change="changeValue($event, configEarth, 'radius')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启旋转<span>： </span></div>
      <DesDVSwitch :value="viewControl.autoRotate" @change="changeValue($event, viewControl, 'autoRotate')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="viewControl.autoRotate">
      <div class="property-item-name">旋转方向<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: radios }"  v-model="viewControl.autoRotateDirection" @change="changeValue($event, viewControl, 'autoRotateDirection')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="viewControl.autoRotate">
      <div class="property-item-name">旋转速度<span>： </span></div>
      <DesDVNumber :config="{ min: 1 }" v-model="viewControl.autoRotateSpeed" @change="changeValue($event, viewControl, 'autoRotateSpeed')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">地球贴图<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: markers }" :value="getSymbol(earth.texture)" @change="changeSymbol($event, earth)" />
    </div>

    <template v-if="!['default', 'satellite'].includes(getSymbol(earth.texture))">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">开启静态<span>： </span></div>
        <DesDVSwitch v-model="staticFile" />
        <DesDVToolTipsIcon
          style="margin-top: 2px"
          :data="{
            desc: `${filesArgs.msg}`,
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item ml20">
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
            <el-image fit="container" v-if="earth.texture" :src="earth.texture | getWebPath">
              <div slot="error" class="el-image__error">无效图片</div>
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <DsfIcon class="del-icon" name="close" v-if="earth.texture" @click.stop="clearImage(earth)"></DsfIcon>
        </div>
      </div>
    </template>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">大气层颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="earth.aureola.color" @change="changeValue($event, earth.aureola, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启光罩<span>： </span></div>
      <DesDVSwitch :value="earth.border.show" @change="changeValue($event, earth.border, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="earth.border.show">
      <div class="property-item-name">光罩颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="earth.border.color" @change="changeValue($event, earth.border, 'color')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="earth.border.show">
      <div class="property-item-name">光罩半径<span>： </span></div>
      <DesDVNumber :config="{ min: 1 }" v-model="earth.border.radius" @change="changeValue($event, earth.border, 'radius')" />
    </div>
    <!-- 卫星设置 -->
    <div class="ds-designer-property property-item">
      <div class="property-item-name">卫星设置<span>： </span></div>
      <DesDVSwitch :value="satellite.show" @change="changeValue($event, satellite, 'show')" />
    </div>
    <DesDVThreeEarthSatellite v-if="satellite.show" :satellites="satellite.data" @updateThree="_updateThree" />
  </div>
</template>
<script>
import DesDVThreeEarthSatellite from "./earth/DesDVThreeEarthSatellite.vue";
export default {
  name: "DesDVThreeEarth",
  components: { DesDVThreeEarthSatellite },
  props: {
    owner: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      staticFile: dsf.config.setting_dataview_upload_static == 1 || false,

      threeOptions: null,
      symbols: ["default", "satellite"],
      markers: [
        {
          text: "默认",
          value: "default",
        },
        {
          text: "卫星影像",
          value: "satellite",
        },

        {
          text: "自定义",
          value: "custom",
        },
      ],
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
      textConfig: {
        picker: { type: "color" },
      },
      colorConfig: {
        type: "color",
      },
    };
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
  beforeDestroy() {
    dsf.emit.$remove("updatePropertyThree", this.owner.$children[0]);
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

    // 球体
    earth() {
      return this.threeOptions.earth;
    },
    configEarth() {
      return this.threeOptions.config;
    },
    viewControl() {
      return this.threeOptions.viewControl;
    },
    satellite() {
      return this.threeOptions.satellite;
    },
    colorFilter: {
      get() {
        const val = this.mapOptions.mirror.color;
        return `linear-gradient(0deg,${val[0]} 0%, ${val[1]} 100%)`;
      },
      set(val) {
        const reg = /(rgb[a]?\(.*?\)|#[0-9A-z]{3,6})/g;
        const result = (val + "").match(reg);
        const [old_b, old_t] = this.mapOptions.mirror.color;
        if (result && result.length > 1) {
          const color = [result[0], result[1]];
          if (old_b != result[0] || old_t != result[1]) {
            this.$set(this.mapOptions.mirror, "color", color);
            this._updateThree();
          }
        }
      },
    },
  },
  methods: {
    clearImage(item) {
      this.$set(item, "texture", "");
      this._updateThree();
    },
    uploadSuccess({ data }) {
      this.$set(this.earth, "texture", this.filesArgs.getFilePath(data));
      this._updateThree();
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
        this._updateThree();
      } else {
        this.$set(item, "texture", val);
      }
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
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>

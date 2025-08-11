<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="itemStyle.topColor" @change="changeValue($event, itemStyle, 'topColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">侧边颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="itemStyle.sideColor" @change="changeValue($event, itemStyle, 'sideColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">侧边动效<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="itemStyle.uColor" @change="changeValue($event, itemStyle, 'uColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">区域边线<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="mapOptions.lineStyle.color" @change="changeValue($event, mapOptions.lineStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">边界颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="mapOptions.outLineStyle.color" @change="changeValue($event, mapOptions.outLineStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启镜面<span>： </span></div>
      <DesDVSwitch :value="mapOptions.mirror.show" @change="changeValue($event, mapOptions.mirror, 'show')" />
      <DesDVToolTipsIcon :data="{ desc: '镜面无法透明背景' }" :descStriking="false"></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="mapOptions.mirror.show">
      <div class="property-item-name">镜面颜色<span>： </span></div>
      <DesDVColorPicker key="linear" :config="{ type: 'linear' }" v-model="colorFilter" />
    </div>

    <commonLabel :label="mapOptions.label" labelText="地区名称" @updateLabel="_updateThree" />

    <div class="ds-designer-property property-item">
      <div class="property-item-name">悬浮效果<span>： </span></div>
      <DesDVSwitch :value="mapOptions.emphasis.show" @change="changeValue($event, mapOptions.emphasis, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="mapOptions.emphasis.show">
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="mapOptions.emphasis.topColor" @change="changeValue($event, mapOptions.emphasis, 'topColor')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="mapOptions.emphasis.show">
      <div class="property-item-name">标签样式<span>： </span></div>
      <DesDVTextStyle :config="textConfig" class="min" v-model="emphasisTextStyle"></DesDVTextStyle>
    </div>

    <template v-if="mapOptions.texture">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">开启纹理<span>： </span></div>
        <DesDVSwitch :value="mapOptions.texture.show" @change="changeValue($event, mapOptions.texture, 'show')" />
      </div>
      <div class="ds-designer-property property-item" v-if="mapOptions.texture.show">
        <div class="property-item-name">纹理<span>： </span></div>
        <DesDVSelect :data="{ dictionary: markers }"  :value="getSymbol(mapOptions.texture.image)" @change="changeSymbol($event, mapOptions.texture)" />
      </div>
      <template v-if="mapOptions.texture.show && getSymbol(mapOptions.texture.image) != 'default'">
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
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">上传<span>： </span></div>
          <div class="image-upload-wrap">
            <el-upload
              class="img-wrap"
              :action="uploadAction"
              :headers="headers"
              :show-file-list="false"
              :on-success="(e) => uploadSuccess(e, mapOptions.texture)"
              :on-error="uploadError"
              :data="extendData"
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
            >
              <el-image fit="container" v-if="mapOptions.texture.image" :src="mapOptions.texture.image | getWebPath">
                <div slot="error" class="el-image__error">无效图片</div>
              </el-image>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <DsfIcon class="del-icon" name="close" v-if="mapOptions.texture.image" @click.stop="clearImage(mapOptions.texture)"> </DsfIcon>
          </div>
        </div>
      </template>
      <div class="ds-designer-property property-item ml20 float-one-row" v-if="mapOptions.texture.show">
        <div class="property-item-name">偏移X<span>： </span></div>
        <DesDVNumber class="min" v-model="mapOptions.texture.offset.x" @change="changeValue($event, mapOptions.texture.offset, 'x')" />
      </div>
      <div class="ds-designer-property property-item float-one-row" v-if="mapOptions.texture.show">
        <div class="property-item-name">偏移Y<span>： </span></div>
        <DesDVNumber class="min" v-model="mapOptions.texture.offset.y" @change="changeValue($event, mapOptions.texture.offset, 'y')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">地图深度<span>： </span></div>
      <DesDVNumber v-model="mapOptions.config.depth" @change="changeValue($event, mapOptions.config, 'depth')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">禁止鼠标旋转<span>： </span></div>
      <DesDVSwitch :value="mapOptions.config.disableRotate" @change="changeValue($event, mapOptions.config, 'disableRotate')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">禁止鼠标缩放<span>： </span></div>
      <DesDVSwitch :value="mapOptions.config.disableZoom" @change="changeValue($event, mapOptions.config, 'disableZoom')" />
    </div>
    <div class="ds-designer-property property-item" v-if="mapOptions.autoRotate">
      <div class="property-item-name">开启旋转<span>： </span></div>
      <DesDVSwitch :value="mapOptions.autoRotate.autoRotate" @change="changeValue($event, mapOptions.autoRotate, 'autoRotate')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="mapOptions.autoRotate && mapOptions.autoRotate.autoRotate">
      <div class="property-item-name">旋转速度<span>： </span></div>
      <DesDVNumber :config="{ min: 1 }" v-model="mapOptions.autoRotate.autoRotateSpeed" @change="changeValue($event, mapOptions.autoRotate, 'autoRotateSpeed')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启网格<span>： </span></div>
      <DesDVSwitch :value="mapOptions.grid.show" @change="changeValue($event, mapOptions.grid, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="mapOptions.grid.show">
      <div class="property-item-name">网格颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="mapOptions.grid.color" @change="changeValue($event, mapOptions.grid, 'color')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="mapOptions.grid.show">
      <div class="property-item-name">透明度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, step: 0.1 }" v-model="mapOptions.grid.opacity" @change="changeValue($event, mapOptions.grid, 'opacity')" />
    </div>
    <template v-if="mapOptions.foundation">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">开启底图<span>： </span></div>
        <DesDVSwitch :value="mapOptions.foundation.show" @change="changeValue($event, mapOptions.foundation, 'show')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="mapOptions.foundation.show">
        <div class="property-item-name">旋转速度<span>： </span></div>
        <DesDVNumber :config="{ min: 0, step: 0.1 }" v-model="mapOptions.foundation.speed" @change="changeValue($event, mapOptions.foundation, 'speed')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="mapOptions.foundation.show">
        <div class="property-item-name">大小<span>： </span></div>
        <DesDVNumber :config="{ min: 0 }" v-model="mapOptions.foundation.size" @change="changeValue($event, mapOptions.foundation, 'size')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="mapOptions.foundation.show">
        <div class="property-item-name">图片<span>： </span></div>
        <DesDVSelect :data="{ dictionary: markers }" :value="getSymbol(mapOptions.foundation.image)" @change="changeSymbol($event, mapOptions.foundation)" />
      </div>

      <template v-if="mapOptions.foundation.show && getSymbol(mapOptions.foundation.image) != 'default'">
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
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">上传<span>： </span></div>
          <div class="image-upload-wrap">
            <el-upload
              class="img-wrap"
              :action="uploadAction"
              :headers="headers"
              :show-file-list="false"
              :on-success="(e) => uploadSuccess(e, mapOptions.foundation)"
              :on-error="uploadError"
              :data="extendData"
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
            >
              <el-image fit="container" v-if="mapOptions.foundation.image" :src="mapOptions.foundation.image | getWebPath">
                <div slot="error" class="el-image__error">无效图片</div>
              </el-image>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <DsfIcon class="del-icon" name="close" v-if="mapOptions.foundation.image" @click.stop="clearImage(mapOptions.foundation)"> </DsfIcon>
          </div>
        </div>
      </template>

      <template v-if="mapOptions.wall">
        <div class="ds-designer-property property-item">
          <div class="property-item-name">电子围栏<span>： </span></div>
          <DesDVSwitch :value="mapOptions.wall.show" @change="changeValue($event, mapOptions.wall, 'show')" />
        </div>
        <div class="ds-designer-property property-item ml20" v-if="mapOptions.wall.show">
          <div class="property-item-name">高度<span>： </span></div>
          <DesDVNumber :config="{ min: 0 }" v-model="mapOptions.wall.height" @change="changeValue($event, mapOptions.wall, 'height')" />
        </div>
        <div class="ds-designer-property property-item ml20" v-if="mapOptions.wall.show">
          <div class="property-item-name">颜色<span>： </span></div>
          <DesDVColorPicker :config="colorConfig" v-model="mapOptions.wall.color" @change="changeValue($event, mapOptions.wall, 'color')" />
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import commonLabel from "./setting/commonLabel.vue";
export default {
  name: "DesDVThreeMap",
  components: { commonLabel },
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
      symbols: ["default"],
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
    //基础地图配置
    mapOptions() {
      const { series, ...mapOptions } = this.threeOptions;
      return mapOptions;
    },
    itemStyle() {
      return this.threeOptions.itemStyle;
    },
    emphasisTextStyle: {
      get() {
        return this.mapOptions.emphasis.textStyle;
      },
      set(v) {
        Object.assign(this.mapOptions.emphasis.textStyle, v);
        this._updateThree();
      },
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
      this.$set(item, "image", "");
      this._updateThree();
    },
    uploadSuccess({ data }, item) {
      this.$set(item, "image", this.filesArgs.getFilePath(data));
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
        this.$set(item, "image", val);
        this._updateThree();
      } else {
        this.$set(item, "image", val);
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

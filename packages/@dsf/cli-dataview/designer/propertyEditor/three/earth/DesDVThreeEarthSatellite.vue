<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-09-02 14:15:36
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-06 18:01:38
-->
<template>
  <div>
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" :class="{ active: active === idx }" v-for="(it, idx) in satellites" :key="idx" :label="idx">
        轨道{{ idx + 1 }}
        <DsfIcon class="del-icon" name="close" @click="deleteSatellite(idx)" v-if="idx > 0"></DsfIcon>
      </div>
      <div class="des-dv-icon-add" @click="addSatellite" style="margin-left: 5px; margin-bottom: 0">
        <i class="add-btn el-icon-plus"></i>
      </div>
    </div>
    <div v-for="(satellite, index) in satellites" :key="index">
      <template v-if="active == index">
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">旋转方向<span>： </span></div>
          <DesDVRadioGroup :data="{ dictionary: radios }" v-model="satellite.autoRotateDirection" @change="changeValue($event, satellite, 'autoRotateDirection')" />
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">旋转速度<span>： </span></div>
          <DesDVNumber :config="{ min: 1 }" v-model="satellite.autoRotateSpeed" @change="changeValue($event, satellite, 'autoRotateSpeed')" />
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">轨道颜色<span>： </span></div>
          <DesDVColorPicker :config="colorConfig" v-model="satellite.ring.color" @change="changeValue($event, satellite.ring, 'color')" />
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">轨道半径<span>： </span></div>
          <DesDVNumber :config="{ min: 1 }" v-model="satellite.ring.radius" @change="changeValue($event, satellite.ring, 'radius')" />
        </div>
        <div class="ds-designer-property property-item float-one-row ml30">
          <div class="property-item-name">旋转X<span>： </span></div>
          <DesDVNumber :value="satellite.ring.degree[0]" @change="changeValue($event, satellite.ring.degree, 0)" />
        </div>
        <div class="ds-designer-property property-item float-one-row">
          <div class="property-item-name">Y<span>： </span></div>
          <DesDVNumber :value="satellite.ring.degree[1]" @change="changeValue($event, satellite.ring.degree, 1)" />
        </div>

        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">卫星数量<span>： </span></div>
          <DesDVNumber :config="{ min: 1 }" v-model="satellite.planet.num" @change="changeValue($event, satellite.planet, 'num')" />
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">卫星大小<span>： </span></div>
          <DesDVNumber :config="{ min: 1 }" v-model="satellite.planet.size" @change="changeValue($event, satellite.planet, 'size')" />
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">卫星贴图<span>： </span></div>
          <DesDVRadioGroup :data="{ dictionary: markers }" :value="getSymbol(satellite.planet.texture)" @change="changeSymbol($event, satellite.planet)" />
        </div>

        <template v-if="getSymbol(satellite.planet.texture) != 'default'">
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
                :on-success="(data) => uploadSuccessSatellite(data, satellite.planet)"
                :on-error="uploadError"
                :data="extendData"
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
              >
                <el-image fit="container" v-if="satellite.planet.texture" :src="satellite.planet.texture | getWebPath">
                  <div slot="error" class="el-image__error">无效图片</div>
                </el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <DsfIcon class="del-icon" name="close" v-if="satellite.planet.texture" @click.stop="clearImage(satellite.planet)"> </DsfIcon>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import createSatellite from "_dataview/output/earth/createSatellite.js";
export default {
  name: "DesDVThreeEarthSatellite",

  props: {
    satellites: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      active: 0,
      staticFile: dsf.config.setting_dataview_upload_static == 1 || false,

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

      colorConfig: {
        type: "color",
      },
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
    clearImage(item) {
      this.$set(item, "texture", "");
      this.$emit("updateThree");
    },
    uploadSuccessSatellite({ data }, item) {
      this.$set(item, "texture", this.filesArgs.getFilePath(data));
      this.$emit("updateThree");
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
        this.$emit("updateThree");
      } else {
        this.$set(item, "texture", val);
      }
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateThree");
    },
    addSatellite() {
      this.satellites.push(createSatellite());
      this.$emit("updateThree");
    },
    deleteSatellite(idx) {
      this.satellites.splice(idx);
      this.$emit("updateThree");
      if (this.active >= idx) {
        this.active--;
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>

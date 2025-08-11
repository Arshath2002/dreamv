<!--
 * @Description: 球体配置
 * @Author: shenah
 * @Date: 2024-07-26 10:09:10
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:40:11
-->

<template>
  <div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">
        半径
        <span>：</span>
      </div>
      <DesDVNumber :config="{ min: 50 }" :value="globe.globeRadius" @change="changeValue($event, globe, 'globeRadius')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">
        外
        <span>：</span>
      </div>
      <DesDVNumber :config="{ min: 50 }" :value="globe.globeOuterRadius" @change="changeValue($event, globe, 'globeOuterRadius')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        地球纹理
        <span>：</span>
      </div>
      <DesDVRadioGroup :data="{ dictionary: baseTextureOptions }" :value="globe.baseTextureType" @change="changeValue($event, globe, 'baseTextureType')"></DesDVRadioGroup>
    </div>
    <template v-if="globe.baseTextureType === 'custom'">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">
          图片
          <span>：</span>
        </div>
        <DesDVMoreImg :value="globe.baseTextureImgObj" :config="{ limitImg: 1, backgroundTypes: [], isEffect: false }" @change="changeValue($event, globe, 'baseTextureImgObj')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        自动旋转
        <span>：</span>
      </div>
      <DesDVSwitch v-model="globe.viewControl.autoRotate" @change="changeValue($event, globe.viewControl, 'autoRotate')" />
    </div>
    <template v-if="globe.viewControl.autoRotate">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">自转的方向<span>： </span></div>
        <DesDVRadioGroup
          :data="{ dictionary: autoRotateDirectionOptions }" 
          :value="globe.viewControl.autoRotateDirection"
          @change="changeValue($event, globe.viewControl, 'autoRotateDirection')"
        ></DesDVRadioGroup>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">
          速度
          <span>：</span>
        </div>
        <DesDVNumber :config="{ min: 50 }" :value="globe.viewControl.autoRotateSpeed" @change="changeValue($event, globe.viewControl, ' autoRotateSpeed')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        环境类型
        <span>：</span>
      </div>
      <DesDVRadioGroup :data="{ dictionary: environmentOptions }"  :value="globe.environmentType" @change="changeValue($event, globe, 'environmentType')"></DesDVRadioGroup>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="globe.environmentType === 'color' || globe.environmentType === 'image'">
      <div class="property-item-name">
        环境
        <span>：</span>
      </div>
      <DesDVColorPicker v-if="globe.environmentType === 'color'" v-model="environmentColor" @change="changeColor($event, globe, 'environment')"></DesDVColorPicker>
      <DesDVMoreImg
        v-else-if="globe.environmentType === 'image'"
        :value="globe.environmentImgObj"
        :config="{ limitImg: 1, backgroundTypes: [], isEffect: false }"
        @change="changeValue($event, globe, 'environmentImgObj')"
      />
    </div>
    <template v-if="globe.atmosphere">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">
          外部大气层
          <span>：</span>
        </div>
        <DesDVSwitch v-model="globe.atmosphere.show" @change="changeValue($event, globe.atmosphere, 'show')" />
      </div>
      <template v-if="globe.atmosphere.show">
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">
            偏移
            <span>：</span>
          </div>
          <DesDVNumber :config="{ min: 0 }" :value="globe.atmosphere.offset" @change="changeValue($event, globe.atmosphere, 'offset')" />
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">
            颜色
            <span>：</span>
          </div>
          <DesDVColorPicker :value="globe.atmosphere.color" @change="changeValue($event, globe.atmosphere, 'color')"></DesDVColorPicker>
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">
            发光功率
            <span>：</span>
          </div>
          <DesDVNumber :config="{ min: 1 }" :value="globe.atmosphere.glowPower" @change="changeValue($event, globe.atmosphere, 'glowPower')" />
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">
            内发光功率
            <span>：</span>
          </div>
          <DesDVNumber :config="{ min: 1 }" :value="globe.atmosphere.innerGlowPower" @change="changeValue($event, globe.atmosphere, 'innerGlowPower')" />
        </div>
      </template>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        地球着色
        <span>：</span>
      </div>
      <DesDVRadioGroup  :data="{ dictionary: shadingOptions }"  :value="globe.shading" @change="changeValue($event, globe, 'shading')"></DesDVRadioGroup>
    </div>
    <template v-if="globe.shading === 'lambert'">
      <!-- 全局光源 -->
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">
          环境光
          <span>：</span>
        </div>
        <DesDVSwitch v-model="globe.light.ambient.show" @change="changeSpecialSwitch($event, globe.light.ambient, 'ambient-show')" />
      </div>
      <template v-if="globe.light.ambient.show">
        <div class="ds-designer-property property-item" style="margin-left: 30px">
          <div class="property-item-name">
            颜色
            <span>：</span>
          </div>
          <DesDVColorPicker :value="globe.light.ambient.color" @change="changeValue($event, globe.light.ambient, 'color')"></DesDVColorPicker>
        </div>
        <div class="ds-designer-property property-item" style="margin-left: 30px">
          <div class="property-item-name">
            光强度
            <span>：</span>
          </div>
          <DesDVNumber :config="{ min: 0.1 }" :value="globe.light.ambient.intensity" @change="changeValue($event, globe.light.ambient, 'intensity')" />
        </div>
      </template>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">
          太阳光
          <span>：</span>
        </div>
        <DesDVSwitch v-model="globe.light.main.show" @change="changeSpecialSwitch($event, globe.light.main, 'main-show')" />
        <DesDVToolTipsIcon
          :data="{
            desc: '随着当前时间的变化而照在不同的地区',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <template v-if="globe.light.main.show">
        <div class="ds-designer-property property-item" style="margin-left: 30px">
          <div class="property-item-name">
            颜色
            <span>：</span>
          </div>
          <DesDVColorPicker :value="globe.light.main.color" @change="changeValue($event, globe.light.main, 'color')"></DesDVColorPicker>
        </div>
        <div class="ds-designer-property property-item" style="margin-left: 30px">
          <div class="property-item-name">
            光强度
            <span>：</span>
          </div>
          <DesDVNumber :config="{ min: 0 }" :value="globe.light.main.intensity" @change="changeValue($event, globe.light.main, 'intensity')" />
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
import defaultEarth from "_dataview/assets/img/echarts/glMap/earth.jpg";
export default {
  name: "DesDVGlobeConfig",
  mixins: [],
  props: {
    owner: {
      type: Object,
      require: true,
    },
    globe: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      baseTextureOptions: [
        {
          text: "默认",
          value: "default",
        },
        {
          text: "卫星影像",
          value: "moon",
        },
        {
          text: "自定义",
          value: "custom",
        },
      ],
      environmentOptions: [
        {
          text: "无",
          value: "no",
        },
        {
          text: "色彩",
          value: "color",
        },
        {
          text: "贴图",
          value: "image",
        },
      ],
      shadingOptions: [
        {
          text: "颜色",
          value: "color",
        },
        {
          text: "lambert",
          value: "lambert",
        },
        // {
        //   text: "真实渲染",
        //   value: "realistic",
        // },
      ],
      autoRotateDirectionOptions: [
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
      blendModeOptions: [
        {
          text: "混合",
          value: "source-over",
        },
        {
          text: "叠加",
          value: "lighter",
        },
      ],
      environmentColor: "#000",
    };
  },
  created() {
    if (this.environmentType === "color") {
      this.environmentColor = dsf.dataview.utils.convertChartToCSSColor(this.globe.environment);
    }
    if (this.globe.atmosphere === undefined) {
      this.$set(this.globe, "atmosphere", {
        show: false,
        offset: 0,
        color: "#fff",
        glowPower: "6",
        innerGlowPower: "2",
      });
    }
  },
  methods: {
    changeValue(val, item, key) {
      if (key === "baseTextureType") {
        if (val === "custom") {
          item.baseTexture = "";
          item.baseTextureImgObj.custom.image = "";
        } else if (val === "moon") {
          item.baseTexture = defaultEarth;
          item.baseTextureImgObj.custom.image = "";
        }
      } else if (key === "baseTextureImgObj") {
        let url = this.owner.handleImgSrcStr(val);
        item.baseTexture = url;
      } else if (key === "environmentType") {
        if (val === "no") {
          item.environment = "auto";
        } else if (val === "color") {
          item.environment = this.environmentColor;
        } else if (val === "image") {
          item.environmentImgObj = item.environmentImgObj ? item.environmentImgObj : _.cloneDeep(defaultBackground);
          let url = this.owner.handleImgSrcStr(item.environmentImgObj);
          item.environment = url;
        }
      } else if (key === "environmentImgObj") {
        let url = this.owner.handleImgSrcStr(val);
        item.environment = url;
      }
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
    changeSpecialSwitch(val, item, key) {
      if (key === "main-show") {
        item.intensity = val ? 1 : 0;
      } else if (key === "ambient-show") {
        item.intensity = val ? 2 : 1;
      }
      this.$set(item, "show", val);
      this.$emit("updateChart");
    },
    changeColor(val, item, key) {
      const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      if (!_.isEqual(item[key], color)) {
        this.$set(item, key, color);
        this.$emit("updateChart");
      }
    },
  },
};
</script>

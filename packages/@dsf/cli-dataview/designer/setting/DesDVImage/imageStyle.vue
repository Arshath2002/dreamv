<!--
 * @Description: 图片样式
 * @Author: shenah
 * @Date: 2025-02-21 10:20:07
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-09 11:23:59
-->

<template>
  <div class="hover-attr-wrap">
    <template v-if="form[form.active]">
      <div class="hover-attr-item">
        <div class="hover-attr-item-name">填充模式：</div>
        <el-select :value="form[form.active].size" @change="commonChange($event, form[form.active], 'size')" placeholder="请选择填充模式" size="small">
          <el-option @click.native.stop :key="item.value" :label="item.text" :value="item.value" v-for="item in fillOptions" />
        </el-select>
      </div>
      <template v-if="form[form.active].size === 'custom'">
        <div class="hover-attr-wrap-row">
          <div class="hover-attr-item">
            <div class="hover-attr-item-name">宽：</div>
            <DesDVPixel class="small-input" :value="form[form.active].customW" @change="commonChange($event, form[form.active], 'customW')" />
          </div>
          <div class="hover-attr-item">
            <div class="hover-attr-item-name">高：</div>
            <DesDVPixel class="small-input" :value="form[form.active].customH" @change="commonChange($event, form[form.active], 'customH')" />
          </div>
        </div>
      </template>
      <div class="hover-attr-item">
        <div class="hover-attr-item-name">平铺模式：</div>
        <el-select :value="form[form.active].repeat" @change="commonChange($event, form[form.active], 'repeat')" placeholder="请选择填充模式" size="small">
          <el-option @click.native.stop :key="item.value" :label="item.text" :value="item.value" v-for="item in tilingOptions" />
        </el-select>
      </div>
      <div class="hover-attr-item">
        <div class="hover-attr-item-name">定制位置：</div>
        <DesDVSwitch :value="form[form.active].isCustomPosition" @change="customPositionChange($event, form[form.active], 'isCustomPosition')" />
      </div>
      <template v-if="form[form.active].isCustomPosition">
        <div class="hover-attr-wrap-row">
          <div class="hover-attr-item">
            <div class="hover-attr-item-name">X：</div>
            <DesDVPixel style="width: 90px" :value="form[form.active].customX" @change="commonChange($event, form[form.active], 'customX')" />
          </div>
          <div class="hover-attr-item">
            <div class="hover-attr-item-name">Y：</div>
            <DesDVPixel style="width: 90px" :value="form[form.active].customY" @change="commonChange($event, form[form.active], 'customY')" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="hover-attr-wrap-row" style="justify-content: flex-start" v-if="Array.isArray(form[form.active].position)">
          <Direction
            type="horizontal"
            :mapData="hMapData"
            :value="form[form.active].position[0]"
            @input="commonChange($event, form[form.active].position, '0')"
            style="padding: 0 10px 0 20px; width: 100px"
          ></Direction>
          <Direction type="vertical" :mapData="vMapData" :value="form[form.active].position[1]" @input="commonChange($event, form[form.active].position, '1')" style="width: 100px"></Direction>
        </div>
      </template>
      <template v-if="form[form.active].filterConfig && config.isFilter">
        <div class="hover-attr-item">
          <div class="hover-attr-item-name">高斯模糊：</div>
          <el-slider class="dv-des-slider" :value="form[form.active].filterConfig.blur" @input="commonChange($event, form[form.active].filterConfig, 'blur')"> </el-slider>
        </div>

        <div class="hover-attr-item">
          <div class="hover-attr-item-name">滤镜：</div>
          <DesDVSwitch :value="form[form.active].filterConfig.show" @change="filterChange($event, form[form.active].filterConfig, 'show')" />
        </div>
        <template v-if="form[form.active].filterConfig.show">
          <div class="hover-attr-item">
            <div class="hover-attr-item-name">色相：</div>
            <el-slider class="dv-des-slider" :value="form[form.active].filterConfig.hueRotate" @input="commonChange($event, form[form.active].filterConfig, 'hueRotate')" :min="0" :max="360">
            </el-slider>
          </div>
          <div class="hover-attr-item">
            <div class="hover-attr-item-name">饱和度：</div>
            <el-slider class="dv-des-slider" :value="form[form.active].filterConfig.saturate" @input="commonChange($event, form[form.active].filterConfig, 'saturate')" :min="0" :max="2" :step="0.01">
            </el-slider>
          </div>
          <div class="hover-attr-item">
            <div class="hover-attr-item-name">对比度：</div>
            <el-slider class="dv-des-slider" :value="form[form.active].filterConfig.contrast" @input="commonChange($event, form[form.active].filterConfig, 'contrast')" :min="0" :max="2" :step="0.01">
            </el-slider>
          </div>
          <div class="hover-attr-item">
            <div class="hover-attr-item-name">亮度：</div>
            <el-slider
              class="dv-des-slider"
              :value="form[form.active].filterConfig.brightness"
              @input="commonChange($event, form[form.active].filterConfig, 'brightness')"
              :min="0"
              :max="2"
              :step="0.01"
            >
            </el-slider>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>
<script>
import { fillOptions, tilingOptions, hMapData, vMapData } from "_dataview/output/config/backgroundExtend.js";
export default {
  name: "ImageStyle",
  props: {
    form: {
      type: Object,
      require: true,
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    Direction: Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_private" */ "_dataview/designer/setting/graph/config/tool/direction.vue")),
  },
  data() {
    return {
      fillOptions,
      tilingOptions,
      hMapData,
      vMapData,
    };
  },
  methods: {
    customPositionChange(val, item, key) {
      if (!val) {
        this.form[this.form.active].position[0] = "center";
        this.form[this.form.active].position[1] = "center";
      }
      this.commonChange(val, item, key);
    },
    filterChange(val, item, key) {
      this.$set(item, key, val);
      if (!val) {
        const form = this.form;

        this.$set(form[form.active].filterConfig, "hueRotate", 0);
        this.$set(form[form.active].filterConfig, "saturate", 1);
        this.$set(form[form.active].filterConfig, "contrast", 1);
        this.$set(form[form.active].filterConfig, "brightness", 1);
      }
      this.$emit("updateData", this.form);
    },
    commonChange(val, item, key) {
      if (val == item[key]) return false;
      this.$set(item, key, val);
      this.$emit("updateData", this.form);
    },
  },
};
</script>

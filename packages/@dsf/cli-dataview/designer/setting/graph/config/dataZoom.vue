<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-06-13 14:04:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 14:04:58
-->
<!--
 * @Description: 类目轴的样式设置
 * @Author: shenah
 * @Date: 2023-06-28 10:46:15
 * @LastEditors: shenah
 * @LastEditTime: 2024-07-09 13:45:05
-->
<template>
  <div class="ds-common-chart-config">
    <div class="axis-list">
      <div class="cell-item">
        <div class="config-title">
          <div class="config-title-outer">
            <div>类目轴宽度</div>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="当以x轴为类目轴时表示宽度,当以y轴为类目轴时这个为高度"
            >
              <i
                class="graph-icon-tip el-icon-warning-outline"
                slot="reference"
              ></i>
            </el-popover>
          </div>
        </div>
        <el-input
          class="mtext"
          size="small"
          v-model="dataZoomOptions.width"
        ></el-input>
      </div>
      <div class="cell-item">
        <div class="config-title">
          <div class="config-title-outer">
            <div>类目轴高度</div>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="当以x轴为类目轴时表示高度,当以y轴为类目轴时这个为宽度"
            >
              <i
                class="graph-icon-tip el-icon-warning-outline"
                slot="reference"
              ></i>
            </el-popover>
          </div>
        </div>
        <el-input
          class="mtext"
          size="small"
          v-model="dataZoomOptions.height"
        ></el-input>
      </div>
      <div class="cell-item">
        <div class="config-title">类目轴底色</div>
        <el-color-picker
          size="small"
          v-model="dataZoomOptions.backgroundColor"
          show-alpha
        ></el-color-picker>
      </div>
      <div class="cell-item">
        <div class="config-title">类目轴颜色</div>
        <el-color-picker
          size="small"
          v-model="dataZoomOptions.fillerColor"
          show-alpha
        ></el-color-picker>
      </div>
      <div class="cell-item">
        <div class="config-title">类目轴点背景色</div>
        <el-color-picker
          size="small"
          v-model="dataZoomOptions.handleColor"
          show-alpha
          @change="changeHandleColor"
        ></el-color-picker>
      </div>
      <div class="cell-item">
        <div class="config-title">两侧缩放手柄的大小</div>
        <el-input-number
          class="common-width"
          v-model="dataZoomOptions.handleSize"
          :controls="false"
          :min="10"
        ></el-input-number>
      </div>
      <div class="cell-item">
        <div class="config-title">两侧缩放手柄的图标</div>
        <el-select
          size="small"
          v-model="dataZoomOptions.selectHandleIcon"
          @change="changeHandleIcon"
          placeholder="请选择"
        >
          <el-option
            v-for="item in handleIconOptions"
            :value="item.value"
            :key="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <div
        class="cell-item"
        style="width: 100%"
        v-if="dataZoomOptions.selectHandleIcon === 'custom'"
      >
        <div class="config-title">两侧缩放手柄自定义图标</div>
        <el-input
          readonly="readonly"
          style="width: 200px; margin: 0 5px"
          placeholder="请输入内容"
          size="small"
          :value="dataZoomOptions.handleIcon"
        ></el-input>
        <button
          class="upload-button el-button el-button--small"
          style="box-sizing: border-box; height: 32px"
        >
          <span
            @click.stop="uploadClick"
            style="
              display: flex;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
            "
          >
            点击上传
          </span>
          <input
            @change="changeIconImage"
            type="file"
            class="upload-input"
            style="display: none"
          />
        </button>
      </div>
      <div class="cell-item" style="width: 100%">
        <div class="config-title">边距设置（上、右、下、左）</div>
        <el-row :gutter="2">
          <el-col :span="6">
            <el-input
              size="small"
              v-model="dataZoomOptions.top"
              placeholder="上"
              class="mtext"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-input
              size="small"
              v-model="dataZoomOptions.right"
              placeholder="右"
              class="mtext"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-input
              size="small"
              v-model="dataZoomOptions.bottom"
              placeholder="下"
              class="mtext"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-input
              size="small"
              v-model="dataZoomOptions.left"
              placeholder="左"
              class="mtext"
            ></el-input>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import svgAndImageUpload from "_dataview/mixins/svgAndImageUpload.js"
export default {
  name: "dataZoomConfig",
  mixins: svgAndImageUpload,
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      handleIconOptions: [
        {
          label: "默认",
          value:
            "M512 512m-208 0a6.5 6.5 0 1 0 416 0 6.5 6.5 0 1 0-416 0Z M512 192C335.264 192 192 335.264 192 512c0 176.736 143.264 320 320 320s320-143.264 320-320C832 335.264 688.736 192 512 192zM512 800c-159.072 0-288-128.928-288-288 0-159.072 128.928-288 288-288s288 128.928 288 288C800 671.072 671.072 800 512 800z",
        },
        {
          label: "自定义",
          value: "custom",
        },
      ],
      // 初始化属性为了以后增加属性准备
      baseConfig: {
        width: "auto",
        height: 16,
        backgroundColor: "rgba(0, 48, 98, 0.05)",
        fillerColor: "#018BFF",
        handleColor: "#cecece",
        handleStyle: {
          borderColor: "#cecece",
        },
        orient: "horizontal",
        top: "auto",
        right: "20",
        left: "5",
        bottom: "12",
        type: "slider",
        show: true,
        textStyle: {
          color: "#DCF0FF",
        },
        borderColor: "none",
        handleIcon:
          "M512 512m-208 0a6.5 6.5 0 1 0 416 0 6.5 6.5 0 1 0-416 0Z M512 192C335.264 192 192 335.264 192 512c0 176.736 143.264 320 320 320s320-143.264 320-320C832 335.264 688.736 192 512 192zM512 800c-159.072 0-288-128.928-288-288 0-159.072 128.928-288 288-288s288 128.928 288 288C800 671.072 671.072 800 512 800z",
        handleSize: 15,
        showDetail: false,
        brushSelect: false,
      },
      dataZoomOptions: {},
    };
  },
  mounted() {
    // 用于进行回显
    let selectHandleIcon = "custom";
    let dataZoomOptions = {
      ..._.cloneDeep(this.baseConfig),
      ...this.options,
    };
    if (
      this.handleIconOptions.findIndex(
        (item) => item.value === dataZoomOptions.handleIcon
      ) > -1
    ) {
      selectHandleIcon = dataZoomOptions.handleIcon;
    }
    dataZoomOptions.selectHandleIcon = selectHandleIcon;
    this.dataZoomOptions = dataZoomOptions;
  },
  watch: {
    dataZoomOptions: {
      handler(val) {
        const options = Object.assign(this.options, val);
        this.$emit("change-options", { type: "dataZoom", options });
      },
      deep: true,
    },
  },
  methods: {
    changeHandleIcon(val) {
      if (val !== "custom") {
        this.dataZoomOptions.handleIcon = val;
      } else {
        this.dataZoomOptions.handleIcon = "";
      }
    },
    changeHandleColor(val) {
      this.dataZoomOptions.handleColor = val;
      this.dataZoomOptions.handleStyle.handleColor = val;
    },
    changeIconImage(e) {
      this.changeSymbolImage(e, {}, (val) => {
        this.dataZoomOptions.handleIcon = val;
      });
    },
  },
};
</script>

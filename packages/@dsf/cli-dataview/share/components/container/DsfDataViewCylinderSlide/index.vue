<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-02-21 09:35:47
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-08 10:44:47
-->
<template>
  <div
    class="data-view-item-wrap ds-control data-view-no-padding dv-three-cylinder-slide"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <div ref="THREE" class="dv-three-canvas"></div>
    <div class="design-tip" v-if="isDesign">
      <p>按住Ctrl键+鼠标右键调整初始视角</p>
    </div>
  </div>
</template>
<script>
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import ThreeCylinder from "./ThreeCylinder.js";
const dictionary = {
  image: "图片",
  name: "名称",
  url: "跳转路径",
};
const images = [
  "/dataview/file/sdk/download?files=a08d53a0e381476392691ba1ed6fa26c",
  "/dataview/file/sdk/download?files=91f980c4d93142ea9cb073057d774a9c",
  "/dataview/file/sdk/download?files=a44d1eb4dead4069bee3a04aab09943d",
];
const staticData = [
  {
    image: "/dataview/file/sdk/download?files=a08d53a0e381476392691ba1ed6fa26c",
    name: "领导驾驶仓",
    url: "",
  },
  {
    image: "/dataview/file/sdk/download?files=91f980c4d93142ea9cb073057d774a9c",
    name: "领导驾驶仓",
    url: "",
  },
  {
    image: "/dataview/file/sdk/download?files=a44d1eb4dead4069bee3a04aab09943d",
    name: "地方征信平台",
    url: "",
  },
];
const backgrounds = images.map((url) => {
  return {
    active: "custom",
    custom: {
      image: url,
      size: "100% 100%",
      repeat: "no-repeat",
      position: "center",
      width: "100%",
      height: "100%",
    },
  };
});

export default dsf.component({
  name: "DsfDataViewCylinderSlide",
  ctrlCaption: "圆柱幻灯片",
  mixins: [$mixins.dataView, dataAnalysis],
  props: {
    backgroundConfigs: {
      type: Array,
      default() {
        return backgrounds;
      },
    },
    staticImage: {
      type: Boolean,
      default: true,
    },
    // 跳转设置
    openConfig: {
      type: Object,
      default: () => {
        return {
          interactType: "-1",
          dialogWidth: "50%",
          dialogHeight: "500px",
          dialogTitle: "",
          isOuter: false,
          dialogType: "",
        };
      },
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "图片字段",
            value: "image",
            map: "image",
            hideDigit: true,
          },
          {
            text: "名称字段",
            value: "name",
            map: "name",
            hideDigit: true,
          },
          {
            text: "跳转路径字段",
            value: "url",
            map: "url",
            hideDigit: true,
          },
        ];
      },
    },
    // 表格数据
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, dictionary);
      },
    },
    // 静态数据
    staticData: {
      type: Array,
      default() {
        return staticData;
      },
    },
    gap: {
      type: Number,
      default: 30,
    },
    radius: {
      type: Number,
      default: 100,
    },
    imageHeight: {
      type: Number,
      default: 80,
    },
    textHeight: {
      type: Number,
      default: 10,
    },
    showName: {
      type: Boolean,
      default: false,
    },
    textStyle: {
      type: Object,
      default: () => createCommonTextStyle({ color: "#FFFFFF", fontSize: 60 }),
    },
    cameraPosition: {
      type: Object,
      default() {
        return { x: 0, y: 0, z: 25 };
      },
    },
    rotate: {
      type: Object,
      default() {
        return {
          autoRotate: true, // 转动
          autoRotateDirection: "cw", // 顺时针cw,逆时针cww
          autoRotateSpeed: 5, // 转动的速度
        };
      },
    },
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          //组件初始化事件
          mounted: {
            relatives: [],
            fn: "",
          },
          //数据加载完成事件
          dataLoad: {
            relatives: [],
            fn: "",
          },
          //数据处理完成事件
          load: {
            relatives: [],
            fn: "",
          },
          //数据点击事件
          click: {
            relatives: [],
            fn: "",
          },
        };
      },
    },
  },
  data() {
    return {
      data: [],
      isCtrl: false,
      otherEvents: ["刷新", "获取当前值"],
    };
  },
  created() {
    document.addEventListener("keydown", this.keyBoard, false);
    document.addEventListener("keyup", this.keyBoardUp, false);
    this.reset = _.debounce(() => {
       if (!this.CylinderSlide) return false;

      try {
        this.CylinderSlide.off("click");
        this.CylinderSlide.off("change");
      } catch (error) {
        console.log(error);
      }
      this.CylinderSlide.on("click", (data) => {
        if (this.$listeners["cylinder-click"]) {
          this.$dispatch("cylinder-click", data);
        }
        this.handleClickSlide(data);
      });

      if (this.isDesign) {
        this.CylinderSlide.on("change", () => {
          let result = this.CylinderSlide.getCamera();
          if (result && this.isCtrl) {
            const { x, y, z } = result;
            this.cameraPosition = { x, y, z };
          }
        });
      }
      const { data, gap, radius, imageHeight, showName, textStyle, textHeight, cameraPosition, rotate } = this;

      this.CylinderSlide.setOption({
        images: data,
        gap,
        radius,
        height: imageHeight,
        textHeight,
        camera: cameraPosition,
        rotate,
        textStyle: {
          show: showName,
          ...textStyle,
        },
      });
    },300);
  },
  watch: {
    staticImage(v) {
      if (this.isDesign) {
        if (!v) {
          this.init();
        } else {
          this.data = this.backgroundConfigs.map((it) => {
            return {
              image: it.custom.image,
            };
          });
          this.reset();
        }
      }
    },
    backgroundConfigs: {
      handler(v,o) {
        if (this.isDesign&&this.staticImage) {
          this.data = this.backgroundConfigs.map((it) => {
            return {
              image: it.custom.image,
            };
          });
          this.reset();
        }
      },
      deep: true,
    },
    textStyle: {
      handler() {
        if (this.isDesign) {
          this.reset();
        }
      },
      deep: true,
    },
    rotate: {
      handler() {
        if (this.isDesign) {
          this.reset();
        }
      },
      deep: true,
    },
    gap() {
      if (this.isDesign) {
        this.reset();
      }
    },
    radius() {
      if (this.isDesign) {
        this.reset();
      }
    },
    imageHeight() {
      if (this.isDesign) {
        this.reset();
      }
    },
    textHeight() {
      if (this.isDesign) {
        this.reset();
      }
    },
    showName() {
      if (this.isDesign) {
        this.reset();
      }
    },
  },
  methods: {
    dataAnalysis(data) {
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        const mapRelations = this.mapRelations;
        const image = mapRelations[0].map;
        const name = mapRelations[1].map;
        const url = mapRelations[2].map;
        this.data = data.map((it) => {
          return {
            ...it,
            image: it[image],
            name: it[name],
            url: it[url],
          };
        });
      }
      if (this.$listeners["interceptOptions"]) {
        this.$dispatch("interceptOptions", { data: data, vm: this });
      } else {
        this.data = data;
        this.reset();
      }
    },
    beforeInit() {
      this.CylinderSlide = new ThreeCylinder(this.$refs.THREE, this.isDesign);
      if (!this.staticImage) {
        this.init();
      } else {
        this.data = this.backgroundConfigs.map((it) => {
          return {
            image: it.custom.image,
          };
        });
        this.reset();
      }
    },
    resize() {
      this.CylinderSlide && this.CylinderSlide.resize();
    },
    keyBoard(e) {
      if (e.keyCode === 17 && this.isDesign) {
        this.isCtrl = true;
      }
    },
    keyBoardUp(e) {
      if (e.keyCode === 17 && this.isDesign) {
        this.isCtrl = false;
      }
    },
    handleClickSlide(item) {
      const { openConfig } = this;
      if (this.staticImage || this.isDesign || openConfig.interactType == -1) {
        this.loadClickEvents(item);
        return false;
      }
      let url = this.$replace(item.url, item);
      if (!url) return false;
      const outer = openConfig.isOuter;
      const dialogWidth = openConfig.dialogWidth || "50%";
      const dialogHeight = openConfig.dialogHeight || "500";
      const dialogTitle = openConfig.dialogTitle || "";
      const dialogType = openConfig.dialogType || "default";

      switch (openConfig.interactType) {
        case "1":
          if (outer) {
            window.open(url, new Date().getTime());
          } else {
            url = url.replace(/^(\/)?#/g, "");
            this.$router.push({ path: url });
          }
          break;
        case "2":
          if (outer) {
            window.open(url, new Date().getTime());
          } else {
            window.location.href = url;
          }
          break;
        case "3":
          this.handleOpenDataViewDialog(url, dialogWidth, dialogHeight, dialogTitle, dialogType);
          break;
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keyBoard, false);
    document.removeEventListener("keyup", this.keyBoardUp, false);
    this.CylinderSlide && this.CylinderSlide.destroy();
    this.CylinderSlide = null;
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewCylinderSlide.scss";
</style>

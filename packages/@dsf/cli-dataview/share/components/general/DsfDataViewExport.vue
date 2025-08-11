<!--
 * @Editor: zhanghang
 * @Description: 导出组件
 * @Date: 2024-07-03 16:01:48
 * @LastEditors: shenah
 * @LastEditTime: 2025-03-14 09:55:13
-->
<template>
  <div class="dv-export-wrap data-view-item-wrap ds-control" :style="allStyle">
    <div class="export-btn" @click="exportFile" :style="contentStyle">
      <DsfIcon v-if="showIcon && iconAlign == 'left'" :style="getIconStyle" :name="iconName"></DsfIcon>
      <span v-if="showText" class="dv-export-text" :style="getTextStyle">{{ text }}</span>
      <DsfIcon v-if="showIcon && iconAlign == 'right'" :style="getIconStyle" :name="iconName"></DsfIcon>
    </div>
  </div>
</template>
<script>
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
export default dsf.component({
  name: "DsfDataViewExport",
  mixins: [$mixins.dataView],
  ctrlCaption: "导出",
  props: {
    styleMapKey: {
      type: String,
      default: "dataViewExport",
    },
    padding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    width: {
      type: String,
      default: "120",
    },
    height: {
      type: String,
      default: "42",
    },
    controlBackgroundConfig: {
      type: Object,
      default: () => defaultBackground,
    },
    showText: {
      type: Boolean,
      default: true,
    },
    textStyle: {
      type: Object,
      default: () => createCommonTextStyle(),
    },
    text: {
      type: String,
      default: "导出页面",
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    iconAlign: {
      type: String,
      default: "left",
    },
    iconName: {
      type: String,
      default: "yunduanxiazai",
    },
    iconColor: {
      type: String,
      default: "#FFF",
    },
    iconSize: {
      type: String,
      default: "16",
    },
    radius: {
      type: Array,
      default() {
        return [5, 5, 5, 5];
      },
    },
    exportType: {
      type: String,
      default: "page",
    },
    fileType: {
      type: String,
      default: "image",
    },
    fileName: {
      type: String,
      default: "",
    },
    componentName: {
      type: [String, Array],
      default: "",
    },
    fileDataType: {
      type: String,
      default: "text",
    },
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      componentType: "exportBtn",
    };
  },
  computed: {
    allStyle() {
      return {
        padding: 0,
        ...this.getCommonEnterAnimateStyle,
      };
    },
    contentStyle() {
      const controlStyle = this.controlStyle;
      if (this.isDesign) {
        if (Array.isArray(this.margin)) {
          let newArr = [...this.margin];
          newArr[0] = 0;
          let newMarin = dsf.dataview.utils.transformArrayPx(newArr);
          controlStyle.margin = newMarin;
        }
      }
      return {
        ...controlStyle,
        "border-radius": this.radius.join("px ") + "px",
        height: dsf.dataview.utils.transformPx(this.height),
        padding: 0,
      };
    },
    getIconStyle() {
      return {
        fontSize: dsf.dataview.utils.transformPx(this.iconSize),
        color: this.iconColor,
      };
    },
    getTextStyle() {
      return dsf.dataview.utils.transformTextStyle(this.textStyle);
    },
  },
  methods: {
    dealTreeData(root) {
      const data = [];
      root.forEach((it) => {
        const res = { name: it.label, value: it.map, level: it.level };
        if (it.children && it.children.length) {
          res.children = this.dealTreeData(it.children);
          data.push(res);
        } else {
          it.map && data.push(res);
        }
      });
      return data;
    },
    exportFile() {
      if (this.isDesign) return false;
      const fileName = this.fileName || dsf.uuid();
      if (this.exportType === "page") {
        if (this.fileType === "image") {
          this.exportImage(fileName);
        }
      } else {
        if (!this.componentName.length || (!this.$page.$vm && !this.$page.$vm)) return false;
        const vm = this.$page.$vm;
        let componentName = this.componentName;
        const data = {};
        if (!Array.isArray) {
          componentName = [componentName];
        }
        componentName.forEach((element) => {
          const component = vm.$refs[element];
          if (component && component.dataType) {
            const key = component.fakeCodeName || element;
            const cellData = {
              data: component.originComponentData,
            };
            //表格特殊处理
            if (component.ctrlType === "dsf.dataviewlargetable") {
              const header = component.header.map((it) => {
                return { name: it.label, value: it.map };
              });

              if (component.header.some((it) => it.isIndex)) {
                cellData.order = true;
              }
              cellData.header = header.filter((it) => it.value);
              const mergeHeader = this.dealTreeData(component.orgHeader);
              if (mergeHeader.some((it) => it.children)) {
                cellData.mergeHeader = mergeHeader;
              }

              //如果是表格数据
            } else if (component.dataType === "excel") {
              const res = component.excelData.slice(0, 2);
              const [values, names] = res;
              const header = [];
              for (let i = 1; i < values.length; i++) {
                header.push({
                  name: names[i],
                  value: values[i],
                });
              }
              header.length && (cellData.header = header);
            }
            data[key] = cellData;
          }
        });
        if (!dsf.isEmptyObject(data)) {
          switch (this.fileDataType) {
            case "text":
              const downName = `${fileName}.txt`;
              this.downloadText(data, downName);
              break;
            default:
              const url = dsf.url.getWebPath(`/export/${this.fileDataType}`, $$webRoot.dataview);
              dsf.file.postDownload.call(
                this,
                url,
                {
                  exportData: JSON.stringify(data),
                  fileName,
                },
                null,
                ""
              );
              break;
          }
        }
      }
    },
    exportImage(fileName) {
      fileName = fileName || dsf.uuid();
      this.loadCanvas().then(() => {
        const el = this.$page.$el;
        let page = $(el).find(".data-view-inner-page")[0];
        if (this.$page.fitType === "ratio") {
          page = $(el).find(".data-view-full-page")[0];
        } else if (this.$page.fitType === "fit") {
          page = $(el).find(".data-view-full-page")[0];
        }
        if (!page) return false;
        html2canvas(page, {
          useCORS: true,
          allowTaint: true,
        }).then((canvas) => {
          const a = document.createElement("a");
          a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
          a.download = `${fileName}.jpg`;
          a.click();
        });
      });
    },
    downloadText(data, fileName) {
      data = JSON.stringify(data);
      const blob = new Blob([data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = fileName;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    loadCanvas() {
      return new Promise((resolve, reject) => {
        if (window.html2canvas) {
          resolve();
        } else {
          let loadFileHttp = dsf.dataview.utils.importFiles([this.$getWebPath("static/js/libs/html2canvas/html2canvas_dv.js", __DSF_DATAVIEW_PATH__)],() => {
              resolve();
          },() => {
            dsf.layer.message("加载html2canvas文件报错", false);
            reject();
          },()=>{
            this.addNowRequestFileList(loadFileHttp,true);
          })
          this.addNowRequestFileList(loadFileHttp);
        }
      });
    },
    addComponents(data) {
      const options = [];
      dsf.designer.recursionLayoutTree(this.$designer.$refs.viewProxy, null, null, (it) => {
        if (it.isDataViewControl && it.dataType) {
          options.push({
            text: it.fakeCodeName,
            value: it.caption,
          });
        }
      });
      data.dictionary = options;
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/export.scss";
</style>

<!--
 * @Description: 表格导入
 * @Author: zhanghang
 * @Date: 2022-07-27 16:43:16
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-03-13 17:27:10
-->
<template>
  <div class="data-view-excel-edit" id="excel-edit" @keydown="keyDown"></div>
</template>
<script>
export default {
  name: "excelData",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    return {
      excelData: [],
      sheetOptions: {
        container: "excel-edit", // 设定DOM容器的id
        lang: "zh", // 设定表格语言
        numberToText: true,
        showinfobar: false,
        showsheetbar: false,
        showtoolbar: false,
        showstatisticBar: false,
        sheetFormulaBar: false,
        enableAddRow: false,
        enableAddBackTop: false,
        hook: {
          cellAllRenderBefore: function (data, sheet, ctx) {
            const { getCellValue, setCellValue } = window.luckysheet;
            if (getCellValue(0, 0) !== "字段名") {
              setCellValue(0, 0, "字段名");
            }
            if (getCellValue(1, 0) !== "字段名描述") {
              setCellValue(1, 0, "字段名描述");
            }
            for (let i = 2; i < data.length; i++) {
              if (getCellValue(i, 0)) setCellValue(i, 0, null);
              // data[i][0] = null;
            }
          },
        },
      },
    };
  },
  created() {
    let excelData = this.currentData;
    if (Array.isArray(excelData)) {
      //luckySheet格式
      if (Array.isArray(excelData[0])) {
        this.excelData = excelData;
        //xsheet 格式
      } else {
        let rows = excelData[0].rows;
        let res = [];
        Object.keys(rows).forEach((key) => {
          if (rows[key].cells) {
            let cells = rows[key].cells,
              row = [];
            Object.keys(cells).forEach((index) => {
              row[index] = cells[index].text;
            });
            res.push(row);
          }
        });
        this.excelData = res;
      }
    }
  },
  mounted() {
    dsf.dataview.utils.importFiles(
      [
        this.$getWebPath("static/js/libs/luckysheet/plugins/css/pluginsCss.css", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/luckysheet/plugins/plugins.css", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/luckysheet/css/luckysheet.css", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/luckysheet/assets/iconfont/iconfont.css", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/html2canvas/html2canvas_dv.js", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/luckysheet/plugins/js/plugin.js", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/luckysheet/luckysheet.umd.js", __DSF_DATAVIEW_PATH__),
      ],
      () => {
        const cellData = window.luckysheet.transToCellData(this.excelData);
        window.luckysheet.destroy();
        window.luckysheet.create({
          ...this.sheetOptions,
          data: [
            {
              name: "Sheet",
              row: 36,
              column: 18,
              celldata:cellData,
            },
          ],
        });
      }
    );
  },
  destroyed() {
    window.luckysheet.destroy();
  },
  methods: {
    keyDown(e) {
      console.time("keydown");
      e.stopPropagation();
      console.timeEnd("keydown");
    },
    getColumnLetter(colIndex) {
      let letter = "";
      while (colIndex >= 0) {
        letter = String.fromCharCode((colIndex % 26) + 97) + letter;
        colIndex = Math.floor(colIndex / 26) - 1;
      }
      return letter;
    },
    yes() {
      window.luckysheet.exitEditMode();
      let sheet = window.luckysheet.getLuckysheetfile()[0];
      let sheetData = window.luckysheet.getSheetData(sheet);

      // 筛选出来不为空的数据，记录字段数
      let fieldsCount = 0;
      sheetData = sheetData.filter((row, rowIdx) => {
        // 这个方法兼容性360安全浏览器不支持替换成下面的
        let idx = _.findLastIndex(row, (cell) => !!cell && cell.m);

        fieldsCount = Math.max(fieldsCount, idx + 1);
        return rowIdx < 2 || idx > 0; // 第一列无法编辑，不存在数据

      });

      let res = [];
      //存在数据
      if (sheetData.length > 2 && sheetData[0].length > 1) {
        //获取字段个数
        let F1 = new Array(fieldsCount);
        let fieldsRow = sheetData.shift();
        for (let i = 0; i < fieldsCount; i++) {
          let cell = fieldsRow[i];
          if (cell && cell.m) {
            F1[i] = cell.m;
          } else {
            F1[i] = "value_" + this.getColumnLetter(i);
            // break;
          }
        }
        res.push(F1);

        for (let i = 0; i < sheetData.length; i++) {
          let row = sheetData[i].slice(0, F1.length);
          let rowData = [];
          row.forEach((cell) => {
            if (cell) {
              rowData.push(cell.m);
            } else {
              rowData.push(null);
            }
          });
          res.push(rowData);
        }
      }
      return res;
    },
  },
};
</script>

<template>
  <div class="dv-luncksheet-excel-edit">
    <div class="left-container">
      <el-table size="small" :data="originData" :cell-class-name="getHighlightCell" class="excel-edit-table" border height="450">
        <el-table-column v-for="field in header" :label="field" :key="field" width="120">
          <template slot="header">
            <span>{{ field }}</span>
            <p>{{ fieldsMap.get(field) }}</p>
          </template>
          <template slot-scope="scope">
            <span class="drag-span" @dblclick="addField(`${scope.$index}@${field}`, scope.row[field])" :draggable="true" :local="`${scope.$index}@${field}`" @dragstart="drag($event)">
              {{ scope.row[field] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div @drop="dropDown($event)" @dragover="(e) => e.preventDefault()" id="dv-luncksheet-excel-edit"></div>
  </div>
</template>
<script>
export default {
  name: "dataDivideSetting",
  mixins: [$mixins.propertyDialogSetting],
  data() {
    const marks = [
      ["加法", "SUM"],
      ["减法", "SUB"],
      ["乘法", "MUL"],
      ["除法", "DIV"],
      ["平均数", "AVG"],
      ["最大值", "MAX"],
      ["最小值", "MIN"],
      ["截取", "SLICE"],
      ["保留小数", "DECIMAL"],
    ];
    const markstr = marks.map((mark) => mark.join("：") + "\n").join("");
    let staticExcel = [
      [
        {
          bg: "#b5c334",
          m: "字段名",
          v: "字段名",
          ps: {
            value: "映射字段",
          },
        },
      ],
      [
        {
          bg: "#b5c334",
          m: "字段描述",
          v: "字段描述",
          ps: {
            value: "映射字段描述文字",
          },
        },
      ],
      [
        {
          bg: "#b5c334",
          m: "数据行起点",
          v: "数据行起点",
          ps: {
            value: "eg:\n 0@F2 ：表示取第一行的F2字段数据。\n 内置公式：\n" + markstr,
          },
        },
      ],
    ];
    return {
      staticExcel,
      originData: [],
      header: [],
      excelData: [],
      fieldsMap: new Map(),
      //表格高亮项
      highlight: [null, null],
      sheetOptions: {
        container: "dv-luncksheet-excel-edit", // 设定DOM容器的id
        lang: "zh", // 设定表格语言
        showinfobar: false,
        showsheetbar: false,
        showtoolbar: false,
        showstatisticBar: false,
        sheetFormulaBar: false,
        enableAddRow: false,
        enableAddBackTop: false,
      },
    };
  },
  created() {
    let divideData = this.owner.$children[0].divideData[0];
    if (divideData) {
      let header = Object.keys(divideData);
      this.header = header;
      //如果是综合表数据
      if (this.owner.dataType === "combineTable" && this.owner.mapFieldList) {
        let map = new Map();
        this.owner.mapFieldList.forEach((it) => {
          map.set(it.value, it.name);
        });
        this.fieldsMap = map;
      }
      this.originData = this.owner.$children[0].divideData;
    }
  },
  mounted() {
    this.$http
      .importFiles([
        this.$getWebPath("static/js/libs/luckysheet/plugins/css/pluginsCss.css", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/luckysheet/plugins/plugins.css", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/luckysheet/css/luckysheet.css", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/luckysheet/assets/iconfont/iconfont.css", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/luckysheet/plugins/js/plugin.js", __DSF_DATAVIEW_PATH__),
        this.$getWebPath("static/js/libs/luckysheet/luckysheet.umd.js".__DSF_DATAVIEW_PATH__),
      ])
      .then(() => {
        let excelData = this.currentData;
        let staticExcel = dsf.mix(true, [], this.staticExcel);
        //当存在数据才会解析
        if (Array.isArray(excelData) && excelData.length >= 2) {
          for (let i = 0; i < excelData.length; i++) {
            let row = excelData[i];
            if (i <= 2) {
              staticExcel[i].push(...row);
            } else {
              let _row = ["", ...row];
              staticExcel.push(_row);
            }
          }
        }

        let celldata = window.luckysheet.transToCellData(staticExcel);

        window.luckysheet.destroy();
        window.luckysheet.create({
          ...this.sheetOptions,
          data: [
            {
              name: "Sheet",
              row: 36,
              column: 18,
              celldata,
              frozen: [
                {
                  type: "row",
                },
              ],
            },
          ],
          hook: {
            cellMousedown: this.cellMousedown,
          },
        });
      });
  },
  methods: {
    getHighlightCell(data) {
      let index = data.rowIndex;
      let column = data.column.label;
      if (this.highlight[0] == index && this.highlight[1] == column) {
        return "highlight-cell";
      }
      return "";
    },
    drag(evt) {
      evt.dataTransfer.setData("Text", evt.target.getAttribute("local"));
    },
    //鼠标
    cellMousedown() {
      this.highlight = [null, null];
      if (window.luckysheet && window.luckysheet.getRange()) {
        let range = window.luckysheet.getRange();
        let { row, column } = range[0];
        //不允许在头部备注的部分插入
        if (row[0] > 1 && column[0] > 0) {
          let data = window.luckysheet.getCellValue(row[0], column[0]);
          if (data) {
            let arr = data.split("@");
            if (arr.length === 2) {
              let index = arr[0];
              let column = arr[1];
              this.highlight = [index, column];
            }
          }
        }
      }
    },
    addField(data, value) {
      if (value === undefined || value === null) {
        return false;
      }
      this.insertData(data);
    },
    insertData(data) {
      if (window.luckysheet && window.luckysheet.getRange()) {
        let range = window.luckysheet.getRange();
        let { row, column } = range[0];
        //不允许在头部备注的部分插入
        if (row[0] > 1 && column[0] > 0) {
          window.luckysheet.setCellValue(row[0], column[0], data);
          let arr = data.split("@");
          let index = arr[0];
          let field = arr[1];
          this.highlight = [index, field];
        }
      }
    },
    dropDown(evt) {
      evt.preventDefault();
      let data = evt.dataTransfer.getData("Text");
      this.insertData(data);
    },
    emptyData() {
      let sheet = luckysheet.getAllSheets()[0];
      let celldata = sheet.celldata;
      celldata.forEach((cell) => {
        if (cell.c > 0) {
          luckysheet.setCellValue(cell.r, cell.c, null);
        }
      });
    },
    yes() {
      let sheet = window.luckysheet.getLuckysheetfile()[0];
      let sheetData = window.luckysheet.getSheetData(sheet);
      sheetData = sheetData.filter((row) => row.some((cell) => !!cell && cell.m));
      let res = [];
      let fields = [];
      let decs = [];

      let row_1 = sheetData.shift();
      let row_2 = sheetData.shift();
      for (let i = 1; i < row_1.length; i++) {
        if (row_1[i]) {
          row_1[i].m && fields.push(row_1[i].m);
        } else {
          break;
        }
      }
      fields.forEach((it, index) => {
        decs.push(row_2[index + 1] ? row_2[index + 1].m : null);
      });
      res.push(fields, decs);
      for (let i = 0; i < sheetData.length; i++) {
        let row = sheetData[i];
        let rowData = [];
        fields.forEach((it, index) => {
          rowData.push(row[index + 1] ? row[index + 1].m : null);
        });
        if (rowData.length) {
          res.push(rowData);
        }
      }
      window.luckysheet && window.luckysheet.destroy();

      return res;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/dataDivideSetting.scss";
</style>

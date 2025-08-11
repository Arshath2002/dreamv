/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-04-04 10:39:43
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-04-04 13:46:17
 */
const quarterIndexMap = {
  'jan': '1季度', 'feb': '2季度', 'mar': '3季度', 'apr': '4季度',
};
const now = new Date();
const nowYear = now.getFullYear()
const nowQuarter = Math.ceil((now.getMonth() + 1) / 3)

export default function () {
  const MonthTable = this.panel.components.MonthTable;
  const rows = MonthTable.computed.rows;
  const getCellStyle = MonthTable.methods.getCellStyle;
  const QuarterTable = {
    extends: MonthTable,
    computed: {
      rows() {
        let _rows = rows.apply(this, arguments);
        _rows = _rows.slice(0, 1)
        return _rows;
      },
    },
    methods: {
      getCellStyle(cell) {
        let style = getCellStyle.call(this, cell);

        style.today = this.date.getFullYear() == nowYear && nowQuarter == cell.text + 1;


        return style;
      },
      getMonthOfCell(month) {
        const year = this.date.getFullYear();
        return new Date(year, month, 1);
      },
      t(key) {
        return quarterIndexMap[key.split('.')[3]];
      },
    },
  };

  return {
    extends: this.panel,
    components: { MonthTable: QuarterTable },
    computed: {
      leftLabel() {
        let fullYear = this.leftDate.getFullYear();
        return fullYear + '年 '
      },

      rightLabel() {
        let fullYear = this.rightDate.getFullYear();
        return fullYear + '年'
      },
    },
  };
}


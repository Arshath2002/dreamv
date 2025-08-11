/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-04-04 10:39:43
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-04-04 14:16:11
 */
const quarterIndexMap = {
  'jan': '上半年', 'feb': '下半年'
};
const now = new Date();
const nowYear = now.getFullYear()
const nowHalfYear = Math.ceil((now.getMonth() + 1) / 6)

export default function () {
  const MonthTable = this.panel.components.MonthTable;
  const rows = MonthTable.computed.rows;
  const getCellStyle = MonthTable.methods.getCellStyle;
  const HalfYearTable = {
    extends: MonthTable,
    computed: {
      rows() {
        let _rows = rows.apply(this, arguments);
        _rows = _rows.slice(0, 1)
        _rows[0] = _rows[0].slice(0, 2)
        return _rows;
      },
    },
    methods: {
      getCellStyle(cell) {
        let style = getCellStyle.call(this, cell);

        style.today = this.date.getFullYear() == nowYear && nowHalfYear == cell.text + 1;


        return style;
      },

      t(key) {
        return quarterIndexMap[key.split('.')[3]];
      },
    },
  };

  return {
    extends: this.panel,
    components: { MonthTable: HalfYearTable },
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


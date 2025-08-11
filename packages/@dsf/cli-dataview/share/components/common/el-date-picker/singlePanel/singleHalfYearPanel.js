const halfYearTextMap = {
  jan: "上半年",
  feb: "下半年",
};
const now = new Date()

const nowYear = now.getFullYear()

const nowHalfYear = Math.ceil((now.getMonth() + 1) / 6)


export default function () {
  const MonthTable = this.panel.components.MonthTable
  if(!MonthTable?.computed) return;
  const rows = MonthTable.computed.rows
  const getCellStyle = MonthTable.methods.getCellStyle
  const singleHalfYearPanel = {
    extends: MonthTable,
    computed: {
      rows () {
        let _rows = rows.apply(this, arguments)
        _rows = _rows.slice(0, 1)
        const date = this.date
        const year = date.getFullYear()
        const value = this.value
        let selectYear = ''
        let selectMonth = ''
        if (value) {
          const selectValue = new Date(value)
          selectYear = selectValue.getFullYear()
          selectMonth = selectValue.getMonth()
        }
        _rows[0] = _rows[0].slice(0, 2).map(it => {
          it.type = 'normal'
          switch (it.column) {
            case 0:
              if(selectYear === year && selectMonth == 0){
                it.type = 'today'
              }
              
              break;
            case 1:
              if(selectYear === year && selectMonth == 1){
                it.type = 'today'
              }
              
              break;
          }
          return it
        })
        
        return _rows
      },
    },
    methods: {
      getCellStyle (cell) {
        let style = getCellStyle.call(this, cell);
        style.current = this.date.getFullYear() == nowYear && nowHalfYear == cell.text + 1;
        style['single-today'] = cell.type === 'today'
        return style;
      },
      t (key) {
        return halfYearTextMap[key.split(".")[3]]
      },
    },
  }

  return {
    extends: this.panel,
    components: { MonthTable: singleHalfYearPanel },
    computed: {
      leftLabel () {
        let fullYear = this.leftDate.getFullYear()
        return fullYear + '年 '
      },

      rightLabel () {
        let fullYear = this.rightDate.getFullYear()
        return fullYear + '年'
      },
    }
  }
}
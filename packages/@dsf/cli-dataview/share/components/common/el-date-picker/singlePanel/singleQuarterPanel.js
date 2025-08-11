const quarterTextMap = {
  'jan': '1季度', 'feb': '2季度', 'mar': '3季度', 'apr': '4季度',
}
const now = new Date()

const nowYear = now.getFullYear()

const nowQuarter = Math.ceil((now.getMonth() + 1) / 3)


export default function () {
  const MonthTable = this.panel.components.MonthTable
  if(!MonthTable?.computed) return;
  const rows = MonthTable.computed.rows
  const getCellStyle = MonthTable.methods.getCellStyle
  const singleQuarterTable = {
    extends: MonthTable,
    computed: {
      rows () {
        let _rows = rows.apply(this, arguments)
        _rows = _rows.slice(0, 1)
        const value = this.value
        const date = this.date
        const year = date.getFullYear()
        let selectYear = ''
        let selectMonth = ''
        if (value) {
          const selectValue = new Date(value)
          selectYear = selectValue.getFullYear()
          selectMonth = selectValue.getMonth()
        }
        _rows[0] = _rows[0].map(it => {
          it.type = 'normal'
          switch (it.column) {
            case 0:
              if (selectYear === year && selectMonth == 0) {
                it.type = 'today'
              }
              break
            case 1:
              if (selectYear === year && selectMonth == 1) {
                it.type = 'today'
              }
              break
            case 2:
              if (selectYear === year && selectMonth == 2) {
                it.type = 'today'
              }
              break
            case 3:
              if (selectYear === year && selectMonth == 3) {
                it.type = 'today'
              }
              break
          }
          return it
        })
        
        return _rows
      },
    },
    methods: {
      getCellStyle (cell) {
        let style = getCellStyle.call(this, cell)
        style.current = this.date.getFullYear() == nowYear && nowQuarter == cell.text + 1
        style['single-today'] = cell.type === 'today'
        return style
      },
      t (key) {
        return quarterTextMap[key.split(".")[3]]
      },
    },
  }

  return {
    extends: this.panel,
    components: { MonthTable: singleQuarterTable },
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
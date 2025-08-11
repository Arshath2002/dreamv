/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-04-04 10:39:43
 * @LastEditors: shenah
 * @LastEditTime: 2023-09-28 14:07:49
 */
const periodMonthIndex = ['01', '10', '20']



const now = new Date();

const nowYear = now.getFullYear()

const nowMonth = now.getMonth()

const nowDay = now.getDate()

export default function () {
  const DateTable = this.panel.components.DateTable;
  const rows = DateTable.computed.rows;
  const getCellClasses = DateTable.methods.getCellClasses;
  const periodMonthTable = {
    extends: DateTable,
    computed: {
      WEEKS() {
        return []
      },
      rows() {
        let _rows = rows.apply(this, arguments);
        const date = this.date

        const year = date.getFullYear()
        const month = date.getMonth()
        console.log(this)
        const value = this.value

        let selectYear = ''
        let selectMonth = ''
        let selectDay = ''
        if (value) {
          const selectValue = new Date(value)
          selectYear = selectValue.getFullYear()
          selectMonth = selectValue.getMonth()
          selectDay = selectValue.getDate()
        }



        _rows = _rows.slice(0, 1)

        _rows[0] = _rows[0].slice(0, 3).map(it => {
          it.type = 'normal'
          switch (it.column) {
            case 0:
              it.text = '上旬'
              if (nowDay < 10 && nowYear === year && nowMonth === month) {
                it.type = 'today'
              }
              if (selectYear === year && selectMonth === month && selectDay < 10) {
                it.selected = true
              }
              break;
            case 1:
              it.text = '中旬'
              if (nowDay < 20 && nowDay >= 10 && nowYear === year && nowMonth === month) {
                it.type = 'today'
              }
              if (selectYear === year && selectMonth === month && selectDay < 20 && selectDay >= 10) {
                it.selected = true
              }
              break;
            case 2:
              it.text = '下旬'
              if (nowDay >= 20 && nowYear === year && nowMonth === month) {
                it.type = 'today'
              }
              if (selectYear === year && selectMonth === month && selectDay >= 20) {
                it.selected = true
              }
              break;
          }
          return it
        })
        return _rows;
      },
    },
    methods: {
      getCellClasses(cell) {
        let classes = getCellClasses.call(this, cell);

        return classes += ' period-month'
      },
      handleClick(event) {
        let target = event.target;
        if (target.tagName === 'SPAN') {
          target = target.parentNode.parentNode;
        }
        if (target.tagName === 'DIV') {
          target = target.parentNode;
        }

        if (target.tagName !== 'TD') return;

        let index = target.cellIndex;

        let day = periodMonthIndex[index]
        let month = this.month
        let year = this.year
        let newDate = new Date(year, month, day)

        this.$emit('pick', newDate);

      },
    },
  };

  return {
    extends: this.panel,
    components: { DateTable: periodMonthTable },
    computed: {
      leftLabel() {
        return this.leftDate.getFullYear() + ' ' + this.t('el.datepicker.year') + ' ' + this.t(`el.datepicker.month${this.leftDate.getMonth() + 1}`);
      },

      rightLabel() {
        return this.rightDate.getFullYear() + ' ' + this.t('el.datepicker.year') + ' ' + this.t(`el.datepicker.month${this.rightDate.getMonth() + 1}`);
      },
    }
  };
}


const yearIndexMap = {
  'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9,
};
const now = new Date();
const nowYear = now.getFullYear()

export default function () {
  const MonthTable = this.panel.components.MonthTable;
  const rows = MonthTable.computed.rows;
  const getCellStyle = MonthTable.methods.getCellStyle;
  const YearTable = {
    extends: MonthTable,
    computed: {
      rows() {
        let _rows = rows.apply(this, arguments);
        _rows[_rows.length - 1] = _rows[_rows.length - 1].slice(0, 2);
        _rows.forEach(it => {
          it.forEach(_it => {
            _it.inRange = false
            _it.start = false
            _it.end = false
          })
        });
        return _rows;
      },
    },
    methods: {
      getCellStyle(cell) {
        let style = getCellStyle.call(this, cell);
        let year = this.date.getFullYear() + cell.text;
        const time = new Date(year, 0).getTime();

        style.today = year == nowYear;
        style['in-range'] = time >= getYearTimestamp(this.minDate) && time <= getYearTimestamp(this.maxDate);
        if (cell.inRange) {
          style['in-range'] = true;
          if (cell.start) {
            style['start-date'] = true;
          }

          if (cell.end) {
            style['end-date'] = true;
          }
        } else {
          style['start-date'] = this.minDate && time === getYearTimestamp(this.minDate);
          style['end-date'] = this.maxDate && time === getYearTimestamp(this.maxDate);
        }
        if (typeof this.disabledDate === 'function') {
          style.disabled = this.disabledDate.call(this, new Date(year + ""));
        }
        return style;
      },

      markRange(minDate, maxDate) {
        minDate = getYearTimestamp(minDate);
        maxDate = getYearTimestamp(maxDate) || minDate;
        [minDate, maxDate] = [Math.min(minDate, maxDate), Math.max(minDate, maxDate)];
        const rows = this.rows;
        for (let i = 0, k = rows.length; i < k; i++) {
          const row = rows[i];
          for (let j = 0, l = row.length; j < l; j++) {
            const cell = row[j];
            if (!cell) continue;

            let year = this.date.getFullYear() + cell.text;
            const time = new Date(year, 0).getTime();
            cell.inRange = minDate && time >= minDate && time <= maxDate;
            cell.start = minDate && time === minDate;
            cell.end = maxDate && time === maxDate;
          }
        }
      },
      getMonthOfCell(index) {
        return new Date(this.date.getFullYear() + index, 0);
      },
      t(key) {
        return this.date.getFullYear() + yearIndexMap[key.split('.')[3]];
      },
    },
  };

  return {
    extends: this.panel,
    components: { MonthTable: YearTable },
    watch: {
      value(newVal) {
        if (!newVal) {
          this.minDate = null;
          this.maxDate = null;
        } else if (Array.isArray(newVal)) {
          this.minDate = isDate(newVal[0]) ? new Date(newVal[0]) : null;
          this.maxDate = isDate(newVal[1]) ? new Date(newVal[1]) : null;
          if (this.minDate) {
            this.leftDate = getRoundYear(this.minDate);
            if (this.unlinkPanels && this.maxDate) {
              const minDateYear = this.minDate.getFullYear();
              const maxDateYear = this.maxDate.getFullYear();
              this.rightDate = minDateYear === maxDateYear
                ? nextTenYear(this.maxDate)
                : this.maxDate;
            } else {
              this.rightDate = nextTenYear(this.leftDate);
            }
          } else {
            this.leftDate = getRoundYear(calcDefaultValue(this.defaultValue)[0]);
            this.rightDate = nextTenYear(this.leftDate);
          }
        }
      },
      defaultValue(val) {
        if (!Array.isArray(this.value)) {
          const [left, right] = calcDefaultValue(val);
          this.leftDate = getRoundYear(left);
          this.rightDate = val && val[1] && left.getFullYear() !== right.getFullYear() && this.unlinkPanels
            ? right
            : nextTenYear(this.leftDate);
        }
      },
    },

    data() {
      let leftDate = getRoundYear(new Date());
      return {
        leftDate: leftDate,
        rightDate: nextTenYear(leftDate),
      };
    },

    computed: {
      leftLabel() {
        let fullYear = this.leftDate.getFullYear();
        return fullYear + '年 - ' + (fullYear + 9) + '年';
      },

      rightLabel() {
        let fullYear = this.rightDate.getFullYear();
        return fullYear + '年 - ' + (fullYear + 9) + '年';
      },
    },

    methods: {
      leftPrevYear() {
        this.leftDate = prevTenYear(this.leftDate);
        if (!this.unlinkPanels) {
          this.rightDate = prevTenYear(this.rightDate);
        }
      },

      rightNextYear() {
        if (!this.unlinkPanels) {
          this.leftDate = nextTenYear(this.leftDate);
        }
        this.rightDate = nextTenYear(this.rightDate);
      },

      leftNextYear() {
        this.leftDate = nextTenYear(this.leftDate);
      },

      rightPrevYear() {
        this.rightDate = prevTenYear(this.rightDate);
      },
    },
  };
}

function nextTenYear(date) {
  return new Date(date.getFullYear() + 10, 0);
}

function prevTenYear(date) {
  return new Date(date.getFullYear() - 10, 0);
}

const calcDefaultValue = (defaultValue) => {
  if (Array.isArray(defaultValue)) {
    return [new Date(defaultValue[0]), new Date(defaultValue[1])];
  } else if (defaultValue) {
    return [new Date(defaultValue), nextYear(new Date(defaultValue))];
  } else {
    return [new Date(), nextYear(new Date())];
  }
};
function getRoundYear(date) {
  let fullYear = date.getFullYear() / 10;
  let leftYear = Math.round(fullYear) * 10;
  return new Date(leftYear, 0);
}


function isDate(date) {
  if (date === null || date === undefined) return false;
  if (isNaN(new Date(date).getTime())) return false;
  if (Array.isArray(date)) return false; // deal with `new Date([ new Date() ]) -> new Date()`
  return true;
}

const clearDate = (date) => {
  return new Date(date.getFullYear(), 0, 1);
};
function nextYear(date) {
  return new Date(date.getFullYear() + 1, 0);
}

const getYearTimestamp = function (time) {
  if (typeof time === 'number' || typeof time === 'string') {
    return clearDate(new Date(time)).getTime();
  } else if (time instanceof Date) {
    return clearDate(time).getTime();
  } else {
    return NaN;
  }
};
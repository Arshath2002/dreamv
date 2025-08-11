/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-04-04 10:39:43
 * @LastEditors: shenah
 * @LastEditTime: 2023-09-28 14:07:57
 */
const periodMonthIndex = ["01", "10", "20"];

const now = new Date();

const nowYear = now.getFullYear();

const nowMonth = now.getMonth();

const nowDay = now.getDate();

export default function () {
  const DateTable = this.panel.components.DateTable;
  const rows = DateTable.computed.rows;
  const getCellClasses = DateTable.methods.getCellClasses;
  const periodMonthTable = {
    extends: DateTable,
    computed: {
      WEEKS() {
        return [];
      },
      rows() {
        let _rows = rows.apply(this, arguments);
        _rows = _rows.slice(0, 1);
        let maxDay = new Date(this.maxDate).getTime();
        let minDay = new Date(this.minDate).getTime();
        _rows[0] = _rows[0].slice(0, 3);
        for (var o = _rows[0], l = 0, u = o.length; l < u; l++) {
          if (!this.showWeekNumber || 0 !== l) {
            var c = o[l],
              d = new Date(
                this.year,
                this.month,
                periodMonthIndex[l]
              ).getTime();
            c.type = "normal";
            if (l === 0) {
              c.text = "上旬";
              if (
                nowDay < 10 &&
                nowYear === this.year &&
                nowMonth === this.month
              ) {
                c.type = "today";
              }
            } else if (l === 1) {
              c.text = "中旬";
              if (
                nowDay < 20 &&
                nowDay >= 10 &&
                nowYear === this.year &&
                nowMonth === this.month
              ) {
                c.type = "today";
              }
            } else if (l === 2) {
              c.text = "下旬";
              if (
                nowDay >= 20 &&
                nowYear === this.year &&
                nowMonth === this.month
              ) {
                c.type = "today";
              }
            }
            (c.inRange = minDay && d >= minDay && d <= maxDay),
              (c.start = minDay && d === minDay),
              (c.end = maxDay && d === maxDay),
              (c.selected = minDay && d === minDay),
              (c.selected = maxDay && d === maxDay);
            if (typeof this.disabledDate === "function") {
              c.disabled = this.disabledDate.call(
                this,
                new Date(this.year, this.month, periodMonthIndex[l])
              );
            }
          }
        }

        return _rows;
      },
    },
    methods: {
      getCellClasses(cell) {
        let classes = getCellClasses.call(this, cell);
        return (classes += " period-month");
      },
      getDateOfCell(e, t) {
        const year = this.year;
        const month = this.month;
        let day = periodMonthIndex[t];
        return new Date(year, month, day);
      },
      markRange: function (e, t) {
        (e = new Date(e).getTime()), (t = new Date(t).getTime() || e);
        var i = [Math.min(e, t), Math.max(e, t)];
        (e = i[0]), (t = i[1]);
        for (
          var n = this.startDate, r = this.rows, s = 0, a = r.length;
          s < a;
          s++
        )
          for (var o = r[s], l = 0, u = o.length; l < u; l++)
            if (!this.showWeekNumber || 0 !== l) {
              var c = o[l],
                d = new Date(
                  this.year,
                  this.month,
                  periodMonthIndex[l]
                ).getTime();
              (c.inRange = e && d >= e && d <= t),
                (c.start = e && d === e),
                (c.end = t && d === t),
                (c.selected = e && d === e),
                (c.selected = t && d === t);
            }
      },
    },
  };

  return {
    extends: this.panel,
    components: { DateTable: periodMonthTable },
    computed: {
      leftLabel() {
        return (
          this.leftDate.getFullYear() +
          " " +
          this.t("el.datepicker.year") +
          " " +
          this.t(`el.datepicker.month${this.leftDate.getMonth() + 1}`)
        );
      },

      rightLabel() {
        return (
          this.rightDate.getFullYear() +
          " " +
          this.t("el.datepicker.year") +
          " " +
          this.t(`el.datepicker.month${this.rightDate.getMonth() + 1}`)
        );
      },
    },
  };
}

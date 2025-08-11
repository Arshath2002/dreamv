const quarterTextMap = {
  jan: "第1季度",
  feb: "第2季度",
  mar: "第3季度",
  apr: "第4季度",
};

const halfYearTextMap = {
  jan: "上半年",
  feb: "下半年",
};

const meadowTextMap = {
  sun: "上旬",
  mon: "中旬",
  tue: "下旬",
};

const now = new Date();
const nowYear = now.getFullYear(),
  nowQuarter = Math.ceil((now.getMonth() + 1) / 3),
  nowHalfYear = Math.ceil((now.getMonth() + 1) / 6),
  nowMeadow = now.getDate();

export function createDatePicker(DatePicker) {
  let displayValue = DatePicker.mixins[0].computed.displayValue;

  return {
    name: DatePicker.name,
    props: {
      periodType: String,
    },
    extends: DatePicker,
    created() {
      this.getPanel();
    },
    computed: {
      displayValue() {
        let dv = displayValue.call(this);
        if (Array.isArray(dv)) {
          return dv.map((d) => d.replace("1半年", "上半年").replace("2半年", "下半年"));
        }
        if (this.format === "yyyy年MM月dd旬") {
          return dv ? dv.replace("01旬", "上旬").replace("11旬", "中旬").replace("21旬", "下旬") : dv;
        }
        return dv ? dv.replace("1半年", "上半年").replace("2半年", "下半年") : dv;
      },
    },
    watch: {
      periodType: "updatePanel",
    },
    methods: {
      updatePanel() {
        let has = false;
        if (this.picker) {
          this.unmountPicker();
          this.picker = null;
          has = true;
        }
        DatePicker.watch.type.call(this, this.type);
        this.getPanel();
        if (has) {
          this.mountPicker();
        }
      },

      getPanel() {
        if (this.periodType == "MD") {
          createMeadowPanel.call(this);
        } else if (this.periodType == "SS") {
          createQuarterPanel.call(this);
        } else if (this.periodType == "HY") {
          createHalfYearPanel.call(this);
        }
      },
    },
  };
}

function createMeadowPanel() {
  const DateTable = this.panel.components.DateTable;
  if(!DateTable?.computed) return;
  const rows = DateTable.computed.rows;
  const getCellStyle = DateTable.methods.getCellStyle;
  const render = DateTable.render;

  const MeadowTable = {
    extends: DateTable,
    computed: {
      rows() {
        return rows?.apply(this, arguments)?.slice(1, 1);
      },
    },
    methods: {
      getCellStyle(cell) {
        let style = getCellStyle.call(this, cell);
        let index = 0;
        // 上旬
        if (nowMeadow < 11) {
          index = 0;
          // 下旬
        } else if(nowMeadow > 20) {
          index = 2;
        } else {
          index = 1;
        }
        style.today = this.date.getFullYear() == nowYear && index == cell.text;
        return style;
      },
      handleClick(event) {
        let target = event.target;
        if (!target.innerText) return;
        let index;
        if (target.innerText == "上旬") {
          index = 1;
        } else if(target.innerText == "中旬") {
          index = 11;
        } else {
          index = 21;
        }
        const newDate = new Date(this.year, this.month, index);
        this.$emit('pick', newDate);
      },
      t(key) {
        return meadowTextMap[key.split(".")[3]];
      },
    },
    render(h) {
      let vNodes = render.call(this, h);
      vNodes.children[0].children[0].children.splice(4, 8);
      vNodes.children[0].children[0].data = { style: {cursor: 'pointer'}};
      vNodes.children[0].children[0].children.forEach(item => {
        if(item?.data && !item?.data.style) {
          item.data.style = {"border-bottom": "none"};
        }
      });
      return vNodes;
    }
  };

  this.panel = {
    extends: this.panel,
    components: { DateTable: MeadowTable },
  };
}

function createQuarterPanel() {
  const MonthTable = this.panel.components.MonthTable;
  if(!MonthTable?.computed) return;
  const rows = MonthTable.computed.rows;
  const getCellStyle = MonthTable.methods.getCellStyle;

  const QuarterTable = {
    extends: MonthTable,
    computed: {
      rows() {
        return rows.apply(this, arguments).slice(0, 1);
      },
    },
    methods: {
      getCellStyle(cell) {
        let style = getCellStyle.call(this, cell);
        style.today = this.date.getFullYear() == nowYear && nowQuarter == cell.text + 1;
        return style;
      },
      t(key) {
        return quarterTextMap[key.split(".")[3]];
      },
    },
  };

  this.panel = {
    extends: this.panel,
    components: { MonthTable: QuarterTable },
  };
}

function createHalfYearPanel() {
  const MonthTable = this.panel.components.MonthTable;
  if(!MonthTable?.computed) return;
  const rows = MonthTable.computed.rows;
  const getCellStyle = MonthTable.methods.getCellStyle;
  const render = MonthTable.render;

  const HalfYearTable = {
    extends: MonthTable,
    computed: {
      rows() {
        return rows.apply(this, arguments).slice(0, 1);
      },
    },
    methods: {
      getCellStyle(cell) {
        let style = getCellStyle.call(this, cell);
        style.today = this.date.getFullYear() == nowYear && nowHalfYear == cell.text + 1;
        return style;
      },
      t(key) {
        return halfYearTextMap[key.split(".")[3]];
      },
    },
    render(h) {
      let vNodes = render.call(this, h);
      vNodes.children[0].children[0].children.splice(2, 4);
      return vNodes;
    }
  };

  this.panel = {
    extends: this.panel,
    components: { MonthTable: HalfYearTable },
  };
}

export const isDate = function (date) {
  if (date === null || date === undefined) return false;
  if (isNaN(new Date(date).getTime())) return false;
  if (Array.isArray(date)) return false; // deal with `new Date([ new Date() ]) -> new Date()`
  return true;
};


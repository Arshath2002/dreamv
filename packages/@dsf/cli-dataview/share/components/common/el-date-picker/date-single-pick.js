/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-05-19 18:13:37
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-06-12 11:28:08
 */
import periodMonthPanel from './singlePanel/periodMonthPanel'
import singleQuarterPanel from './singlePanel/singleQuarterPanel';
import singleHalfYearPanel from './singlePanel/singleHalfYearPanel';
const DatePicker = ELEMENT.DatePicker;

export default {
  name: 'dataviewDateSinglePicker',
  extends: DatePicker,
  props: {
    customType: String
  },
  watch: {
    customType: 'updatePanel',
  },
  computed: {
    displayValue() {
      let displayValue = DatePicker.mixins[0].computed.displayValue;
      let dv = displayValue.call(this);
      if (!dv) return dv
      let suffix = ''
      let prefix = ''
      if (this.customType === 'periodMonth') {
        suffix = dv.substr(-2, 2)
        prefix = dv.substr(0, dv.length - 2)
      } else {
        suffix = dv.substr(-3, 3)
        prefix = dv.substr(0, dv.length - 3)
      }

      switch (suffix) {
        case '01':
          suffix = '上旬'
          break;
        case '10':
          suffix = '中旬'
          break;
        case '20':
          suffix = '下旬'
          break;
        case '1半年':
          suffix = '上半年'
          break;
        case '2半年':
          suffix = '下半年'
          break;
      }

      return prefix + suffix
    },
  },
  created() {
    this.getPanel()
  },
  methods: {
    getPanel() {
      switch (this.customType) {
        case 'periodMonth':
          this.panel = periodMonthPanel.call(this)
          break;
        case 'singleQuarter':
          this.panel = singleQuarterPanel.call(this)
          break;
        case 'singleHalfYear':
          this.panel = singleHalfYearPanel.call(this)
          break
      }
    },
    updatePanel() {
      let has = false;

      if (this.picker) {
        this.unmountPicker();
        this.picker = null;
        has = true;
      }
      this.getPanel();
      if (has) {
        this.mountPicker();
      }

    }
  }
}


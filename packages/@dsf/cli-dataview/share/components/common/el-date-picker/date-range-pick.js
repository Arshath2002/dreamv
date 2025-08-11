/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2023-05-19 18:13:37
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-06-09 15:55:54
 */
import yearPanel from './rangePanel/yearPanel'
import quarterPanel from './rangePanel/quarterPanel'
import halfYearPanel from './rangePanel/halfYearPanel'
import rangePeriodMonthPanel from './rangePanel/rangePeriodMonthPanel'

const DatePicker = ELEMENT.DatePicker

export default {
  name: 'dataviewDateRangePicker',
  extends: DatePicker,
  props: {
    customType: String
  },
  watch: {
    customType: 'updatePanel',
  },
  computed: {
    displayValue() {
      let displayValue = DatePicker.mixins[0].computed.displayValue
      let dv = displayValue.call(this)
      if (!dv) return dv
      if (this.customType === 'rangePeriod') {
        let newDv = dv.map(item => {
          let suffix = item.substr(-2, 2)
          let prefix = item.substr(0, item.length - 2)
          if (Number(suffix) >= 1 && Number(suffix) < 10) {
            suffix = '上旬'
          } else if (Number(suffix) >= 10 && Number(suffix) < 20) {
            suffix = '中旬'
          } else if (Number(suffix) >= 20 && Number(suffix) < 32) {
            suffix = '下旬'
          }
          return prefix + suffix
        })
        return newDv
      }
      if (Array.isArray(dv)) {
        return dv.map(d => d.replace('1半年', '上半年').replace('2半年', '下半年'))
      }
      return dv ? dv.replace('1半年', '上半年').replace('2半年', '下半年') : dv
    },
  },
  created() {
    this.getPanel()
  },
  methods: {
    getPanel() {
      switch (this.customType) {
        case 'year':
          this.panel = yearPanel.call(this)
          break
        case 'quarter':
          this.panel = quarterPanel.call(this)
          break
        case 'halfYear':
          this.panel = halfYearPanel.call(this)
          break
        case 'rangePeriod':
          this.panel = rangePeriodMonthPanel.call(this)
          break
      }
    },
    updatePanel() {
      let has = false

      if (this.picker) {
        this.unmountPicker()
        this.picker = null
        has = true
      }
      this.getPanel()
      if (has) {
        this.mountPicker()
      }

    }
  }
}


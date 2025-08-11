/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2025-06-30 15:51:56
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-01 16:00:49
 */
export default {
  computed: {
    componentSlots() {
      return this.slots.filter((it) => it.controls.length);
    },
  },
  created() {
    if (this.isDesign) {
      const recuse = (data, arr = []) => {
        data.forEach((item) => {
          arr.push(item.caption);
          if (item.slots) {
            item.slots.forEach(({ controls }) => {
              recuse(controls, arr);
            });
          }
        });
      };
      this._watch = this.$watch(
        () => {
          const components = [];
          recuse([this], components);
          return components;
        },
        () => {
          this.designerUpdateChildrenData();
        },
        {
          deep: true,
        }
      );
    }
  },
  beforeDestroy () {
    this._watch?.();
  },
  methods: {
    
    /**
     * 设计器下更新子组件数据
     */
    designerUpdateChildrenData() {},

    /**
     * 给子组件设置数据
     * @param {Object} child 子组件content
     * @param {Object} data 当前下标的数据
     */
    getChildProps(child, data) {
      const res = dsf.mix(true, {}, child);
      const dictionary = {};
      let excelData = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          dictionary[key] = key;
        });
        excelData = dsf.dataview.utils.transformToExcelData([data], dictionary);
      }

      if (res.dataType) {
        res.dataType = "excel";
        res.excelData = excelData;
      }
      if(res.ctrlName=="DsfDataViewHtml"){
        res.injectData = data
      }

      return res;
    },

    /**
     * 设计器下 更新子组件数据
     */
    updateCommonChildrenData() {
      const data = this.data;
      const item = data[0];
      const dictionary = {};
      if (item) {
        Object.keys(item).forEach((key) => {
          dictionary[key] = key;
        });
      }
      const recursion = (controls, callback) => {
        controls.forEach((item) => {
          if (item.isDataViewControl && item.dataType) {
            callback(item);
          }
          if (item.slots && item.slots.length) {
            item.slots.forEach((it) => {
              recursion(it.controls, callback);
            });
          }
        });
      };

      this.slots.forEach((slot, index) => {
        const value = data[index % data.length];
        const excelData = dsf.dataview.utils.transformToExcelData([value], dictionary);
        const controls = slot.controls;
        recursion(controls, (item) => {
          item.excelData = excelData;
          item.dataType = "excel";
        });
      });
    },
  },
};

/*
 * @Description: 关于大多数数据改变的相关
 * @Author: shenah
 * @Date: 2023-05-16 09:40:15
 * @LastEditors: shenah
 * @LastEditTime: 2024-02-23 10:19:02
 */
import SelectInput from "./graph/selectInput.vue";

export default {
  components: {
    SelectInput,
  },
  provide() {
    return {
      owner: this.owner,
      mapFieldList: () => this.mapFieldList
    };
  },
  data() {
    return {
      //映射列表
      mapFieldList: [],
    };
  },
  created() {
    //兼容以前版本
    this.reloadFieldList();

    dsf.emit.$on(
      "reloadFields",
      (args) => {
        //是否清空映射值
        if (args && args.clear) {
          this.clearMapFieldList();
        }
        this.$nextTick(() => {
          this.reloadFieldList();
        });
      },
      this.owner.$children[0]
    );
  },

  beforeDestroy() {
    if (dsf.emit.$hasEvent("reloadFields", this.owner.$children[0])) {
      dsf.emit.$remove("reloadFields", this.owner.$children[0]);
    }
  },
  methods: {
    renderData(v, obj) {
      this.$emit("renderData", v, obj);
    },
    reloadFieldList() {
      this.mapFieldList = this.owner.$children[0].getDesignerMapFieldList();
    },
    beforeYes() {
      setTimeout(() => {
        let vm = this.owner.$children[0];
        if (vm && vm.middleWareData) {
          vm.middleWareData(vm.serviceData);
        }
      });
    },
  },
};

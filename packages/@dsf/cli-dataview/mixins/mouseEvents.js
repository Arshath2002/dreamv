/*
 * @Editor: zhanghang
 * @Description: 鼠标移入移出事件
 * @Date: 2024-09-11 11:06:50
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-09-11 16:48:55
 */
export default {
  methods: {
    // 鼠标移入事件
    loadMouseEnterEvents(data, e) {
      try {
        if (!this.eventRelativeDeal.mouseenter) return;
        let { fn } = this.eventRelativeDeal.mouseenter;
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data, e);
      } catch (error) {
        console.log(error);
      }
    },
    // 鼠标移出事件
    loadMouseLeaveEvents(data, e) {
      try {
        if (!this.eventRelativeDeal.mouseleave) return;
        let { fn } = this.eventRelativeDeal.mouseleave;
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data, e);
      } catch (error) {
        console.log(error);
      }
    },
    // 默认鼠标移入事件
    handleMouseEnter(data, e) {
      this.loadMouseEnterEvents(data, e);
    },
    // 默认鼠标移除事件
    handleMouseLeave(data, e) {
      // 如果有悬浮框需要移除
      setTimeout(() => this.handleCloseDVPopup(), 200);
      this.loadMouseLeaveEvents(data, e);
    },
  },
};

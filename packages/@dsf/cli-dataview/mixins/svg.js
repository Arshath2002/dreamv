/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-08-29 11:28:53
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-10-12 17:30:43
 */
export default {
  data() {
    return {
      dom: null,
      realWidth: 0,
      realHeight: 0,
    }
  },
  methods: {
    resize() {
      const { $nextTick, $refs, ref, onResize } = this;
      return new Promise((resolve) => {
        $nextTick((_) => {
          const dom = (this.dom = $refs[ref]);

          let cacheW = this.realWidth
          let cacheH = this.realHeight

          let realWidth = dom ? dom.clientWidth : 0;
          let realHeight = dom ? dom.clientHeight : 0;
          this.realWidth = realWidth
          this.realHeight = realHeight
          if (cacheW != realWidth || cacheH != realHeight) {
            if (typeof onResize === "function") onResize();
          }
          resolve();
        });
      });
    }
  }
}
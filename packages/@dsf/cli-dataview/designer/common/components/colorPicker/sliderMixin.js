export default {
  data() {
    return {
      isDown: false
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.mousemove);
    window.addEventListener('mouseup', this.mouseup);
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.mousemove);
    window.removeEventListener('mouseup', this.mouseup);
  },
  methods: {
    mousedown(e) {
      this.isDown = true;
      let {offsetX, offsetY, screenX, screenY} = e;
      let thumb = this.__thumb || this.$refs.thumb;
      if (e.target === thumb) {
        this._offsetX = this._SoffsetX = e.target.offsetLeft;
        this._offsetY = this._SoffsetY = e.target.offsetTop;
        this._screenX = screenX;
        this._screenY = screenY;
      } else {
        this._offsetX = this._SoffsetX = offsetX;
        this._offsetY = this._SoffsetY = offsetY;
        this._screenX = screenX;
        this._screenY = screenY;
        this.setPoint();
      }
    },
    mousemove(e) {
      if (!this.isDown) return;
      let {screenX, screenY} = e;
      this._offsetX = this._SoffsetX + screenX - this._screenX;
      this._offsetY = this._SoffsetY + screenY - this._screenY;
      this.setPoint();
    },
    mouseup(e) {
      if (!this.isDown) return;
      let {screenX, screenY} = e;
      this._offsetX = this._SoffsetX + screenX - this._screenX;
      this._offsetY = this._SoffsetY + screenY - this._screenY;
      this.setPoint();
      this.isDown = false;
    },
    setPoint() {
      let {offsetWidth, offsetHeight} = this.$refs.sliderBox;
      let offX = this._offsetX;
      if (offX < 0) {
        offX = 0;
      } else if (offX > offsetWidth) {
        offX = offsetWidth;
      }
      let offY = this._offsetY;
      if (offY < 0) {
        offY = 0;
      } else if (offY > offsetHeight) {
        offY = offsetHeight;
      }
      this.pointChange?.(offX, offY, this._offsetX, this._offsetY);
    }
  }
}
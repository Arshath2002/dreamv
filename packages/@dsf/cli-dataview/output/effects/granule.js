/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-09-08 16:14:28
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-15 17:44:50
 */
class Granule {
  constructor(config = {}) {
    let { numLasers = 150, tail = 80, ishasBackground = false, backgroud = 'rgba(6,13,25,1)', el, type = 'line' } = config;
    this.af = null;
    this.numLasers = numLasers;
    this.tail = tail;
    this.backgroud = backgroud
    this.ishasBackground = ishasBackground
    this.lasers = []
    if (!el.style.position) { el.style.position = 'relative' }
    this.el = el;
    this.canvasId = `canvas_${dsf.uuid()}`
    this.canvas = $(`<canvas id="${this.canvasId}" style="position:absolute;top:0;z-index:1;"></canvas>`)[0]

    $(this.el).prepend(this.canvas)

    this.ctx = this.canvas.getContext("2d");
    this.type = type
  }
  init() {
    let { canvas, af } = this
    cancelAnimationFrame(af);
    canvas.width = this.el.offsetWidth;
    canvas.height = this.el.offsetHeight;
    this.createCells()
    this.render()
  }
  clear() {
    let { af } = this
    cancelAnimationFrame(af)

    $(`#${this.canvasId}`).remove()

  }
  createCells() {
    let { numLasers, canvas } = this
    let lasers = []
    for (let i = 0; i < numLasers; ++i) {
      lasers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 2 + 1
      });
    }
    this.lasers = lasers
  }
  renderCell(l) {
    let { ctx, canvas, tail } = this
    const grad = ctx.createLinearGradient(l.x, l.y, l.x, l.y + tail);
    const a = canvas.height == 0 ? 1 : 1 - (canvas.height - l.y) / canvas.height * 0.8;
    grad.addColorStop(0, `rgba(255,255,255,${a})`);
    grad.addColorStop(1, "rgba(26,102,177,0)");

    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(l.x, l.y + tail);
    ctx.stroke();
  }
  updateCell(l) {
    let { tail, canvas } = this
    l.y -= l.s;
    if (l.y < -tail) {
      l.y = canvas.height;
    }
  }
  render() {
    let { lasers, ctx, canvas, ishasBackground, backgroud } = this
    ctx.fillStyle = backgroud
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //清除画布
    if (!ishasBackground) {
      let w = canvas.width;
      let h = canvas.height;
      ctx.clearRect(0, 0, w, h);
    }


    for (let l of lasers) {
      this.renderCell(l);
      this.updateCell(l);
    }
    this.af = requestAnimationFrame(() => this.render());
  }
}
export default Granule
export const fac = Granule

export let config = {
  backgroud: 'rgba(6,13,25,1)',
  ishasBackground: false,
  numLasers: 150,
  tail: 80,
  type: 'line'
}

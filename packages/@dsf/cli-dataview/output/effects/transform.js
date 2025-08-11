/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-09-14 15:45:38
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-16 09:55:39
 */
class Transfrom {
  constructor(config = {}) {
    let { count = 1500, el, maxSize = 2, ishasBackground = false, backgroud = 'rgba(6,13,25,1)' } = config;
    this.af = null;
    this.count = count;
    this.maxSize = maxSize;
    this.counters = []
    this.halfWidth = 0
    this.halfWidth = 0

    this.backgroud = backgroud
    this.ishasBackground = ishasBackground

    if (!el.style.position) { el.style.position = 'relative' }
    this.el = el;
    this.canvasId = `canvas_${dsf.uuid()}`
    this.canvas = $(`<canvas id="${this.canvasId}" style="position:absolute;top:0;z-index:1;"></canvas>`)[0]

    $(this.el).prepend(this.canvas)

    this.ctx = this.canvas.getContext("2d");

  }
  init() {
    let { canvas, af } = this
    cancelAnimationFrame(af);
    let w = canvas.width = this.el.offsetWidth;
    let h = canvas.height = this.el.offsetHeight;

    this.halfWidth = w / 2,
      this.halfHeight = h / 2;

    this.createCells()
    this.render()
  }
  clear() {
    let { af } = this
    cancelAnimationFrame(af)

    $(`#${this.canvasId}`).remove()


  }
  createCells() {
    let { count, canvas, maxSize, halfWidth, halfHeight } = this
    let w = canvas.width
    let h = canvas.height
    let counters = []

    for (let i = 0; i < count; ++i) {
      counters.push({
        x: Math.ceil(Math.random() * w),
        y: Math.ceil(Math.random() * h),
        posx: Math.random() * w - halfWidth,
        posy: Math.random() * h - halfHeight,
        fl: 100,
        speed: Math.random() * 2,
        posz: Math.random() * 250,
        r: Math.ceil(Math.random() * maxSize),
        color: "rgba(" + Math.ceil(Math.random() * 255) + "," + Math.ceil(Math.random() * 255) + "," + Math.ceil(Math.random() * 255) + "," + Math.random() + ")"

      });
    }
    this.counters = counters
  }
  renderCell(coor) {
    let { ctx, canvas, } = this
    var grd = ctx.createRadialGradient(coor.x, coor.y, coor.size / 2, coor.x, coor.y, coor.size);
    grd.addColorStop(0, "white");
    grd.addColorStop(1, coor.color);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(coor.x, coor.y, coor.size, 0, Math.PI * 2, true);
    ctx.transform(1, 0, 0, 1, 0, coor.z);
    ctx.closePath();
    ctx.fill();
  }
  draw(item) {
    if (item.posz > -item.fl) {
      var scale = item.fl / (item.fl + item.posz);
      item.x = this.halfWidth + item.posx * scale;
      item.y = this.halfHeight + item.posy * scale;
      item.size = item.r * scale;
      item.posz -= item.speed;
    } else {
      item.posz = Math.random() * 250;
    }
    this.renderCell(item);
  }
  render() {
    let { counters, ctx, canvas, ishasBackground, backgroud } = this
    ctx.fillStyle = backgroud
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!ishasBackground) {
      //清除画布
      let w = canvas.width;
      let h = canvas.height;
      ctx.clearRect(0, 0, w, h);
    }


    for (var item of counters) {
      this.draw(item);
    }
    this.af = requestAnimationFrame(() => this.render());
  }
}
export default Transfrom
export const fac = Transfrom

export let config = {
  count: 1000,
  maxSize: 2,
  backgroud: 'rgba(6,13,25,1)',
  ishasBackground: false,
}
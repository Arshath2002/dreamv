/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-09-14 14:00:10
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-16 10:00:33
 */
function random(min, max) {
  return Math.random() * (max - min) + min;
}
class Vortex {
  constructor(config = {}) {
    let { count = 100, el, ishasBackground = false, backgroud = 'rgba(6,13,25,1)' } = config;
    this.af = null;
    this.count = count;
    this.backgroud = backgroud
    this.ishasBackground = ishasBackground
    this.dots = []

    if (!el.style.position) { el.style.position = 'relative' }
    this.el = el;
    this.canvasId = `canvas_${dsf.uuid()}`
    this.canvas = $(`<canvas id="${this.canvasId}" style="position:absolute;top:0;z-index:1;"></canvas>`)[0]

    $(this.el).prepend(this.canvas)

    this.ctx = this.canvas.getContext("2d");

  }
  createCells() {
    let { count } = this
    var x, y, ix, iy, vx, vy, a, dist;
    let dots = []
    for (var i = 0; i < count; i++) {
      ix = x;
      iy = y;
      vx = random(-1, 1);
      vy = random(-1, 1);
      dist = count / 10 + i;
      a = 1;

      dots.push({
        ix,
        iy,
        vx,
        vy,
        i,
        a,
        dist
      });
    }
    this.dots = dots
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
  draw() {
    let { dots, ctx, canvas } = this
    let centerX = canvas.width * 0.5
    let centerY = canvas.height * 0.5
    let half = 50


    for (let i = 0; i < dots.length; i++) {
      let dot = dots[i];

      dot.a += 0.001;
      dot.x = centerX + Math.cos(i + dot.a) * (dot.dist * i * 0.1);
      dot.y = centerY + Math.sin(i + dot.a) * (dot.dist);

      const grad = ctx.createRadialGradient(dot.x + half / 2, dot.y + half / 2, 0, dot.x + half / 2, dot.y + half / 2, half / 2);

      grad.addColorStop(0.025, '#CCC');
      grad.addColorStop(0.1, 'rgba(33,72,135,1)');
      grad.addColorStop(0.25, 'rgba(33,72,135,0.1)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.fillRect(dot.x, dot.y, half, half);

    }

  }
  render() {
    let { ctx, canvas, backgroud, ishasBackground } = this
    ctx.fillStyle = backgroud
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!ishasBackground) {
      //清除画布
      let w = canvas.width;
      let h = canvas.height;
      ctx.clearRect(0, 0, w, h);
    }


    this.draw()

    this.af = requestAnimationFrame(() => this.render());
  }
}
export default Vortex
export const fac = Vortex

export let config = {
  count: 100,
  backgroud: 'rgba(6,13,25,1)',
  ishasBackground: false,
}
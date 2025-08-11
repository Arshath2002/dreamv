/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-09-14 10:59:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-16 10:04:53
 */
class Wave {
  constructor(config = {}) {
    let { pixelsNumber = 400, el, ishasBackground = false, backgroud = '#17293a', } = config;
    this.af = null;
    this.pixels = []
    this.pixelsNumber = pixelsNumber
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
    canvas.width = this.el.offsetWidth;
    canvas.height = this.el.offsetHeight;
    this.createCells()
    this.render()
  }
  createCells() {
    let pixels = []
    for (var x = -400; x < 400; x += 5) {
      for (var z = -250; z < 250; z += 5) {
        pixels.push({ x: x, y: 100, z: z });
      }
      this.pixels = pixels
    }
  }
  clear() {
    let { af } = this
    cancelAnimationFrame(af)

    $(`#${this.canvasId}`).remove()


  }
  draw(ts) {
    const { ctx, canvas, pixels } = this
    let w = canvas.width
    let h = canvas.height
    let imageData = ctx.getImageData(0, 0, w, h),
      len = pixels.length,
      fov = 250,
      pixel, scale,
      x2d, y2d, c;

    for (var i = 0; i < len; i++) {
      pixel = pixels[i];
      scale = fov / (fov + pixel.z);
      x2d = pixel.x * scale + w / 2;
      y2d = pixel.y * scale + h / 2;
      if (x2d >= 0 && x2d <= w && y2d >= 0 && y2d <= h) {
        c = (Math.round(y2d) * imageData.width + Math.round(x2d)) * 4;
        imageData.data[c] = 17;
        imageData.data[c + 1] = 122;
        imageData.data[c + 2] = 181;
        imageData.data[c + 3] = 255;
      }
      pixel.z -= 0.4;
      pixel.y = h / 14 + Math.sin(i / len * 15 + (ts / 450)) * 10;
      if (pixel.z < -fov) pixel.z += 2 * fov;
    }
    ctx.putImageData(imageData, 0, 0);
  }
  render(ts) {
    let { ctx, canvas, backgroud, ishasBackground } = this

    ctx.fillStyle = backgroud;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!ishasBackground) {
      //清除画布
      let w = canvas.width;
      let h = canvas.height;
      ctx.clearRect(0, 0, w, h);
    }


    this.draw(ts)

    this.af = requestAnimationFrame((ts) => this.render(ts));
  }
}
export default Wave
export const fac = Wave

export let config = {
  pixelsNumber: 600,
  backgroud: '#17293a',
  ishasBackground: false,
}
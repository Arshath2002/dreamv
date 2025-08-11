/*
 * @Description: 星空特效
 * @Author: zhanghang
 * @Date: 2022-09-08 16:41:51
 * @LastEditors: zhanghang
 * @LastEditTime: 2022-09-16 09:52:43
 */
function random(min, max) {
  if (arguments.length < 2) {
    max = min;
    min = 0;
  }
  if (min > max) {
    var hold = max;
    max = min;
    min = hold;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function maxOrbit(x, y) {
  const max = Math.max(x, y)
  const diameter = Math.round(Math.sqrt(max * max + max * max));
  return diameter / 2;
  //星星移动范围，值越大范围越小，
}
class Star {
  constructor(w, h, maxStars) {
    this.orbitRadius = random(maxOrbit(w, h));
    this.radius = random(60, this.orbitRadius) / 10;       //星星大小,值越大星星越小,默认8

    this.orbitX = w / 2;
    this.orbitY = h / 2;
    this.timePassed = random(0, maxStars);
    this.speed = random(this.orbitRadius) / 80000;        //星星移动速度,值越大越慢,默认5W

    this.alpha = random(2, 10) / 10;
  }
  draw(ctx, canvas2) {
    let x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX
    let y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY
    let twinkle = random(10);
    if (twinkle === 1 && this.alpha > 0) {
      this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
      this.alpha += 0.05;
    }
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
    this.timePassed += this.speed;
  }
}

class StarSky {
  constructor(config = {}) {
    let { starsNumber = 1000, backgroud = '', ishasBackground = false, el } = config;
    this.backgroud = backgroud
    this.ishasBackground = ishasBackground
    this.af = null;
    this.starsNumber = starsNumber;
    this.stars = []
    if (!el.style.position) { el.style.position = 'relative' }
    this.el = el;
    this.canvasId = `canvas_${dsf.uuid()}`
    this.canvas = $(`<canvas id="${this.canvasId}" style="position:absolute;top:0;z-index:1;"></canvas>`)[0]

    $(this.el).prepend(this.canvas)

    this.ctx = this.canvas.getContext("2d");
  }
  init() {
    let { canvas, af, starsNumber } = this
    cancelAnimationFrame(af);
    canvas.width = this.el.offsetWidth;
    canvas.height = this.el.offsetHeight;

    this.createStar()

    this.stars = []
    for (var i = 0; i < starsNumber; i++) {
      this.stars.push(new Star(canvas.width, canvas.height, starsNumber))
    }
    this.render()
  }
  clear() {
    let { af } = this
    cancelAnimationFrame(af)
    $(`#${this.canvasId}`).remove()

  }
  createStar() {
    const canvas2 = document.createElement('canvas')
    const ctx2 = canvas2.getContext('2d')

    canvas2.width = 100;
    canvas2.height = 100;
    const half = canvas2.width / 2
    const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#CCC');
    gradient2.addColorStop(0.1, 'rgba(33,72,135,1)');
    gradient2.addColorStop(0.25, 'rgba(6,13,25,0.5)');
    gradient2.addColorStop(1, 'transparent');
    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

    this.canvas2 = canvas2
  }

  render() {
    let { ctx, canvas, stars, canvas2, ishasBackground, backgroud } = this
    //清除画布
    let w = canvas.width;
    let h = canvas.height;
    if (!ishasBackground) {
      ctx.clearRect(0, 0, w, h);
    }


    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.5;                                 //尾巴
    ctx.fillStyle = backgroud
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter';

    for (var i = 1,
      l = stars.length; i < l; i++) {
      stars[i].draw(ctx, canvas2);
    }

    this.af = requestAnimationFrame(() => this.render());
  }
}
export default StarSky
export const fac = StarSky

export let config = {
  starsNumber: 1000,
  backgroud: 'rgba(6,13,25,1)',
  ishasBackground: true,
}
/*
 * Cloud 9 Carousel 2.2.0
 *
 * Pseudo-3D carousel plugin for jQuery/Zepto focused on performance.
 *
 * Based on the original CloudCarousel by R. Cecco.
 *
 * See the demo and download the latest version:
 *   http://specious.github.io/cloud9carousel/
 *
 * Copyright (c) 2017 by Ildar Sagdejev ( http://specious.github.io )
 * Copyright (c) 2011 by R. Cecco ( http://www.professorcloud.com )
 *
 * MIT License
 *
 * Please retain this copyright header in all versions of the software
 *
 * Requires:
 *  - jQuery >= 1.3.0 or Zepto >= 1.1.1
 *
 * Optional (jQuery only):
 *  - Reflection support via reflection.js plugin by Christophe Beyls
 *     http://www.digitalia.be/software/reflectionjs-for-jquery
 *  - Mousewheel support via mousewheel plugin
 *     http://plugins.jquery.com/mousewheel/
 */
const time =
  !window.performance || !window.performance.now
    ? function () {
        return +new Date();
      }
    : function () {
        return performance.now();
      };

const cancelFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;
const requestFrame = window.requestAnimationFrame;

class CarouselItem {
  constructor(element, options) {
    element.item = this;
    this.options = options;
    this.element = element;
    if (element.tagName === "IMG") {
      this.fullWidth = element.width;
      this.fullHeight = element.height;
    } else {
      // element.style.display = "inline-block";
      this.fullWidth = element.offsetWidth;
      this.fullHeight = element.offsetHeight;
    }
    element.style.position = "absolute";
    if (options.transforms) this.element.style["transformOrigin"] = "0 0";
  }
  moveTo(x, y, scale) {
    this.width = this.fullWidth * scale;
    this.height = this.fullHeight * scale;
    this.x = x;
    this.y = y;
    this.scale = scale;

    var style = this.element.style;
    style.zIndex = ("" + scale * 100) | 0;

    if (this.options.transforms) {
      style["transform"] = "translate(" + x + "px, " + y + "px) scale(" + scale + ")";
    } else {
      style.width = this.width + "px";
      style.left = x + "px";
      style.top = y + "px";
    }
  }
}

export default class Carousel {
  constructor(element, options = {}) {
    options = dsf.mix(
      true,
      {},
      {
        xOrigin: null, // null: calculated automatically
        yOrigin: null,
        xRadius: null,
        yRadius: null,
        farScale: 0.5, // scale of the farthest item
        transforms: true, // enable CSS transforms
        smooth: true, // enable smooth animation via requestAnimationFrame()
        fps: 30, // fixed frames per second (if smooth animation is off)
        speed: 4, // positive number
        autoPlay: 1, // [ 0: off | number of items (integer recommended, positive is clockwise) ]
        autoPlayDelay: 4000,
        bringToFront: true,
        itemClass: "carousel-item",
        frontItemClass: null,
        handle: "carousel",
      },
      options
    );
    this.options = options;

    const $container = $(element);
    this.$container = $container;

    const width = $container.width();
    const height = $container.height();

    this.items = [];
    this.xOrigin = options.xOrigin === null ? width / 2 : width / options.xOrigin;
    this.yOrigin = options.yOrigin === null ? height / 10 : height / options.yOrigin;
    this.xRadius = options.xRadius === null ? width / 2 : width / options.xRadius;
    this.yRadius = options.yRadius === null ? height / 6 : height / options.yRadius;
    this.farScale = options.farScale;
    this.rotation = this.destRotation = Math.PI / 2; // start with the first item positioned in front
    this.speed = options.speed;
    this.smooth = options.smooth;
    this.fps = options.fps;
    this.timer = 0;
    this.autoPlayAmount = options.autoPlay;
    this.autoPlayDelay = options.autoPlayDelay;
    this.autoPlayTimer = 0;
    this.frontItemClass = options.frontItemClass;
    this.onLoaded = options.onLoaded;
    this.onRendered = options.onRendered;
    this.onAnimationFinished = options.onAnimationFinished;

    this.activeIndex = 0;

    $container.css({ position: "relative", overflow: "hidden" });

    this.finishInit();
  }

  resize() {
    this.deactivate();
    const { options, $container } = this;
    const width = $container.width();
    const height = $container.height();
    this.xOrigin = options.xOrigin === null ? width / 2 : width / options.xOrigin;
    this.yOrigin = options.yOrigin === null ? height / 10 : height / options.yOrigin;
    this.xRadius = options.xRadius === null ? width / 2 : width / options.xRadius;
    this.yRadius = options.yRadius === null ? height / 6 : height / options.yRadius;

    this.finishInit();
  }

  reset(opt = {}) {
    this.deactivate();
    let { options, $container } = this;
    options = dsf.mix(
      true,
      {},

      options,
      opt
    );
    this.options = options;

    const width = $container.width();
    const height = $container.height();
    this.xOrigin = options.xOrigin === null ? width / 2 : width / options.xOrigin;
    this.yOrigin = options.yOrigin === null ? height / 10 : height / options.yOrigin;
    this.xRadius = options.xRadius === null ? width / 2 : width / options.xRadius;
    this.yRadius = options.yRadius === null ? height / 6 : height / options.yRadius;

    this.farScale = options.farScale;
    this.rotation = this.destRotation = Math.PI / 2; // start with the first item positioned in front
    this.speed = options.speed;
    this.smooth = options.smooth;
    this.fps = options.fps;
    this.timer = 0;
    this.autoPlayAmount = options.autoPlay;
    this.autoPlayDelay = options.autoPlayDelay;
    this.autoPlayTimer = 0;
    this.frontItemClass = options.frontItemClass;
    this.onLoaded = options.onLoaded;
    this.onRendered = options.onRendered;
    this.onAnimationFinished = options.onAnimationFinished;

    this.finishInit();
  }

  render() {
    const count = this.items.length;
    const spacing = (2 * Math.PI) / count;
    let radians = this.rotation;
    const nearest = this.nearestIndex();

    for (let i = 0; i < count; i++) {
      let item = this.renderItem(i, radians);

      if (i === nearest) $(item.element).addClass(this.frontItemClass);
      else $(item.element).removeClass(this.frontItemClass);

      radians += spacing;
    }

    if (typeof this.onRendered === "function") this.onRendered(this);
  }

  // Rotation:
  //  *      0 : right
  //  *   Pi/2 : front
  //  *   Pi   : left
  //  * 3 Pi/2 : back
  renderItem(itemIndex, rotation) {
    const item = this.items[itemIndex];
    const sin = Math.sin(rotation);
    const farScale = this.farScale;
    const scale = farScale + (1 - farScale) * (sin + 1) * 0.5;

    item.moveTo(this.xOrigin + scale * (Math.cos(rotation) * this.xRadius - item.fullWidth * 0.5), this.yOrigin + scale * sin * this.yRadius, scale);

    return item;
  }

  playFrame() {
    const rem = this.destRotation - this.rotation;
    const now = time();
    const dt = (now - this.lastTime) * 0.002;
    this.lastTime = now;

    if (Math.abs(rem) < 0.003) {
      this.rotation = this.destRotation;
      this.pause();

      if (typeof this.onAnimationFinished === "function") this.onAnimationFinished(this.activeIndex);
    } else {
      // Asymptotically approach the destination
      this.rotation = this.destRotation - rem / (1 + this.speed * dt);
      this.scheduleNextFrame();
    }

    this.render();
  }

  scheduleNextFrame() {
    this.lastTime = time();
    this.timer = this.smooth && cancelFrame ? requestFrame(this.playFrame.bind(this)) : setTimeout(this.playFrame.bind(this), 1000 / this.fps);
  }

  itemsRotated() {
    return (this.items.length * (Math.PI / 2 - this.rotation)) / (2 * Math.PI);
  }

  floatIndex() {
    const count = this.items.length;
    const floatIndex = this.itemsRotated() % count;

    // Make sure float-index is positive
    return floatIndex < 0 ? floatIndex + count : floatIndex;
  }
  nearestIndex() {
    return Math.round(this.floatIndex()) % this.items.length;
  }
  nearestItem() {
    return this.items[this.nearestIndex()];
  }
  play() {
    if (this.timer === 0) this.scheduleNextFrame();
  }
  pause() {
    this.smooth && cancelFrame ? cancelFrame(this.timer) : clearTimeout(this.timer);
    this.timer = 0;
  }
  go(count) {
    this.destRotation += ((2 * Math.PI) / this.items.length) * count;
    this.play();
  }
  goTo(index) {
    this.activeIndex = index;
    const count = this.items.length;

    // Find the shortest way to rotate item to front
    let diff = index - (this.floatIndex() % count);

    if (2 * Math.abs(diff) > count) diff -= diff > 0 ? count : -count;

    // Halt any rotation already in progress
    this.destRotation = this.rotation;

    // Spin the opposite way to bring item to front
    this.go(-diff);

    // Return rotational distance (in items) to the target
    return diff;
  }

  deactivate() {
    this.pause();
    const { options, $container } = this;
    clearInterval(this.autoPlayTimer);
    if (options.buttonLeft) options.buttonLeft.off("click");
    if (options.buttonRight) options.buttonRight.off("click");
    $container.off(".cloud9");
  }
  autoPlay() {
    clearInterval(this.autoPlayTimer);
    this.autoPlayTimer = setInterval(() => {
      this.go(this.autoPlayAmount);
    }, this.autoPlayDelay);
  }
  enableAutoPlay() {
    const { $container } = this;
    // Stop auto-play on mouse over
    $container.on("mouseover.cloud9", () => {
      clearInterval(this.autoPlayTimer);
    });

    // Resume auto-play when mouse leaves the container
    $container.on("mouseout.cloud9", () => {
      this.autoPlay();
    });

    this.autoPlay();
  }
  bindControls() {
    const { options, $container } = this;
    if (options.buttonLeft) {
      options.buttonLeft.on("click", () => {
        this.go(-1);
        return false;
      });
    }

    if (options.buttonRight) {
      options.buttonRight.on("click", () => {
        this.go(1);
        return false;
      });
    }

    if (options.mouseWheel) {
      $container.on("mousewheel.cloud9", (event, delta) => {
        this.go(delta > 0 ? 1 : -1);
        return false;
      });
    }

    if (options.bringToFront) {
      $container.on("click.cloud9", (event) => {
        const hits = $(event.target).closest("." + options.itemClass);
        if (hits.length !== 0) {
          const diff = this.goTo(this.items.indexOf(hits[0].item));

          // Suppress default browser action if the item isn't roughly in front
          if (Math.abs(diff) > 0.5) event.preventDefault();
        }
      });
    }
  }

  finishInit() {
    const { $container, options } = this;
    const items = $container.find("." + options.itemClass);
    //
    // Wait until all images have completely loaded
    //
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.tagName === "IMG" && (item.width === undefined || (item.complete !== undefined && !item.complete))) return;
    }

    clearInterval(this.initTimer);

    this.items = [];

    // Init items
    for (let i = 0; i < items.length; i++) this.items.push(new CarouselItem(items[i], options));

    // Disable click-dragging of items
    $container.on("mousedown onselectstart", function () {
      return false;
    });

    if (this.autoPlayAmount !== 0) this.enableAutoPlay();
    this.bindControls();
    this.render();

    if (typeof this.onLoaded === "function") this.onLoaded(this);
  }
}

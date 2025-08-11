<template>
  <canvas />
</template>

<script>
export default {
  name: 'Ruler',
  inject: ['$designerContainer'],
  props: {
    type: String
  },
  computed: {
    realWidth() {
      return this.$designerContainer.realWidth;
    },
    realHeight() {
      return this.$designerContainer.realHeight;
    },
    top() {
      return this.$designerContainer.top;
    },
    left() {
      return this.$designerContainer.left;
    },
    scale() {
      return this.$designerContainer.scale;
    },
  },
  mounted() {
    this.ctx = this.$el.getContext("2d");
  },
  methods: {
    resize() {
      let {type, ctx, $el} = this;
      if (!ctx) return;
      let {width = 0, height = 0} = this.$designerContainer.boxRect.box;
      if (!width || !height) return;
      width = type == 'y' ? 18 : width;
      height = type == 'x' ? 18 : height;
      $el.width = width;
      $el.height = height;
      ctx.width = width * 2;
      ctx.height = height * 2;
    },
    draw() {
      let {type, ctx} = this;
      ctx.clearRect(0, 0, ctx.width, ctx.height);
      if (type == 'y') {
        this.drawY();
      } else {
        this.drawX();
      }
    },
    drawX() {
      let {ctx} = this;
      let {left, scale, realWidth, boxRect} = this.$designerContainer;
      let {scrollLeft = 0, box: {width: boxWidth}} = boxRect;
      left -= scrollLeft + 12;
      let right = left + realWidth, x = left, n = 0;
      while (x <= boxWidth) {
        fn();
        n++;
      }
      n = -1;
      while (x >= 0) {
        fn();
        n--;
      }
      function fn() {
        x = left + n * scale / 10;
        let isHundred = n % 10 == 0;
        let isHighlight = x >= left && x <= right;
        if (!isHighlight) {
          ctx.strokeStyle = '#ccc';
        } else {
          ctx.strokeStyle = isHundred ? '#333' : '#999';
        }
        x = Math.round(x);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.moveTo(x, 0);
        ctx.lineTo(x, isHundred ? 12 : 6);
        ctx.stroke();
        if (isHundred && isHighlight) {
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#777';
          ctx.fillText(n * 10, x + 5, 18);
        }
      }
    },
    drawY() {
      let {ctx} = this;
      let {top, scale, realHeight, boxRect} = this.$designerContainer;
      let {scrollTop = 0, box: {height: boxHeight}} = boxRect;
      ctx.lineWidth = 1;
      top -= scrollTop + 12;
      let bottom = top + realHeight, y = top, n = -1;
      while (y >= 0) {
        fn();
        n--;
      }
      n = 0;
      while (y <= boxHeight) {
        fn();
        n++;
      }
      function fn() {
        y = top + n * scale / 10;
        let isHundred = n % 10 == 0;
        let isHighlight = y >= top && y <= bottom;
        if (!isHighlight) {
          ctx.strokeStyle = '#ccc';
        } else {
          ctx.strokeStyle = isHundred ? '#333' : '#999';
        }
        y = Math.round(y);
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.moveTo(0, y);
        ctx.lineTo(isHundred ? 12 : 6, y);
        ctx.stroke();
        if (isHundred && isHighlight) {
          ctx.save();
          ctx.translate(18, y + 5);
          ctx.rotate(-Math.PI / 2);
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#777';
          ctx.textAlign = "right";
          ctx.fillText(n * 10, 0, 0);
          ctx.rotate(Math.PI / 2);
          ctx.translate(-18, 5 - y);
          ctx.restore();
        }
      }
    }
  }
}
</script>
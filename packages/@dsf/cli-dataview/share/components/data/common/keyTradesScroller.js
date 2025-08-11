import LoopScroller from "../../common/loopScroller.vue";

export default {
  name: "keyTradesScroller",
  components: {
    LoopScroller,
  },
  props: {
    type: {
      type: String,
    },
    grid: {
      type: Object,
      default() {
        return {
          cols: 2,
          rows: 2,
        };
      },
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    itemStyle: {
      type: Function,
      default: () => {},
    },
    activeItem: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {
    options() {
      if (this.type === "block") {
        return {
          indicatorPosition: "none",
          arrow: "never",
          autoplay: true,
          ...this.config,
        };
      }
      return this.config;
    },
    dataSlices() {
      if (this.type === "block") {
        const { rows = 0, cols = 0 } = this.grid;
        const dataCount = rows * cols || 1;
        const result = [];
        for (let i = 0; i < this.data.length; i += dataCount) {
          const items = this.data.slice(i, i + dataCount);
          result.push(items);
        }
        return result;
      } else {
        return this.data;
      }
    },
    gridBoxStyle() {
      const { margin, itemWidth, itemBoxStyle } = this.$parent;
      const { direction = "horizontal" } = this.config;
      if (
        (this.type === "loop" || this.type === "block") &&
        direction === "horizontal"
      ) {
        const { rows = 0, cols = 0, gaps = "0px" } = this.grid;
        let [top, right = 0, bottom, left = 0] = margin;
        let gap = +left + +right;
        return {
          ...itemBoxStyle,
          width: (parseFloat(itemWidth) + gap) * (cols || 1) + "px",
          height: "100%",
          display: "grid",
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: gaps,
        };
      } else {
        return itemBoxStyle;
      }
    },
  },
  render(h) {
    const createItem = (it, idx) => {
      return h(
        "div",
        {
          class: {
            "key-trades-box-item": true,
            "bg-layout-array-setting": true,
            "select-key-trades-box-item": this.activeItem === it.index,
          },
          style: this.itemStyle(it.index - 1),
          key: idx,
          on: {
            click: (event) => this.$emit("it-click", event, it),
            mouseenter: (event) => this.$emit("it-mouseenter", event, it),
            mouseleave: (event) => this.$emit("it-mouseleave", event, it),
            mouseover: (event) => this.$emit("it-mouseover", event, it),
          },
        },
        [this.$scopedSlots.default({ it, index: idx })]
      );
    };

    const createGridBox = (data) => {
      return h(
        "div",
        {
          class: "key-trades-box",
          style: this.gridBoxStyle,
        },
        data.map((it, idx) => createItem(it, idx))
      );
    };

    let scrollerContent;
    if (this.type === "loop") {
      scrollerContent = h(
        LoopScroller,
        {
          props: this.options,
        },
        [createGridBox(this.dataSlices)]
      );
    } else if (this.type === "block") {
      scrollerContent = h(
        "el-carousel",
        {
          props: this.options,
          style: { height: "100%" },
        },
        this.dataSlices.map((item, index) =>
          h(
            "el-carousel-item",
            { key: index },
            [createGridBox(item)]
          )
        )
      );
    } else if (this.type === "none") {
      scrollerContent = h(
        "div",
        {
          style: { height: "100%", width: "100%", overflow: "hidden" },
        },
        [createGridBox(this.dataSlices)]
      );
    } else {
      scrollerContent = h(
        "dsf-virtual-scroll",
        {
          props: this.options,
          style: { height: "100%", width: "100%" },
        },
        [createGridBox(this.dataSlices)]
      );
    }

    return h(
      "div",
      {
        class: "key-trades-scroller",
      },
      [scrollerContent]
    );
  },
};
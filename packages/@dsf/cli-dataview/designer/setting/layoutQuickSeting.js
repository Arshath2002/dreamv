const letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let quickLayoutFour = {};
let quickLayoutFive = {};

for (let i = 0; i < 9; i++) {
  quickLayoutFour[letter[i]] = {
    animate: "",
    attr: [parseInt(i / 3), i % 3, 1, 1],
    show: true,
  };
}
for (let i = 0; i < 8; i++) {
  if (i < 3) {
    quickLayoutFive[letter[i]] = {
      animate: "",
      attr: [parseInt(i / 3), i % 3, 1, 1],
      show: true,
    };
  } else if (i == 3) {
    quickLayoutFive[letter[i]] = {
      animate: "",
      attr: [parseInt(i / 3), i % 3, 2, 2],
      show: true,
    };
  }else if (i == 4) {
    quickLayoutFive[letter[i]] = {
      animate: "",
      attr: [parseInt((i + 1) / 3), (i + 1) % 3, 2, 1],
      show: true,
    };
  } else {
    quickLayoutFive[letter[i]] = {
      animate: "",
      attr: [parseInt((i + 1) / 3)+1, (i + 1) % 3, 1, 1],
      show: true,
    };
  }
}

const quickLayoutConfig = [
  {
    columns: [""],
    rows: ["50%", "50%"],
    slotMap: {
      A: {
        animate: "",
        attr: [0, 0, 1, 1],
        show: true,
      },
      B: {
        animate: "",
        attr: [0, 1, 1, 1],
        show: true,
      },
    },
  },
  {
    columns: [""],
    rows: ["33.33%", "33.33%", "33.33%"],
    slotMap: {
      A: {
        animate: "",
        attr: [0, 0, 1, 1],
        show: true,
      },
      B: {
        animate: "",
        attr: [0, 1, 1, 1],
        show: true,
      },
      C: {
        animate: "",
        attr: [0, 2, 1, 1],
        show: true,
      },
    },
  },
  {
    columns: ["", ""],
    rows: ["100%"],
    slotMap: {
      A: {
        animate: "",
        attr: [0, 0, 1, 1],
        show: true,
      },
      B: {
        animate: "",
        attr: [1, 0, 1, 1],
        show: true,
      },
    },
  },
  {
    columns: ["", "", ""],
    rows: ["100%"],
    slotMap: {
      A: {
        animate: "",
        attr: [0, 0, 1, 1],
        show: true,
      },
      B: {
        animate: "",
        attr: [1, 0, 1, 1],
        show: true,
      },
      C: {
        animate: "",
        attr: [2, 0, 1, 1],
        show: true,
      },
    },
  },
  {
    columns: ["", "", ""],
    rows: ["33.33%", "33.33%", "33.33%"],
    slotMap: quickLayoutFour,
  },
  {
    columns: ["", "", "", ""],
    rows: ["100%"],
    slotMap: {
      A: {
        animate: "",
        attr: [0, 0, 1, 1],
        show: true,
      },
      B: {
        animate: "",
        attr: [1, 0, 2, 1],
        show: true,
      },
      C: {
        animate: "",
        attr: [3, 0, 1, 1],
        show: true,
      },
    },
  },

  {
    columns: ["", "", "", ""],
    rows: ["33.33%", "33.33%", "33.33%"],
    slotMap: quickLayoutFive,
  },
];


export default quickLayoutConfig

export {
  quickLayoutConfig
}
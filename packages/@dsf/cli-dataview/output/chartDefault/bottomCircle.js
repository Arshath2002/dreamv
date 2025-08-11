function createChart4(leftRotSize,mainColor,viceColor) {
  return {
    series: [
      // 最外圈格子
      {
        type: 'gauge', // 系列为仪表盘
        radius: '85%', // 外圈起始位置
        clockwise: false, // 是否顺时针
        startAngle: `${0 + leftRotSize}`, // 起始角度
        endAngle: `${240 + leftRotSize}`, // 结束角度
        splitNumber: 35, // 分割数量
        axisTick: false,
        axisLabel: false,
        // 走第二个逻辑把这个线变透明
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, 'transparent'],
              [1, 'transparent'],
            ],
            width: 10,
          }
        },
        // 分割线设置宽度和高度
        splitLine: {
          show: true,
          length: 15, // 这个是每一格的高度
          lineStyle: {
            color:mainColor,
            width: 10, // 每一格的宽度
          }
        },
      },
      // 最外圈线
      {
        type: 'gauge',
        radius: '84%',
        clockwise: false,
        startAngle: `${245 + leftRotSize}`,
        endAngle: `${355 + leftRotSize}`,
        splitNumber: 0,
        detail: '',
        axisTick: false,
        splitLine: false,
        axisLabel: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, mainColor],
              [1, mainColor]
            ],
            width: 10,
          }
        },
      },
      // 次外圈虚点
      {
        type: 'gauge',
        radius: '72%',
        clockwise: false,
        startAngle: `${0 - leftRotSize * 2}`,
        endAngle: `${354 - leftRotSize * 2}`,
        splitNumber: 60,
        axisTick: false,
        axisLabel: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, 'transparent'],
              [1, 'transparent'],
            ],
          }
        },
        splitLine: {
          show: true,
          length: 3,
          lineStyle: {
            color:viceColor,
            width: 3,
          }
        },
      },
      // 中间细线
      {
        type: 'gauge',
        radius: '60%',
        clockwise: false,
        startAngle: '0',
        endAngle: '359.99',
        splitNumber: 0,
        detail: '',
        axisTick: false,
        splitLine: false,
        axisLabel: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, viceColor],
              [1, viceColor]
            ],
            width: 3,
          }
        },
      },
      // 中间齿轮格子
      {
        type: 'gauge',
        radius: '54%',
        clockwise: false,
        startAngle: `${0 + leftRotSize * 3}`,
        endAngle: `${358 + leftRotSize * 3}`,
        splitNumber: 35,
        axisTick: false,
        axisLabel: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, 'transparent'],
              [1, 'transparent'],
            ],
            width: 10,
          }
        },
        splitLine: {
          show: true,
          length: 12,
          lineStyle: {
            color: viceColor,
            width: 10,
          }
        },
      },
      // 中间齿轮线
      {
        type: 'gauge',
        radius: '49%',
        clockwise: false,
        startAngle: '0',
        endAngle: '359.99',
        splitNumber: 0,
        detail: '',
        axisTick: false,
        splitLine: false,
        axisLabel: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, viceColor],
              [1, viceColor]
            ],
            width: 13,
          }
        },
      },
    ]
  }

}
function createChart3(leftRotSize, color) {
  return {
    series: [
      // 锅底
      {
        type: 'gauge',
        radius: '43%',
        clockwise: false,
        startAngle: '0',
        endAngle: '359.99', // 为什么不是360，因为360 = 0
        splitNumber: 0,
        detail: '',
        axisTick: false,
        splitLine: false,
        axisLabel: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, color],
              [1, color]
            ],
            width: 12,
          }
        },
      },
      // 锅耳
      {
        type: 'gauge',
        radius: '50%',
        clockwise: false,
        startAngle: `${0 - leftRotSize * 4}`,
        endAngle: `${359.99 - leftRotSize * 4}`,
        splitNumber: 0,
        detail: '',
        axisTick: false,
        splitLine: false,
        axisLabel: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, 'transparent'],
              [0.20, 'transparent'],
              [0.21, color],
              [0.29, color],
              [0.30, 'transparent'],
              [0.70, 'transparent'],
              [0.71, color],
              [0.79, color],
              [0.80, 'transparent'],
              [1, 'transparent']
            ],
            width: 16,
          }
        },
      },
    ]
  }
}
function createChart2(color) {
  return {
    series: [
      // 次内圈线
      {
        type: 'gauge',
        radius: '32%',
        clockwise: false,
        startAngle: '0',
        endAngle: '359.99',
        splitNumber: 0,
        detail: '',
        axisTick: false,
        splitLine: false,
        axisLabel: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, color],
              [1, color]
            ],
            width: 2,
          }
        },
      },
    ]



  }
}
function createChart1(leftRotSize, color) {
  return {
    series: [
      // 最内圈格子
      {
        type: 'gauge',
        radius: '28%',
        clockwise: false,
        startAngle: `${0 + leftRotSize * 6}`,
        endAngle: `${359 + leftRotSize * 6}`,
        splitNumber: 35,
        axisTick: false,
        axisLabel: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, 'transparent'],
              [1, 'transparent'],
            ],
            width: 10,
          }
        },
        splitLine: {
          show: true,
          length: 3,
          lineStyle: {
            color,
            width: 3,
          }
        },
      },
      // 最内圈线
      {
        type: 'gauge',
        radius: '28%',
        clockwise: false,
        startAngle: `${82 + leftRotSize * 6}`,
        endAngle: `${195 + leftRotSize * 6}`,
        splitNumber: 0,
        detail: '',
        axisTick: false,
        splitLine: false,
        axisLabel: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, color],
              [1, color]
            ],
            width: 3,
          }
        },
      },
    ]
  }
}
export {
  createChart4,
  createChart3,
  createChart2,
  createChart1
}
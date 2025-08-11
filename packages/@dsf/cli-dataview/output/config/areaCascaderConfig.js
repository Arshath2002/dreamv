// 区划级别
export const gradeConfig = {
  0: {
    name: 'province',
    zhName: '省(自治区、直辖市)'
  },
  1: {
    name: 'city',
    zhName: '地(市、州、盟)'
  },
  2: {
    name: 'dist',
    zhName: '县(市、区、旗)'
  },
  3: {
    name: 'street',
    zhName: '乡(镇、街道)'
  },
  4: {
    name: 'town',
    zhName: '村(居)委会'
  },
  // 5: {
  //   name: 'detail',
  //   zhName: '街(路)、门牌号'
  // }
};

// 行政编码划分规则
const gradeRule = [
  [0, 2, '0000000000'],
  [0, 4, '00000000'],
  [0, 6, '000000'],
  [0, 9, '000'],
  [0, 12, '']
];

/**
 * 根据最后一级的value值推算前面几级的value
 * @param lastValue
 * @param codeRule
 * @returns {string[]}
 */
export const getValuesByLastValue = (lastValue, {rootCode = '000000000000', isFull = false, inferCode} = {}) => {
  if (dsf.isFunction(inferCode)) {
    return inferCode(lastValue, {rootCode, isFull});
  }
  if (lastValue == rootCode) return [lastValue];
  let originValue = lastValue;
  if (isFull) {
    lastValue = _.padEnd(lastValue, 12, '0');
  }
  let ids = [rootCode];
  // todo 台湾、香港、澳门数据不对
  // todo 下面的处理可支持到一级二级筛选
  // todo 三级及以上前端暂时无解
  if (/^(71|81|82)/.test(lastValue)) {
    if (lastValue.substring(0,2) == '71') {
      ids.push(isFull ? '71' : '7100000000000');
    } else if (lastValue.substring(0,2) == '81') {
      ids.push(isFull ? '81' : '8100000000000');
    } else if (lastValue.substring(0,2) == '82') {
      ids.push(isFull ? '82' : '8200000000000');
    }
    if (lastValue.substring(2) != '00000000000') {
      ids.push(originValue);
    }
  }
  // 其他数据正常
  else {
    for (let i = 0; i < gradeRule.length; i++) {
      let newVal = lastValue.substring(gradeRule[i][0], gradeRule[i][1]);
      if (!isFull) {
        newVal += gradeRule[i][2];
      }
      if (newVal == ids[i]) break;
      ids.push(newVal);
    }
  }
  return ids;
}

const areaMap = {};
const queenMap = {};

/**
 * 请求数据
 * @param ids
 * @param endRange
 * @param startRange
 * @param areaVersion
 * @param cb
 * @returns {*}
 */
export function getOptions({ ids, endRange, startRange, areaVersion }, cb) {
  if (!dsf.isFunction(cb)) return;
  let callback = (list) => cb(_.cloneDeep(list));
  if (areaMap[`${ids},${endRange},${startRange}`]) {
    return callback(areaMap[`${ids},${endRange},${startRange}`]);
  }
  let queen = queenMap[`${ids},${endRange},${startRange}`];
  if (!queen) {
    queen = [];
    queenMap[`${ids},${endRange},${startRange}`] = queen;
  }
  queen.push(callback);
  if (queen.length !== 1) return;
  this.loading = true;
  const url = dsf.url.getWebPath("area/getArea", $$webRoot.platform);
  this.$http.get(url, {
    TREEINFO_GLOBALID: ids,
    END_LEVEL: endRange,
    START_LEVEL: startRange,
    $AreaVersionDate: areaVersion
  }, {
    cache: true,
    headers: {
      'Cache-Control': 'public'
    }
  })
    .done(({ success, data, message }) => {
      if (success) {
        areaMap[`${ids},${endRange},${startRange}`] = data;
        _.each(queenMap[`${ids},${endRange},${startRange}`], fn => fn(data));
        queenMap[`${ids},${endRange},${startRange}`] = [];
      } else {
        dsf.layer.message(message || '请求异常', false);
      }
    })
    .error(err => {
      dsf.layer.message(err?.message || '请求异常', false);
    })
    .always(() => {
      this.loading = false;
    });
}
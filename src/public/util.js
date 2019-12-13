/**
 * 把一个数组的横向存储变成纵向存储，势必结果会把一维数组转成二维数组
 * @target Array(one-dimensional)
 * @rowLen Number
 * @return Array(multi-dimensional)
 */
export function rowToCol(target, rowLen) {
  if (!rowLen || typeof rowLen !== "number" || rowLen === Infinity) {
    throw "util.rowToCal() need a total number at the second argument";
    return target;
  }
  if (rowLen <= 1) return target;
  const result = [
    // [{},{},{}]
    // [{},{}]
  ];

  let x = 0; // 代表列的下表
  let y = 0; // 代表行的下表
  let i = 0; // 代表target元素的下表
  while (i < target.length) {
    let loop = rowLen;
    while (loop--) {
      if (y >= target.length) break;
      if (!result[y]) result[y] = [];
      if (target[i]) result[y][x] = target[i];
      i++;
      y++;
    }
    y = 0;
    x++;
  }

  return result;
}
/**
 * 只支持二维数组
 * @target
 * @rowLen
 * @colLen
 * @element
 * @return
 *
 */
export function fillArray(target = [], element = "", rowLen = 1, colLen = 0) {
  let result = target;
  if (colLen) {
    multiDimonsional(rowLen, colLen);
  } else {
    oneDimonsional(rowLen);
  }

  function multiDimonsional(y) {
    while (y--) {
      if (!result[y]) result[y] = [];
      let x = colLen;
      while (x--) {
        if (!result[y][x]) result[y][x] = element;
      }
    }
  }

  function oneDimonsional(y) {
    while (y--) {
      if (!result[y]) result[y] = element;
    }
  }

  return result;
}

export function isEmptyObj(target) {
  for (let name in target) {
    return false;
  }
  return true;
}

export function isObj(target) {
  return Object.prototype.toString.call(target) === "[object Object]";
}

export function suffix(max) {
  return Math.floor(Math.random() * max)  
}

export function starFlash(container) {
    const stars = container.querySelectorAll('button.app-icon-container')
    const loop = () => {
        const star = stars[suffix(stars.length)]
        const flashTime = 1000 + suffix(3000)

        flashStart(star, flashTime)

        setTimeout(() => {
            flashEnd(star, flashTime)
            return loop()
        }, flashTime)

        function flashStart(target, flashTime) {
            target.style.border = `${flashTime/1800}px solid`
            target.style.boxShadow = `0 0 ${flashTime/300}px #fff`
        }
        function flashEnd(target) {
            target.style.border = "1px solid"
            target.style.boxShadow = "none"
        }
    }
    loop()
    loop()
    loop()
    loop()
}

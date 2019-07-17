 function genPoints (inArr, { width }) {
  const arr = inArr.map(item => (typeof item === 'number' ? item : item.value))
  const gridX = width / (arr.length - 1)

  return arr.map((value, index) => {
    const color = typeof inArr[index] === 'number' ? inArr[index] : inArr[index].color
    return {
      x: index * gridX,
      width: (value / 15) * gridX,
      v: color,
      animate: true
    }
  }).filter(({width}) => { return width > 0})
}

function genGoalPoints (inArr, length, { width }) {
  const gridX = width / (length - 1)
  return inArr.map((value) => {
    return {
      x: value * gridX,
      width: gridX,
      v: '#95be18',
      animate: false
    }
  }).filter(({width}) => { return width > 0})
}

function genColumns (_this, arr, h) {
  const { height } = _this.size;
  return arr.map((item, index) => {
    return h('rect', {
      attrs: {
        id: `column-id-${index}`,
        fill: item.v,
        x: item.x,
        y: 0,
        width: item.width,
        height,
      }
    }, ...(item.animate ? [[
      h('animate', {
        attrs: {
          attributeName: 'width',
          from: 0,
          to: item.width,
          dur: `${_this.growDuration}s`,
          fill: 'freeze'
        }
      })
    ]] : []))
  })
}

function genBackground ({ width, height }, h) {
  return h('rect', {
      attrs: {
        id: `background`,
        fill: '#e7e7e7',
        x: 0,
        y: 0,
        width: width,
        height,
      }
    })
}


export default {
  props: ['data', 'goal', 'size', 'blockSize', 'id', 'growDuration', 'max', 'min'],

  render (h) {
    const { data, goal, size } = this
    const goalPoints = genGoalPoints(goal, data.length, size)

    const dataArr = data.map((item, index) => {
        return {
          value: item,
          color: goal.indexOf(index) > -1 ? '#0074b9' : '#f43d89'
        }
    })

    const background = genBackground(size, h);
    const points = genPoints(dataArr, size)

    const bars = genColumns(this, [...goalPoints, ...points], h)

    return h('g', {
      attrs: {
        transform: `scale(1,-1) translate(0,-${this.size.height})`
      }
    }, [background, ...bars])
  }
}

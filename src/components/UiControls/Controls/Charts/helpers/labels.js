function genLabels (_this, arr, h) {
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
function genColumn (_this, h) {
  const { height, width } = _this.size;
  const { goal, spend, size } = _this;

  let bar_width = 0;
  let x = 0;
  let exceeded = false;

  if(spend <= goal) {
    bar_width = (width / goal) * (goal - spend);
  } else if (spend > goal) {
    bar_width  = (width / spend) * (spend - goal)
    exceeded = true;
  }

  if(exceeded) {
    return [
        h('rect', {
            attrs: {
              id: `column-id-1`,
              fill: 'green',
              x: bar_width,
              y: 0,
              width: width - bar_width,
              height,
            }
          }, [
            h('animate', {
                  attrs: {
                    attributeName: 'width',
                    from: width - bar_width,
                    to: 0,
                    dur: `1s`,
                    fill: 'freeze'
                  }
                }
            )]
      ),
        h('rect', {
          attrs: {
            id: `column-id-1`,
            fill: (exceeded ? 'red' : 'green'),
            transform: (exceeded ? "scale(-1, 1)" : ""),
            x: (exceeded ? bar_width * -1 : 0),
            y: 0,
            width: 0,
            height,
          }
        }, [
          h('animate', {
                attrs: {
                  attributeName: 'width',
                  from: 0,
                  to: bar_width,
                  dur: `1s`,
                  begin: `1s`,
                  fill: 'freeze'
                }
              }
          )]
    )];
  } else {
    return [h('rect', {
          attrs: {
            id: `column-id-1`,
            fill: 'green',
            x: 0,
            y: 0,
            width: width,
            height,
          }
        }, [
          h('animate', {
                attrs: {
                  attributeName: 'width',
                  from: width,
                  to: bar_width,
                  dur: `1s`,
                  fill: 'freeze'
                }
              }
          )]
    )];
  }
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
  props: ['spend', 'goal', 'size', 'id', 'growDuration'],

  render (h) {
    const { size } = this

    const background = genBackground(size, h);
    const column = genColumn(this, h)

    return h('g', {
      attrs: {
        transform: `scale(1,-1) translate(0,-${this.size.height})`
      }
    }, [background, ...column])
  }
}

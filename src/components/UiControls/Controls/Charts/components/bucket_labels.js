export default {
   props: ['spend', 'goal', 'size'],

  render (h) {
    const { spend, goal, size } = this
    const text_size = 9;

    let bar_width = 0;
    let exceeded = false;

    if(spend <= goal) {
      bar_width = (size.width / goal) * (goal - spend);
    } else if (spend > goal) {
      bar_width  = (size.width / spend) * (spend - goal)
      exceeded = true;
    }

    return h('g', {
      attrs: {
        transform: `scale(1,1) translate(0,${size.height} )`
      }
    }, [
        h('text', {
          attrs: {
            'dominant-baseline': 'hanging',
            'text-anchor': 'begin',
            fill: '#9a9a9a',
            'font-size': text_size,
            id: `label-text-start`,
            x: 0,
            y: (size.height) / 2
          }
        }, (exceeded ? goal - spend : '0')),
        ...(exceeded ?
            [h('text', {
              attrs: {
                'dominant-baseline': 'hanging',
                'text-anchor': 'middle',
                fill: '#9a9a9a',
                'font-size': text_size,
                id: `label-text-8`,
                x: bar_width,
                y: size.height / 2
              }
            }, '0')] : []
        ),
        h('text', {
          attrs: {
            'dominant-baseline': 'hanging',
            'text-anchor': 'end',
            fill: '#9a9a9a',
            'font-size': text_size,
            id: `label-text-goal`,
            x: size.width,
            y: (size.height) / 2
          }
        }, goal)
    ])
  }
}

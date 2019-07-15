export default {
  props: ['data', 'goal', 'size', 'blockSize', 'id', 'growDuration', 'max', 'min'],

  render (h) {
    const { data, goal, size } = this

    const icon_size = 12;
    const text_size = 9;

    return h('g', {
      attrs: {
        transform: `scale(1,1) translate(0,${size.height + size.height - icon_size} )`
      }
    }, [
        h('image', {
          attrs: {
            id: `label-sun`,
            'xlink:href': require('@/assets/images/challenges/icn_moon.svg'),
            x: 0,
            y: 0,
            width: icon_size,
            height: icon_size,
          }
        }),
        h('text', {
          attrs: {
            'dominant-baseline': 'hanging',
            'text-anchor': 'middle',
            fill: '#9a9a9a',
            'font-size': text_size,
            id: `label-text-4`,
            x: (size.width / 6),
            y: (size.height - icon_size) / 2
          }
        }, '04:00'),
        h('text', {
          attrs: {
            'dominant-baseline': 'hanging',
            'text-anchor': 'middle',
            fill: '#9a9a9a',
            'font-size': text_size,
            id: `label-text-8`,
            x: (size.width / 6) * 2,
            y: (size.height - icon_size) / 2
          }
        }, '08:00'),
        h('image', {
          attrs: {
            id: `label-sun`,
            'xlink:href': require('@/assets/images/challenges/icn_sun.svg'),
            x: size.width / 2 - (icon_size  * 1.1 / 2),
            y: 0,
            width: icon_size * 1.1,
            height: icon_size  * 1.1,
          }
        }),
        h('text', {
          attrs: {
            'dominant-baseline': 'hanging',
            'text-anchor': 'middle',
            fill: '#9a9a9a',
            'font-size': text_size,
            id: `label-text-16`,
            x: (size.width / 6) * 4,
            y: (size.height - icon_size) / 2
          }
        }, '16:00'),
        h('text', {
          attrs: {
            'dominant-baseline': 'hanging',
            'text-anchor': 'middle',
            fill: '#9a9a9a',
            'font-size': text_size,
            id: `label-text-20`,
            x: (size.width / 6) * 5,
            y: (size.height - icon_size) / 2
          }
        }, '20:00'),
        h('image', {
          attrs: {
            id: `label-sun`,
            'xlink:href': require('@/assets/images/challenges/icn_moon.svg'),
            x: size.width - icon_size,
            y: 0,
            width: icon_size,
            height: icon_size,
          }
        }),
    ])
  }
}

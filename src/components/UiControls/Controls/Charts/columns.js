import Column from './components/columns'
import Labels from './components/labels'

export default {
  name: 'Columns',

  props: {
    data: {
      type: Array,
      required: true
    },
    goal: {
      type: Array,
      required: true
    },
    blockSize: {
      type: Number,
      default: 15
    },
    growDuration: {
      type: Number,
      default: 0.5
    },
    max: {
      type: Number,
      default: -Infinity
    },
    min: {
      type: Number,
      default: Infinity
    },
    height: Number,
    width: Number
  },

  render (h) {
    if (!this.data || this.data.length < 2) return
    const { width, height } = this
    const viewWidth = width || 300
    const viewHeight = height || 18
    const props = this.$props

    props.size = {
      width: viewWidth,
      height: viewHeight
    }
    props.id = 'vue-columns-' + this._uid

    return h('svg', {
      attrs: {
        width: width || '100%',
        height: height || '20%',
        viewBox: `0 0 ${viewWidth} ${viewHeight * 2}`
      }
    }, [
      h(Column, {
        props,
        ref: 'path'
      }),
      h(Labels, {
        props,
        ref: 'path_labels'
      })

    ])
  }
}

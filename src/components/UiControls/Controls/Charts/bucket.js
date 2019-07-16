import Bucket from './components/bucket'
import Labels from './components/labels'

export default {
  name: 'Columns',

  props: {
    goal: {
      type: Number,
      required: true
    },
    spend: {
      type: Number,
      required: true,
      default: 0
    },
    growDuration: {
      type: Number,
      default: 0.5
    },
    height: Number,
    width: Number
  },

  render (h) {
    const { width, height } = this
    const viewWidth = width || 300
    const viewHeight = height || 18
    const props = this.$props

    props.size = {
      width: viewWidth,
      height: viewHeight
    }
    props.id = 'vue-bucket-' + this._uid

    return h('svg', {
      attrs: {
        width: width || '100%',
        height: height || '20%',
        viewBox: `0 0 ${viewWidth} ${viewHeight * 2}`
      }
    }, [
      h(Bucket, {
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

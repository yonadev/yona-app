import Bars from "./components/bars";
import Labels from "./components/labels";

export default {
  name: "Bars",

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
    height: Number
  },

  render(h) {
    if (!this.data || this.data.length < 2) return;
    const { height } = this;
    const viewHeight = height || 21;
    const props = this.$props;

    props.size = {
      height: viewHeight
    };

    props.id = "vue-columns-" + this._uid;
    props.offset = viewHeight * 1.5;

    return h(
      "svg",
      {
        attrs: {
          width: "100%",
          height: `${viewHeight * 3.5 + 2}px`
        }
      },
      [
        h(Bars, {
          props: { ...props, size: { height: viewHeight * 2.5 } },
          ref: "path"
        }),
        h(Labels, {
          props,
          ref: "path_labels"
        })
      ]
    );
  }
};

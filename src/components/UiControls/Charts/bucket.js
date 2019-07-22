import Bucket from "./components/bucket";
import Labels from "./components/bucket_labels";

export default {
  name: "Columns",

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
    height: Number
  },

  render(h) {
    const { height } = this;
    const viewHeight = height || 21;
    const props = this.$props;

    props.size = {
      height: viewHeight
    };
    props.offset = 0;
    props.id = "vue-bucket-" + this._uid;

    return h(
      "svg",
      {
        attrs: {
          width: "100%",
          height: `${viewHeight * 2}px`
        }
      },
      [
        h(Bucket, {
          props,
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

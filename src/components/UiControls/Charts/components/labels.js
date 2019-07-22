export default {
  props: [
    "data",
    "goal",
    "size",
    "offset",
    "blockSize",
    "id",
    "growDuration",
    "max",
    "min"
  ],

  render(h) {
    const { size, offset } = this;

    const icon_size = 13;
    const text_size = 11;

    return h(
      "g",
      {
        attrs: {
          transform: `scale(1,1) translate(0,${size.height + offset} )`
        }
      },
      [
        h("image", {
          attrs: {
            id: `label-sun`,
            transform: `translate(0, 2)`,
            "xlink:href": require("@/assets/images/challenges/icn_moon.svg"),
            x: 0,
            y: size.height - icon_size,
            width: icon_size,
            height: icon_size
          }
        }),
        h(
          "text",
          {
            attrs: {
              "text-anchor": "middle",
              fill: "#9a9a9a",
              "font-size": text_size,
              id: `label-text-4`,
              x: `${100 / 6}%`,
              y: size.height
            }
          },
          "04:00"
        ),
        h(
          "text",
          {
            attrs: {
              "text-anchor": "middle",
              fill: "#9a9a9a",
              "font-size": text_size,
              id: `label-text-8`,
              x: `${100 / 3}%`,
              y: size.height
            }
          },
          "08:00"
        ),
        h("image", {
          attrs: {
            id: `label-sun`,
            transform: `translate(${(icon_size / 2) * -1}, 2)`,
            "xlink:href": require("@/assets/images/challenges/icn_sun.svg"),
            x: `${100 / 2}%`,
            y: size.height - icon_size,
            width: icon_size * 1.1,
            height: icon_size * 1.1
          }
        }),
        h(
          "text",
          {
            attrs: {
              "text-anchor": "middle",
              fill: "#9a9a9a",
              "font-size": text_size,
              id: `label-text-16`,
              x: `${(100 / 6) * 4}%`,
              y: size.height
            }
          },
          "16:00"
        ),
        h(
          "text",
          {
            attrs: {
              "text-anchor": "middle",
              fill: "#9a9a9a",
              "font-size": text_size,
              id: `label-text-20`,
              x: `${(100 / 6) * 5}%`,
              y: size.height
            }
          },
          "20:00"
        ),
        h("image", {
          attrs: {
            id: `label-sun`,
            transform: `translate(${icon_size * -1}, 2)`,
            "xlink:href": require("@/assets/images/challenges/icn_moon.svg"),
            x: `${100}%`,
            y: size.height - icon_size,
            width: icon_size,
            height: icon_size
          }
        })
      ]
    );
  }
};

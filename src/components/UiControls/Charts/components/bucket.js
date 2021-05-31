function genColumn(_this, h) {
  const { height } = _this.size;
  const { goal, spend, size } = _this;

  let bar_width = 0;
  let exceeded = false;

  if (spend <= goal) {
    bar_width = (100 / goal) * (goal - spend);
  } else if (spend > goal) {
    bar_width = (100 / spend) * (spend - goal);
    exceeded = true;
  }

  if (exceeded) {
    return [
      h(
        "rect",
        {
          attrs: {
            id: `column-id-1`,
            fill: "#95be18",
            x: `${bar_width}%`,
            y: 0,
            width: `${100 - bar_width}%`,
            height,
          },
        },
        [
          h("animate", {
            attrs: {
              attributeName: "width",
              from: `${100 - bar_width}%`,
              to: 0,
              dur: `1s`,
              fill: "freeze",
            },
          }),
        ]
      ),
      h(
        "rect",
        {
          attrs: {
            id: `column-id-1`,
            fill: exceeded ? "#f43d89" : "#95be18",
            transform: exceeded ? "scale(-1, 1)" : "",
            x: exceeded ? `${bar_width * -1}%` : 0,
            y: 0,
            width: 0,
            height,
          },
        },
        [
          h("animate", {
            attrs: {
              attributeName: "width",
              from: 0,
              to: `${bar_width}%`,
              dur: `1s`,
              begin: `1s`,
              fill: "freeze",
            },
          }),
        ]
      ),
    ];
  } else {
    return [
      h(
        "rect",
        {
          attrs: {
            id: `column-id-1`,
            fill: "#95be18",
            x: 0,
            y: 0,
            width: "100%",
            height,
          },
        },
        [
          h("animate", {
            attrs: {
              attributeName: "width",
              from: "100%",
              to: `${bar_width}%`,
              dur: `1s`,
              fill: "freeze",
            },
          }),
        ]
      ),
    ];
  }
}

function genBackground({ width, height }, h) {
  return h("rect", {
    attrs: {
      id: `background`,
      fill: "#e7e7e7",
      x: 0,
      y: 0,
      width: "100%",
      height,
    },
  });
}

export default {
  props: ["spend", "goal", "size", "id", "growDuration"],

  render(h) {
    const { size } = this;

    const background = genBackground(size, h);
    const column = genColumn(this, h);

    return h(
      "g",
      {
        attrs: {
          transform: `scale(1,-1) translate(0,-${this.size.height})`,
        },
      },
      [background, ...column]
    );
  },
};

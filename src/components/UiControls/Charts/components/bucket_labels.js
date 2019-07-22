export default {
  props: ["spend", "goal", "size"],

  render(h) {
    const { spend, goal, size } = this;
    const text_size = 11;

    let bar_width = 0;
    let exceeded = false;

    if (spend <= goal) {
      bar_width = (100 / goal) * (goal - spend);
    } else if (spend > goal) {
      bar_width = (100 / spend) * (spend - goal);
      exceeded = true;
    }

    return h(
      "g",
      {
        attrs: {
          transform: `scale(1,1) translate(0,${size.height})`
        }
      },
      [
        h(
          "text",
          {
            attrs: {
              "text-anchor": "begin",
              fill: "#9a9a9a",
              "font-size": text_size,
              id: `label-text-start`,
              x: 0,
              y: size.height
            }
          },
          exceeded ? goal - spend : "0"
        ),
        ...(exceeded
          ? [
              h(
                "text",
                {
                  attrs: {
                    "text-anchor": "middle",
                    fill: "#9a9a9a",
                    "font-size": text_size,
                    id: `label-text-8`,
                    x: `${bar_width}%`,
                    y: size.height
                  }
                },
                "0"
              )
            ]
          : []),
        h(
          "text",
          {
            attrs: {
              "text-anchor": "end",
              fill: "#9a9a9a",
              "font-size": text_size,
              id: `label-text-goal`,
              x: "100%",
              y: size.height
            }
          },
          goal
        )
      ]
    );
  }
};

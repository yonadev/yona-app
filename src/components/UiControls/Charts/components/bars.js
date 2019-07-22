function genPoints(inArr, { height }, { min, max }) {
  const arr = inArr.map(item => (typeof item === "number" ? item : item.value));
  const gridX = 100 / (arr.length - 1);
  const gridY = height / max + 0.001;

  return arr.map((value, index) => {
    const color =
      typeof inArr[index] === "number" ? inArr[index] : inArr[index].color;
    return {
      x: `${index * gridX}%`,
      y: value * gridY,
      v: color
    };
  });
}

function genGoalPoints(arr, length, { width }) {
  const gridX = 100 / (length - 1);

  let points = [];
  for (let i = 1; i <= length; i++) {
    points.push({
      x: `${i * gridX}%`,
      y: 2,
      v: arr.indexOf(i) > -1 ? "#d5d5d5" : "#f3f3f3"
    });
  }

  return points;
}

export function genBars(_this, arr, h) {
  return arr.map((item, index) => {
    return h(
      "rect",
      {
        attrs: {
          id: `bar-id-${index}`,
          fill: item.v,
          x: item.x,
          y: 0,
          width: 1,
          height: item.y
        }
      },
      [
        h("animate", {
          attrs: {
            attributeName: "height",
            from: 0,
            to: item.y,
            dur: `${_this.growDuration}s`,
            fill: "freeze"
          }
        }),
        h("title", {}, [item.v])
      ]
    );
  });
}

export default {
  props: [
    "data",
    "goal",
    "size",
    "blockSize",
    "id",
    "growDuration",
    "max",
    "min"
  ],

  render(h) {
    const { data, goal, size, min, max } = this;
    const goalPoints = genGoalPoints(goal, data.length, size, { min, max });
    const dataArr = data.map((item, index) => {
      return {
        value: item,
        color: goal.indexOf(index) > -1 ? "#0074b9" : "#f43d89"
      };
    });

    const points = genPoints(dataArr, size, { min, max });
    const bars = genBars(this, [...goalPoints, ...points], h);

    return h(
      "g",
      {
        attrs: {
          transform: `scale(1,-1) translate(0,-${this.size.height})`
        }
      },
      [...bars]
    );
  }
};

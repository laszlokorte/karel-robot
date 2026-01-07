export const world = () => {
  const size = 20;

  const goalColumn = 11 + Math.ceil(Math.random() * 4) * 2 - 1;
  const heights = Array(size)
    .fill(size - 1)
    .map((x) => Math.round(Math.random() * x));
  // Start bei (1,1), Budget groß genug für 100 Schritte
  return {
    size: {
      y: size,
      x: size,
    },
    start: {
      y: size - 1,
      x: 0,
    },
    walls: Array(size)
      .fill(false)
      .flatMap((x, row) => {
        return Array(size)
          .fill(false)
          .map(
            (y, col) =>
              col % 2 == 1 &&
              20 - row <= heights[(col + 1) / 2] &&
              col < goalColumn,
          );
      }),
    crystals: Array(size)
      .fill(false)
      .flatMap((_, x) => {
        return Array(size)
          .fill(x == size - 1)
          .map((y, col) => y && col == goalColumn);
      }),
  };
};

export const solution = [
  {
    indentSpaces: "",
    label: "step",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "checkBeeper",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@done",
    spaces: "",
    numericArg: 21,
  },
  {
    indentSpaces: "",
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpBy",
    arg: "3",
    spaces: "",
    numericArg: 3,
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@step",
    spaces: "",
    numericArg: 0,
  },
  {
    indentSpaces: "",
    op: "turnLeft",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkWallRight",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpBy",
    arg: "-2",
    spaces: "",
    numericArg: -2,
  },
  {
    indentSpaces: "",
    op: "turnRight",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "turnRight",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifNotJumpBy",
    arg: "-2",
    spaces: "",
    numericArg: -2,
  },
  {
    indentSpaces: "",
    op: "turnLeft",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@step",
    spaces: "",
    numericArg: 0,
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "done",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "halt",
    spaces: "",
  },
];

export const world = () => {
  const size = 10;

  const heights = Array(size)
    .fill(false)
    .map((x) => Math.floor(Math.random() * 3));

  const counts = Array(size)
    .fill(false)
    .map((x) => Math.ceil(Math.random() * 3));
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
          .map((x, i) => row <= heights[i]);
      }),
    crystals: Array(size)
      .fill(false)
      .flatMap((_, row) => {
        return Array(size)
          .fill(false)
          .map((_x, i) => row > heights[i] && row - heights[i] <= counts[i]);
      }),
  };
};

export const solution = [
  {
    indentSpaces: "",
    label: "start",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "turnLeft",
    spaces: "",
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
    op: "jumpBy",
    arg: "-3",
    spaces: "",
    numericArg: -3,
  },
  {
    indentSpaces: "",
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "bookmarkAndJump",
    arg: "@collect",
    spaces: "",
    numericArg: 16,
  },
  {
    indentSpaces: "",
    op: "turnRight",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@end",
    spaces: "",
    numericArg: 32,
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@start",
    spaces: "",
    numericArg: 0,
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "collect",
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
    op: "ifNotJumpBy",
    arg: "7",
    spaces: "",
    numericArg: 7,
  },
  {
    indentSpaces: "",
    op: "pick",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "bookmarkAndJump",
    arg: "@collect",
    spaces: "",
    numericArg: 16,
  },
  {
    indentSpaces: "",
    op: "drop",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "return",
    spaces: "",
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
    op: "jumpBy",
    arg: "-3",
    spaces: "",
    numericArg: -3,
  },
  {
    indentSpaces: "",
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "return",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "end",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "halt",
    spaces: "",
  },
];

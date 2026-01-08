export const world = () => {
  const size = 10;

  const heights = Array(size)
    .fill(size)
    .map((x) => Math.round(Math.random() * x));

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
        return Array(size).fill(false);
      }),
    crystals: Array(size)
      .fill(false)
      .flatMap((_, x) => {
        return Array(size)
          .fill(true)
          .map((_, col) => x > 10 - heights[col]);
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
    op: "checkBeeper",
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
    arg: "@start",
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
    op: "checkBeeper",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifNotJumpTo",
    arg: "@roundDown",
    spaces: "",
    numericArg: 41,
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkBeeper",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifNotJumpTo",
    arg: "@roundDown",
    spaces: "",
    numericArg: 41,
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkBeeper",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifNotJumpTo",
    arg: "@roundDown",
    spaces: "",
    numericArg: 41,
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkBeeper",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@roundUp",
    spaces: "",
    numericArg: 20,
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@roundDown",
    spaces: "",
    numericArg: 41,
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "roundUp",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpBy",
    arg: "5",
    spaces: "",
    numericArg: 5,
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkBeeper",
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
    op: "drop",
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
    arg: "-4",
    spaces: "",
    numericArg: -4,
  },
  {
    indentSpaces: "",
    op: "turnAround",
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
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@done",
    spaces: "",
    numericArg: 56,
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
    label: "roundDown",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkBeeper",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifNotJumpBy",
    arg: "2",
    spaces: "",
    numericArg: 2,
  },
  {
    indentSpaces: "",
    op: "pick",
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
    arg: "-5",
    spaces: "",
    numericArg: -5,
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
    op: "ifYesJumpTo",
    arg: "@done",
    spaces: "",
    numericArg: 56,
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
    label: "done",
    labelSpace: " ",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "halt",
    spaces: "",
  },
];

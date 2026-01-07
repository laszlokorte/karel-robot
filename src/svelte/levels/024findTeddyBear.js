export const world = () => {
  const size = 10;

  const side = Math.round(Math.random() * 3);
  const pos = Math.round(Math.random() * 9);
  return {
    size: {
      y: size,
      x: size,
    },
    start: {
      y: Math.round(Math.random() * 9),
      x: Math.round(Math.random() * 9),
    },
    walls: Array(size)
      .fill(false)
      .flatMap((x, row) => {
        return Array(size).fill(false);
      }),
    crystals: Array(size)
      .fill(false)
      .flatMap((x, row) => {
        return Array(size)
          .fill(false)
          .map((x, col) => {
            return (
              (side == 0 && col == 0 && row == pos) ||
              (side == 1 && col == 9 && row == pos) ||
              (side == 2 && row == 0 && col == pos) ||
              (side == 3 && row == 9 && col == pos)
            );
          });
      }),
  };
};

export const solution = [
  {
    indentSpaces: "",
    label: "search",
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
    arg: "@found",
    spaces: "",
    numericArg: 11,
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
    arg: "@search",
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
    op: "jumpTo",
    arg: "@search",
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
    label: "found",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "pick",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "halt",
    spaces: "",
  },
];

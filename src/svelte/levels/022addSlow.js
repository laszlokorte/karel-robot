export const world = () => {
  const size = 10;

  return {
    size: {
      y: size,
      x: size,
    },
    start: {
      y: 0,
      x: size - 1,
    },
    walls: Array(size)
      .fill(false)
      .flatMap((x, row) => {
        return Array(size)
          .fill(false)
          .map((x, i) => (i == 0 ? true : x));
      }),
    crystals: Array(size)
      .fill(false)
      .flatMap((x, row) => {
        return Array(size)
          .fill(false)
          .map((x, i) => (i < 2 ? false : row <= 1 ? Math.random() > 0.5 : x));
      }),
    digits: Array(size * size).fill(true),
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
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "decrement",
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
    arg: "@writeDecrement",
    spaces: "",
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
    op: "ifYesJumpTo",
    arg: "@overflowDecrement",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@decrement",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "writeDecrement",
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
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "walkBackDecrement",
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
    arg: "3",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@walkBackDecrement",
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
    op: "turnRight",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@increment",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "overflowDecrement",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "halt",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "increment",
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
    op: "ifNotJumpTo",
    arg: "@writeIncrement",
    spaces: "",
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
    op: "ifYesJumpTo",
    arg: "@overflowIncrement",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@increment",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "writeIncrement",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "drop",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "walkBackIncrement",
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
    arg: "3",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@walkBackIncrement",
    spaces: "",
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
    op: "turnLeft",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@decrement",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "overflowIncrement",
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
    op: "jumpTo",
    arg: "@walkBackIncrement",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
];

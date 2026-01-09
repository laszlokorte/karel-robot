export const world = () => {
  const size = 20;
  const walls = Array(size * size).fill(false);

  const start = {
    x: 2 + Math.floor(Math.random() * 15),
    y: 2 + Math.floor(Math.random() * 15),
  };
  for (let r = 0; r < size * size; r += 2) {
    if (Math.random() > 0.2) {
      continue;
    }
    const x1 = Math.floor(r / size);
    const y1 = r % size;
    if (Math.hypot(start.x - x1, start.y - y1) < 4) {
      continue;
    }
    if (walls[x1 + y1 * size]) {
      continue;
    }
    const vert = Math.round(Math.random());
    const dir = Math.round(Math.random());
    const hor = 1 - vert;

    walls[x1 - hor + (y1 - vert) * size] = true;
    walls[x1 + y1 * size] = true;
    walls[x1 + hor + (y1 + vert) * size] = true;
    walls[x1 + hor + dir * vert + (y1 + vert + dir * hor) * size] = true;
    walls[x1 - hor + dir * vert + (y1 + vert + dir * hor) * size] = true;
  }
  return {
    start,
    size: {
      y: size,
      x: size,
    },
    walls,
    crystals: Array(size * size).fill(false),
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
    op: "bookmarkAndJump",
    arg: "@rec",
    spaces: "",
    numericArg: 4,
  },
  {
    indentSpaces: "",
    op: "halt",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "rec",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    empty: "",
    comment: "# already visited?",
  },
  {
    indentSpaces: "",
    op: "checkBeeper",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@ret",
    spaces: "",
    numericArg: 65,
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    empty: "",
    comment: "# deadend check: wall ahead + left + right",
  },
  {
    indentSpaces: "",
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifNotJumpTo",
    arg: "@notdead",
    spaces: "",
    numericArg: 18,
  },
  {
    indentSpaces: "",
    op: "checkWallLeft",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifNotJumpTo",
    arg: "@notdead",
    spaces: "",
    numericArg: 18,
  },
  {
    indentSpaces: "",
    op: "checkWallRight",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifNotJumpTo",
    arg: "@notdead",
    spaces: "",
    numericArg: 18,
  },
  {
    indentSpaces: "",
    op: "return",
    spaces: " ",
    comment: "# deadend, do nothing",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "notdead",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "drop",
    spaces: " ",
    comment: "# mark visited",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    empty: "",
    comment: "# direction 1",
  },
  {
    indentSpaces: "",
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@d1skip",
    spaces: "",
    numericArg: 29,
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "bookmarkAndJump",
    arg: "@rec",
    spaces: "",
    numericArg: 4,
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
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    label: "d1skip",
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
    empty: "",
  },
  {
    indentSpaces: "",
    empty: "",
    comment: "# direction 2",
  },
  {
    indentSpaces: "",
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@d2skip",
    spaces: "",
    numericArg: 40,
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "bookmarkAndJump",
    arg: "@rec",
    spaces: "",
    numericArg: 4,
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
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    label: "d2skip",
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
    empty: "",
  },
  {
    indentSpaces: "",
    empty: "",
    comment: "# direction 3",
  },
  {
    indentSpaces: "",
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@d3skip",
    spaces: "",
    numericArg: 51,
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "bookmarkAndJump",
    arg: "@rec",
    spaces: "",
    numericArg: 4,
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
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    label: "d3skip",
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
    empty: "",
  },
  {
    indentSpaces: "",
    empty: "",
    comment: "# direction 4",
  },
  {
    indentSpaces: "",
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@d4skip",
    spaces: "",
    numericArg: 62,
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "bookmarkAndJump",
    arg: "@rec",
    spaces: "",
    numericArg: 4,
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
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    label: "d4skip",
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
    empty: "",
  },
  {
    indentSpaces: "",
    label: "ret",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "return",
    spaces: "",
  },
];

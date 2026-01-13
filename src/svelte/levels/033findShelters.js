import commands from "../commands";
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
    op: commands.bookmarkAndJump.long,
    arg: "@rec",
    spaces: "",
    numericArg: 4,
  },
  {
    indentSpaces: "",
    op: commands.halt.long,
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
    op: commands.checkBeeper.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpTo.long,
    arg: "@notdead",
    spaces: "",
    numericArg: 18,
  },
  {
    indentSpaces: "",
    op: commands.checkWallLeft.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpTo.long,
    arg: "@notdead",
    spaces: "",
    numericArg: 18,
  },
  {
    indentSpaces: "",
    op: commands.checkWallRight.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpTo.long,
    arg: "@notdead",
    spaces: "",
    numericArg: 18,
  },
  {
    indentSpaces: "",
    op: commands.return.long,
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
    op: commands.drop.long,
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@d1skip",
    spaces: "",
    numericArg: 29,
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.bookmarkAndJump.long,
    arg: "@rec",
    spaces: "",
    numericArg: 4,
  },
  {
    indentSpaces: "",
    op: commands.turnAround.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.turnAround.long,
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
    op: commands.turnLeft.long,
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@d2skip",
    spaces: "",
    numericArg: 40,
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.bookmarkAndJump.long,
    arg: "@rec",
    spaces: "",
    numericArg: 4,
  },
  {
    indentSpaces: "",
    op: commands.turnAround.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.turnAround.long,
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
    op: commands.turnLeft.long,
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@d3skip",
    spaces: "",
    numericArg: 51,
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.bookmarkAndJump.long,
    arg: "@rec",
    spaces: "",
    numericArg: 4,
  },
  {
    indentSpaces: "",
    op: commands.turnAround.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.turnAround.long,
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
    op: commands.turnLeft.long,
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@d4skip",
    spaces: "",
    numericArg: 62,
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.bookmarkAndJump.long,
    arg: "@rec",
    spaces: "",
    numericArg: 4,
  },
  {
    indentSpaces: "",
    op: commands.turnAround.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.turnAround.long,
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
    op: commands.turnLeft.long,
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
    op: commands.return.long,
    spaces: "",
  },
];

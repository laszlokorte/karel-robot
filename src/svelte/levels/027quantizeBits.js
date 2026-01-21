import commands from "../commands";
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
    op: commands.checkBeeper.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpBy.long,
    arg: "5",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@done",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@start",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.turnLeft.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkBeeper.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpTo.long,
    arg: "@roundDown",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkBeeper.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpTo.long,
    arg: "@roundDown",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkBeeper.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpTo.long,
    arg: "@roundDown",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkBeeper.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@roundUp",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@roundDown",
    spaces: "",
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpBy.long,
    arg: "5",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkBeeper.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpBy.long,
    arg: "-2",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.drop.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpBy.long,
    arg: "3",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpBy.long,
    arg: "-4",
    spaces: "",
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpBy.long,
    arg: "-2",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.turnLeft.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@done",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@start",
    spaces: "",
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
    op: commands.checkBeeper.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpBy.long,
    arg: "2",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.pick.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpBy.long,
    arg: "-5",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.turnLeft.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@done",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@start",
    spaces: "",
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
    op: commands.halt.long,
    spaces: "",
  },
];

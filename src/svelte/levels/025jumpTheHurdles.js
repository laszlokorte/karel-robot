import commands from "../commands";
import { mulberry32 } from "../mulberry";
export const world = (seed) => {
  const rnd = mulberry32(seed);
  const size = 20;

  const goalColumn = 11 + Math.ceil(rnd() * 4) * 2 - 1;
  const heights = Array(size)
    .fill(size - 1)
    .map((x) => Math.round(rnd() * x));
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
    op: commands.checkBeeper.long,
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
    op: commands.jumpTo.long,
    arg: "@step",
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
    op: commands.checkWallRight.long,
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
    op: commands.turnRight.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.turnRight.long,
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
    op: commands.jumpTo.long,
    arg: "@step",
    spaces: "",
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
    op: commands.halt.long,
    spaces: "",
  },
];

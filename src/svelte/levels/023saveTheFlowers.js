import commands from "../commands";
import { mulberry32 } from "../mulberry";
export const world = (seed) => {
  const rnd = mulberry32(seed);
  const size = 10;

  const heights = [
    ...Array(4)
      .fill(false)
      .map((x) => Math.ceil(rnd() * 2)),
    0,
    ...Array(3)
      .fill(false)
      .map((x) => -Math.floor(rnd() * 2) - 1),
  ]
    .reduce((acc, v) => [v + acc[0], ...acc], [1])
    .reverse();
  heights[5] = 9;
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
          .map((x, i) => 10 - row < heights[i]);
      }),
    crystals: Array(size)
      .fill(false)
      .flatMap((x, row) => {
        return Array(size)
          .fill(false)
          .map((x, i) => i > 0 && i < 5 && 10 - row == heights[i]);
      }),
  };
};
export const solution = [
  {
    indentSpaces: "",
    op: commands.bookmarkAndJump.long,
    arg: "@rec",
    spaces: "",
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
    op: commands.turnLeft.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.checkWallRight.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpBy.long,
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
    arg: "-3",
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
    op: commands.checkBeeper.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifNotJumpBy.long,
    arg: "3",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.pick.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.bookmarkAndJump.long,
    arg: "@rec",
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
    arg: "2",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.return.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.drop.long,
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpBy.long,
    arg: "2",
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
    op: commands.return.long,
    spaces: "",
  },
];

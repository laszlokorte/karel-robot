import commands from "../commands";
import { mulberry32 } from "../mulberry";

export const world = (seed) => {
  const rnd = mulberry32(seed);
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
          .map((x, i) => (i == 0 ? true : row == 0 ? rnd() > 0.5 : x));
      }),
    digits: Array(size * size).fill(true),
  };
};
export const solution = [
  {
    indentSpaces: "",
    op: commands.turnAround.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "search",
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
    op: commands.ifNotJumpTo.long,
    arg: "@write",
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
    op: commands.ifYesJumpTo.long,
    arg: "@overflow",
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
    arg: "@search",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "write",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: commands.drop.long,
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
    empty: "",
  },
  {
    indentSpaces: "",
    label: "overflow",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: commands.halt.long,
    spaces: "",
  },
];

import commands from "../commands";
import { mulberry32 } from "../mulberry";

export const world = (seed) => {
  const rnd = mulberry32(seed);
  return {
    size: {
      y: 10,
      x: 10,
    },
    start: {
      y: 9,
      x: 0,
    },
    walls: Array(10 * 10).fill(false),
    crystals: Array(10 * 10)
      .fill(false)
      .map((x, i) => (rnd() > 0.5 ? x : !x)),
  };
};

export const solution = [
  {
    indentSpaces: "",
    label: "walkRight",
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
    op: commands.ifNotJumpTo.long,
    arg: "@walkRight",
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
    op: commands.checkWallLeft.long,
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
    op: commands.turnLeft.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@walkLeft",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "walkLeft",
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
    op: commands.ifNotJumpTo.long,
    arg: "@walkLeft",
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
    op: commands.checkWallRight.long,
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
    op: commands.turnRight.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@walkRight",
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

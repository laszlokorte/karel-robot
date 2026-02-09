import commands from "../commands";
export const world = () => {
  const size = 10;

  return {
    size: {
      y: size,
      x: size,
    },
    start: {
      x: size - 1,
      y: 0,
    },
    walls: Array(size)
      .fill(false)
      .flatMap((_x, _row) => {
        return Array(size)
          .fill(false)
          .map((v, col) => (col > 0 ? v : true));
      }),
    crystals: Array(size)
      .fill(false)
      .flatMap((x, row) => {
        return Array(size)
          .fill(false)
          .map((v, col) => row < 2 && col == size - 1);
      }),
    digits: Array(size * size).fill(true),
  };
};

export const solution = [
  {
    indentSpaces: "",
    op: commands.turnRight.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    label: "carryfresh",
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
    arg: "@carryfreshone",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryfreshzero",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "carryzero",
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
    arg: "@carryzeroone",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryzerozero",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "carryone",
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
    arg: "@carryoneone",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryonezero",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "carryzerozero",
    labelSpace: "",
    empty: "",
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
    arg: "4",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.drop.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryzeronext",
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
    arg: "@carryzeronext",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "carryzeroone",
    labelSpace: "",
    empty: "",
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
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryonenext",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.drop.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryzeronext",
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
    label: "carryfreshzero",
    labelSpace: "",
    empty: "",
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
    op: commands.ifYesJumpTo.long,
    arg: "@halt",
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
    arg: "4",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.drop.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryzeronext",
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
    arg: "@carryzeronext",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "carryfreshone",
    labelSpace: "",
    empty: "",
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
    op: commands.ifYesJumpTo.long,
    arg: "@halt",
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
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryonenext",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.drop.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryzeronext",
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
    label: "carryonezero",
    labelSpace: "",
    empty: "",
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
    arg: "4",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.drop.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryzeronext",
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
    arg: "@carryonenext",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "carryoneone",
    labelSpace: "",
    empty: "",
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
    arg: "4",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.drop.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@carryonenext",
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
    arg: "@carryonenext",
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
    label: "carryonenext",
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@doneAdding",
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
    arg: "@carryone",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "carryzeronext",
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@doneAdding",
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
    arg: "@carryzero",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "doneAdding",
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
    op: commands.checkWallAhead.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@halt",
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
    arg: "@carryfresh",
    spaces: "",
  },
  {
    indentSpaces: "",
    label: "halt",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: commands.halt.long,
    spaces: "",
  },
];

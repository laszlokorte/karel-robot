export const levels = [
  {
    id: "line",
    name: "Line",
    level: {
      size: { x: 10, y: 10 },
      start: { x: 5, y: 5 },
      walls: Array(10 * 10).fill(false),
      crystals: Array(10 * 10).fill(false),
    },
  },
  {
    id: "inf-line",
    name: "Infinite Line",
    level: {
      size: { x: 10, y: 10 },
      start: { x: 5, y: 5 },
      walls: Array(10 * 10).fill(false),
      crystals: Array(10 * 10).fill(false),
    },
  },
  {
    id: "error",
    name: "Errors",
    level: {
      size: { x: 10, y: 10 },
      start: { x: 5, y: 5 },
      walls: Array(10 * 10).fill(false),
      crystals: Array(10 * 10).fill(false),
    },
  },
  {
    id: "empty",
    name: "Empty",
    level: {
      size: { x: 10, y: 10 },
      start: { x: 5, y: 5 },
      walls: Array(10 * 10).fill(false),
      crystals: Array(10 * 10).fill(false),
    },
  },
  {
    id: "bookmarks",
    name: "Bookmarks",
    level: {
      size: { x: 10, y: 10 },
      start: { x: 5, y: 5 },
      walls: Array(10 * 10).fill(false),
      crystals: Array(10 * 10).fill(false),
    },
  },
  {
    id: "stack",
    name: "Stack",
    level: {
      size: { x: 10, y: 10 },
      start: { x: 5, y: 5 },
      walls: Array(10 * 10).fill(false),
      crystals: Array(10 * 10).fill(false),
    },
  },
  {
    id: "lvl1",
    name: "Level 1",
    level: {
      size: { x: 10, y: 10 },
      start: { x: 3, y: 4 },
      walls: Array(10 * 10)
        .fill(false)
        .map((d, i) => (i % 17 == 0 ? d : i % 19 == 2 ? true : d)),
      crystals: Array(10 * 10)
        .fill(false)
        .map((d, i) => (i % 17 == 0 ? true : d)),
    },
  },
];

export const solutions = [
  {
    level: "inf-line",
    commands: [
      {
        label: "start",
        labelSpace: "",
        empty: "",
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpBy.long,
        arg: "3",
        spaces: "",
      },
      {
        op: commands.jumpBy.long,
        arg: "-3",
        spaces: "",
      },
      {
        empty: "",
      },
      {
        op: commands.turnAround.long,
        spaces: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpBy.long,
        arg: "5",
        spaces: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.jumpBy.long,
        arg: "-4",
        spaces: "",
      },
      {
        empty: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.turnAround.long,
        spaces: "",
      },
      {
        op: commands.pick.long,
        spaces: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpBy.long,
        arg: "3",
        spaces: "",
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.jumpBy.long,
        arg: "-4",
        spaces: "",
      },
      {
        op: commands.turnAround.long,
        spaces: "",
      },
      {
        op: commands.jumpTo.long,
        arg: "@start",
        spaces: "",
      },
      {
        empty: "",
      },
    ],
  },
  {
    level: "line",
    commands: [
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpTo.long,
        arg: "@foo",
        spaces: "",
      },
      {
        op: commands.jumpBy.long,
        arg: "-3",
        spaces: "",
      },
      {
        empty: "",
      },
      {
        label: "foo",
        labelSpace: "",
        empty: "",
      },
      {
        op: commands.turnAround.long,
        spaces: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpTo.long,
        arg: "@bar",
        spaces: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.jumpBy.long,
        arg: "-4",
        spaces: "",
      },
      {
        empty: "",
      },
      {
        label: "bar",
        labelSpace: "",
        empty: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.turnAround.long,
        spaces: "",
      },
      {
        op: commands.pick.long,
        spaces: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpBy.long,
        arg: "3",
        spaces: "",
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.jumpBy.long,
        arg: "-4",
        spaces: "",
      },
      {
        op: commands.turnAround.long,
        spaces: "",
      },
      {
        op: commands.halt.long,
        spaces: "",
      },
      {
        empty: "",
      },
    ],
  },
  {
    level: "error",
    commands: [
      {
        op: commands.turnLeft.long,
        spaces: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.turnAround.long,
        spaces: "",
      },
    ],
  },
  {
    level: "bookmarks",
    commands: [
      {
        op: commands.bookmark.long,
        spaces: "",
      },
      {
        op: commands.bookmark.long,
        spaces: "",
      },
      {
        op: commands.bookmark.long,
        spaces: "",
      },
      {
        op: commands.bookmark.long,
        spaces: "",
      },
      {
        op: commands.bookmark.long,
        spaces: "",
      },
      {
        op: commands.bookmark.long,
        spaces: "",
      },
      {
        op: commands.bookmark.long,
        spaces: "",
      },
      {
        op: commands.return.long,
        spaces: "",
      },
      {
        op: commands.halt.long,
        spaces: "",
      },
    ],
  },
  {
    level: "stack",
    commands: [
      {
        op: commands.bookmarkAndJump.long,
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: commands.turnLeft.long,
        spaces: "",
      },
      {
        op: commands.bookmarkAndJump.long,
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.turnLeft.long,
        spaces: "",
      },
      {
        op: commands.bookmarkAndJump.long,
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.turnLeft.long,
        spaces: "",
      },
      {
        op: commands.bookmarkAndJump.long,
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.turnLeft.long,
        spaces: "",
      },
      {
        op: commands.bookmarkAndJump.long,
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.turnAround.long,
        spaces: "",
      },
      {
        op: commands.bookmarkAndJump.long,
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: commands.turnRight.long,
        spaces: "",
      },
      {
        op: commands.bookmarkAndJump.long,
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: commands.turnRight.long,
        spaces: "",
      },
      {
        op: commands.bookmarkAndJump.long,
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: commands.turnRight.long,
        spaces: "",
      },
      {
        op: commands.halt.long,
        spaces: "",
      },
      {
        empty: "",
      },
      {
        empty: "",
      },
      {
        label: "walkToWall",
        labelSpace: "",
        empty: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpBy.long,
        arg: "3",
        spaces: "",
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.jumpTo.long,
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: commands.return.long,
        spaces: "",
      },
    ],
  },
  {
    level: "lvl1",
    commands: [
      {
        label: "start",
        labelSpace: "",
        empty: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpBy.long,
        arg: "3",
        spaces: "",
        numericArg: 3,
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.jumpTo.long,
        arg: "@start",
        spaces: "",
        numericArg: 0,
      },
      {
        empty: "",
      },
      {
        label: "turn",
        labelSpace: "",
        empty: "",
      },
      {
        op: commands.turnLeft.long,
        spaces: "",
      },
      {
        label: "step",
        labelSpace: "",
        empty: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpTo.long,
        arg: "@turn",
        spaces: "",
        numericArg: 6,
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.checkWallLeft.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpBy.long,
        arg: "2",
        spaces: "",
        numericArg: 2,
      },
      {
        op: commands.turnRight.long,
        spaces: "",
      },
      {
        op: commands.checkBeeper.long,
        spaces: "",
      },
      {
        op: commands.ifNotJumpTo.long,
        arg: "@step",
        spaces: "",
        numericArg: 8,
      },
      {
        op: commands.pick.long,
        spaces: "",
      },
      {
        op: commands.jumpTo.long,
        arg: "@step",
        spaces: "",
        numericArg: 8,
      },
      {
        empty: "",
      },
    ],
  },
  {
    level: "empty",
    commands: [
      {
        op: commands.jumpTo.long,
        arg: "@begin",
        spaces: "",
      },
      {
        label: "turn",
        labelSpace: "",
        empty: "",
      },
      {
        op: commands.turnAround.long,
        spaces: "",
      },
      {
        empty: "",
      },
      {
        label: "begin",
        labelSpace: "",
        empty: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpTo.long,
        arg: "@turn",
        spaces: "",
      },
      {
        op: commands.checkBeeper.long,
        spaces: "",
      },
      {
        op: commands.ifNotJumpBy.long,
        arg: "15",
        spaces: "",
      },
      {
        op: commands.pick.long,
        spaces: "",
      },
      {
        op: commands.turnLeft.long,
        spaces: "",
      },
      {
        op: commands.checkWallAhead.long,
        spaces: "",
      },
      {
        op: commands.ifNotJumpBy.long,
        arg: "2",
        spaces: "",
      },
      {
        op: commands.halt.long,
        spaces: "",
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.checkBeeper.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpBy.long,
        arg: "-5",
        spaces: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.turnAround.long,
        spaces: "",
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.checkBeeper.long,
        spaces: "",
      },
      {
        op: commands.ifYesJumpBy.long,
        arg: "-2",
        spaces: "",
      },
      {
        op: commands.turnLeft.long,
        spaces: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.jumpTo.long,
        arg: "@begin",
        spaces: "",
      },
      {
        op: commands.drop.long,
        spaces: "",
      },
      {
        op: commands.forward.long,
        spaces: "",
      },
      {
        op: commands.jumpTo.long,
        arg: "@begin",
        spaces: "",
      },
    ],
  },
];

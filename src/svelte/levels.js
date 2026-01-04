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
        op: "forward",
        spaces: "",
      },
      {
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifYesJumpBy",
        arg: "3",
        spaces: "",
      },
      {
        op: "jumpBy",
        arg: "-3",
        spaces: "",
      },
      {
        empty: "",
      },
      {
        op: "turnAround",
        spaces: "",
      },
      {
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifYesJumpBy",
        arg: "5",
        spaces: "",
      },
      {
        op: "drop",
        spaces: "",
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "jumpBy",
        arg: "-4",
        spaces: "",
      },
      {
        empty: "",
      },
      {
        op: "drop",
        spaces: "",
      },
      {
        op: "turnAround",
        spaces: "",
      },
      {
        op: "pick",
        spaces: "",
      },
      {
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifYesJumpBy",
        arg: "3",
        spaces: "",
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "jumpBy",
        arg: "-4",
        spaces: "",
      },
      {
        op: "turnAround",
        spaces: "",
      },
      {
        op: "jumpTo",
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
        op: "forward",
        spaces: "",
      },
      {
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifYesJumpTo",
        arg: "@foo",
        spaces: "",
      },
      {
        op: "jumpBy",
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
        op: "turnAround",
        spaces: "",
      },
      {
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifYesJumpTo",
        arg: "@bar",
        spaces: "",
      },
      {
        op: "drop",
        spaces: "",
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "jumpBy",
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
        op: "drop",
        spaces: "",
      },
      {
        op: "turnAround",
        spaces: "",
      },
      {
        op: "pick",
        spaces: "",
      },
      {
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifYesJumpBy",
        arg: "3",
        spaces: "",
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "jumpBy",
        arg: "-4",
        spaces: "",
      },
      {
        op: "turnAround",
        spaces: "",
      },
      {
        op: "halt",
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
        op: "turnLeft",
        spaces: "",
      },
      {
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "turnAround",
        spaces: "",
      },
    ],
  },
  {
    level: "bookmarks",
    commands: [
      {
        op: "bookmark",
        spaces: "",
      },
      {
        op: "bookmark",
        spaces: "",
      },
      {
        op: "bookmark",
        spaces: "",
      },
      {
        op: "bookmark",
        spaces: "",
      },
      {
        op: "bookmark",
        spaces: "",
      },
      {
        op: "bookmark",
        spaces: "",
      },
      {
        op: "bookmark",
        spaces: "",
      },
      {
        op: "return",
        spaces: "",
      },
      {
        op: "halt",
        spaces: "",
      },
    ],
  },
  {
    level: "stack",
    commands: [
      {
        op: "bookmarkAndJump",
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: "turnLeft",
        spaces: "",
      },
      {
        op: "bookmarkAndJump",
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: "drop",
        spaces: "",
      },
      {
        op: "turnLeft",
        spaces: "",
      },
      {
        op: "bookmarkAndJump",
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: "drop",
        spaces: "",
      },
      {
        op: "turnLeft",
        spaces: "",
      },
      {
        op: "bookmarkAndJump",
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: "drop",
        spaces: "",
      },
      {
        op: "turnLeft",
        spaces: "",
      },
      {
        op: "bookmarkAndJump",
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: "drop",
        spaces: "",
      },
      {
        op: "turnAround",
        spaces: "",
      },
      {
        op: "bookmarkAndJump",
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: "turnRight",
        spaces: "",
      },
      {
        op: "bookmarkAndJump",
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: "turnRight",
        spaces: "",
      },
      {
        op: "bookmarkAndJump",
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: "turnRight",
        spaces: "",
      },
      {
        op: "halt",
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
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifYesJumpBy",
        arg: "3",
        spaces: "",
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "jumpTo",
        arg: "@walkToWall",
        spaces: "",
      },
      {
        op: "return",
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
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifYesJumpBy",
        arg: "3",
        spaces: "",
        numericArg: 3,
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "jumpTo",
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
        op: "turnLeft",
        spaces: "",
      },
      {
        label: "step",
        labelSpace: "",
        empty: "",
      },
      {
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifYesJumpTo",
        arg: "@turn",
        spaces: "",
        numericArg: 6,
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "checkWallLeft",
        spaces: "",
      },
      {
        op: "ifYesJumpBy",
        arg: "2",
        spaces: "",
        numericArg: 2,
      },
      {
        op: "turnRight",
        spaces: "",
      },
      {
        op: "checkBeeper",
        spaces: "",
      },
      {
        op: "ifNotJumpTo",
        arg: "@step",
        spaces: "",
        numericArg: 8,
      },
      {
        op: "pick",
        spaces: "",
      },
      {
        op: "jumpTo",
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
        op: "jumpTo",
        arg: "@begin",
        spaces: "",
      },
      {
        label: "turn",
        labelSpace: "",
        empty: "",
      },
      {
        op: "turnAround",
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
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifYesJumpTo",
        arg: "@turn",
        spaces: "",
      },
      {
        op: "checkBeeper",
        spaces: "",
      },
      {
        op: "ifNotJumpBy",
        arg: "15",
        spaces: "",
      },
      {
        op: "pick",
        spaces: "",
      },
      {
        op: "turnLeft",
        spaces: "",
      },
      {
        op: "checkWallAhead",
        spaces: "",
      },
      {
        op: "ifNotJumpBy",
        arg: "2",
        spaces: "",
      },
      {
        op: "halt",
        spaces: "",
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "checkBeeper",
        spaces: "",
      },
      {
        op: "ifYesJumpBy",
        arg: "-5",
        spaces: "",
      },
      {
        op: "drop",
        spaces: "",
      },
      {
        op: "turnAround",
        spaces: "",
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "checkBeeper",
        spaces: "",
      },
      {
        op: "ifYesJumpBy",
        arg: "-2",
        spaces: "",
      },
      {
        op: "turnLeft",
        spaces: "",
      },
      {
        op: "drop",
        spaces: "",
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "jumpTo",
        arg: "@begin",
        spaces: "",
      },
      {
        op: "drop",
        spaces: "",
      },
      {
        op: "forward",
        spaces: "",
      },
      {
        op: "jumpTo",
        arg: "@begin",
        spaces: "",
      },
    ],
  },
];

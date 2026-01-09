export const world = () => ({
  size: {
    y: 10,
    x: 10,
  },
  start: {
    y: 9,
    x: 0,
  },
  walls: Array(10 * 10).fill(false),
  crystals: Array(10 * 10).fill(false),
});

export const solution = [
  {
    indentSpaces: "",
    op: "bookmarkAndJump",
    arg: "@place",
    spaces: "",
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
    label: "place",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "checkBeeper",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpBy",
    arg: "2",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpBy",
    arg: "3",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "turnAround",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "return",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "drop",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkWallAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpBy",
    arg: "3",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkBeeperAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifNotJumpBy",
    arg: "8",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "turnLeft",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "bookmarkAndJump",
    arg: "@place",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "pick",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "turnRight",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "return",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "bookmarkAndJump",
    arg: "@place",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "pick",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "return",
    spaces: "",
  },
];

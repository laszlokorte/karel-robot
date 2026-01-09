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
    label: "step",
    labelSpace: "",
    empty: "",
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
    op: "ifYesJumpTo",
    arg: "@turn",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkBeeperAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@turn",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
    arg: "@step",
    spaces: "",
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "turn",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: "turnLeft",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "checkBeeperAhead",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "ifYesJumpTo",
    arg: "@done",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "forward",
    spaces: "",
  },
  {
    indentSpaces: "",
    op: "jumpTo",
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
    op: "halt",
    spaces: "",
  },
];

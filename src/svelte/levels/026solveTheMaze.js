import commands from "../commands";
function generateMaze(size = 20) {
  if (size % 2 !== 0) {
    throw new Error("size must be even");
  }
  size++;
  let end = null;

  const idx = (x, y) => y * size + x;

  const maze = {
    size: { x: size, y: size },
    start: { x: 0, y: 0 },
    walls: Array(size * size).fill(true),
  };

  const dirs = [
    { x: 0, y: -2 },
    { x: 2, y: 0 },
    { x: 0, y: 2 },
    { x: -2, y: 0 },
  ];

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < size && y < size;
  }

  function carve(x, y) {
    maze.walls[idx(x, y)] = false;

    for (const d of shuffle([...dirs])) {
      const nx = x + d.x;
      const ny = y + d.y;

      if (!inBounds(nx, ny)) continue;
      if (!maze.walls[idx(nx, ny)]) continue;

      maze.walls[idx(x + d.x / 2, y + d.y / 2)] = false;

      end = { x, y };
      carve(nx, ny);
    }
  }
  carve(0, 0);
  const crystals = Array(size * size).fill(false);
  crystals[idx(end.x, end.y)] = true;
  return { ...maze, crystals };
}

export const world = () => {
  const size = 20;

  return {
    ...generateMaze(size),
  };
};

export const solution = [
  {
    indentSpaces: "",
    label: "begin",
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
    arg: "3",
    spaces: "",
    numericArg: 3,
  },
  {
    indentSpaces: "",
    op: commands.pick.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.halt.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@tryRight",
    spaces: "",
    numericArg: 7,
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "tryRight",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: commands.checkWallRight.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@tryForward",
    spaces: "",
    numericArg: 14,
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
    op: commands.jumpTo.long,
    arg: "@begin",
    spaces: "",
    numericArg: 0,
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "tryForward",
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
    op: commands.ifYesJumpTo.long,
    arg: "@tryLeft",
    spaces: "",
    numericArg: 20,
  },
  {
    indentSpaces: "",
    op: commands.forward.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.jumpTo.long,
    arg: "@begin",
    spaces: "",
    numericArg: 0,
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "tryLeft",
    labelSpace: "",
    empty: "",
  },
  {
    indentSpaces: "",
    op: commands.checkWallLeft.long,
    spaces: "",
  },
  {
    indentSpaces: "",
    op: commands.ifYesJumpTo.long,
    arg: "@tryBack",
    spaces: "",
    numericArg: 27,
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
    op: commands.jumpTo.long,
    arg: "@begin",
    spaces: "",
    numericArg: 0,
  },
  {
    indentSpaces: "",
    empty: "",
  },
  {
    indentSpaces: "",
    label: "tryBack",
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
    op: commands.jumpTo.long,
    arg: "@begin",
    spaces: "",
    numericArg: 0,
  },
];

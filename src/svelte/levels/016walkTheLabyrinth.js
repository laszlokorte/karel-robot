import commands from "../commands";
export const world = () => {
  const size = 19;
  const CHARTED = "#".charCodeAt(0);
  const WALL = "_".charCodeAt(0);
  const FREE = " ".charCodeAt(0);
  const ONE = "1".charCodeAt(0);
  const ZERO = "0".charCodeAt(0);

  const libTemplate = new TextEncoder().encode(
    `# # # # # # # # # # # #
_______________________
#_2_3_3_3_3_3_3_3_3_2_#
_______________________
#_3_4_4_4_4_4_4_4_4_3_#
_______________________
#_3_4_4_4_4_4_4_4_4_3_#
_______________________
#_3_4_4_4_4_4_4_4_4_3_#
_______________________
#_3_4_4_4_4_4_4_4_4_3_#
_______________________
#_3_4_4_4_4_4_4_4_4_3_#
_______________________
#_3_4_4_4_4_4_4_4_4_3_#
_______________________
#_3_4_4_4_4_4_4_4_4_3_#
_______________________
#_3_4_4_4_4_4_4_4_4_3_#
_______________________
#_2_3_3_3_3_3_3_3_3_2_#
_______________________
# # # # # # # # # # # #`,
  );

  const EAST = 1;
  const NORTH = -24;
  const WEST = -1;
  const SOUTH = 24;

  const NEIGHBOUR_X = 2 * EAST;
  const NEIGHBOUR_Y = 2 * SOUTH;
  const ORIGIN = NEIGHBOUR_Y + NEIGHBOUR_X;

  const turnLeft = {
    [EAST]: NORTH,
    [NORTH]: WEST,
    [WEST]: SOUTH,
    [SOUTH]: EAST,
  };

  const turnRight = {
    [EAST]: SOUTH,
    [SOUTH]: WEST,
    [WEST]: NORTH,
    [NORTH]: EAST,
  };

  const permutationsOfDirections = [
    0x01e8ff18, // EAST, NORTH, WEST, SOUTH,
    0x01e818ff, // EAST, NORTH, SOUTH, WEST,
    0x01ffe818, // EAST, WEST, NORTH, SOUTH,
    0x01ff18e8, // EAST, WEST, SOUTH, NORTH,
    0x0118e8ff, // EAST, SOUTH, NORTH, WEST,
    0x0118ffe8, // EAST, SOUTH, WEST, NORTH,

    0xe801ff18, // NORTH, EAST, WEST, SOUTH,
    0xe80118ff, // NORTH, EAST, SOUTH, WEST,
    0xe8ff0118, // NORTH, WEST, EAST, SOUTH,
    0xe8ff1801, // NORTH, WEST, SOUTH, EAST,
    0xe81801ff, // NORTH, SOUTH, EAST, WEST,
    0xe818ff01, // NORTH, SOUTH, WEST, EAST,

    0xff01e818, // WEST, EAST, NORTH, SOUTH,
    0xff0118e8, // WEST, EAST, SOUTH, NORTH,
    0xffe80118, // WEST, NORTH, EAST, SOUTH,
    0xffe81801, // WEST, NORTH, SOUTH, EAST,
    0xff1801e8, // WEST, SOUTH, EAST, NORTH,
    0xff18e801, // WEST, SOUTH, NORTH, EAST,

    0x1801e8ff, // SOUTH, EAST, NORTH, WEST,
    0x1801ffe8, // SOUTH, EAST, WEST, NORTH,
    0x18e801ff, // SOUTH, NORTH, EAST, WEST,
    0x18e8ff01, // SOUTH, NORTH, WEST, EAST,
    0x18ff01e8, // SOUTH, WEST, EAST, NORTH,
    0x18ffe801, // SOUTH, WEST, NORTH, EAST,
  ];

  function* directions() {
    const directions =
      permutationsOfDirections[
        Math.floor(Math.random() * permutationsOfDirections.length)
      ];

    yield directions >> 24;
    yield (directions << 8) >> 24;
    yield (directions << 16) >> 24;
    yield (directions << 24) >> 24;
  }

  const BACKTRACK = 0;
  const BACKTRACK_BUDGET_EXHAUSTED = -1;

  class LabyrinthGenerator {
    #labyrinth = null;
    #backtrackBudget = null;

    constructor() {
      this.#backtrackBudget = 0;
    }

    generateLabyrinth() {
      let destination = 0;
      this.#labyrinth = libTemplate.slice();
      {
        do {
          this.#labyrinth = libTemplate.slice();
          this.#backtrackBudget = 100 * 100;
          destination = this.destinationOpen(ORIGIN, EAST, 99);
        } while (destination == BACKTRACK_BUDGET_EXHAUSTED);
      }
      const walls = Array(size * size);

      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
          const gx = x + 2; // Offset wegen Rand
          const gy = y + 2;
          const p = gx + 24 * gy;

          walls[x + size * y] = this.#labyrinth[p] == WALL;
        }
      }

      const dy = Math.floor(destination / 24) - 2;
      const dx = (destination % 24) - 2;
      const oy = Math.floor(ORIGIN / 24) - 1;
      const ox = (ORIGIN % 24) - 1;

      return { walls: walls, dx, dy, ox, oy };
    }

    isUncharted(position) {
      return this.#labyrinth[position] >= ZERO;
    }

    causesPartition(position, direction) {
      return (
        !this.isUncharted(position + 2 * direction) &&
        this.isUncharted(position + 2 * turnLeft[direction]) &&
        this.isUncharted(position + 2 * turnRight[direction])
      );
    }

    destinationOpen(position, direction, uncharted) {
      if (this.causesPartition(position, direction)) return BACKTRACK;

      const unchartedNeighbours = this.#labyrinth[position];
      this.#labyrinth[position] = CHARTED;

      let potentialDeadEnds = 0;
      if (--this.#labyrinth[position + NEIGHBOUR_X] == ONE) ++potentialDeadEnds;
      if (--this.#labyrinth[position - NEIGHBOUR_Y] == ONE) ++potentialDeadEnds;
      if (--this.#labyrinth[position - NEIGHBOUR_X] == ONE) ++potentialDeadEnds;
      if (--this.#labyrinth[position + NEIGHBOUR_Y] == ONE) ++potentialDeadEnds;

      if (potentialDeadEnds == 0) {
        // We can roam freely without consequence
        for (let dir of directions()) {
          const neighbour = position + 2 * dir;
          if (this.isUncharted(neighbour)) {
            const wall = position + dir;
            this.#labyrinth[wall] = FREE;
            const it = this.destinationOpen(neighbour, dir, uncharted - 1);
            if (it != BACKTRACK) return it;
            this.#labyrinth[wall] = WALL;
          }
        }
      } else if (potentialDeadEnds == 2) {
        // We must eliminate one of the potential dead ends by picking it
        for (let dir of directions()) {
          const neighbour = position + 2 * dir;
          if (this.#labyrinth[neighbour] == ONE) {
            const wall = position + dir;
            this.#labyrinth[wall] = FREE;
            const it = this.destinationFound(neighbour, dir, uncharted - 1);
            if (it != BACKTRACK) return it;
            this.#labyrinth[wall] = WALL;
          }
        }
      } else if (potentialDeadEnds == 1) {
        // We can either eliminate the potential dead end by picking it,
        // or turn it into an actual dead end by picking another neighbour
        for (let dir of directions()) {
          const neighbour = position + 2 * dir;
          if (this.isUncharted(neighbour)) {
            const wall = position + dir;
            this.#labyrinth[wall] = FREE;
            if (this.#labyrinth[neighbour] == ONE) {
              const it = this.destinationOpen(neighbour, dir, uncharted - 1);
              if (it != BACKTRACK) return it;
            } else {
              const it = this.destinationFound(neighbour, dir, uncharted - 1);
              if (it != BACKTRACK) return it;
            }
            this.#labyrinth[wall] = WALL;
          }
        }
      }

      if (--this.#backtrackBudget < 0) return BACKTRACK_BUDGET_EXHAUSTED;

      this.#labyrinth[position] = unchartedNeighbours;
      this.#labyrinth[position + NEIGHBOUR_X]++;
      this.#labyrinth[position - NEIGHBOUR_Y]++;
      this.#labyrinth[position - NEIGHBOUR_X]++;
      this.#labyrinth[position + NEIGHBOUR_Y]++;

      return BACKTRACK;
    }

    destinationFound(position, direction, uncharted) {
      if (this.causesPartition(position, direction)) return BACKTRACK;
      if (uncharted == 0) return position;

      const unchartedNeighbours = this.#labyrinth[position];
      this.#labyrinth[position] = CHARTED;

      let potentialDeadEnds = 0;
      // A potential dead end is a neighbour that will turn into a dead end
      // unless we tear down the wall and pick it as our next position
      if (--this.#labyrinth[position + NEIGHBOUR_X] == ONE) ++potentialDeadEnds;
      if (--this.#labyrinth[position - NEIGHBOUR_Y] == ONE) ++potentialDeadEnds;
      if (--this.#labyrinth[position - NEIGHBOUR_X] == ONE) ++potentialDeadEnds;
      if (--this.#labyrinth[position + NEIGHBOUR_Y] == ONE) ++potentialDeadEnds;

      if (potentialDeadEnds == 0) {
        // We can roam freely without consequence
        for (let dir of directions()) {
          const neighbour = position + 2 * dir;
          if (this.isUncharted(neighbour)) {
            const wall = position + dir;
            this.#labyrinth[wall] = FREE;
            const it = this.destinationFound(neighbour, dir, uncharted - 1);
            if (it != BACKTRACK) return it;
            this.#labyrinth[wall] = WALL;
          }
        }
      } else if (potentialDeadEnds == 1) {
        // We must eliminate the potential dead end by picking it,
        // because we already found our destination earlier
        for (let dir of directions()) {
          const neighbour = position + 2 * dir;
          if (this.#labyrinth[neighbour] == ONE) {
            const wall = position + dir;
            this.#labyrinth[wall] = FREE;
            const it = this.destinationFound(neighbour, dir, uncharted - 1);
            if (it != BACKTRACK) return it;
            this.#labyrinth[wall] = WALL;
          }
        }
      }
      if (--this.#backtrackBudget < 0) return BACKTRACK_BUDGET_EXHAUSTED;

      this.#labyrinth[position] = unchartedNeighbours;
      this.#labyrinth[position + NEIGHBOUR_X]++;
      this.#labyrinth[position - NEIGHBOUR_Y]++;
      this.#labyrinth[position - NEIGHBOUR_X]++;
      this.#labyrinth[position + NEIGHBOUR_Y]++;
      return BACKTRACK;
    }
  }
  const labGen = new LabyrinthGenerator();
  const { walls: ww, ox, oy, dx, dy } = labGen.generateLabyrinth();

  const walls = ww;
  const crystals = Array(size * size).fill(false);
  crystals[dx + dy * size] = true;

  return {
    size: {
      y: size,
      x: size,
    },
    start: {
      x: ox - 1,
      y: oy - 1,
    },
    walls,
    crystals,
    digits: Array(size).fill(false),
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

import commands from "../commands";
import { mulberry32 } from "../mulberry";
export const world = (seed) => {
  const rnd = mulberry32(seed * 13);
  // Inspired by https://github.com/fredoverflow/karel/blob/master/src/main/kotlin/logic/LabyrinthGenerator.kt
  const size = 13 + Math.round(rnd() * 4) * 2;
  const CHARTED = "#".charCodeAt(0);
  const WALL = "_".charCodeAt(0);
  const FREE = " ".charCodeAt(0);
  const ONE = "1".charCodeAt(0);
  const ZERO = "0".charCodeAt(0);

  const libTemplate = new TextEncoder().encode(
    Array(size + 2 * 2)
      .fill("")
      .map((_, i, rows) =>
        Array(rows.length)
          .fill(i == 0 || i == rows.length - 1 ? " " : "_")
          .map((c, j, cols) =>
            i == 0 || i == rows.length - 1
              ? j % 2 == 1
                ? c
                : "#"
              : j == 0 || j == cols.length - 1
                ? i % 2 == 1
                  ? c
                  : "#"
                : j % 2 == 1
                  ? c
                  : i % 2 == 1
                    ? c
                    : Math.min(
                        Math.round(i / 2),
                        2,
                        Math.round((rows.length - 1 - i) / 2),
                      ) +
                      Math.min(
                        Math.round(j / 2),
                        2,
                        Math.round((cols.length - 1 - j) / 2),
                      ),
          )
          .join(""),
      )
      .join("\n"),
  );

  const EAST = 1;
  const NORTH = -(size + 5);
  const WEST = -1;
  const SOUTH = size + 5;

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
    [EAST, NORTH, WEST, SOUTH],
    [EAST, NORTH, SOUTH, WEST],
    [EAST, WEST, NORTH, SOUTH],
    [EAST, WEST, SOUTH, NORTH],
    [EAST, SOUTH, NORTH, WEST],
    [EAST, SOUTH, WEST, NORTH],

    [NORTH, EAST, WEST, SOUTH],
    [NORTH, EAST, SOUTH, WEST],
    [NORTH, WEST, EAST, SOUTH],
    [NORTH, WEST, SOUTH, EAST],
    [NORTH, SOUTH, EAST, WEST],
    [NORTH, SOUTH, WEST, EAST],

    [WEST, EAST, NORTH, SOUTH],
    [WEST, EAST, SOUTH, NORTH],
    [WEST, NORTH, EAST, SOUTH],
    [WEST, NORTH, SOUTH, EAST],
    [WEST, SOUTH, EAST, NORTH],
    [WEST, SOUTH, NORTH, EAST],

    [SOUTH, EAST, NORTH, WEST],
    [SOUTH, EAST, WEST, NORTH],
    [SOUTH, NORTH, EAST, WEST],
    [SOUTH, NORTH, WEST, EAST],
    [SOUTH, WEST, EAST, NORTH],
    [SOUTH, WEST, NORTH, EAST],
  ];

  function* directions() {
    const directions =
      permutationsOfDirections[
        Math.floor(rnd() * permutationsOfDirections.length)
      ];

    yield* directions;
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
          this.#backtrackBudget = Math.pow(Math.ceil(size / 2), 4);
          destination = this.destinationOpen(
            ORIGIN,
            EAST,
            Math.pow(Math.ceil(size / 2), 2) - 1,
          );
        } while (destination == BACKTRACK_BUDGET_EXHAUSTED);
      }
      const walls = Array(size * size);

      for (let y = 0; y <= size; y++) {
        for (let x = 0; x <= size; x++) {
          const gx = x + 2; // Offset wegen Rand
          const gy = y + 2;
          const p = gx + (size + 5) * gy;

          walls[x + size * y] = this.#labyrinth[p] == WALL;
        }
      }

      const dy = Math.floor(destination / (size + 5)) - 2;
      const dx = (destination % (size + 5)) - 2;
      const oy = Math.floor(ORIGIN / (size + 5)) - 1;
      const ox = (ORIGIN % (size + 5)) - 1;

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

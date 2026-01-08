export const world = () => {
  const size = 20;

  const goalColumn = 11 + Math.ceil(Math.random() * 4) * 2 - 1;
  const heights = Array(size)
    .fill(size - 1)
    .map((x) => Math.round(Math.random() * x));
  // Start bei (1,1), Budget groß genug für 100 Schritte
  return {
    size: {
      y: size,
      x: size,
    },
    start: {
      y: size - 1,
      x: 0,
    },
    walls: Array(size)
      .fill(false)
      .flatMap((x, row) => {
        return Array(size).fill(false);
      }),
    crystals: Array(size).fill(false),
  };
};

const solution = [];

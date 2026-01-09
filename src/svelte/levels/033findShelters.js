export const world = () => {
  const size = 10;

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

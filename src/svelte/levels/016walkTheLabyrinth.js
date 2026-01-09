export const world = () => {
  const size = 20;

  return {
    size: {
      y: size,
      x: size,
    },
    start: {
      y: 1,
      x: 1,
    },
    walls: Array(size * size).fill(false),
    crystals: Array(size * size).fill(false),
    digits: Array(size).fill(false),
  };
};

export const solution = [];

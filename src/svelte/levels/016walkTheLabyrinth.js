export const world = () => {
  const size = 20;

  // Start bei (1,1), Budget groß genug für 100 Schritte
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
  };
};

export const solution = [];

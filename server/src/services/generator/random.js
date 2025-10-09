import seedrandom from 'seedrandom';

export function createRandom(seed) {
  const rng = seedrandom(seed);
  return {
    next() {
      return rng();
    },
    int(max) {
      return Math.floor(rng() * max);
    },
    pick(array) {
      if (!array.length) {
        throw new Error('Cannot pick from an empty array');
      }
      return array[this.int(array.length)];
    },
  };
}

export function shuffle(array, rng) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng.next() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

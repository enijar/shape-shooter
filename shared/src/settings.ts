const settings = {
  exp: {
    playerKill: 25,
    itemKill: 5,
    aiMissileKill: 3,
    perLevel: 50,
  },
  player: {
    size: 100,
    maxHealth: 100,
  },
  bullet: {
    size: 10,
    damage: 5,
  },
  item: {
    size: 15,
    maxHealth: 30,
  },
  food: {
    size: 8,
    healthIncrement: 20,
  },
  arena: {
    size: 2000,
    cell: {
      size: 20,
      gap: 1,
    },
  },
  ai: {
    missile: {
      size: 20,
      maxHealth: 30,
      damage: 3,
      color: "#ffffff",
    },
  },
};

export default settings;

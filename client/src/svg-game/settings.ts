type Settings = {
  arena: {
    size: number;
  };
  player: {
    size: number;
    speed: number;
  };
};

const settings: Settings = {
  arena: {
    size: 200,
  },
  player: {
    size: 10,
    speed: 0.1,
  },
};

export default settings;

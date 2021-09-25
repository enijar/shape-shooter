import create from "zustand";

export type AppStore = {
  connected: boolean;
  setConnected: (connected: boolean) => void;
};

export const useAppStore = create<AppStore>((set) => {
  return {
    connected: false,
    setConnected(connected: boolean) {
      set({ connected });
    },
  };
});

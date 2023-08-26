import { create } from "zustand";

// hook can only be used in react component ..
export const useAuthStore = create((set) => ({
  auth: {
    username: "",
    active: false,
  },
  setUsername: (name) =>
    set((state) => ({ auth: { ...state.auth, username: name } })),
}));

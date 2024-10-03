import { create } from "zustand";


export const userStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchCurrentUser: (user) =>{
    return set({ currentUser: user, isLoading: false })
  },
}));

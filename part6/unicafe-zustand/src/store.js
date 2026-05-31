import { create } from "zustand";

export const useFeedbackStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    incrementGood: () => set((state) => ({ good: state.good + 1 })),
    incrementNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set((state) => ({ bad: state.bad + 1 })),
  },
}));
//
// export const useFeedbackStore = create((set) => ({
//   values: {
//     good: 0,
//     neutral: 0,
//     bad: 0,
//   },
//   actions: {
//     incrementGood: () =>
//       set((state) => {
//         state.values.good = state.values.good + 1;
//         return state;
//       }),
//     incrementNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
//     incrementBad: () => set((state) => ({ bad: state.bad + 1 })),
//   },
// }));

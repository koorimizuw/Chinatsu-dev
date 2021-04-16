import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";

export interface GlobalState {
  count: number;
  profile: any;
  playlog: any;
  detail: any;
}

export const StateKey: InjectionKey<Store<GlobalState>> = Symbol();

export const store = createStore({
  state: {
    count: 0,
    profile: {},
    playlog: [],
    detail: [],
    rating: {},
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    commitProfile(state, data) {
      state.profile = data;
    },
    commitPlaylog(state, data) {
      state.playlog = data;
    },
    commitMusicData(state, data) {
      state.detail = data;
    },
    commitRatingData(state, data) {
      state.rating = data;
    },
  },
  actions: {
    updateProfile(ctx, data) {
      ctx.commit("commitProfile", data);
    },
    updatePlaylog(ctx, data) {
      ctx.commit("commitPlaylog", data);
    },
    updateMusicData(ctx, data) {
      ctx.commit("commitMusicData", data);
    },
    updateRatingData(ctx, data) {
      ctx.commit("commitRatingData", data);
    },
  },
});

export function useStore() {
  return baseUseStore(StateKey);
}

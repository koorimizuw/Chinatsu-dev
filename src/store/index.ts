import { InjectionKey } from "vue"
import { createStore, Store, useStore as baseUseStore } from 'vuex'


export interface GlobalState {
  count: number,
  profile: any,
  playlog: any,
}

export const StateKey: InjectionKey<Store<GlobalState>> = Symbol()

export const store = createStore({
  state: {
    count: 0,
    profile: {},
    playlog: [],
  },
  mutations: {
    increment(state) {
      state.count++
    },
    commitProfile(state, data) {
      state.profile = data
    },
    commitPlaylog(state, data) {
      state.playlog = data
    },
  },
  actions: {
    updateProfile(ctx, data) {
      ctx.commit('commitProfile', data)
    },
    updatePlaylog(ctx, data) {
      ctx.commit('commitPlaylog', data)
    },
  }
})

export function useStore() {
  return baseUseStore(StateKey)
}
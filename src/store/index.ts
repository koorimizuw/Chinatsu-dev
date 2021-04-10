import { InjectionKey } from "vue"
import { createStore, Store, useStore as baseUseStore } from 'vuex'


export interface GlobalState {
	count: number
}

export const StateKey: InjectionKey<Store<GlobalState>> = Symbol()

export const store = createStore({
	state: {
		count: 0
	},
	mutations: {
		increment(state) {
			state.count++
		}
	}
})

export function useStore() {
	return baseUseStore(StateKey)
}
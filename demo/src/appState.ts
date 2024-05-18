import { createContext, useContext, Provider, ReactNode, useMemo, useReducer } from 'react'

import { StateUpdater, NextState, StateDispatcher, AppState, AppStore } from './types'

const AppContext = createContext<AppStore | undefined>(undefined)

export const useAppStore = () => useContext(AppContext)

const { Provider } = AppContext

export function AppProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useReducer((previous: AppState, update: NextState<AppState>) => {
			const next = Object.create(null)
			Object.assign(next, previous)
			if (typeof update === 'function') {
				const fn = update as StateUpdater<AppState>
				return Object.assign(next, fn(previous))
			}
			return Object.assign(next, update)
	}, { content: 'CONTENT' })

	const value = useMemo<[AppState, StateDispatcher<AppState>]>(() => [state, setState], [state])

	return <Provider value={value}>{children}</Provider>
}

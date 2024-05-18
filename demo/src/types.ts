import { Dispatch } from 'react'

export type Nullish = null | undefined

export type StateUpdater<T> = (previous: T) => T
export type NextState<T> = Partial<T> | StateUpdater<Partial<T>>
export type StateDispatcher<T> = Dispatch<NextState<T>>

export type AppState = {
	content: string
}
export type AppStore = [AppState, StateDispatcher<AppState>]

import { createStore } from "redux"

export interface authReducerAction {
  type: string;
  token?: string;
}

export interface authReducerState {
  value: boolean | string | undefined
}

function authReducer(state: authReducerState = { value: false }, action: authReducerAction) {
  switch (action.type) {
    case 'login':
      return { value: action.token }
    case 'adminLogin':
      return { value: true }
    case 'logout':
      return { value: false }
    default:
      return state
  }
}

export const store = createStore(authReducer)

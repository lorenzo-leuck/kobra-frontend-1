import type { AppState, Filters } from '../types'
import type { AppAction } from '../types'
import { SORT_OPTIONS } from '../utils/constants'

export const initialState: AppState = {
  pets: [],
  filters: {
    search: '',
    statusFilter: 'all',
    sort: SORT_OPTIONS.AGE_ASC,
  },
  theme: {
    primaryColor: '#4f46e5',
    backgroundColor: '#eef4fb',
    textColor: '#111827',
    fontScale: 1,
    cardRadius: 8,
    mode: 'light',
    density: 'comfortable',
  },
  user: null,
  toasts: [],
  banners: [],
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PETS':
      return { ...state, pets: action.payload }

    case 'ADD_PET':
      return { ...state, pets: [...state.pets, action.payload] }

    case 'UPDATE_PET':
      return {
        ...state,
        pets: state.pets.map((pet) =>
          pet.id === action.payload.id ? { ...pet, ...action.payload } : pet,
        ),
      }

    case 'DELETE_PET':
      return {
        ...state,
        pets: state.pets.filter((pet) => pet.id !== action.payload),
      }

    case 'MOVE_PET':
      return {
        ...state,
        pets: state.pets.map((pet) =>
          pet.id === action.payload.id
            ? { ...pet, status: action.payload.status }
            : pet,
        ),
      }

    case 'SET_SEARCH':
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
      }

    case 'SET_STATUS_FILTER':
      return {
        ...state,
        filters: { ...state.filters, statusFilter: action.payload },
      }

    case 'SET_SORT':
      return {
        ...state,
        filters: { ...state.filters, sort: action.payload as Filters['sort'] },
      }

    case 'SET_THEME':
      return { ...state, theme: { ...state.theme, ...action.payload } }

    case 'SET_USER':
      return { ...state, user: action.payload }

    case 'LOGOUT':
      return { ...state, user: null }

    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { id: Date.now(), ...action.payload }],
      }

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      }

    case 'SET_BANNERS':
      return { ...state, banners: action.payload }

    case 'ADD_BANNER':
      return { ...state, banners: [...state.banners, action.payload] }

    case 'UPDATE_BANNER':
      return {
        ...state,
        banners: state.banners.map((banner) =>
          banner.id === action.payload.id ? { ...banner, ...action.payload } : banner,
        ),
      }

    case 'DELETE_BANNER':
      return {
        ...state,
        banners: state.banners.filter((banner) => banner.id !== action.payload),
      }

    default:
      return state
  }
}

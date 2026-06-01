export interface Pet {
  id: string
  name: string
  breed: string
  breedPath: string
  estimatedAge: number
  status: string
  photoUrl: string
  createdAt: string
}

export interface Filters {
  search: string
  statusFilter: string
  sort: 'age_asc' | 'age_desc'
}

export interface Theme {
  primaryColor: string
  backgroundColor: string
  textColor: string
  fontScale: number
  cardRadius: number
  mode: 'light' | 'dark'
  density: 'comfortable' | 'compact'
}

export interface User {
  email: string
  role: 'user' | 'admin'
  name: string
  iat: number
  exp: number
}

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export interface AppState {
  pets: Pet[]
  filters: Filters
  theme: Theme
  user: User | null
  toasts: Toast[]
  banners: Banner[]
}

export type AppAction =
  | { type: 'SET_PETS'; payload: Pet[] }
  | { type: 'ADD_PET'; payload: Pet }
  | { type: 'UPDATE_PET'; payload: Pet }
  | { type: 'DELETE_PET'; payload: string }
  | { type: 'MOVE_PET'; payload: { id: string; status: string } }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: string }
  | { type: 'SET_SORT'; payload: string }
  | { type: 'SET_THEME'; payload: Partial<Theme> }
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TOAST'; payload: { message: string; type: Toast['type'] } }
  | { type: 'REMOVE_TOAST'; payload: number }
  | { type: 'SET_BANNERS'; payload: Banner[] }
  | { type: 'ADD_BANNER'; payload: Banner }
  | { type: 'UPDATE_BANNER'; payload: Banner }
  | { type: 'DELETE_BANNER'; payload: string }

export interface Breed {
  name: string
  path: string
}

export interface Banner {
  id: string
  title: string
  description: string
  color: string
}

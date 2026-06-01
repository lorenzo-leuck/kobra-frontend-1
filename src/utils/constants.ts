export const PET_STATUSES = {
  NEW: 'New',
  MEET_AND_GREET: 'Meet & Greet',
  ADOPTED: 'Adopted',
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'pet_shelter_auth_token',
  PETS: 'pet_shelter_pets',
  THEME: 'pet_shelter_theme',
  FILTERS: 'pet_shelter_filters',
  DOG_IMAGES_CACHE: 'pet_shelter_dog_images_cache',
  BANNERS: 'pet_shelter_banners',
} as const

export const SORT_OPTIONS = {
  AGE_ASC: 'age_asc',
  AGE_DESC: 'age_desc',
} as const

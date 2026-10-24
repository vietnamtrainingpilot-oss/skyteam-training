export const DEPARTMENTS = {
  FLIGHT_DECK: 'FLIGHT_DECK',
  CABIN_CREW: 'CABIN_CREW',
  GROUND_CREW: 'GROUND_CREW',
  SHARED_CORE: 'SHARED_CORE'
} as const

export type Department = typeof DEPARTMENTS[keyof typeof DEPARTMENTS]

export const ROLE_COLORS: Record<Department, string> = {
  FLIGHT_DECK: '#0066cc',
  CABIN_CREW: '#30a46c',
  GROUND_CREW: '#d4a843',
  SHARED_CORE: '#7c3aed'
}

export const ROLE_NAMES: Record<Department, string> = {
  FLIGHT_DECK: 'Flight Deck',
  CABIN_CREW: 'Cabin Crew',
  GROUND_CREW: 'Ground Crew',
  SHARED_CORE: 'Shared Core'
}

export const ROLES = {
  ADMIN: 'ADMIN',
  TRAINER: 'TRAINER',
  TRAINEE: 'TRAINEE'
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

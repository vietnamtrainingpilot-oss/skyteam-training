import { Plane, Users, Shield } from 'lucide-react'

export const DEPARTMENTS = {
  FLIGHT_DECK: 'FLIGHT_DECK',
  CABIN_CREW: 'CABIN_CREW',
  GROUND_CREW: 'GROUND_CREW'
} as const

export type Department = typeof DEPARTMENTS[keyof typeof DEPARTMENTS]

export const ROLE_COLORS: Record<Department, string> = {
  FLIGHT_DECK: '#9b5b32',
  CABIN_CREW: '#4f8a4a',
  GROUND_CREW: '#c9822f'
}

export const ROLE_NAMES: Record<Department, string> = {
  FLIGHT_DECK: 'Flight Deck',
  CABIN_CREW: 'Cabin Crew',
  GROUND_CREW: 'Ground Crew'
}

export const ROLES = {
  ADMIN: 'ADMIN',
  TRAINER: 'TRAINER',
  TRAINEE: 'TRAINEE'
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export interface DepartmentInfo {
  id: Department
  name: string
  icon: React.ElementType
  color: string
  description: string
}

export const departmentInfo: Record<Department, DepartmentInfo> = {
  FLIGHT_DECK: {
    id: 'FLIGHT_DECK',
    name: 'Flight Deck',
    icon: Plane,
    color: '#9b5b32',
    description: 'Master flight operations, navigation, and aircraft handling.'
  },
  CABIN_CREW: {
    id: 'CABIN_CREW',
    name: 'Cabin Crew',
    icon: Users,
    color: '#4f8a4a',
    description: 'Learn passenger service, safety protocols, and in-flight procedures.'
  },
  GROUND_CREW: {
    id: 'GROUND_CREW',
    name: 'Ground Crew',
    icon: Shield,
    color: '#c9822f',
    description: 'Master airport operations, vehicle handling, and ground procedures.'
  }
}

export const departments = Object.values(departmentInfo)

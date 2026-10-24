import { useAuth } from './useAuth'

export function useSupabase() {
  const { user } = useAuth()
  return user
}

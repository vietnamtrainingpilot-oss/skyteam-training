import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { ROLES, Department, Role } from '../lib/constants'
import { supabase, signIn as apiSignIn, signUp as apiSignUp, getSession as apiGetSession } from '../lib/supabase-api'
import { OnboardingData } from '../lib/supabase-api'
import { User } from '../lib/mockData'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; user: Partial<User> }

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: OnboardingData) => Promise<void>
  signOut: () => void
  updateOnboarding: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true }
    case 'LOGIN_SUCCESS':
      return { user: action.user, isAuthenticated: true, isLoading: false }
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false }
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, isLoading: false }
    case 'UPDATE_USER':
      return { ...state, user: action.user ? { ...state.user!, ...action.user } : null }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const signIn = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const result = await apiSignIn(email, password)
      dispatch({ type: 'LOGIN_SUCCESS', user: result.user })
    } catch {
      dispatch({ type: 'LOGIN_FAILURE' })
    }
  }

  const signUp = async (data: OnboardingData) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const result = await apiSignUp(data)
      dispatch({ type: 'LOGIN_SUCCESS', user: result.user })
    } catch {
      dispatch({ type: 'LOGIN_FAILURE' })
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // Ignore errors during sign out
    }
    dispatch({ type: 'LOGOUT' })
  }

  const updateOnboarding = (data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', user: data })
  }

  // Initialize auth state from session
  useEffect(() => {
    apiGetSession().then(result => {
      dispatch({ type: result.user ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE', user: result.user || { id: '', email: '', name: '', role: 'TRAINEE' as Role, department: 'FLIGHT_DECK' as Department, airline: '', discord: '', region: '', experience: '', heardAbout: '', avatar: null, progress: 0, joinedDate: new Date().toISOString().split('T')[0], onboarded: true } as User })
    }).catch(() => {
      dispatch({ type: 'LOGIN_FAILURE' })
    })
  }, [])

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (session?.user) {
        apiGetSession().then(result => {
          dispatch({ type: result.user ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE', user: result.user || { id: '', email: '', name: '', role: 'TRAINEE' as Role, department: 'FLIGHT_DECK' as Department, airline: '', discord: '', region: '', experience: '', heardAbout: '', avatar: null, progress: 0, joinedDate: new Date().toISOString().split('T')[0], onboarded: true } as User })
        })
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, updateOnboarding }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { ROLES }
export type { AuthState, AuthAction }

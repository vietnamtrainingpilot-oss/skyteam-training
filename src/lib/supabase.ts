import { createClient } from '@supabase/supabase-js'
import { User, Course, Assessment, AssessmentQuestion } from './mockData'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Create client only if credentials are provided
let supabaseClient: ReturnType<typeof createClient> | null = null
if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

// Export a safe client that throws with a helpful message if not configured
export const supabase = supabaseClient || {
  auth: {
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    upsert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
  })
} as any

export type { User, Course, Assessment, AssessmentQuestion }

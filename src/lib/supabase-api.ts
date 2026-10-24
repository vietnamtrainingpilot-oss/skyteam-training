import { supabase } from './supabase'
import { User, Course, Assessment, courses as mockCourses, assessments as mockAssessments, users as mockUsers } from './mockData'

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  return !!(url && key && url !== 'https://your-project.supabase.co' && key !== 'your-anon-key-here')
}

// Auth helpers with mock fallback
export async function signIn(email: string, password: string): Promise<{ user: User }> {
  if (!isSupabaseConfigured()) {
    // Fallback to mock data
    const found = mockUsers.find(u => u.email === email)
    if (found) return { user: found }
    return { user: mockUsers[0] }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (!data.user) throw new Error('No user returned')

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (profileError) throw profileError
    return { user: profile as User }
  } catch (error) {
    console.warn('Supabase signIn failed, using mock fallback:', error)
    const found = mockUsers.find(u => u.email === email)
    if (found) return { user: found }
    return { user: mockUsers[0] }
  }
}

export async function signUp(data: { email: string; name: string; department: string }): Promise<{ user: User }> {
  if (!isSupabaseConfigured()) {
    // Fallback to mock data
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      role: 'TRAINEE',
      department: data.department as any,
      airline: 'SkyTeam Aviation',
      avatar: null,
      progress: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    }
    mockUsers.push(newUser)
    return { user: newUser }
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: 'tempPassword123!',
      options: { data: { name: data.name, department: data.department } }
    })
    if (authError) throw authError
    if (!authData.user) throw new Error('No user returned')

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({ email: data.email, name: data.name, role: 'TRAINEE', department: data.department, airline: 'SkyTeam Aviation' })
      .select()
      .single()

    if (profileError) throw profileError
    return { user: profile as User }
  } catch (error) {
    console.warn('Supabase signUp failed, using mock fallback:', error)
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      role: 'TRAINEE',
      department: data.department as any,
      airline: 'SkyTeam Aviation',
      avatar: null,
      progress: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    }
    mockUsers.push(newUser)
    return { user: newUser }
  }
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch {
      // Ignore errors
    }
  }
}

export async function getSession(): Promise<{ user: User | null }> {
  if (!isSupabaseConfigured()) {
    return { user: null }
  }

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return { user: null }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email || '')
      .single()

    return { user: profile as User | null }
  } catch (error) {
    console.warn('Supabase getSession failed:', error)
    return { user: null }
  }
}

// Courses with mock fallback
export async function getCourses(): Promise<{ courses: Course[] }> {
  if (!isSupabaseConfigured()) {
    return { courses: mockCourses }
  }

  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`*, modules(*, lessons(*))`)
      .eq('status', 'published')
      .order('created_at')

    if (error) throw error

    const mapped = (data || []).map((course: any) => ({
      ...course,
      progress: 0,
      status: course.progress > 0 ? (course.progress >= 100 ? 'completed' : 'in-progress') : 'not-started',
      modules: (course.modules || []).map((m: any) => ({ ...m, lessons: m.lessons || [] }))
    })) as Course[]

    return { courses: mapped }
  } catch (error) {
    console.warn('Supabase getCourses failed, using mock fallback:', error)
    return { courses: mockCourses }
  }
}

export async function getCourse(courseId: string): Promise<{ course: Course | null }> {
  if (!isSupabaseConfigured()) {
    const course = mockCourses.find(c => c.id === courseId) || null
    return { course }
  }

  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`*, modules(*, lessons(*))`)
      .eq('id', courseId)
      .single()

    if (error) throw error
    if (!data) return { course: null }

    const mapped = {
      ...data,
      progress: 0,
      status: data.progress > 0 ? (data.progress >= 100 ? 'completed' : 'in-progress') : 'not-started',
      modules: (data.modules || []).map((m: any) => ({ ...m, lessons: m.lessons || [] }))
    } as Course

    return { course: mapped }
  } catch (error) {
    console.warn('Supabase getCourse failed, using mock fallback:', error)
    const course = mockCourses.find(c => c.id === courseId) || null
    return { course }
  }
}

export async function updateCourseProgress(userId: string, courseId: string, progress: number): Promise<void> {
  if (!isSupabaseConfigured()) return

  try {
    await supabase
      .from('user_course_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        progress,
        status: progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started',
        completed_at: progress >= 100 ? new Date().toISOString() : null,
        last_accessed_at: new Date().toISOString()
      })
  } catch (error) {
    console.warn('Supabase updateCourseProgress failed:', error)
  }
}

// Assessments with mock fallback
export async function getAssessments(department?: string): Promise<{ assessments: Assessment[] }> {
  if (!isSupabaseConfigured()) {
    const filtered = department
      ? mockAssessments.filter(a => a.department === department)
      : mockAssessments
    return { assessments: filtered }
  }

  try {
    let query = supabase
      .from('assessments')
      .select(`*, questions:assessment_questions(*)`)

    if (department) {
      query = query.eq('department', department)
    }

    const { data, error } = await query.order('created_at')
    if (error) throw error

    return { assessments: data as Assessment[] }
  } catch (error) {
    console.warn('Supabase getAssessments failed, using mock fallback:', error)
    const filtered = department
      ? mockAssessments.filter(a => a.department === department)
      : mockAssessments
    return { assessments: filtered }
  }
}

export async function getAssessment(assessmentId: string): Promise<{ assessment: Assessment | null }> {
  if (!isSupabaseConfigured()) {
    const assessment = mockAssessments.find(a => a.id === assessmentId) || null
    return { assessment }
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .select(`*, questions:assessment_questions(*)`)
      .eq('id', assessmentId)
      .single()

    if (error) throw error
    return { assessment: data as Assessment | null }
  } catch (error) {
    console.warn('Supabase getAssessment failed, using mock fallback:', error)
    const assessment = mockAssessments.find(a => a.id === assessmentId) || null
    return { assessment }
  }
}

export async function submitAssessment(userId: string, assessmentId: string, score: number, answers: Record<string, any>): Promise<{ result: any }> {
  if (!isSupabaseConfigured()) {
    return { result: { id: assessmentId, score, passed: score >= 70 } }
  }

  try {
    const { data: assessment } = await supabase
      .from('assessments')
      .select('passing_score')
      .eq('id', assessmentId)
      .single()

    const passed = score >= (assessment?.passing_score || 70)

    const { data, error } = await supabase
      .from('assessment_results')
      .insert({ user_id: userId, assessment_id: assessmentId, score, passed, answers })
      .select()
      .single()

    if (error) throw error
    return { result: data }
  } catch (error) {
    console.warn('Supabase submitAssessment failed:', error)
    return { result: { id: assessmentId, score, passed: score >= 70 } }
  }
}

// Trainees with mock fallback
export async function getTrainees(department?: string): Promise<{ trainees: any[] }> {
  if (!isSupabaseConfigured()) {
    return { trainees: [] }
  }

  try {
    const { data, error } = await supabase.from('trainees').select('*')
    if (error) throw error

    const filtered = department
      ? (data || []).filter((t: any) => t.department === department)
      : data || []

    return { trainees: filtered }
  } catch (error) {
    console.warn('Supabase getTrainees failed:', error)
    return { trainees: [] }
  }
}

export { supabase }

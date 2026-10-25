import { users, courses, assessments, trainees } from './mockData'
import { User, Course, Assessment } from './mockData'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function api<T>(data: T, delayMs = 300): Promise<T> {
  await delay(delayMs)
  return data
}

// Auth API
export async function signIn(email: string, _password: string): Promise<{ user: User }> {
  const found = users.find(u => u.email === email)
  if (found) {
    return api({ user: found })
  }
  // Default login for demo
  return api({ user: users[0] })
}

export async function signUp(data: { email: string; name: string; department: string; password?: string; role?: string; airline?: string; discord?: string; region?: string; experience?: string; heardAbout?: string }): Promise<{ user: User }> {
  const newUser: User = {
    id: String(users.length + 1),
    email: data.email,
    name: data.name,
    role: (data.role || 'TRAINEE') as any,
    department: data.department as any,
    airline: data.airline || 'SkyTeam Aviation',
    discord: data.discord || '',
    region: data.region || 'North America',
    avatar: null,
    progress: 0,
    joinedDate: new Date().toISOString().split('T')[0],
    onboarded: true
  }
  return api({ user: newUser })
}

// Courses API
export async function getCourses(): Promise<{ courses: Course[] }> {
  return api({ courses })
}

export async function getCourse(courseId: string): Promise<{ course: Course | null }> {
  const course = courses.find(c => c.id === courseId)
  return api({ course: course || null })
}

// Assessments API
export async function getAssessments(department?: string): Promise<{ assessments: Assessment[] }> {
  const filtered = department
    ? assessments.filter(a => a.department === department)
    : assessments
  return api({ assessments: filtered })
}

export async function getAssessment(assessmentId: string): Promise<{ assessment: Assessment | null }> {
  const assessment = assessments.find(a => a.id === assessmentId)
  return api({ assessment: assessment || null })
}

// Trainer API
export async function getTrainees(department?: string): Promise<{ trainees: typeof trainees }> {
  const filtered = department
    ? trainees.filter(t => t.department === department)
    : trainees
  return api({ trainees: filtered })
}

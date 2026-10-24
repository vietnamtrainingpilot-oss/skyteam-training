import { Department, Role } from './constants'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  department: Department
  airline: string
  avatar: string | null
  progress: number
  joinedDate: string
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  type: 'video' | 'reading' | 'quiz'
  duration: string
  content?: string
  videoUrl?: string
}

export interface Course {
  id: string
  title: string
  department: Department
  modules: Module[]
  progress: number
  status: 'not-started' | 'in-progress' | 'completed'
  description: string
  icon: string
}

export interface AssessmentQuestion {
  id: string
  question: string
  options?: string[]
  correctAnswer?: number
  type: 'mcq' | 'true-false' | 'essay'
  explanation?: string
}

export interface Assessment {
  id: string
  title: string
  type: 'written' | 'practical'
  department: Department
  questions: AssessmentQuestion[]
  passingScore: number
  timeLimit: number
  description: string
}

export const users: User[] = [
  {
    id: '1',
    email: 'alex.chen@skyteam.example',
    name: 'Alex Chen',
    role: 'TRAINEE',
    department: 'FLIGHT_DECK',
    airline: 'SkyTeam Aviation',
    avatar: null,
    progress: 65,
    joinedDate: '2024-08-15'
  },
  {
    id: '2',
    email: 'sarah.jones@skyteam.example',
    name: 'Sarah Jones',
    role: 'TRAINEE',
    department: 'CABIN_CREW',
    airline: 'SkyTeam Aviation',
    avatar: null,
    progress: 42,
    joinedDate: '2024-09-01'
  },
  {
    id: '3',
    email: 'mike.torres@skyteam.example',
    name: 'Mike Torres',
    role: 'TRAINEE',
    department: 'GROUND_CREW',
    airline: 'SkyTeam Aviation',
    avatar: null,
    progress: 28,
    joinedDate: '2024-09-10'
  },
  {
    id: '4',
    email: 'emma.wilson@skyteam.example',
    name: 'Emma Wilson',
    role: 'TRAINER',
    department: 'FLIGHT_DECK',
    airline: 'SkyTeam Aviation',
    avatar: null,
    progress: 100,
    joinedDate: '2023-06-20'
  },
  {
    id: '5',
    email: 'admin@skyteam.example',
    name: 'Admin User',
    role: 'ADMIN',
    department: 'SHARED_CORE',
    airline: 'SkyTeam Alliance',
    avatar: null,
    progress: 100,
    joinedDate: '2023-01-01'
  }
]

export const courses: Course[] = [
  {
    id: 'fd-core',
    title: 'Flight Deck Core Operations',
    department: 'FLIGHT_DECK',
    description: 'Master the fundamentals of flight deck operations including flight planning, aircraft handling, and complete flight operations procedures.',
    modules: [
      {
        id: 'fd-m1',
        title: 'Flight Plan Preparation',
        lessons: [
          { id: 'fd-l1', title: 'Flight Plan Basics', type: 'reading', duration: '15 min', content: 'Learn about flight plan components...' },
          { id: 'fd-l2', title: 'Flight Plan Example', type: 'reading', duration: '20 min', content: 'Walk through a complete flight plan example...' },
          { id: 'fd-l3', title: 'Flight Plan Quiz', type: 'quiz', duration: '10 min' }
        ]
      },
      {
        id: 'fd-m2',
        title: 'Aircraft Pre-Flight Inspection',
        lessons: [
          { id: 'fd-l4', title: 'Walkaround Procedure', type: 'video', duration: '12 min' },
          { id: 'fd-l5', title: 'Cockpit Checks', type: 'reading', duration: '18 min' }
        ]
      },
      {
        id: 'fd-m3',
        title: 'Pushback and Taxi',
        lessons: [
          { id: 'fd-l6', title: 'Pushback Procedures', type: 'reading', duration: '10 min' },
          { id: 'fd-l7', title: 'Taxi Chart Navigation', type: 'reading', duration: '15 min' }
        ]
      },
      {
        id: 'fd-m4',
        title: 'Takeoff and Climb',
        lessons: [
          { id: 'fd-l8', title: 'Takeoff Procedures', type: 'video', duration: '20 min' },
          { id: 'fd-l9', title: 'Climb Management', type: 'reading', duration: '15 min' }
        ]
      },
      {
        id: 'fd-m5',
        title: 'Cruise Phase',
        lessons: [
          { id: 'fd-l10', title: 'Cruise Operations', type: 'reading', duration: '15 min' },
          { id: 'fd-l11', title: 'Communication Protocols', type: 'reading', duration: '10 min' }
        ]
      },
      {
        id: 'fd-m6',
        title: 'Descent and Approach',
        lessons: [
          { id: 'fd-l12', title: 'Descent Planning', type: 'reading', duration: '12 min' },
          { id: 'fd-l13', title: 'Approach Procedures', type: 'video', duration: '18 min' }
        ]
      },
      {
        id: 'fd-m7',
        title: 'Landing Operations',
        lessons: [
          { id: 'fd-l14', title: 'Landing Techniques', type: 'video', duration: '20 min' },
          { id: 'fd-l15', title: 'Post-Landing Procedures', type: 'reading', duration: '10 min' }
        ]
      },
      {
        id: 'fd-m8',
        title: 'Final Assessment',
        lessons: [
          { id: 'fd-l16', title: 'Written Exam', type: 'quiz', duration: '30 min' },
          { id: 'fd-l17', title: 'Practical Evaluation', type: 'quiz', duration: '45 min' }
        ]
      }
    ],
    progress: 65,
    status: 'in-progress',
    icon: 'plane'
  },
  {
    id: 'cc-core',
    title: 'Cabin Crew Fundamentals',
    department: 'CABIN_CREW',
    description: 'Learn essential cabin crew procedures including check-in, boarding, in-flight service, and safety protocols.',
    modules: [
      {
        id: 'cc-m1',
        title: 'Check-In Procedures',
        lessons: [
          { id: 'cc-l1', title: 'Check-In Process', type: 'reading', duration: '15 min' },
          { id: 'cc-l2', title: 'Document Verification', type: 'reading', duration: '10 min' }
        ]
      },
      {
        id: 'cc-m2',
        title: 'Boarding Procedures',
        lessons: [
          { id: 'cc-l3', title: 'Gate Boarding', type: 'reading', duration: '12 min' },
          { id: 'cc-l4', title: 'Bus Boarding', type: 'reading', duration: '10 min' }
        ]
      },
      {
        id: 'cc-m3',
        title: 'In-Flight Service',
        lessons: [
          { id: 'cc-l5', title: 'Service Standards', type: 'reading', duration: '15 min' },
          { id: 'cc-l6', title: 'Special Meal Requests', type: 'reading', duration: '10 min' }
        ]
      },
      {
        id: 'cc-m4',
        title: 'Safety Procedures',
        lessons: [
          { id: 'cc-l7', title: 'Safety Demonstrations', type: 'video', duration: '20 min' },
          { id: 'cc-l8', title: 'Emergency Protocols', type: 'reading', duration: '25 min' }
        ]
      },
      {
        id: 'cc-m5',
        title: 'Final Assessment',
        lessons: [
          { id: 'cc-l9', title: 'Written Exam', type: 'quiz', duration: '30 min' },
          { id: 'cc-l10', title: 'Practical Evaluation', type: 'quiz', duration: '40 min' }
        ]
      }
    ],
    progress: 42,
    status: 'in-progress',
    icon: 'users'
  },
  {
    id: 'gc-core',
    title: 'Ground Crew Operations',
    department: 'GROUND_CREW',
    description: 'Master ground handling procedures including airport setup, aircraft positioning, and vehicle operations.',
    modules: [
      {
        id: 'gc-m1',
        title: 'Airport Setup',
        lessons: [
          { id: 'gc-l1', title: 'Departure Airport Setup', type: 'reading', duration: '15 min' },
          { id: 'gc-l2', title: 'Destination Airport Setup', type: 'reading', duration: '15 min' }
        ]
      },
      {
        id: 'gc-m2',
        title: 'Vehicle Operations',
        lessons: [
          { id: 'gc-l3', title: 'Ground Vehicles', type: 'reading', duration: '20 min' },
          { id: 'gc-l4', title: 'Vehicle Placement', type: 'video', duration: '15 min' }
        ]
      },
      {
        id: 'gc-m3',
        title: 'Cone Placement',
        lessons: [
          { id: 'gc-l5', title: 'Cone Standards', type: 'reading', duration: '15 min' },
          { id: 'gc-l6', title: 'Placement Patterns', type: 'reading', duration: '20 min' }
        ]
      },
      {
        id: 'gc-m4',
        title: 'Pushback Procedures',
        lessons: [
          { id: 'gc-l7', title: 'Pushback Setup', type: 'reading', duration: '12 min' },
          { id: 'gc-l8', title: 'Pushback Execution', type: 'video', duration: '18 min' }
        ]
      },
      {
        id: 'gc-m5',
        title: 'Final Assessment',
        lessons: [
          { id: 'gc-l9', title: 'Written Exam', type: 'quiz', duration: '30 min' },
          { id: 'gc-l10', title: 'Practical Evaluation', type: 'quiz', duration: '35 min' }
        ]
      }
    ],
    progress: 28,
    status: 'in-progress',
    icon: 'truck'
  },
  {
    id: 'sc-shared',
    title: 'Shared Core Training',
    department: 'SHARED_CORE',
    description: 'Essential training applicable to all departments including alliance procedures and communication standards.',
    modules: [
      {
        id: 'sc-m1',
        title: 'Alliance Overview',
        lessons: [
          { id: 'sc-l1', title: 'SkyTeam Alliance', type: 'reading', duration: '15 min' },
          { id: 'sc-l2', title: 'Inter-Department Communication', type: 'reading', duration: '10 min' }
        ]
      },
      {
        id: 'sc-m2',
        title: 'Safety Standards',
        lessons: [
          { id: 'sc-l3', title: 'General Safety Protocols', type: 'reading', duration: '20 min' },
          { id: 'sc-l4', title: 'Emergency Procedures', type: 'video', duration: '25 min' }
        ]
      },
      {
        id: 'sc-m3',
        title: 'Final Assessment',
        lessons: [
          { id: 'sc-l5', title: 'Written Exam', type: 'quiz', duration: '20 min' },
          { id: 'sc-l6', title: 'Practical Evaluation', type: 'quiz', duration: '30 min' }
        ]
      }
    ],
    progress: 0,
    status: 'not-started',
    icon: 'globe'
  }
]

export const assessments: Assessment[] = [
  {
    id: 'we-fd-1',
    title: 'Flight Deck Written Exam',
    type: 'written',
    department: 'FLIGHT_DECK',
    passingScore: 70,
    timeLimit: 30,
    description: 'Comprehensive written examination covering all Flight Deck procedures.',
    questions: [
      {
        id: 'fd-q1',
        question: 'How many sections does the Flight Deck handbook have?',
        type: 'mcq',
        options: ['8', '9', '10', '11', '12', '13'],
        correctAnswer: 2,
        explanation: 'The Flight Deck handbook has 10 sections.'
      },
      {
        id: 'fd-q2',
        question: 'Should you turn on the engine while being pushed back?',
        type: 'mcq',
        options: [
          'Yes - start engines as pushback begins',
          'No - never start engines during pushback',
          'No - not while connected due to PTFS bug',
          'Yes - because we can',
          'No - only with ground crew approval',
          'Yes - as long as pilot wants'
        ],
        correctAnswer: 2,
        explanation: 'Do not start engines while still connected to pushback tug due to a known PTFS bug.'
      },
      {
        id: 'fd-q3',
        question: 'What is the recommended taxi speed?',
        type: 'mcq',
        options: [
          '5-10 knots; check taxi chart',
          '10-15 knots; check weather',
          '10-20 knots; check taxi chart for planned route',
          '15-25 knots; check with ground crew',
          '20-30 knots; check taxi chart',
          '10-20 knots; check with ground crew'
        ],
        correctAnswer: 2,
        explanation: 'Recommended taxi speed is 10-20 knots with taxi chart reference.'
      },
      {
        id: 'fd-q4',
        question: 'What are PAPI lights used for?',
        type: 'mcq',
        options: [
          'Show correct heading',
          'Indicate horizontal position',
          'Indicate altitude relative to glidepath',
          'Show current airspeed',
          'Show distance to threshold',
          'Communicate with tower'
        ],
        correctAnswer: 2,
        explanation: 'PAPI lights indicate how high you are relative to the correct glidepath.'
      },
      {
        id: 'fd-q5',
        question: 'After touchdown, when should reverse thrust be disengaged?',
        type: 'mcq',
        options: [
          'Immediately on touchdown',
          'At 60 knots',
          'At 40 knots',
          'Keep engaged to gate',
          'At 200 feet',
          'At 250 knots'
        ],
        correctAnswer: 1,
        explanation: 'Switch from reverse to taxi thrust at approximately 60 knots.'
      }
    ]
  },
  {
    id: 'pe-fd-1',
    title: 'Flight Deck Practical Evaluation',
    type: 'practical',
    department: 'FLIGHT_DECK',
    passingScore: 80,
    timeLimit: 45,
    description: 'Practical assessment of flight deck operational skills.',
    questions: [
      {
        id: 'fd-p1',
        question: 'Walk through the plane check procedure.',
        type: 'essay',
        explanation: 'Demonstrate knowledge of pre-flight inspection process.'
      },
      {
        id: 'fd-p2',
        question: 'Describe how you would file a complete flight plan.',
        type: 'essay',
        explanation: 'Include all required components in your example.'
      },
      {
        id: 'fd-p3',
        question: 'What do you do when you are too high during descent?',
        type: 'essay',
        explanation: 'Explain your approach to managing excessive altitude.'
      },
      {
        id: 'fd-p4',
        question: 'Describe post-takeoff procedures after reaching 200 feet.',
        type: 'essay',
        explanation: 'Include flap retraction and climb management.'
      }
    ]
  },
  {
    id: 'we-cc-1',
    title: 'Cabin Crew Written Exam',
    type: 'written',
    department: 'CABIN_CREW',
    passingScore: 70,
    timeLimit: 30,
    description: 'Written examination covering cabin crew procedures and protocols.',
    questions: [
      {
        id: 'cc-q1',
        question: 'What should you ask passengers during check-in?',
        type: 'mcq',
        options: [
          'Luggage, Food, Seating, Class, ID',
          'Destination, ID, Class, Boarding pass type, Luggage',
          'Destination, Favorite food, Seating, Boarding pass, Drinks',
          'Hot towel, Gate, Airport, Passport, Boarding pass',
          'Destination, Class, Job, ID, Luggage',
          'Nothing - just tell them to proceed to gate'
        ],
        correctAnswer: 1,
        explanation: 'Check-in requires verifying destination, ID, class, boarding pass type, and luggage.'
      },
      {
        id: 'cc-q2',
        question: 'When should you serve Business Class preflight service?',
        type: 'mcq',
        options: [
          'Before all passengers board',
          'After all business class passengers board',
          'During check-in',
          'Immediately after takeoff',
          'During descent',
          'Only if requested'
        ],
        correctAnswer: 1,
        explanation: 'Business class preflight service begins after all business class passengers have boarded.'
      },
      {
        id: 'cc-q3',
        question: 'What should you do after completing in-flight service?',
        type: 'mcq',
        options: [
          'Wait 2 minutes then notify captain',
          'Notify captain immediately',
          'Wait 2 minutes then begin deboarding',
          'Start service again',
          'Wait 5 minutes then notify captain',
          'Notify captain with no waiting period'
        ],
        correctAnswer: 4,
        explanation: 'Notify the captain that service is finished with no waiting period required.'
      },
      {
        id: 'cc-q4',
        question: 'How should you handle a disruptive passenger?',
        type: 'essay',
        explanation: 'Describe your approach to managing disruptive behavior.'
      }
    ]
  },
  {
    id: 'we-gc-1',
    title: 'Ground Crew Written Exam',
    type: 'written',
    department: 'GROUND_CREW',
    passingScore: 70,
    timeLimit: 30,
    description: 'Written examination covering ground handling procedures.',
    questions: [
      {
        id: 'gc-q1',
        question: 'How many vehicles are needed for a B787 at the gate?',
        type: 'mcq',
        options: ['3', '4', '5', '6', '7', '8'],
        correctAnswer: 3,
        explanation: 'A B787 requires 6 vehicles at the gate.'
      },
      {
        id: 'gc-q2',
        question: 'Where should the catering truck be located on a B737?',
        type: 'mcq',
        options: [
          'Front right door',
          'Front left door',
          'Back right door',
          'Back left door',
          'Back and front right door',
          'Back and front left door'
        ],
        correctAnswer: 0,
        explanation: 'Catering truck is positioned at the front right door for B737.'
      },
      {
        id: 'gc-q3',
        question: 'What is a stair truck used for?',
        type: 'mcq',
        options: [
          'Transporting luggage',
          'Supplying fuel',
          'Providing food service',
          'Helping passengers board without jetway',
          'Moving passengers to gate',
          'Pushing back aircraft'
        ],
        correctAnswer: 3,
        explanation: 'Stair trucks assist boarding when jetway is not available.'
      },
      {
        id: 'gc-q4',
        question: 'How many cones are needed for a B777?',
        type: 'mcq',
        options: ['3', '4', '5', '6', '7', '8'],
        correctAnswer: 3,
        explanation: 'A B777 requires 6 cones for safe ground operations.'
      },
      {
        id: 'gc-q5',
        question: 'When should the pushback tug be positioned?',
        type: 'essay',
        explanation: 'Describe the proper positioning and timing for pushback operations.'
      }
    ]
  }
]

export const trainees = [
  { id: '1', name: 'Alex Chen', department: 'FLIGHT_DECK', progress: 65, status: 'active' },
  { id: '2', name: 'Sarah Jones', department: 'CABIN_CREW', progress: 42, status: 'active' },
  { id: '3', name: 'Mike Torres', department: 'GROUND_CREW', progress: 28, status: 'in-progress' },
  { id: '6', name: 'Lisa Park', department: 'FLIGHT_DECK', progress: 90, status: 'completed' },
  { id: '7', name: 'James Lee', department: 'CABIN_CREW', progress: 15, status: 'active' }
]

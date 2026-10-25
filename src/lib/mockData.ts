import { Department, Role } from './constants'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  department: Department
  airline: string
  discord: string
  region: string
  joinedDate: string
  progress: number
  avatar: string | null
  onboarded: boolean
}

export interface Module {
  id: string
  title: string
  description?: string
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
  description: string
  icon: string
  modules: Module[]
  progress: number
  status: 'not-started' | 'in-progress' | 'completed'
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
  passingScore: number
  timeLimit: number
  description: string
  questions: AssessmentQuestion[]
}

export interface ApplicationQuestion {
  id: string
  department: Department
  question: string
  type: 'text' | 'textarea'
  required: boolean
  order?: number
  placeholder?: string
}

export interface StudyGuideSection {
  id: string
  title: string
  content: string
  order: number
}

export interface TrainerGradingCriteria {
  criterion: string
  description: string
  points: number
}

export interface TrainerEvaluation {
  department: Department
  maxScore: number
  passScore: number
  criteria: TrainerGradingCriteria[]
  routes?: string[]
}

export const users: User[] = [
  {
    id: '1',
    email: 'vietnamtrainingpilot@gmail.com',
    name: 'Nguyen Huu Khoi Nguyen',
    role: 'ADMIN',
    department: 'FLIGHT_DECK',
    airline: 'Vietnam Training Pilot',
    discord: 'khoinguyen#0001',
    region: 'Asia',
    joinedDate: '2024-01-01',
    progress: 100,
    avatar: null,
    onboarded: true
  }
]

export const trainees = [
  { id: '1', name: 'Alex Chen', department: 'FLIGHT_DECK', progress: 65, status: 'active' },
  { id: '2', name: 'Sarah Jones', department: 'CABIN_CREW', progress: 42, status: 'active' },
  { id: '3', name: 'Mike Torres', department: 'GROUND_CREW', progress: 28, status: 'in-progress' },
  { id: '6', name: 'Lisa Park', department: 'FLIGHT_DECK', progress: 90, status: 'completed' },
  { id: '7', name: 'James Lee', department: 'CABIN_CREW', progress: 15, status: 'active' }
]

// Application questions from PTC training materials
export const applicationQuestions: ApplicationQuestion[] = [
  // Flight Deck applications (14 questions)
  { id: 'fd-aq1', department: 'FLIGHT_DECK', question: 'What is your Roblox and Discord usernames?', type: 'text', required: true },
  { id: 'fd-aq2', department: 'FLIGHT_DECK', question: 'What is your region? How active are you? How old are you?', type: 'textarea', required: true },
  { id: 'fd-aq3', department: 'FLIGHT_DECK', question: 'What is your previous experience in this department?', type: 'textarea', required: true },
  { id: 'fd-aq4', department: 'FLIGHT_DECK', question: 'Why do you want to apply to this department?', type: 'textarea', required: true },
  { id: 'fd-aq5', department: 'FLIGHT_DECK', question: 'What makes you stand out from other colleagues?', type: 'textarea', required: true },
  { id: 'fd-aq6', department: 'FLIGHT_DECK', question: 'What are your weakest and strongest skills? (list at least 2)', type: 'textarea', required: true },
  { id: 'fd-aq7', department: 'FLIGHT_DECK', question: 'What skills do you think are needed in this department?', type: 'textarea', required: true },
  { id: 'fd-aq8', department: 'FLIGHT_DECK', question: 'How can you keep the flight realistic?', type: 'textarea', required: true },
  { id: 'fd-aq9', department: 'FLIGHT_DECK', question: 'What is one thing you would do to the department that will help the department a lot if you are able to?', type: 'textarea', required: true },
  { id: 'fd-aq10', department: 'FLIGHT_DECK', question: 'A passenger just joined the flight for the first time and doesn\'t know anything, so they decided to ask you for guidance. How would you reply to him, and what information would you provide the passenger?', type: 'textarea', required: true },
  { id: 'fd-aq11', department: 'FLIGHT_DECK', question: 'What are the main parts of a plane?', type: 'textarea', required: true },
  { id: 'fd-aq12', department: 'FLIGHT_DECK', question: 'When you are taking off, should we immediately turn or not?', type: 'textarea', required: true },
  { id: 'fd-aq13', department: 'FLIGHT_DECK', question: 'In a flight, what is the most important thing you must follow to ensure the flight is realistic?', type: 'textarea', required: true },
  { id: 'fd-aq14', department: 'FLIGHT_DECK', question: 'Any questions?', type: 'textarea', required: false },
  // Cabin Crew applications (12 questions)
  { id: 'cc-aq1', department: 'CABIN_CREW', question: 'What is your Roblox and Discord usernames?', type: 'text', required: true },
  { id: 'cc-aq2', department: 'CABIN_CREW', question: 'What is your region? How active are you? How old are you?', type: 'textarea', required: true },
  { id: 'cc-aq3', department: 'CABIN_CREW', question: 'What is your previous experience in this department?', type: 'textarea', required: true },
  { id: 'cc-aq4', department: 'CABIN_CREW', question: 'Why do you want to apply to this department?', type: 'textarea', required: true },
  { id: 'cc-aq5', department: 'CABIN_CREW', question: 'What makes you stand out from other colleagues?', type: 'textarea', required: true },
  { id: 'cc-aq6', department: 'CABIN_CREW', question: 'What are the weakest and strongest skills of yours? (list at least 2)', type: 'textarea', required: true },
  { id: 'cc-aq7', department: 'CABIN_CREW', question: 'What skills do you think are needed in this department?', type: 'textarea', required: true },
  { id: 'cc-aq8', department: 'CABIN_CREW', question: 'During the cruising attitude, a passenger suddenly becomes angry and disrupts the flight. As you are the only available flight attendant, what do you do?', type: 'textarea', required: true },
  { id: 'cc-aq9', department: 'CABIN_CREW', question: 'A passenger is ordering food, and another passengers suddenly came to you and asked for some tissues. How would you react and complete the task?', type: 'textarea', required: true },
  { id: 'cc-aq10', department: 'CABIN_CREW', question: 'A passenger just joined the flight for the first time and doesn\'t know anything, so they decided to ask you for guidance. How would you reply to him, and what information would you provide the passenger?', type: 'textarea', required: true },
  { id: 'cc-aq11', department: 'CABIN_CREW', question: 'What is one thing you would do for the department that will help the department a lot if you are able to?', type: 'textarea', required: true },
  { id: 'cc-aq12', department: 'CABIN_CREW', question: 'Any questions?', type: 'textarea', required: false },
  // Ground Crew applications (13 questions)
  { id: 'gc-aq1', department: 'GROUND_CREW', question: 'What is your Roblox and Discord username?*', type: 'text', required: true },
  { id: 'gc-aq2', department: 'GROUND_CREW', question: 'What is your region? How active are you? How old are you?*', type: 'textarea', required: true },
  { id: 'gc-aq3', department: 'GROUND_CREW', question: 'What is your previous experience in this department? *', type: 'textarea', required: true },
  { id: 'gc-aq4', department: 'GROUND_CREW', question: 'Why do you want to apply to this department?*', type: 'textarea', required: true },
  { id: 'gc-aq5', department: 'GROUND_CREW', question: 'What makes you stand out from other colleagues?*', type: 'textarea', required: true },
  { id: 'gc-aq6', department: 'GROUND_CREW', question: 'What are your weakest and strongest skills? (list at least 2)*', type: 'textarea', required: true },
  { id: 'gc-aq7', department: 'GROUND_CREW', question: 'What skills do you think are needed in this department?*', type: 'textarea', required: true },
  { id: 'gc-aq8', department: 'GROUND_CREW', question: 'How can you keep the flight realistic?*', type: 'textarea', required: true },
  { id: 'gc-aq9', department: 'GROUND_CREW', question: 'What is one thing you would do to the department that will help the department a lot if you are able to?*', type: 'textarea', required: true },
  { id: 'gc-aq10', department: 'GROUND_CREW', question: 'What are the main ground crew vehicles?*', type: 'textarea', required: true },
  { id: 'gc-aq11', department: 'GROUND_CREW', question: 'There is an insufficient number of ground crew, which has only you. How would you divide the work just so you can still complete your job and meet the time?*', type: 'textarea', required: true },
  { id: 'gc-aq12', department: 'GROUND_CREW', question: 'A passenger just joined the flight for the first time and doesn\'t know anything, so they decided to ask you for guidance. How would you reply to him, and what information would you provide the passenger?*', type: 'textarea', required: true },
  { id: 'gc-aq13', department: 'GROUND_CREW', question: 'Any questions?*', type: 'textarea', required: false }
]

// Study guide sections from PTC training materials
export const studyGuideSections: Record<Department, StudyGuideSection[]> = {
  FLIGHT_DECK: [
    { id: 'fd-sg1', title: 'Flight Plan', order: 1, content: 'After the briefing, file a flight plan with the flight operator. You should read and understand the flight plan.\n\n**Example Format:**\n- Callsign: LX001 - flight callsign\n- Aircraft: A320 - type of aircraft\n- Departure: HAN - where we take off\n- Arrival: SGN - where we land\n- Route: GPS Direct - what type we use during flight\n- Flight Level: 030 - flight altitude\n- Runway: IRFD 25L ITKO 31 - departure and landing runway' },
    { id: 'fd-sg2', title: 'Plane-Checking', order: 2, content: 'This part has no purpose, but it makes the flight operation more realistic. One of the 2 crew decks should go down and walk around the aircraft. The main things to look at are the gears, flaps, tail, and other important parts of the plane.' },
    { id: 'fd-sg3', title: 'Taxi', order: 3, content: '**Pushback:** Before pushing back, you must provide the ground crew with the direction of pushing back. Do not turn on the engine during pushback when it is connected, because of a bug in PTFS. Wait for the ground crew to finish the pushback.\n\n**Taxi:** After pushback, you may start up the engines. I recommend looking at the chart since it would help you taxi much better with planned routes. The taxi speed should remain between 10-20 knots because the safety demonstration video is long. Try to stay on the centerline of the taxiway.' },
    { id: 'fd-sg4', title: 'Takeoff', order: 4, content: 'When you are taking off, make sure to set the throttle to 80% and try to take off as smoothly as possible. Do not pitch too much and remain in gear until you get to 200 ft so you can deploy the gear. When the plane reaches 200 kts, retract the flaps. Also, the speed should remain under 250 kts until you reach the cruising altitude. From that point, you may set the speed as high as you can, but realistically, set it around 85-95 percent.' },
    { id: 'fd-sg5', title: 'Cruising', order: 5, content: 'During the climb, do not make sharp turns. Before leveling off, ensure the aircraft is pointed toward your destination. As you reach the cruising altitude based on your flight plan, begin a smooth transition to level flight. Don\'t be too picky in correcting, as being within ± 50 feet of your assigned altitude is acceptable. Once you\'ve reached the cruising altitude, press `R` to keep the altitude. The aircraft will continue flying on the heading you\'ve selected. When you\'re halfway through the route, press `F` to enable cruise mode for in-flight service.' },
    { id: 'fd-sg6', title: 'Descent', order: 6, content: 'When descending, keep your descent rate realistic. The aircraft should not look like it is diving. **Do NOT** pitch down to reach the runway or capture the glideslope. If you are too high, fly a circular descent or perform a go-around instead. Keep your turns smooth and avoid steep bank angles. Make small adjustments to stay lined up with the runway.' },
    { id: 'fd-sg7', title: 'Landing', order: 7, content: 'When landing, use the PAPI lights to indicate how high you currently are, as this will determine your touchdown. That being said, try to touch down within the touchdown zone to avoid floating in the air and causing an overrun. Check if you are currently at the correct landing speed and flaps configuration.\n\nAfter touchdown, lower the nose wheel normally and do not keep it raised for too long. Once all wheels are on the ground, apply reverse thrust at about 40% throttle. When your speed reaches 60 knots, turn off reverse thrust and use taxi thrust instead. Find the nearest exit. Exit the runway at a maximum of 30 kts, and retract the flaps once you have reached the taxiway.' },
    { id: 'fd-sg8', title: 'Taxi to Gate', order: 8, content: 'It is just the same as normal taxi. When you are ready to get to the gate, follow the marshaller\'s instructions. Once you have finished, shut down your engines and wait for all passengers to deboard the plane.' }
  ],
  CABIN_CREW: [
    { id: 'cc-sg1', title: 'Check-In', order: 1, content: 'The check-in part will happen at the check-in section of the airport. You will have to sit at a desk and provide a boarding pass for passengers to board the flight. You should ask the passenger about their destination, identification, class, whether they want a digital or normal boarding pass, and their luggage, and finally give a brief overview of the flight and its destination to confirm that their booking details are correct. Must check their role before giving out a boarding pass.\n\n**PA Announcement:** "Check-in is now open for [AIRLINE] flight [CALLSIGN] to [DESTINATION]. Passengers are requested to proceed to the check-in counter. Please have your passport and travel documents ready. Thank you."\n\n**Final Check-in:** "This is the last call for check-in on [AIRLINE] flight [CALLSIGN] to [DESTINATION]. Passengers who have not yet checked in are urgently requested to proceed to the counter immediately. The counter closes in 10 minutes."' },
    { id: 'cc-sg2', title: 'Boarding', order: 2, content: 'The gate boarding part will happen at the flight gate. You will have to sit at a desk and check all the boarding passes of the passengers of that flight so they can board the flight. You should ask the passenger for their boarding pass and let them board the plane.\n\n**Example Dialogue:**\n- GA: Hello @, welcome to [AIRLINE] flight [CALLSIGN]! May I take a look at your boarding pass, sir?\n- Passenger: Sure!\n- GA scans boarding pass, hands back BP\n- GA: Thank you! All details are correct, and you may board the plane.\n\nFor international flights, please also ask them for their passport.' },
    { id: 'cc-sg3', title: 'Preflight Service', order: 3, content: 'At [AIRLINE], we offer business class. The host will tell you if we have business class or not. After all the business class passengers board, you may serve them with preflight service.\n\n**Example Dialogue:**\n- You: Hello, welcome to Business Class preflight service. What would you like to have?\n- Passenger: I\'ll take a glass of water.\n- You: Sure! Here is your hot towel for being a Business Class Passenger — please call me if you need help!' },
    { id: 'cc-sg4', title: 'Safety Demonstration', order: 4, content: 'Play this PA Announcement before pushing back:\n\n"Ladies and Gentlemen, this is your Captain speaking. Welcome onboard [AIRLINE] Flight [CALLSIGN]. Our estimated flight time for this flight is approximately an unknown number; the flight today is expected to be smooth with no turbulence. We will be starting the safety instructions shortly — please rely on them and ensure that your seatbelts are fastened, your tray tables are stowed, and your window shades are open. If you need any assistance, please contact a crew member in the aircraft in front of or behind you. Thank you for choosing [AIRLINE]."' },
    { id: 'cc-sg5', title: 'Takeoff PA', order: 5, content: '"Ladies and gentlemen, we are now cleared for takeoff from [ORIGIN]. Crew is now required to be seated. Please ensure seatbelts are securely fastened, tray tables are stowed, and window shades are open."' },
    { id: 'cc-sg6', title: 'Inflight Service', order: 6, content: 'After you get the confirmation from the pilot, you may announce to start the flight service:\n\n"Ladies and gentlemen, we will now begin our in-flight service. Our crew will be coming through the cabin with food and beverages."\n\nYou should ask passengers what they want, serve it, ask them if they want anything else, provide what they need, and thank them.\n\n**Example Dialogue:**\n- FA: Hello, welcome to [AIRLINE] in-flight food service on flight [CALLSIGN] to [DESTINATION] ([ORIGIN]). May I take your order, please? @\n- PAX: Can I have a bowl of [MEAL]?\n- FA: Of course! Please wait a moment while I prepare your order. @\n- FA: Here is your food. Would you like anything else? @\n- FA: Here is your drink. Enjoy your meal! @' },
    { id: 'cc-sg7', title: 'Landing/Descent', order: 7, content: 'When completing the flight service, the plane will start descent. Play this PA Announcement:\n\n"Ladies and gentlemen, we have begun our descent into [DEST]. Please return your seats and tray tables to the upright position, stow all carry-on items, and ensure your seatbelts are fastened. All electronic devices should remain in flight mode until we have come to a complete stop."\n\nAfter landing:\n\n"Ladies and gentlemen, on behalf of [AIRLINE] and your flight crew, welcome to [DEST]. Please remain seated with your seatbelts fastened until the aircraft has come to a complete stop and the seatbelt sign has been turned off."\n\nThen, wait for the plane to taxi to the gate.' },
    { id: 'cc-sg8', title: 'Deboarding', order: 8, content: 'When the plane reaches the gate, make this announcement:\n\n"Ladies and gentlemen, the seatbelt sign has been turned off. You may collect your carry-on baggage from the overhead bins. Please take care as items may have shifted. Check that you have all your belongings before leaving. On behalf of [AIRLINE], thank you for flying with us today."\n\nAnd make this announcement to officially end the flight:\n\n"On behalf of your captain and the entire crew of [AIRLINE] flight [CALLSIGN], we thank you for choosing to fly with us today. It has been our pleasure to serve you. We hope to welcome you on board again soon. Have a wonderful day."' }
  ],
  GROUND_CREW: [
    { id: 'gc-sg1', title: 'Airport Setup', order: 1, content: '**Origin Airports:** Firstly, use the time provided in the briefing to track the airport we are departing from and check the airlines and aircraft operating there. Then, start setting up the airport with the data you received. Set up one zone for the home airline (based on the airport\'s country). You can gather airport setup information on FlightRadar 24.\n\n**Destination Airports:** Same as setting up for the origin airport, you should repeat the same with the destination airport too. After that, leave a vacant stand/gate and bring up some ground crew vehicles. It is not required to use all ground crew vehicles — only a stair truck, fuel truck, and baggage truck are okay. Note: only start this when the plane has taken off.\n\n![Ground crew airport setup guide showing origin and destination zones, vehicle staging areas](/gc-airport-setup.svg)' },
    { id: 'gc-sg2', title: 'Aircraft Setup', order: 2, content: '**Information:** This is the most important part of the flight as Ground Crew. The cones and ground crew vehicles should be placed in their correct positions, and all operations must be carried out correctly.\n\n### Baggage Truck\n- **What is it:** A vehicle used for transporting luggage to the plane\n- **When to use:** Check-in is completed, boarding has started, and it is removed when boarding is completed\n- **Where to place:** At the right back part of the plane for all planes, and an additional one at the front right part of the plane if using widebody planes\n- **How often:** Every flight must have it\n\n### Catering Truck\n- **What is it:** A vehicle used for providing services like food and drinks\n- **When to use:** During check-in, and removed when boarding is completed\n- **Where to place:** Front right door, and 1 additional at the right back door if using widebodies\n- **How often:** Flights that are over 1 hour long\n\n### Stair Truck\n- **What is it:** A vehicle used to help passengers board the plane if not using the gate, or for staff to get on the plane\n- **When to use:** When boarding starts (on the bus) and only for flights that do not use a jetway, or check-in, and removed when boarding is completed.\n- **Where to place:** Front left door, and 1 additional at the left back door if using widebodies (if not using jetway), or one at the left back door if using jetway.\n- **How often:** Every time for flights that do not use a jetway, or are in a stand\n\n### Fuel Truck\n- **What is it:** A vehicle used to supply fuel to the plane\n- **When to use:** Check-in starts, and removed when boarding is completed\n- **Where to place:** Next to the right wing, not under\n- **How often:** Every flight, and use a large fuel truck for widebodies and a small one for narrow-body planes\n\n### Terminal Bus\n- **What is it:** A vehicle used for moving passengers to board the plane if not using the gate\n- **When to use:** Drive to bus stand when check-in starts, and drive away when everyone has left the plane\n- **Where to place:** Bus stand\n- **How often:** Every time for flights that do not use a jetway, or are in a stand\n\n### Pushback Tug\n- **What is it:** A vehicle used for pushing back the plane\n- **When to use:** All cones and ground crew vehicles are removed\n- **Where to place:** Front of the plane, heading the same direction as the plane\n- **How often:** Every time for flights — ask the pilot for tail heading directions.\n\n![Ground crew vehicle placement guide — top-down view showing all vehicle positions](/gc-aircraft-setup.svg)\n\n![Ground crew vehicle reference guide — all required vehicles for narrow-body operations](/gc-vehicles-reference.svg)' },
    { id: 'gc-sg3', title: 'Cone Placement', order: 3, content: `Cone placement is necessary because it will mark the zones that we should not go to. We will place cones like this because it applies to all planes. Place the cone for departure in the prep time and remove it before departure. Only place the cones when the engine has stopped operating.\n\n![Ground crew cone placement — side view pattern](/gc-cone-placement-diagram.svg)\n\n![Ground crew cone placement — front positioning](/gc-cone-placement-diagram.svg)\n\n![Ground crew cone placement — rear configuration](/gc-rear-cone-config.svg)\n\n![Ground crew complete vehicle and cone setup](/gc-aircraft-setup.svg)` }
  ],
  SHARED_CORE: []
}

// Assessment questions from PTC Examination files
export const assessments: Assessment[] = [
  // Flight Deck Written Exam (Section 1 - MCQs, Section 2 - practical essay questions)
  {
    id: 'we-fd-1',
    title: 'Flight Deck Written Exam',
    type: 'written',
    department: 'FLIGHT_DECK',
    passingScore: 70,
    timeLimit: 30,
    description: 'Comprehensive written examination covering Flight Deck operations, procedures, and safety.',
    questions: [
      {
        id: 'fd-q1',
        question: 'How many sections does the Flight Deck handbook have, not counting Welcome/Introduction, Training, or Conclusion & Credits?',
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
          'Yes — start the engines as soon as pushback begins, regardless of connection status',
          'No — never start the engines during pushback under any circumstance, even after disconnecting',
          'No — not while still connected to the pushback tug, because of a known PTFS bug',
          'Yes — because we can',
          'No — but only because ground crew must explicitly approve it first',
          'Yes — as long as the pilot wants to'
        ],
        correctAnswer: 2,
        explanation: 'Do not start engines while still connected to pushback tug due to a known PTFS bug.'
      },
      {
        id: 'fd-q3',
        question: 'What is the recommended taxi speed, and what should you check before taxiing?',
        type: 'mcq',
        options: [
          '5-10 knots; check the taxi chart',
          '10-15 knots; check the weather provided by the ATC',
          '10-20 knots; check the taxi chart for your planned route',
          '15-25 knots; check with ground crew',
          '20-30 knots; check the taxi chart',
          '10-20 knots; check with ground crew'
        ],
        correctAnswer: 2,
        explanation: 'Recommended taxi speed is 10-20 knots with taxi chart reference.'
      },
      {
        id: 'fd-q4',
        question: 'If you find yourself too high during descent, what should you do?',
        type: 'mcq',
        options: [
          'Pitch down more steeply to catch the glidepath',
          'Fly a circular descent',
          'Perform a go-around',
          'Reduce your speed to idle and let the aircraft sink naturally',
          'Continue the approach and correct once established on short final',
          'Back and front left door'
        ],
        correctAnswer: 3,
        explanation: 'Perform a go-around when too high during descent.'
      },
      {
        id: 'fd-q5',
        question: 'What are PAPI lights used for?',
        type: 'mcq',
        options: [
          'To show the correct heading for your final approach course',
          'To indicate your horizontal position relative to the runway centerline',
          'To indicate how high you currently are, which determines your touchdown point',
          'To indicate your current airspeed relative to the approach speed',
          'To show the distance remaining to the threshold',
          'To communicate directly with the tower during approach'
        ],
        correctAnswer: 2,
        explanation: 'PAPI lights indicate altitude relative to glidepath, determining touchdown point.'
      },
      {
        id: 'fd-q6',
        question: 'After touchdown, which of these is correct?',
        type: 'mcq',
        options: [
          'Apply reverse thrust at about 40% throttle once all wheels are on the ground',
          'Apply reverse thrust at about 60% throttle immediately on touchdown, before the nose wheel is down',
          'Switch from reverse thrust to taxi thrust once your speed reaches 60 knots',
          'Switch from reverse thrust to taxi thrust once your speed reaches 40 knots',
          'Keep reverse thrust engaged all the way to the gate',
          'Exit the runway at any convenient speed, then retract the flaps immediately at touchdown'
        ],
        correctAnswer: 2,
        explanation: 'Switch from reverse thrust to taxi thrust at 60 knots after landing.'
      },
      // Essay questions (Section 2)
      {
        id: 'fd-p1',
        question: 'You\'ve just leveled off at your flight-planned cruising altitude after a smooth climb. Walk through exactly what you do next to properly settle into cruise — including any keys/commands you\'d use, and how much altitude inaccuracy is acceptable before you\'d need to correct it.',
        type: 'essay',
        explanation: 'Expect answer covering pressing R to hold altitude, pressing F for cruise mode halfway, ±50 feet tolerance, heading alignment.'
      },
      {
        id: 'fd-p2',
        question: 'You and your co-pilot are about to begin operations for today\'s flight. Walk through what the plane check involves, who\'s responsible for it, and why we bother doing it even though it has no effect on the game\'s mechanics.',
        type: 'essay',
        explanation: 'Expect answer covering walkaround inspection, pilot responsibility, realism procedures.'
      },
      {
        id: 'fd-p3',
        question: 'What is a Flight Plan? How should you file the flight plan? What components are included in a flight plan? Give me an example flight plan',
        type: 'essay',
        explanation: 'Expect answer covering flight plan definition, filing process, components: callsign, aircraft, departure, arrival, route, flight level, runway.'
      },
      {
        id: 'fd-p4',
        question: 'You\'re now halfway through the route in cruise. Walk through what changes at this point — what you\'d press, what you\'d tell the cabin crew, and what has to happen til we landed at the destination?',
        type: 'essay',
        explanation: 'Expect answer covering pressing F for cruise mode, notifying cabin crew for service, descent preparation.'
      }
    ]
  },
  // Cabin Crew Written Exam
  {
    id: 'we-cc-1',
    title: 'Cabin Crew Written Exam',
    type: 'written',
    department: 'CABIN_CREW',
    passingScore: 70,
    timeLimit: 30,
    description: 'Written examination covering cabin crew procedures, service, and safety protocols.',
    questions: [
      {
        id: 'cc-q1',
        question: 'Which of these are mentioned as briefing content that Flight Dispatchers cover? (for Cabin Crew only)',
        type: 'mcq',
        options: [
          'Departure and Arrival Airport',
          'Classes offered on the flight',
          'The pilot\'s flight minutes',
          'The aircraft\'s ground crew vehicles types',
          'The exact number of passengers pre-booked in each class',
          'Which cabin crew member is assigned to which class'
        ],
        correctAnswer: 0,
        explanation: 'Flight Dispatchers cover departure and arrival airports.'
      },
      {
        id: 'cc-q2',
        question: 'According to the in-flight service script, what should you do during flight service?',
        type: 'mcq',
        options: [
          'Skip confirming the order and just guess based on class',
          'Ask for payment before taking their order',
          'Ask if they\'d like anything else after serving their order',
          'Serve every passenger the same preset meal without asking',
          'Wait for passengers to flag you down before offering service',
          'Ask passengers what they\'d like to eat or drink'
        ],
        correctAnswer: 5,
        explanation: 'Ask passengers what they want to eat or drink.'
      },
      {
        id: 'cc-q3',
        question: 'What to ask passengers during check-in before proceeding the boarding pass?',
        type: 'mcq',
        options: [
          'Luggage, Food, Seating, Class and Identification',
          'Destination, Identification, Class, Boarding pass type and Luggage',
          'Destination, Favourite food, Seating type, Boarding Pass and Drinks',
          'Hot towel, Gate, Airport, Passport and Boarding Pass',
          'Destination, Class, Job, Identification and Luggage',
          'Nothing to ask them just tell them to proceed to boarding gate'
        ],
        correctAnswer: 1,
        explanation: 'Check-in requires destination, identification, class, boarding pass type, and luggage.'
      },
      {
        id: 'cc-q4',
        question: 'How should you serve a Business Class passenger before departure?',
        type: 'mcq',
        options: [
          'Offer them a hot towel and direct them to the lounge',
          'Serve them the same as Economy Class passengers',
          'Ask them to wait in the boarding area with everyone else',
          'Skip pre-flight service entirely for Business Class',
          'Offer them a hot towel, but have them remain at the gate rather than the lounge',
          'Direct them to the lounge, but skip the hot towel since that\'s First-Class-only'
        ],
        correctAnswer: 0,
        explanation: 'Offer hot towel and direct to lounge for Business Class.'
      },
      {
        id: 'cc-q5',
        question: 'After completing in-flight service for all passengers, what should you do?',
        type: 'mcq',
        options: [
          'Wait about 2 minutes to extend the flight time, then notify the captain that service has finished',
          'Notify the captain immediately, then wait 2 minutes before starting descent',
          'Wait about 2 minutes, then begin deboarding announcement',
          'Start service again from the first passenger to fill the extra time',
          'Wait about 5 minutes, then notify the captain',
          'Notify the captain that service has finished, with no waiting period required'
        ],
        correctAnswer: 5,
        explanation: 'Notify captain that service has finished with no waiting period.'
      },
      {
        id: 'cc-q6',
        question: 'A passenger skipped check-in. What should you do?',
        type: 'mcq',
        options: [
          'Contact them for going back to check-in',
          'Ignore them',
          'Shout at them go back to gate',
          'Kick him out of the game',
          'Notify the Flight Dispatcher about him',
          'Let them skipped and continue the flight'
        ],
        correctAnswer: 0,
        explanation: 'Contact the passenger and request they return to check-in, and notify the flight dispatcher.'
      },
      // Essay questions
      {
        id: 'cc-p1',
        question: 'A passenger orders chicken, then another passenger suddenly asks for beef. In that situation, how would you handle the ordering without upsetting either passenger?',
        type: 'essay',
        explanation: 'Expect answer covering prioritizing first order, communicating delay to second passenger.'
      },
      {
        id: 'cc-p2',
        question: 'A passenger walks up to your check-in desk. Walk through, step-by-step, exactly what you\'d say and ask them, from greeting through handing them their boarding pass.',
        type: 'essay',
        explanation: 'Expect complete check-in dialogue with all required questions.'
      },
      {
        id: 'cc-p3',
        question: 'What are the main things we should ask the passenger during the flight service?',
        type: 'essay',
        explanation: 'Expect answer covering order taking, follow-up offers, assistance.'
      },
      {
        id: 'cc-p4',
        question: 'A passenger is being disruptive in the cabin. As a cabin crew member, what should you do?',
        type: 'essay',
        explanation: 'Expect answer covering remaining calm, notifying dispatcher, escalation procedures.'
      }
    ]
  },
  // Ground Crew Written Exam
  {
    id: 'we-gc-1',
    title: 'Ground Crew Written Exam',
    type: 'written',
    department: 'GROUND_CREW',
    passingScore: 70,
    timeLimit: 30,
    description: 'Written examination covering ground handling procedures, vehicle operations, and setup standards.',
    questions: [
      {
        id: 'gc-q1',
        question: 'Which of these are mentioned as briefing content that Flight Dispatchers cover? (for Ground Crew only)',
        type: 'mcq',
        options: [
          'Departure and Arrival Airport',
          'Classes offered on the flight',
          'The pilot\'s flight minutes',
          'The aircraft\'s ground crew vehicles types',
          'The exact number of passengers pre-booked in each class',
          'Ground Crew limitations'
        ],
        correctAnswer: 0,
        explanation: 'Flight Dispatchers cover departure and arrival airports, and ground crew vehicle types.'
      },
      {
        id: 'gc-q2',
        question: 'How to setup airports on departure',
        type: 'mcq',
        options: [
          'Divide the zones and setup by FlightRadar24 Data',
          'Use the airport location in real-life and set up by FlightRadar24 Data',
          'Set up all white',
          'No setup required',
          'Use the PTFS Airport Island location in real-life and set up like that',
          'Choose random airlines to set up'
        ],
        correctAnswer: 1,
        explanation: 'Use real-world airport location and FlightRadar24 data for setup.'
      },
      {
        id: 'gc-q3',
        question: 'How many vehicles is needed for a B787 at the gate?',
        type: 'mcq',
        options: ['3', '4', '5', '6', '7', '8'],
        correctAnswer: 3,
        explanation: 'A B787 requires 6 vehicles at the gate.'
      },
      {
        id: 'gc-q4',
        question: 'Where should the catering truck be located on the B737?',
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
        id: 'gc-q5',
        question: 'What is a stair truck?',
        type: 'mcq',
        options: [
          'A vehicle used for transporting luggage to the plane',
          'A vehicle used to supply fuel to the plane',
          'A vehicle used for providing services like food and drinks',
          'A vehicle used to help passengers board the plane if not using the gate',
          'A vehicle used for moving passengers to board the plane if not using the gate',
          'A vehicle used for pushing back the plane'
        ],
        correctAnswer: 3,
        explanation: 'Stair truck helps passengers board when jetway is not available.'
      },
      {
        id: 'gc-q6',
        question: 'How many cones is needed for a B777?',
        type: 'mcq',
        options: ['3', '4', '5', '6', '7', '8'],
        correctAnswer: 3,
        explanation: 'A B777 requires 6 cones for safe ground operations.'
      },
      // Essay questions
      {
        id: 'gc-p1',
        question: 'Give me a full demonstration of cone placement. (Describe the image yourself.)',
        type: 'essay',
        explanation: 'Assess how accurately the response describes cone placement pattern.'
      },
      {
        id: 'gc-p2',
        question: 'An Airbus A350 is parking at Perth International at gate 14 (have jetway). How would you set up the Ground Crew vehicles?',
        type: 'essay',
        explanation: 'Expect answer covering vehicle setup for A350 with jetway.'
      },
      {
        id: 'gc-p3',
        question: 'A flight is arriving with Amsterdam Schipol as its destination. Walk through how and when you\'d set up the airport for its arrival.',
        type: 'essay',
        explanation: 'Expect answer covering airport setup, gate reservation, vehicle positioning before arrival.'
      },
      {
        id: 'gc-p4',
        question: 'What are the additional Ground Crew vehicles needed to be add when the flight is not using the jetway for departure? Describe it and explain why do we need it?',
        type: 'essay',
        explanation: 'Expect answer covering stair truck and terminal bus for non-jetway departures.'
      }
    ]
  }
]

// Trainer evaluation criteria from PTC training materials
export const trainerEvaluations: TrainerEvaluation[] = [
  {
    department: 'FLIGHT_DECK',
    maxScore: 60,
    passScore: 48,
    routes: [
      'Keflavik → Sauthepomea — hill approach',
      'Tokyo → Perth — Runway 29 approach',
      'Mellor → Greater Rockford — Runway 7L approach',
      'Sauthepomea → Keflavik — Runway 16 approach',
      'Izolrani → St. Barts — beach approach',
      'Izolrani → Laranca — Runway 26 approach'
    ],
    criteria: [
      { criterion: 'Pushback', description: 'Quality and accuracy of the pushback procedure.', points: 5 },
      { criterion: 'Taxi', description: 'Taxi alignment, gear positioning, speed control, and awareness.', points: 5 },
      { criterion: 'Takeoff', description: 'Flap and throttle configuration, speed control, performance, and smoothness.', points: 10 },
      { criterion: 'Climb', description: 'Climb attitude, climb rate, steepness, and speed control.', points: 5 },
      { criterion: 'Cruise', description: 'Aircraft configuration, attitude, and speed during cruise.', points: 5 },
      { criterion: 'Descent', description: 'Descent profile, attitude, path, flap configuration, and speed.', points: 5 },
      { criterion: 'Landing', description: 'Approach, alignment, touchdown, and landing smoothness.', points: 20 },
      { criterion: 'Taxi to Gate', description: 'Taxi alignment, gear positioning, speed control, and gate approach.', points: 5 }
    ]
  },
  {
    department: 'CABIN_CREW',
    maxScore: 55,
    passScore: 44,
    criteria: [
      { criterion: 'Check-in', description: 'Check-in procedure and related public-address announcements.', points: 10 },
      { criterion: 'Boarding', description: 'Boarding procedure and related public-address announcements.', points: 10 },
      { criterion: 'Pre-flight Service', description: 'Completion of the required pre-flight service procedures.', points: 5 },
      { criterion: 'Safety Demonstration', description: 'Safety-related public-address announcements and demonstration.', points: 4 },
      { criterion: 'Takeoff', description: 'Required takeoff announcements.', points: 3 },
      { criterion: 'In-flight Service', description: 'In-flight service procedures and related announcements.', points: 10 },
      { criterion: 'Descent and Landing', description: 'Required descent and landing announcements.', points: 3 },
      { criterion: 'Passenger Situation', description: 'Response to a simulated passenger interruption or issue. Assess professionalism, communication, and adherence to procedure.', points: 10 }
    ]
  },
  {
    department: 'GROUND_CREW',
    maxScore: 50,
    passScore: 40,
    criteria: [
      { criterion: 'Cone Placement', description: 'Correct placement and positioning of cones.', points: 6 },
      { criterion: 'Aircraft Setup', description: 'Completion of the required setup tasks. Award 5 points for each vehicle.', points: 30 },
      { criterion: 'Pushback', description: 'Execution, control, safety, and smoothness of the pushback procedure.', points: 10 },
      { criterion: 'Marshalling', description: 'Accuracy, timing, communication, and control during marshalling.', points: 4 }
    ]
  }
]

// Trainer Phase 1 grading guidelines (written exam grading)
export const trainerGradingGuidelines: Record<Department, { question: number; guideline: string; points: number }[]> = {
  FLIGHT_DECK: [
    { question: 1, guideline: '10 sections in the handbook', points: 2 },
    { question: 2, guideline: 'No — not while still connected to the pushback tug, because of a known PTFS bug', points: 2 },
    { question: 3, guideline: '10–20 knots; check the taxi chart for your planned route', points: 2 },
    { question: 4, guideline: 'Fly a circular descent (1 point) / Perform a go-around (1 point)', points: 2 },
    { question: 5, guideline: 'To indicate the current altitude, which determines the touchdown point', points: 2 },
    { question: 6, guideline: 'Apply reverse thrust at 40% throttle once all wheels on ground (1 point) / Switch to taxi thrust at 60 knots (1 point)', points: 2 },
    { question: 7, guideline: 'Slowly tilt nose down, ensure near 0 degrees tilt (1 point) / Press R to hold altitude (0.5 points) / Press F for cruise (1 point) / Stay within ±50 feet of flight plan (0.5 points)', points: 3 },
    { question: 8, guideline: 'Walkaround of landing gear, engines, underside of wing, wingtips (1 point) / Copilot or pilot can do it, usually led by pilot (1 point) / Improves realism (1 point)', points: 3 },
    { question: 9, guideline: 'A flight plan records upcoming flight details (1.5 points) / Callsign, aircraft, departure, arrival, route, flight level, runway, example (1.5 points)', points: 3 },
    { question: 10, guideline: 'Press F to exit cruise, tilt down to approach, reduce throttle (1 point) / Descend and align with runway, deploy flaps to reduce speed (1 point) / Use PAPI lights, deploy gear at 1000ft, land smoothly (1 point)', points: 3 }
  ],
  GROUND_CREW: [
    { question: 1, guideline: 'Departure and arrival airport (1 point) / The types of ground-service vehicles required (1 point)', points: 2 },
    { question: 2, guideline: 'Use the airport\'s real-world location and set up using reliable airport data', points: 2 },
    { question: 3, guideline: '5 or 6 vehicles', points: 2 },
    { question: 4, guideline: 'Rear-right and front-right doors', points: 2 },
    { question: 5, guideline: 'A vehicle used to help passengers board the aircraft when a gate is not being used', points: 2 },
    { question: 6, guideline: '6 cones', points: 2 },
    { question: 7, guideline: 'Use the provided image as a reference and assess accuracy', points: 3 },
    { question: 8, guideline: 'Catering trucks at front-right and rear-right; fuel truck next to right wing; stair truck at rear-left; two baggage trucks at rear-right and front-right; pushback tug at front', points: 3 },
    { question: 9, guideline: 'Set up airport and reserve a gate (1 point) / Position vehicles before arrival (1 point) / Use follow-me vehicle after landing (1 point)', points: 3 },
    { question: 10, guideline: 'Stair truck helps boarding from ground, terminal bus transports passengers (1.5 points) / Stair truck boards from ground, terminal bus efficient passenger transport (1.5 points)', points: 3 }
  ],
  CABIN_CREW: [
    { question: 1, guideline: 'Departure and arrival airport (1 point) / Classes offered on the flight (1 point)', points: 2 },
    { question: 2, guideline: 'Ask passengers what they want to eat or drink (1 point) / Ask if they want anything else after serving (1 point)', points: 2 },
    { question: 3, guideline: 'Destination, identification, class, boarding-pass type, and luggage', points: 2 },
    { question: 4, guideline: 'Offer a hot towel and direct to appropriate lounge', points: 2 },
    { question: 5, guideline: 'Wait 2 minutes, then notify captain service is finished', points: 2 },
    { question: 6, guideline: 'Contact passenger to return to check-in (1 point) / Notify flight dispatcher (1 point)', points: 2 },
    { question: 7, guideline: 'Prioritize chicken order, apologize to beef passenger (1.5 points) / Serve beef after first order (1.5 points)', points: 3 },
    { question: 8, guideline: 'Grade complete check-in dialogue, deduct 0.5 for each missing/incorrect step', points: 3 },
    { question: 9, guideline: 'Welcome passenger (1 point) / Ask what they want (1 point) / Ask if they need anything else after serving (1 point)', points: 3 },
    { question: 10, guideline: 'Remain calm, politely ask passenger to calm down (1 point) / Notify flight dispatcher (1 point) / Follow removal/reporting procedures if escalated (1 point)', points: 3 }
  ],
  SHARED_CORE: []
}

// Department-specific onboarding questions
export const onboardingQuestions = [
  { name: 'role', label: 'What is your role?', type: 'select', options: ['Trainee', 'Trainer'], required: true },
  { name: 'airline', label: 'What airline do you fly under?', type: 'text', required: true },
  { name: 'discord', label: 'Your Discord username (for crew communication)', type: 'text', required: true },
  { name: 'region', label: 'What region are you based in?', type: 'select', options: ['North America', 'Europe', 'Asia', 'Oceania', 'South America', 'Africa'], required: true },
  { name: 'experience', label: 'What aviation experience do you have?', type: 'textarea', required: true },
  { name: 'heardAbout', label: 'How did you hear about SkyTeam Training?', type: 'select', options: ['Friend', 'Discord', 'Forum', 'Social Media', 'Search Engine', 'Other'], required: true }
]

export const courses: Course[] = [
  {
    id: 'fd-core',
    title: 'Flight Deck Core Operations',
    department: 'FLIGHT_DECK',
    description: 'Master the fundamentals of flight deck operations including flight planning, aircraft handling, and complete flight operations procedures.',
    icon: 'plane',
    progress: 65,
    status: 'in-progress',
    modules: [
      {
        id: 'fd-m1',
        title: 'Flight Plan Preparation',
        description: 'Learn to file and read complete flight plans.',
        lessons: [
          { id: 'fd-l1', title: 'Flight Plan Basics', type: 'reading', duration: '15 min', content: 'After the briefing, file a flight plan with the flight operator. A flight plan records upcoming flight details for a smoother flight. Components include callsign, aircraft, departure, arrival, route, flight level, and runway.' },
          { id: 'fd-l2', title: 'Flight Plan Example', type: 'reading', duration: '20 min', content: '- Callsign: LX001\n- Aircraft: A320\n- Departure: HAN\n- Arrival: SGN\n- Route: GPS Direct\n- Flight Level: 030\n- Runway: IRFD 25L ITKO 31' },
          { id: 'fd-l3', title: 'Flight Plan Quiz', type: 'quiz', duration: '10 min' }
        ]
      },
      {
        id: 'fd-m2',
        title: 'Aircraft Pre-Flight Inspection',
        description: 'Conduct walkaround inspections of critical aircraft components.',
        lessons: [
          { id: 'fd-l4', title: 'Walkaround Procedure', type: 'video', duration: '12 min', content: 'Inspect landing gear, engines, underside of wings, wingtips, and other crucial areas.' },
          { id: 'fd-l5', title: 'Cockpit Checks', type: 'reading', duration: '18 min', content: 'Verify all instruments, switches, and flight controls are functional before departure.' }
        ]
      },
      {
        id: 'fd-m3',
        title: 'Pushback and Taxi',
        description: 'Execute proper pushback procedures and taxi operations.',
        lessons: [
          { id: 'fd-l6', title: 'Pushback Procedures', type: 'reading', duration: '10 min', content: 'Provide ground crew with pushback direction. Do NOT start engines while connected to the pushback tug due to a PTFS bug. Wait for ground crew to finish pushback.' },
          { id: 'fd-l7', title: 'Taxi Chart Navigation', type: 'reading', duration: '15 min', content: 'Recommended taxi speed is 10-20 knots. Check the taxi chart for your planned route. Stay on centerline.' }
        ]
      },
      {
        id: 'fd-m4',
        title: 'Takeoff and Climb',
        description: 'Execute proper takeoff procedures and climb management.',
        lessons: [
          { id: 'fd-l8', title: 'Takeoff Procedures', type: 'video', duration: '20 min', content: 'Set throttle to 80%, take off smoothly, do not pitch excessively. Stay in gear until 200 ft to deploy gear.' },
          { id: 'fd-l9', title: 'Climb Management', type: 'reading', duration: '15 min', content: 'Retract flaps at 200 kts. Keep speed under 250 kts until cruising altitude. Set speed around 85-95 percent at cruise.' }
        ]
      },
      {
        id: 'fd-m5',
        title: 'Cruise Phase',
        description: 'Manage aircraft during cruise flight.',
        lessons: [
          { id: 'fd-l10', title: 'Cruise Operations', type: 'reading', duration: '15 min', content: 'Press R to hold altitude. Press F halfway through route for cruise mode. Stay within ±50 feet of assigned altitude.' },
          { id: 'fd-l11', title: 'Communication Protocols', type: 'reading', duration: '10 min', content: 'Notify cabin crew for meal service when cruise mode is enabled.' }
        ]
      },
      {
        id: 'fd-m6',
        title: 'Descent and Approach',
        description: 'Execute proper descent procedures and approach management.',
        lessons: [
          { id: 'fd-l12', title: 'Descent Planning', type: 'reading', duration: '12 min', content: 'Keep descent rate realistic. Do NOT pitch down to reach runway. If too high, fly circular descent or go-around.' },
          { id: 'fd-l13', title: 'Approach Procedures', type: 'video', duration: '18 min', content: 'Use PAPI lights for approach guidance. Deploy landing gear at 1,000 feet.' }
        ]
      },
      {
        id: 'fd-m7',
        title: 'Landing Operations',
        description: 'Execute proper landing techniques and post-landing procedures.',
        lessons: [
          { id: 'fd-l14', title: 'Landing Techniques', type: 'video', duration: '20 min', content: 'Touch down within touchdown zone. Use PAPI lights. Lower nose wheel normally after touchdown.' },
          { id: 'fd-l15', title: 'Post-Landing Procedures', type: 'reading', duration: '10 min', content: 'Apply reverse thrust at 40% throttle. Switch to taxi thrust at 60 knots. Exit runway at max 30 kts. Retract flaps after reaching taxiway.' }
        ]
      },
      {
        id: 'fd-m8',
        title: 'Final Assessment',
        description: 'Complete written and practical evaluations.',
        lessons: [
          { id: 'fd-l16', title: 'Written Exam', type: 'quiz', duration: '30 min', content: 'Comprehensive multiple-choice exam. Pass score: 70%.' },
          { id: 'fd-l17', title: 'Practical Evaluation', type: 'quiz', duration: '45 min', content: 'Stage 2 practical evaluation. Pass score: 80% (48 of 60 points).' }
        ]
      }
    ]
  },
  {
    id: 'cc-core',
    title: 'Cabin Crew Fundamentals',
    department: 'CABIN_CREW',
    description: 'Learn essential cabin crew procedures including check-in, boarding, in-flight service, and safety protocols.',
    icon: 'users',
    progress: 42,
    status: 'in-progress',
    modules: [
      {
        id: 'cc-m1',
        title: 'Check-In Procedures',
        description: 'Master check-in desk operations and boarding pass issuance.',
        lessons: [
          { id: 'cc-l1', title: 'Check-In Process', type: 'reading', duration: '15 min', content: 'Ask passenger: destination, identification, class, boarding pass type (digital or printed), luggage. Give brief flight overview. Play PA announcement before starting.' },
          { id: 'cc-l2', title: 'Document Verification', type: 'reading', duration: '10 min', content: 'Verify passport and travel documents. Check passenger role before issuing boarding pass.' }
        ]
      },
      {
        id: 'cc-m2',
        title: 'Boarding Procedures',
        description: 'Handle gate boarding and document verification.',
        lessons: [
          { id: 'cc-l3', title: 'Gate Boarding', type: 'reading', duration: '12 min', content: 'Check all boarding passes. For international flights, also ask for passport. Be professional and formal.' },
          { id: 'cc-l4', title: 'Bus Boarding', type: 'reading', duration: '10 min', content: 'Assist passengers arriving via bus transport to the aircraft.' }
        ]
      },
      {
        id: 'cc-m3',
        title: 'In-Flight Service',
        description: 'Deliver premium service and announcements during flight.',
        lessons: [
          { id: 'cc-l5', title: 'Service Standards', type: 'reading', duration: '15 min', content: 'Ask passengers what they want to eat or drink. Serve orders promptly. Ask if they need anything else after serving.' },
          { id: 'cc-l6', title: 'Special Meal Requests', type: 'reading', duration: '10 min', content: 'Handle special dietary requests and meal preferences with attention to detail.' }
        ]
      },
      {
        id: 'cc-m4',
        title: 'Safety Procedures',
        description: 'Conduct safety demonstrations and handle emergencies.',
        lessons: [
          { id: 'cc-l7', title: 'Safety Demonstrations', type: 'video', duration: '20 min', content: 'Play safety PA before pushback. Ensure seatbelts fastened, tray tables stowed, window shades open.' },
          { id: 'cc-l8', title: 'Emergency Protocols', type: 'reading', duration: '25 min', content: 'Handle disruptive passengers calmly. Notify flight dispatcher. Follow passenger removal procedures if escalated.' }
        ]
      },
      {
        id: 'cc-m5',
        title: 'Final Assessment',
        description: 'Complete written and practical evaluations.',
        lessons: [
          { id: 'cc-l9', title: 'Written Exam', type: 'quiz', duration: '30 min', content: 'Comprehensive written exam. Pass score: 70%.' },
          { id: 'cc-l10', title: 'Practical Evaluation', type: 'quiz', duration: '40 min', content: 'Stage 2 practical evaluation. Pass score: 44 of 55 points.' }
        ]
      }
    ]
  },
  {
    id: 'gc-core',
    title: 'Ground Crew Operations',
    description: 'Master ground handling procedures including airport setup, aircraft positioning, and vehicle operations.',
    department: 'GROUND_CREW',
    icon: 'truck',
    progress: 28,
    status: 'in-progress',
    modules: [
      {
        id: 'gc-m1',
        title: 'Airport Setup',
        description: 'Learn to set up departure and arrival airports with correct airline zones.',
        lessons: [
          { id: 'gc-l1', title: 'Departure Airport Setup', type: 'reading', duration: '15 min', content: 'Use real-world airport location and FlightRadar24 data. Set up one zone for home airline based on country. Track airlines and aircraft operating at the airport.' },
          { id: 'gc-l2', title: 'Destination Airport Setup', type: 'reading', duration: '15 min', content: 'Same as origin setup. Leave vacant gate and bring up ground crew vehicles. Start after plane takes off.' }
        ]
      },
      {
        id: 'gc-m2',
        title: 'Vehicle Operations',
        description: 'Position and operate ground support vehicles correctly.',
        lessons: [
          { id: 'gc-l3', title: 'Ground Vehicles', type: 'reading', duration: '20 min', content: 'Learn each vehicle type: baggage truck, catering truck, stair truck, fuel truck, terminal bus, pushback tug. Understand when to use, where to place, and frequency.' },
          { id: 'gc-l4', title: 'Vehicle Placement', type: 'video', duration: '15 min', content: 'Place vehicles according to aircraft type. Widebodies need additional vehicles at front and back doors.' }
        ]
      },
      {
        id: 'gc-m3',
        title: 'Cone Placement',
        description: 'Master cone placement patterns for all aircraft types.',
        lessons: [
          { id: 'gc-l5', title: 'Cone Standards', type: 'reading', duration: '15 min', content: 'Cones mark zones aircraft and personnel should not enter. Place in prep time, remove before departure. Only place when engines are stopped.' },
          { id: 'gc-l6', title: 'Placement Patterns', type: 'reading', duration: '20 min', content: 'B777 requires 6 cones. B787 requires 6 vehicles at the gate. Follow visual reference patterns.' }
        ]
      },
      {
        id: 'gc-m4',
        title: 'Pushback Procedures',
        description: 'Execute proper pushback with tug positioning and connection.',
        lessons: [
          { id: 'gc-l7', title: 'Pushback Setup', type: 'reading', duration: '12 min', content: 'Position tug at front of aircraft, heading same direction. Ensure all cones and vehicles are removed first.' },
          { id: 'gc-l8', title: 'Pushback Execution', type: 'video', duration: '18 min', content: 'Ask pilot for tail heading. Align front gear with taxi line. Do not turn too soon. Disconnect after pushback complete.' }
        ]
      },
      {
        id: 'gc-m5',
        title: 'Final Assessment',
        description: 'Complete written and practical evaluations.',
        lessons: [
          { id: 'gc-l9', title: 'Written Exam', type: 'quiz', duration: '30 min', content: 'Comprehensive written exam. Pass score: 70%.' },
          { id: 'gc-l10', title: 'Practical Evaluation', type: 'quiz', duration: '35 min', content: 'Stage 2 practical evaluation. Pass score: 40 of 50 points.' }
        ]
      }
    ]
  },
]
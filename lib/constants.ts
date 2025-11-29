// Mock data for the application
export const INITIAL_USERS = {
  student: {
    id: "s1",
    name: "Aarav Sharma",
    role: "Student",
    department: "Computer Science",
    year: "3rd Year",
    avatar: "AS",
    points: 135,
    badges: ["Event Explorer", "Community Helper"],
    rank: 12,
    notificationToken: "token_s1",
  },
  faculty: {
    id: "f1",
    name: "Dr. Priya Verma",
    role: "Faculty",
    department: "Information Tech",
    avatar: "PV",
    notificationToken: "token_f1",
  },
  admin: {
    id: "a1",
    name: "Admin Controller",
    role: "Admin",
    department: "Management",
    avatar: "AD",
    notificationToken: "token_a1",
  },
}

export const INITIAL_EVENTS = [
  {
    id: 101,
    title: "Data Structures Lecture",
    time: "10:00 AM - 11:00 AM",
    type: "class",
    location: "Room 302",
    date: "Today",
    description: "Regular lecture",
    createdBy: "admin",
    status: "upcoming",
  },
  {
    id: 102,
    title: "Hackathon Kickoff",
    time: "12:00 PM - 01:00 PM",
    type: "event",
    location: "Auditorium",
    date: "Today",
    description: "24hr hackathon start",
    createdBy: "f1",
    status: "upcoming",
  },
]

export const INITIAL_BOOKS = [
  { id: "b1", title: "Introduction to Algorithms", author: "Cormen", qty: 5, image: "📚" },
  { id: "b2", title: "Clean Code", author: "Robert C. Martin", qty: 3, image: "💻" },
  { id: "b3", title: "Artificial Intelligence: A Modern Approach", author: "Russell & Norvig", qty: 4, image: "🤖" },
  { id: "b4", title: "Design Patterns", author: "Erich Gamma", qty: 2, image: "📐" },
  { id: "b5", title: "The Pragmatic Programmer", author: "Andrew Hunt", qty: 5, image: "🛠" },
]

export const INITIAL_LAB_EQUIPMENT = [
  {
    id: "l1",
    name: "3D Printer (Prusa i3)",
    location: "Fab Lab",
    slots: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    bookedSlots: ["10:00"],
  },
  {
    id: "l2",
    name: "MacBook Pro M2 (Dev Unit)",
    location: "iOS Lab",
    slots: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"],
    bookedSlots: [],
  },
  {
    id: "l3",
    name: "VR Headset (Oculus Quest)",
    location: "AR/VR Lab",
    slots: ["10:00", "11:00", "14:00"],
    bookedSlots: ["14:00"],
  },
]

export const INITIAL_STUDY_ROOMS = [
  { id: "sr1", name: "Quiet Zone A", capacity: 20, bookedSeats: [1, 2, 5, 8, 9] },
  { id: "sr2", name: "Group Discussion B", capacity: 12, bookedSeats: [1, 2, 3] },
]

export const INITIAL_HALLS = [
  { id: "ch1", name: "Main Auditorium", capacity: 500, features: ["Projector", "Sound System", "AC"] },
  { id: "ch2", name: "Seminar Hall B", capacity: 100, features: ["Projector", "Whiteboard"] },
]

export const INITIAL_POSTS = [
  {
    id: 1,
    author: "Dr. Priya Verma",
    role: "Faculty",
    content: "Reminder: The internal assessment for DBMS is scheduled for next Monday.",
    likes: 12,
    comments: 4,
    time: "2h ago",
  },
  {
    id: 2,
    author: "Rohit Singh",
    role: "Student",
    content: "Looking for 2 teammates for the Smart India Hackathon. MERN stack preferred!",
    likes: 24,
    comments: 8,
    time: "4h ago",
  },
]

export const INITIAL_CONNECT_POSTS = [
  {
    id: 1,
    type: "hiring",
    title: "Need Frontend Dev",
    author: "Rohan Das",
    description: "Looking for a React developer for the upcoming Hackathon.",
    skills: ["React", "Tailwind"],
    contact: "rohan@svvv.edu.in",
  },
  {
    id: 2,
    type: "volunteering",
    title: "Tech Fest Volunteers",
    author: "Event Committee",
    description: "Need 5 volunteers for crowd management at the main auditorium.",
    skills: ["Management", "Communication"],
    contact: "events@svvv.edu.in",
  },
]

export const INITIAL_REQUESTS = [
  {
    requestId: "r1",
    title: "AI Workshop",
    description: "A 2-hour workshop on Generative AI basics.",
    eventType: "Workshop",
    proposedDate: "Tomorrow",
    proposedTime: "02:00 PM - 04:00 PM",
    location: "Lab 2",
    expectedAttendees: 40,
    budget: "5000",
    requesterId: "s1",
    requesterName: "Aarav Sharma",
    department: "Computer Science",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
]

export const BADGES = [
  { id: "b1", name: "Event Explorer", icon: "🎫", description: "Attend 5 events", earned: true },
  { id: "b2", name: "Lab Legend", icon: "🔬", description: "10 hours in lab", earned: false, progress: "7/10" },
  { id: "b3", name: "Community Helper", icon: "🤝", description: "10 replies in forum", earned: true },
  {
    id: "b4",
    name: "Power User",
    icon: "⚡",
    description: "Logged in 7 days consecutively",
    earned: false,
    progress: "5/7",
  },
]

export const REWARDS = [
  {
    id: "rew1",
    title: "+2 Internal Marks",
    cost: 100,
    type: "academic",
    description: "Boost your internal assessment score.",
  },
  { id: "rew2", title: "Tech Fest Pass", cost: 120, type: "event", description: "Free entry to the annual Tech Fest." },
  { id: "rew3", title: "Lab Priority Slot", cost: 80, type: "resource", description: "Book labs without waiting." },
  { id: "rew4", title: "Hostel WiFi Boost", cost: 50, type: "utility", description: "High-speed data for 24 hours." },
]

export const LEADERBOARD = [
  { rank: 1, name: "Riya Sharma", points: 560, avatar: "RS", dept: "CSE" },
  { rank: 2, name: "Arjun Patel", points: 535, avatar: "AP", dept: "IT" },
  { rank: 3, name: "Neha Gupta", points: 490, avatar: "NG", dept: "CSE" },
  { rank: 12, name: "You", points: 135, avatar: "AS", dept: "CSE", isUser: true },
]

export const INITIAL_REDEMPTIONS = [
  {
    id: "red1",
    item: "Hostel WiFi Boost",
    cost: 50,
    status: "approved",
    date: "2 days ago",
    studentName: "Aarav Sharma",
  },
  {
    id: "red2",
    item: "+2 Internal Marks",
    cost: 100,
    status: "pending",
    date: "Just now",
    studentName: "Aarav Sharma",
  },
]

export interface User {
  id: string
  name: string
  role: "Student" | "Faculty" | "Admin"
  department: string
  avatar: string
  points?: number
  badges?: string[]
  rank?: number
  year?: string
}

export interface Event {
  id: number
  title: string
  time: string
  type: string
  location: string
  date: string
  description: string
  createdBy: string
  status: "upcoming" | "ongoing" | "completed"
}

export interface Book {
  id: string
  title: string
  author: string
  qty: number
  image: string
}

export interface Equipment {
  id: string
  name: string
  location: string
  slots: string[]
  bookedSlots: string[]
}

export interface StudyRoom {
  id: string
  name: string
  capacity: number
  bookedSeats: number[]
}

export interface Post {
  id: number
  author: string
  role: string
  content: string
  likes: number
  comments: number
  time: string
}

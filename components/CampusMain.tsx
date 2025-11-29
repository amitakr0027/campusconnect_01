"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Calendar,
  BookOpen,
  Users,
  Bell,
  Menu,
  X,
  Search,
  MessageSquare,
  Clock,
  MapPin,
  LogOut,
  CheckCircle,
  Award,
  CheckSquare,
  XCircle,
  PlusCircle,
  Trophy,
  Gift,
  TrendingUp,
  Zap,
  QrCode,
  Tag,
  Monitor,
} from "lucide-react"
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext" // Changed from useAuthContext
import {
  INITIAL_EVENTS,
  INITIAL_BOOKS,
  INITIAL_LAB_EQUIPMENT,
  INITIAL_STUDY_ROOMS,
  INITIAL_HALLS,
  INITIAL_POSTS,
  INITIAL_CONNECT_POSTS,
  INITIAL_REQUESTS,
  REWARDS,
  LEADERBOARD,
  INITIAL_REDEMPTIONS,
} from "@/lib/constants"

interface Post {
  id: number
  author: string
  role: string
  content: string
  likes: number
  comments: number
  time: string
}

interface ConnectPost {
  id: number
  type: string
  title: string
  author: string
  description: string
  skills: string[]
  contact: string
}

interface Request {
  requestId: string
  title: string
  description?: string
  eventType: string
  proposedDate: string
  proposedTime: string
  location: string
  expectedAttendees?: string | number
  budget?: string
  requesterId: string
  requesterName: string
  department: string
  status: string
  createdAt: string
}

interface ResourceRequest {
  id: string
  type: string
  itemName: string
  itemId?: string
  slot?: string
  roomId?: string
  seatNum?: number
  requesterName: string
  status: string
  timestamp: string
  reason?: string
  date?: string
}

const Notification = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-bounce z-50 max-w-sm">
    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
      <X className="w-4 h-4" />
    </button>
  </div>
)

export default function CampusMain({ currentUser }: { currentUser: any }) {
  const { logout } = useFirebaseAuth() // Changed from useAuthContext
  const [activeTab, setActiveTab] = useState("home")
  const [darkMode, setDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState("list")
  const [showQR, setShowQR] = useState(false)

  // State management
  const [books, setBooks] = useState(INITIAL_BOOKS)
  const [equipment, setEquipment] = useState(INITIAL_LAB_EQUIPMENT)
  const [rooms, setRooms] = useState(INITIAL_STUDY_ROOMS)
  const [halls, setHalls] = useState(INITIAL_HALLS)
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [connectPosts, setConnectPosts] = useState<ConnectPost[]>(INITIAL_CONNECT_POSTS)
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS)
  const [resourceRequests, setResourceRequests] = useState<ResourceRequest[]>([])
  const [redemptions, setRedemptions] = useState(INITIAL_REDEMPTIONS)
  const [resCategory, setResCategory] = useState("library")

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

  const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const text = formData.get("postContent") as string
    if (!text) return

    const newPost: Post = {
      id: Date.now(),
      author: currentUser?.displayName || "User", // Use currentUser
      role: currentUser?.role || "Student", // Assuming role is available in currentUser
      content: text,
      likes: 0,
      comments: 0,
      time: "Just now",
    }
    setPosts([newPost, ...posts])
    e.currentTarget.reset()
    showNotification("Post shared with campus!")
  }

  const handleConnectPostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newPost: ConnectPost = {
      id: Date.now(),
      type: formData.get("type") as string,
      title: formData.get("title") as string,
      author: currentUser?.displayName || "User", // Use currentUser
      description: formData.get("description") as string,
      skills: (formData.get("skills") as string).split(",").map((s) => s.trim()),
      contact: formData.get("contact") as string,
    }
    setConnectPosts([newPost, ...connectPosts])
    e.currentTarget.reset()
    setViewMode("list")
    showNotification("Opportunity posted to Connect Hub!")
  }

  const handleResourceRequest = (type: string, details: any) => {
    const newReq: ResourceRequest = {
      id: `res_req_${Date.now()}`,
      type,
      ...details,
      requesterName: currentUser?.displayName || "User", // Use currentUser
      status: "pending",
      timestamp: new Date().toLocaleTimeString(),
    }
    setResourceRequests([newReq, ...resourceRequests])
    showNotification(`${type} request sent to faculty!`)
  }

  const handleApproveResource = (req: ResourceRequest) => {
    const updatedReqs = resourceRequests.map((r) => (r.id === req.id ? { ...r, status: "approved" } : r))
    setResourceRequests(updatedReqs)

    if (req.type === "Book") {
      const updatedBooks = books.map((b) => (b.id === req.itemId ? { ...b, qty: b.qty - 1 } : b))
      setBooks(updatedBooks)
    } else if (req.type === "Equipment") {
      const updatedEquip = equipment.map((e) =>
        e.id === req.itemId ? { ...e, bookedSlots: [...e.bookedSlots, req.slot || ""] } : e,
      )
      setEquipment(updatedEquip)
    } else if (req.type === "Seat") {
      const updatedRooms = rooms.map((r) =>
        r.id === req.roomId ? { ...r, bookedSeats: [...r.bookedSeats, req.seatNum || 0] } : r,
      )
      setRooms(updatedRooms)
    }
    showNotification(`${req.type} request approved successfully.`)
  }

  const handleApproveRequest = (req: Request) => {
    const updatedRequests = requests.map((r) => (r.requestId === req.requestId ? { ...r, status: "approved" } : r))
    setRequests(updatedRequests)

    const newEvent = {
      id: Date.now(),
      title: req.title,
      description: req.description || "",
      time: req.proposedTime,
      date: req.proposedDate,
      location: req.location,
      type: req.eventType,
      createdBy: req.requesterId,
      status: "upcoming" as const,
    }
    setEvents([...events, newEvent])
    showNotification(`Request "${req.title}" approved & published!`)
  }

  const handleRedeem = (reward: any) => {
    if (!currentUser || currentUser.points === undefined) return // Use currentUser
    if (currentUser.points < reward.cost) {
      showNotification("Not enough points!")
      return
    }

    const newPoints = currentUser.points - reward.cost
    // Assuming updateUser exists in FirebaseAuthContext or you have a way to update currentUser
    // For now, we'll simulate an update if no updateUser function is provided
    // If you have a context with updateUser, uncomment the line below and adapt if needed
    // updateUser({ points: newPoints });

    // Simulate update if updateUser is not available
    currentUser.points = newPoints // This won't persist across re-renders without proper state management

    const newRedemption = {
      id: `red${Date.now()}`,
      item: reward.title,
      cost: reward.cost,
      status: "pending",
      date: "Just now",
      studentName: currentUser.displayName, // Use currentUser
    }
    setRedemptions([newRedemption, ...redemptions])
    showNotification(`Redeemed ${reward.title}! Pending approval.`)
  }

  // Use currentUser instead of user from AuthContext
  if (!currentUser) return null

  const QRModal = () => (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => setShowQR(false)}
    >
      <div
        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 dark:text-white">{currentUser.displayName}</h3> {/* Use currentUser */}
        <div className="bg-white p-4 rounded-xl inline-block mb-4 border-2 border-indigo-100">
          <QrCode className="w-48 h-48 text-gray-900" />
        </div>
        <p className="text-gray-500 text-sm">Scan at events to earn points automatically!</p>
        <button onClick={() => setShowQR(false)} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg w-full">
          Close
        </button>
      </div>
    </div>
  )

  const EventForm = ({
    onSubmit,
    mode = "request",
    onCancel,
  }: { onSubmit: (data: any) => void; mode?: string; onCancel: () => void }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {mode === "direct" ? "Create New Event" : "Submit Event Request"}
        </h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const data = {
            title: formData.get("title"),
            eventType: formData.get("eventType"),
            proposedDate: formData.get("date"),
            proposedTime: formData.get("time"),
            location: formData.get("location"),
            expectedAttendees: formData.get("attendees"),
            budget: formData.get("budget"),
            description: formData.get("description"),
          }
          onSubmit(data)
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            required
            name="title"
            className="w-full rounded-lg border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2.5 border"
            placeholder="Event Title"
          />
          <select
            name="eventType"
            className="w-full rounded-lg border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2.5 border"
          >
            <option>Academic</option>
            <option>Social</option>
            <option>Hackathon</option>
          </select>
          <input
            required
            name="date"
            className="w-full rounded-lg border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2.5 border"
            placeholder="Date"
          />
          <input
            required
            name="time"
            className="w-full rounded-lg border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2.5 border"
            placeholder="Time"
          />
          <input
            required
            name="location"
            className="w-full rounded-lg border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2.5 border"
            placeholder="Location"
          />
          <input
            name="attendees"
            className="w-full rounded-lg border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2.5 border"
            placeholder="Est. count"
          />
        </div>
        <textarea
          required
          name="description"
          rows={3}
          className="w-full rounded-lg border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white p-2.5 border"
          placeholder="Description..."
        ></textarea>
        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )

  const ResourcesView = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Resource Booking</h2>
        <div className="flex gap-2 bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
          {["library", "lab", "rooms", "hall"].map((cat) => (
            <button
              key={cat}
              onClick={() => setResCategory(cat)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                resCategory === cat
                  ? "bg-white dark:bg-slate-600 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Library */}
      {resCategory === "library" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 flex flex-col"
            >
              <div className="text-4xl mb-4">{book.image}</div>
              <h3 className="font-bold text-gray-800 dark:text-white line-clamp-1">{book.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{book.author}</p>
              <div className="mt-auto flex justify-between items-center">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${book.qty > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {book.qty > 0 ? `${book.qty} Available` : "Out of Stock"}
                </span>
                <button
                  onClick={() => handleResourceRequest("Book", { itemName: book.title, itemId: book.id })}
                  disabled={book.qty === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${book.qty > 0 ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lab Equipment */}
      {resCategory === "lab" && (
        <div className="space-y-6">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                  <Monitor className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> {item.location}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {item.slots.map((slot) => {
                  const isBooked = item.bookedSlots.includes(slot)
                  return (
                    <button
                      key={slot}
                      disabled={isBooked}
                      onClick={() => handleResourceRequest("Equipment", { itemName: item.name, itemId: item.id, slot })}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        isBooked
                          ? "bg-red-50 border-red-100 text-red-400 cursor-not-allowed"
                          : "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-indigo-500 hover:text-indigo-600"
                      }`}
                    >
                      {slot} {isBooked ? "(Busy)" : ""}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study Rooms */}
      {resCategory === "rooms" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white">{room.name}</h3>
                <span className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                  {room.bookedSeats.length}/{room.capacity} Occupied
                </span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: room.capacity }).map((_, idx) => {
                  const seatNum = idx + 1
                  const isBooked = room.bookedSeats.includes(seatNum)
                  return (
                    <button
                      key={seatNum}
                      disabled={isBooked}
                      onClick={() => handleResourceRequest("Seat", { itemName: room.name, roomId: room.id, seatNum })}
                      className={`h-10 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                        isBooked
                          ? "bg-red-500 text-white cursor-not-allowed"
                          : "bg-green-100 text-green-700 hover:bg-green-500 hover:text-white"
                      }`}
                    >
                      {seatNum}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Halls */}
      {resCategory === "hall" && (
        <div className="space-y-6">
          {halls.map((hall) => (
            <div
              key={hall.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row"
            >
              <div className="bg-gray-100 dark:bg-slate-700 w-full md:w-1/3 flex items-center justify-center p-8">
                <Monitor className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{hall.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">
                    Capacity: {hall.capacity}
                  </span>
                  {hall.features.map((f) => (
                    <span key={f} className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const ConnectHubView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-500" /> Connect Hub
          </h2>
          <p className="text-gray-500 text-sm mt-1">Find teammates, hire talent, or volunteer.</p>
        </div>
        {viewMode === "list" && (
          <button
            onClick={() => setViewMode("create")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Post Opportunity
          </button>
        )}
      </div>

      {viewMode === "create" ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold mb-4 dark:text-white">Create New Post</h3>
          <form onSubmit={handleConnectPostSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
                <select
                  name="type"
                  className="w-full p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="hiring">Hiring / Teammates</option>
                  <option value="volunteering">Volunteering</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
                <input
                  required
                  name="title"
                  className="w-full p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="e.g. Need Designer for Hackathon"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
              <textarea
                required
                name="description"
                rows={3}
                className="w-full p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Role details, event date, etc."
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Skills / Tags (comma separated)
                </label>
                <input
                  required
                  name="skills"
                  className="w-full p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="React, Figma, Speaking"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Contact Info</label>
                <input
                  required
                  name="contact"
                  className="w-full p-2.5 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Email or Phone"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Post
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div
                  className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${post.type === "hiring" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                >
                  {post.type}
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{post.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{post.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs flex items-center"
                  >
                    <Tag className="w-3 h-3 mr-1" /> {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                    {post.author.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-500">{post.author}</span>
                </div>
                <button className="text-sm font-medium text-indigo-600 hover:underline">Contact</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const GamificationView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-medium opacity-90">Campus Points</h3>
            <div className="text-4xl font-bold mt-2 flex items-baseline gap-2">
              {currentUser.points || 0} <span className="text-sm font-normal opacity-75">pts</span>{" "}
              {/* Use currentUser */}
            </div>
            <button
              onClick={() => setShowQR(true)}
              className="mt-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition-colors backdrop-blur-sm"
            >
              <QrCode className="w-4 h-4" /> Show ID to Earn
            </button>
          </div>
          <Trophy className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white opacity-20 rotate-12" />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-gray-500 text-sm font-medium">Current Rank</h3>
          <div className="text-3xl font-bold text-gray-800 dark:text-white mt-1">#{currentUser.rank || 1}</div>{" "}
          {/* Use currentUser */}
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-indigo-200 text-sm font-bold uppercase">
            <Zap className="w-4 h-4" /> AI Suggestion
          </div>
          <p className="font-medium">Complete your profile and book a lab slot today to earn your first badge!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-500" /> Rewards Store
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REWARDS.map((reward) => (
              <div
                key={reward.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">{reward.title}</h4>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                        reward.type === "academic"
                          ? "bg-blue-100 text-blue-700"
                          : reward.type === "event"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {reward.type}
                    </span>
                  </div>
                  <div className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-sm">
                    {reward.cost} pts
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4 h-10">{reward.description}</p>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={(currentUser.points || 0) < reward.cost} // Use currentUser
                  className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
                    (currentUser.points || 0) >= reward.cost // Use currentUser
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {(currentUser.points || 0) >= reward.cost ? "Redeem Now" : "Need more points"} {/* Use currentUser */}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" /> Leaderboard
            </h3>
            <div className="space-y-3">
              {LEADERBOARD.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 flex items-center justify-center font-bold text-sm rounded-full ${idx < 3 ? "bg-yellow-100 text-yellow-700" : "text-gray-400"}`}
                    >
                      {entry.rank}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {entry.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{entry.name}</p>
                      <p className="text-[10px] text-gray-500">{entry.dept}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{entry.points}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-400" /> Redemption History
            </h3>
            <div className="space-y-4">
              {redemptions.map((red) => (
                <div key={red.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{red.item}</p>
                    <p className="text-xs text-gray-400">{red.date}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`block text-xs font-bold uppercase ${red.status === "approved" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {red.status}
                    </span>
                    <span className="text-xs text-gray-500">-{red.cost} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const FacultyApprovalView = () => {
    const [approvalTab, setApprovalTab] = useState("events")
    const [filter, setFilter] = useState("pending")

    const filteredRequests = requests.filter((r) => (filter === "all" ? true : r.status === filter))
    const filteredResources = resourceRequests.filter((r) => (filter === "all" ? true : r.status === filter))

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Approvals</h2>
          <div className="flex gap-2 bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
            {["events", "resources"].map((tab) => (
              <button
                key={tab}
                onClick={() => setApprovalTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  approvalTab === tab
                    ? "bg-white dark:bg-slate-600 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {approvalTab === "events" && (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.requestId}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex justify-between"
              >
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">{req.title}</h4>
                  <p className="text-sm text-gray-500">
                    {req.requesterName} • {req.eventType}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${req.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                  >
                    {req.status}
                  </span>
                </div>
                {req.status === "pending" && (
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => handleApproveRequest(req)}
                      className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"
                    >
                      <CheckSquare className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {approvalTab === "resources" && (
          <div className="space-y-4">
            {filteredResources.map((resReq) => (
              <div
                key={resReq.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex justify-between items-start"
              >
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">{resReq.type} Request</h4>
                  <p className="font-medium text-sm mt-1">{resReq.itemName}</p>
                  <div className="text-xs text-gray-500 mt-1">Requester: {resReq.requesterName}</div>
                </div>
                {resReq.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveResource(resReq)}
                      className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700"
                    >
                      Accept
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Reject</button>
                  </div>
                ) : (
                  <span
                    className={`text-xs font-bold uppercase ${resReq.status === "approved" ? "text-green-600" : "text-red-600"}`}
                  >
                    {resReq.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const NavItem = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id)
        setViewMode("list")
        setIsSidebarOpen(false)
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id
          ? "bg-indigo-600 text-white shadow-md"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  )

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? "dark bg-slate-900" : "bg-gray-50"}`}>
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      {showQR && <QRModal />}

      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-slate-800 p-4 shadow-sm flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 dark:text-gray-300">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg text-indigo-600">CampusConnect</span>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL || "/placeholder.svg"} alt="Avatar" className="w-full h-full rounded-full" />
          ) : (
            currentUser?.displayName?.charAt(0)
          )}{" "}
          {/* Use currentUser for avatar */}
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-xl transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:shadow-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  Campus<span className="text-indigo-600">Connect</span>
                </h1>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
                <X />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              <NavItem id="home" icon={Users} label="Dashboard" />
              {currentUser?.role === "Student" && <NavItem id="gamification" icon={Trophy} label="Campus Rewards" />}{" "}
              {/* Use currentUser */}
              {(currentUser?.role === "Faculty" || currentUser?.role === "Admin") && ( // Use currentUser
                <NavItem id="approvals" icon={CheckSquare} label="Approvals" />
              )}
              <NavItem id="calendar" icon={Calendar} label="Schedule & Exams" />
              <NavItem id="resources" icon={BookOpen} label="Resource Booking" />
              <NavItem id="connect" icon={MessageSquare} label="Connect Hub" />
            </nav>

            <div className="pt-6 border-t border-gray-100 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-900 p-3 rounded-xl">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full p-1 flex transition-colors ${darkMode ? "bg-indigo-600 justify-end" : "bg-gray-300 justify-start"}`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>
              <button
                onClick={logout} // Use logout from FirebaseAuthContext
                className="flex items-center space-x-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <header className="hidden lg:flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {activeTab === "home" && "Dashboard"}
              {activeTab === "gamification" && "Campus Rewards & Points"}
              {activeTab === "approvals" && "Approvals"}
              {activeTab === "connect" && "Connect Hub"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white w-64"
                />
              </div>
              <button className="relative p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-700">
                <div className="text-right hidden xl:block">
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{currentUser?.displayName}</p>{" "}
                  {/* Use currentUser */}
                  <p className="text-xs text-gray-500">{currentUser?.department}</p>{" "}
                  {/* Assuming department is available */}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    currentUser?.displayName?.charAt(0)
                  )}{" "}
                  {/* Use currentUser for avatar */}
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-6xl">
            {activeTab === "home" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-1">Welcome back, {currentUser.displayName?.split(" ")[0]}!</h2>{" "}
                    {/* Use currentUser */}
                    <p className="opacity-90">Here is what's happening on campus today.</p>
                    {currentUser?.role === "Student" && ( // Use currentUser
                      <button
                        onClick={() => setActiveTab("gamification")}
                        className="mt-4 inline-flex items-center bg-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded-full backdrop-blur-sm"
                      >
                        <Award className="w-4 h-4 mr-2 text-yellow-300" />
                        <span className="font-semibold">{currentUser.points || 0} Campus Points</span>{" "}
                        {/* Use currentUser */}
                        <span className="ml-2 text-xs opacity-75">→ Redeem</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-slate-700">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" /> Campus Feed
                      </h3>
                      <form onSubmit={handlePostSubmit} className="mb-6">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {currentUser?.photoURL ? (
                              <img
                                src={currentUser.photoURL || "/placeholder.svg"}
                                alt="Avatar"
                                className="w-full h-full rounded-full"
                              />
                            ) : (
                              currentUser?.displayName?.charAt(0)
                            )}{" "}
                            {/* Use currentUser for avatar */}
                          </div>
                          <input
                            name="postContent"
                            type="text"
                            placeholder={`Share something, ${currentUser.displayName}...`} // Use currentUser
                            className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                          />
                        </div>
                      </form>
                      <div className="space-y-4">
                        {posts.map((post) => (
                          <div key={post.id} className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                            <p className="font-bold text-gray-800 dark:text-white text-sm mb-1">
                              {post.author}{" "}
                              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-normal ml-2">
                                {post.role}
                              </span>
                              <span className="font-normal text-gray-500 ml-1">• {post.time}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{post.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-slate-700">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-indigo-500" /> Upcoming
                    </h3>
                    {events.slice(0, 3).map((evt) => (
                      <div
                        key={evt.id}
                        className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg border-l-4 border-indigo-500 mb-2"
                      >
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{evt.title}</p>
                          <p className="text-xs text-gray-500">{evt.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "gamification" && currentUser?.role === "Student" && <GamificationView />}{" "}
            {/* Use currentUser */}
            {activeTab === "resources" && <ResourcesView />}
            {activeTab === "approvals" && (currentUser?.role === "Faculty" || currentUser?.role === "Admin") && (
              <FacultyApprovalView />
            )}{" "}
            {/* Use currentUser */}
            {activeTab === "connect" && <ConnectHubView />}
            {activeTab === "calendar" && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Academic Calendar</h2>
                <p className="text-gray-500">
                  Weekly schedule view coming soon. Check the dashboard for upcoming events.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

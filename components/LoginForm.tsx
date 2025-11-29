"use client"
import { BookOpen, Users, FileText, CheckCircle } from "lucide-react"
import { useAuthContext } from "@/contexts/AuthContext"

export default function LoginForm() {
  const { login } = useAuthContext()

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 transition-colors font-sans">
      {/* Left Side - Hero & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 opacity-30 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CampusConnect</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Your Campus Life, <br />
            <span className="text-indigo-200">Reimagined.</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-md leading-relaxed">
            One platform to manage classes, events, resources, and community. Connect with peers, book labs, and stay
            updated in real-time.
          </p>
        </div>
        <div className="relative z-10 text-sm text-indigo-200 font-medium">
          © 2025 Shri Vaishnav Vidyapeeth Vishwavidyalaya
        </div>
      </div>

      {/* Right Side - Login/Role Selection */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Select your portal to continue.</p>
          </div>

          <div className="space-y-4 mt-8">
            {[
              {
                id: "student" as const,
                label: "Student Portal",
                icon: Users,
                desc: "Manage schedule, events & grades",
                color: "indigo",
              },
              {
                id: "faculty" as const,
                label: "Faculty Portal",
                icon: FileText,
                desc: "Approve requests & class management",
                color: "emerald",
              },
              {
                id: "admin" as const,
                label: "Admin Portal",
                icon: CheckCircle,
                desc: "System oversight & resource control",
                color: "orange",
              },
            ].map((role) => {
              const Icon = role.icon
              return (
                <button
                  key={role.id}
                  onClick={() => login(role.id)}
                  className="group w-full flex items-center p-4 bg-white dark:bg-slate-800 border-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-left"
                >
                  <div
                    className={`p-3 rounded-xl mr-4 transition-colors ${
                      role.id === "student"
                        ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                        : role.id === "faculty"
                          ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
                          : "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {role.label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{role.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

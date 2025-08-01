'use client'
import Link from "next/link"
import { Button } from "./ui/button";
import { Bell, User, Settings, LogOut, Trophy, Target, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { useAuthContext } from "@/contexts/auth-context";
import { ACHIEVEMENT } from "@/types/user";
import { useEffect, useState } from "react";

const achievementConfig = {
  [ACHIEVEMENT.BEGINNER]: {
    label: "Beginner",
    color: "text-gray-600",
    bgColor: "bg-gray-100"
  },
  [ACHIEVEMENT.INTERMEDIATE]: {
    label: "Intermediate",
    color: "text-gray-800",
    bgColor: "bg-gray-200"
  },
  [ACHIEVEMENT.EXPERT]: {
    label: "Expert",
    color: "text-white",
    bgColor: "bg-black"
  }
};

export default function UserAuth() {
  const [hydrated, setHydrated] = useState(false);
  const {
    isLoading,
    isAuthenticated,
    user,
    error,
    clearError,
    login,
    register,
    logout
  } = useAuthContext();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex justify-center mb-8">
        <div className="animate-pulse flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            onClick={login}
            className="cursor-pointer px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {isLoading ? (
              <>
              <Clock className="h-4 w-4 animate-spin" />
              Login...
              </>
            ) : (
              <>
              <User className="h-4 w-4 mr-2" />
              Login
              </>
            )}
          </Button>
          <Button
            onClick={register}
            variant="outline"
            className="cursor-pointer px-8 py-3 border-2 border-black text-black hover:bg-gray-50 rounded-lg font-medium transform hover:scale-105 transition-all duration-200"
          >
            Register
          </Button>
        </div>
      </div>
    )
  }

  const achievement = user?.achievement ? achievementConfig[user.achievement] : achievementConfig[ACHIEVEMENT.BEGINNER];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-6 px-6 py-4 bg-white rounded-xl shadow-lg border border-gray-200">
        {/* User Avatar & Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full border-2 border-white"></div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{user?.username}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${achievement.color} ${achievement.bgColor}`}>
                {achievement.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                <span>{user?.totalSubmissionPoint || 0} điểm</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {/* <Button variant="ghost" size="sm" className="cursor-pointer relative hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full"></div>
        </Button> */}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer p-2 hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2 border-b">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            {/* <DropdownMenuItem asChild>
              <Link href="/problems" className="cursor-pointer flex items-center gap-2">
                <Target className="h-4 w-4" />
                Saved Problems
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem> */}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer flex items-center gap-2 text-gray-800 hover:text-black focus:text-black hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
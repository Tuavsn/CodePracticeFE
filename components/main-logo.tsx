import { Zap } from "lucide-react";
import Link from "next/link";

export default function MainLogo() {
  return (
    <div className="mb-16 relative">
      <div className="relative flex items-center justify-center mb-12">
        <Link href={"/"}>
          <div className="flex items-center justify-center gap-6">
            <div className="relative p-6 bg-black rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-8xl md:text-9xl font-bold text-black mb-4 tracking-tight">
                CodeJudge
              </h1>
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <div className="w-8 h-px bg-gray-300"></div>
                <span className="text-sm font-medium tracking-widest uppercase">Elite Coding Platform</span>
                <div className="w-8 h-px bg-gray-300"></div>
              </div>
            </div>
          </div></Link>
      </div>
    </div>
  )
}
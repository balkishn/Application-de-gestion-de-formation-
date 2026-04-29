'use client'

import AuthenticationCard from "@/components/authentication-card"
import PublicFooter from "@/components/public-footer"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background via-[#0f2818] to-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-green-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute left-1/3 top-1/2 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div
        className="absolute right-20 top-20 h-40 w-40 rounded-3xl border-2 border-emerald-500/20 transform rotate-12 animate-float"
        style={{ animation: 'float 6s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-32 left-20 h-32 w-32 rounded-full border border-green-500/15 transform -rotate-6 animate-float"
        style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '1s' }}
      />

      <main className="relative z-50 flex flex-1 items-center justify-center px-4 py-8">
        <div className="flex w-full items-center justify-center">
          <AuthenticationCard />
        </div>
      </main>

      <div className="relative z-50 mt-auto">
        <PublicFooter />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  )
}

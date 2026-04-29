"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock } from "lucide-react"
import PublicFooter from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/lib/api"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordContent() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token") || ""
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      await authApi.resetPassword({ token, newPassword, confirmPassword })
      setMessage("Mot de passe reinitialise avec succes. Vous pouvez vous connecter.")
      setTimeout(() => router.push("/"), 1200)
    } catch (err: any) {
      setError(err?.message || "Echec de reinitialisation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-[#0f2818] to-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-green-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute left-1/3 top-1/2 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div
        className="absolute right-20 top-20 h-40 w-40 rounded-3xl border-2 border-emerald-500/20 transform rotate-12"
        style={{ animation: "float 6s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-32 left-20 h-32 w-32 rounded-full border border-green-500/15 transform -rotate-6"
        style={{ animation: "float 8s ease-in-out infinite", animationDelay: "1s" }}
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
        <div className="w-[450px] max-w-[450px]">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl" />
            <div className="relative space-y-6 rounded-3xl p-8">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-white">Reinitialiser le mot de passe</h2>
                <p className="text-white/70">Definissez et confirmez votre nouveau mot de passe.</p>
              </div>

              {error && <div className="rounded-lg border border-red-500/40 bg-red-500/15 p-3 text-sm text-red-200">{error}</div>}
              {message && <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 p-3 text-sm text-emerald-100">{message}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white/90">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Votre nouveau mot de passe"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white/90">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirmer le mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full border border-white/30 bg-white/20 text-white hover:bg-white/30 disabled:opacity-60"
                >
                  {loading ? "Traitement..." : "Valider"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />

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

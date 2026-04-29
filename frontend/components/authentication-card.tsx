"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/lib/api"
import { normalizeRole, setFirstLoginPending } from "@/lib/auth"

type Mode = "login" | "forgot"

export default function AuthenticationCard() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("login")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current)
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current)
      errorTimerRef.current = null
    }
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const data = await authApi.login(identifier.trim(), password)

      if (data.mustChangePassword) {
        setFirstLoginPending(identifier.trim(), password)
        router.push("/first-login")
        return
      }

      if (!data.token) {
        throw new Error("Session invalide")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)
      localStorage.setItem("username", data.username || "")
      localStorage.setItem("email", data.email || "")
      localStorage.setItem("userId", String(data.userId))

      const role = normalizeRole(data.role)
      if (role === "SIMPLE_UTILISATEUR") {
        router.push("/dashboard")
      } else {
        router.push("/admin")
      }
    } catch (err: any) {
      setError(err?.message || "Echec de connexion")
      errorTimerRef.current = setTimeout(() => {
        setError("")
        errorTimerRef.current = null
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      await authApi.forgotPassword(email.trim())
      setMessage("Si le compte existe, un email de reinitialisation a ete envoye.")
    } catch (err: any) {
      setError(err?.message || "Echec de la demande")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-[450px] max-w-[450px]">
      <div className="relative">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl" />
        <div className="relative p-8 rounded-3xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-white">Plateforme Formation</h1>
            <p className="text-white/70">
              {mode === "login" ? "Connexion par email ou login" : "Recuperation de mot de passe"}
            </p>
          </div>

          {error && <div className="rounded-lg border border-red-500/40 bg-red-500/15 p-3 text-sm text-red-200">{error}</div>}
          {message && <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 p-3 text-sm text-emerald-100">{message}</div>}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-white/90">Email ou Login</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="ex: user@mail.com ou monlogin"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Votre mot de passe"
                    required
                  />
                </div>
              </div>

              <div className="text-right">
                <button type="button" onClick={() => setMode("forgot")} className="text-white/70 hover:text-white text-sm">
                  Mot de passe oublie ?
                </button>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Votre adresse email"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                {loading ? "Envoi..." : "Envoyer le lien"}
              </Button>

              <button type="button" onClick={() => setMode("login")} className="w-full text-white/70 hover:text-white text-sm">
                Retour a la connexion
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

import { clearSession, getAuthToken } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081"

type ApiEnvelope<T> = {
  success: boolean
  message?: string
  data?: T
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const isAuthEndpoint = path.startsWith("/auth/")
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token && !isAuthEndpoint) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    })

    // Backend responses are wrapped in a common envelope, but some endpoints may
    // still return an empty body on success or failure, so JSON parsing must stay optional.
    let json: ApiEnvelope<T> | null = null
    try {
      json = await response.json()
    } catch {
      json = null
    }

    if (response.status === 401 && token && !isAuthEndpoint) {
      // Only redirect if user had a session token (session expired)
      // and request is NOT to auth endpoints (login, etc.)
      // On auth endpoints, 401 = wrong credentials, just show error
      clearSession()
      if (typeof window !== "undefined") {
        window.location.href = "/"
      }
      return (null as T)
    }

    if (!response.ok || (json && json.success === false)) {
      const message = json?.message || `Request failed with status ${response.status}`
      if (typeof window !== "undefined") {
        toast({
          title: "Erreur",
          description: message,
          variant: "destructive",
        })
      }
      throw new Error(message)
    }

    return (json?.data as T) ?? (null as T)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Une erreur est survenue"
    if (typeof window !== "undefined") {
      toast({
        title: "Erreur de connexion",
        description: message,
        variant: "destructive",
      })
    }
    throw error instanceof Error ? error : new Error(message)
  }
}

export const authApi = {
  login: (identifier: string, password: string) =>
    request<{ token: string | null; username: string | null; email: string; role: string; userId: number; mustChangePassword: boolean }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),
  completeFirstLogin: (payload: { identifier: string; currentPassword: string; login: string; newPassword: string; confirmPassword: string }) =>
    request<{ token: string; username: string; email: string; role: string; userId: number; mustChangePassword: boolean }>("/auth/complete-first-login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  forgotPassword: (email: string) =>
    request<string>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (payload: { token: string; newPassword: string; confirmPassword: string }) =>
    request<string>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
}

export const participantApi = {
  getAll: () => request<any[]>("/participants"),
  create: (payload: any) => request<any>("/participants", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => request<any>(`/participants/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/participants/${id}`, { method: "DELETE" }),
}

export const formationApi = {
  getAll: () => request<any[]>("/formations"),
  create: (payload: any) => request<any>("/formations", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => request<any>(`/formations/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/formations/${id}`, { method: "DELETE" }),
}

export const formateurApi = {
  getAll: () => request<any[]>("/formateurs"),
  create: (payload: any) => request<any>("/formateurs", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => request<any>(`/formateurs/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/formateurs/${id}`, { method: "DELETE" }),
}

export const domaineApi = {
  getAll: () => request<any[]>("/domaines"),
  create: (payload: any) => request<any>("/domaines", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => request<any>(`/domaines/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/domaines/${id}`, { method: "DELETE" }),
}

export const profilApi = {
  getAll: () => request<any[]>("/profils"),
  create: (payload: any) => request<any>("/profils", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => request<any>(`/profils/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/profils/${id}`, { method: "DELETE" }),
}

export const structureApi = {
  getAll: () => request<any[]>("/structures"),
  create: (payload: any) => request<any>("/structures", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => request<any>(`/structures/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/structures/${id}`, { method: "DELETE" }),
}

export const employeurApi = {
  getAll: () => request<any[]>("/employeurs"),
  create: (payload: any) => request<any>("/employeurs", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => request<any>(`/employeurs/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/employeurs/${id}`, { method: "DELETE" }),
}

export const utilisateurApi = {
  getAll: () => request<any[]>("/utilisateurs"),
  getRoles: () => request<any[]>("/utilisateurs/roles"),
  create: (payload: { email: string; roleId: number }) => request<any>("/utilisateurs", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => request<any>(`/utilisateurs/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => request<void>(`/utilisateurs/${id}`, { method: "DELETE" }),
}

export const statistiquesApi = {
  dashboardData: () => request<any>("/statistiques/dashboard-data"),
  overview: () => request<any>("/statistiques/overview"),
  formationsParDomaine: () => request<any[]>("/statistiques/formations-par-domaine"),
  formationsParAnnee: () => request<any[]>("/statistiques/formations-par-annee"),
  participantsParStructure: () => request<any[]>("/statistiques/participants-par-structure"),
}

export const notificationsApi = {
  getRecent: () => request<any[]>("/notifications/recent"),
}

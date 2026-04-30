export function normalizeRole(role?: string | null) {
  return (role || "").toUpperCase().replace(/\s+/g, "_")
}

export function getAuthToken() {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("token") || ""
}

export function getCurrentRole() {
  if (typeof window === "undefined") return ""
  return normalizeRole(localStorage.getItem("role"))
}

export function getCurrentUsername() {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("username") || ""
}

export function getCurrentEmail() {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("email") || ""
}

export function getCurrentUserId() {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("userId")
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isNaN(parsed) ? null : parsed
}

export function setFirstLoginPending(identifier: string, currentPassword: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("firstLoginIdentifier", identifier)
  localStorage.setItem("firstLoginPassword", currentPassword)
}

export function getFirstLoginPending() {
  if (typeof window === "undefined") {
    return { identifier: "", currentPassword: "" }
  }
  return {
    identifier: localStorage.getItem("firstLoginIdentifier") || "",
    currentPassword: localStorage.getItem("firstLoginPassword") || "",
  }
}

export function clearFirstLoginPending() {
  if (typeof window === "undefined") return
  localStorage.removeItem("firstLoginIdentifier")
  localStorage.removeItem("firstLoginPassword")
}

export function clearSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem("token")
  localStorage.removeItem("role")
  localStorage.removeItem("username")
  localStorage.removeItem("email")
  localStorage.removeItem("userId")
  clearFirstLoginPending()
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}

export function hasAnyRole(expectedRoles: string[]) {
  const current = getCurrentRole()
  const normalized = expectedRoles.map((r) => normalizeRole(r))
  return normalized.includes(current)
}

export function isAdminRole(role?: string | null) {
  return normalizeRole(role ?? getCurrentRole()) === "ADMINISTRATEUR"
}

export function isResponsableRole(role?: string | null) {
  return normalizeRole(role ?? getCurrentRole()) === "RESPONSABLE"
}

export function isSimpleUserRole(role?: string | null) {
  return normalizeRole(role ?? getCurrentRole()) === "SIMPLE_UTILISATEUR"
}

export function getDefaultHomeByRole(role?: string | null) {
  if (isAdminRole(role)) return "/admin"
  if (isResponsableRole(role)) return "/responsable"
  return "/dashboard"
}

export function canAccessAdminPath(pathname: string, role?: string | null) {
  const normalizedRole = normalizeRole(role ?? getCurrentRole())

  if (normalizedRole === "ADMINISTRATEUR") {
    return true
  }

  if (normalizedRole === "RESPONSABLE") {
    const adminOnlyPrefixes: any[] = []
    return !adminOnlyPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  }

  return false
}

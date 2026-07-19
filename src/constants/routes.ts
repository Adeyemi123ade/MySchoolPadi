export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",

  dashboard: "/dashboard",
  courses: "/courses",
  course: (id: string) => `/courses/${id}`,
  announcements: "/announcements",
  announcement: (id: string) => `/announcements/${id}`,
  notifications: "/notifications",
  bookmarks: "/bookmarks",
  profile: "/profile",
  settings: "/settings",
} as const;

export const PROTECTED_ROUTE_PREFIXES = [
  ROUTES.dashboard,
  ROUTES.courses,
  ROUTES.announcements,
  ROUTES.notifications,
  ROUTES.bookmarks,
  ROUTES.settings,
  ROUTES.profile,
] as const;

export const AUTH_ROUTE_PREFIXES = [ROUTES.login, ROUTES.register, ROUTES.forgotPassword] as const;

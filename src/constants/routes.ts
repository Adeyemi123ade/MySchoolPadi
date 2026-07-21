export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
  login: "/login",
  register: "/register",
  registerStudent: "/register/student",
  registerLecturer: "/register/lecturer",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  dashboard: "/dashboard",
  courses: "/courses",
  course: (id: string) => `/courses/${id}`,
  joinCourse: "/courses/join",
  announcements: "/announcements",
  announcement: (id: string) => `/announcements/${id}`,
  newAnnouncement: "/announcements/new",
  notifications: "/notifications",
  bookmarks: "/bookmarks",
  search: "/search",
  profile: "/profile",
  settings: "/settings",

  // Lecturer-only
  students: "/students",
  analytics: "/analytics",

  // Both roles (lecturer creates, student views)
  calendar: "/calendar",
  messages: "/messages",
} as const;

export const PROTECTED_ROUTE_PREFIXES = [
  ROUTES.dashboard,
  ROUTES.courses,
  ROUTES.announcements,
  ROUTES.notifications,
  ROUTES.bookmarks,
  ROUTES.search,
  ROUTES.settings,
  ROUTES.profile,
  ROUTES.students,
  ROUTES.analytics,
  ROUTES.calendar,
  ROUTES.messages,
] as const;

// Note: /reset-password is intentionally excluded from both lists below.
// A user lands there with a Supabase-issued recovery session (established
// client-side from the emailed link's URL fragment, which the server can't
// see on the very first request) and must be able to stay on the page while
// authenticated to submit their new password — unlike other auth routes,
// middleware must not redirect them away from it in either direction.
export const AUTH_ROUTE_PREFIXES = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.verifyEmail,
  ROUTES.forgotPassword,
] as const;

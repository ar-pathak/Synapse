import { createBrowserRouter } from "react-router"
import { lazy, Suspense } from "react"
import App from "./App"
import ErrorPage from "./components/error/ErrorPage"
import LoadingFallback from "./components/utils/LoadingFallback"
import PublicRoute from "./components/routes/PublicRoute"
import ProtectedRoute from "./components/routes/ProtectedRoute"
import ForgotPassword from "./components/auth/ForgotPassword"
import ResetPassword from "./components/auth/ResetPassword"


const AppLayout = lazy(() => import("./components/auth/AppLayout"))
const SignUp = lazy(() => import("./components/auth/SignUp"))
const SignIn = lazy(() => import("./components/auth/SignIn"))
const Profile = lazy(() => import("./components/pages/Profile"))
const Home = lazy(() => import("./components/pages/Home"))
const Feed = lazy(() => import("./components/pages/Feed"))
const Explore = lazy(() => import("./components/pages/Explore"))
const Settings = lazy(() => import("./components/pages/Settings"))
const VerifyEmail = lazy(() => import("./components/auth/VerifyEmail"))
const Notifications = lazy(() => import("./components/pages/Notifications"));
const Bookmarks = lazy(() => import("./components/pages/Bookmarks"));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <App />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <PublicRoute>
                            <Home />
                        </PublicRoute>
                    </Suspense>
                ),
            },
            {
                path: "auth",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <PublicRoute>
                            <AppLayout />
                        </PublicRoute>
                    </Suspense>
                ),
                children: [
                    {
                        path: "signin",
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <PublicRoute>
                                    <SignIn />
                                </PublicRoute>
                            </Suspense>
                        )
                    },
                    {
                        path: "signup",
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <PublicRoute>
                                    <SignUp />
                                </PublicRoute>
                            </Suspense>
                        )
                    },
                    {
                        path: "verify-email/:token",
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <PublicRoute>
                                    <VerifyEmail />
                                </PublicRoute>
                            </Suspense>
                        )
                    },
                    {
                        path: "forgot-password",
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <PublicRoute>
                                    <ForgotPassword />
                                </PublicRoute>
                            </Suspense>
                        )
                    },
                    {
                        path: "reset-password",
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <PublicRoute>
                                    <ResetPassword />
                                </PublicRoute>
                            </Suspense>
                        )
                    }
                ],
            },
            {
                path: "profile",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: "feed",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute>
                            <Feed />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: "explore",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute>
                            <Explore />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: "settings",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: "notifications",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: "bookmarks",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute>
                            <Bookmarks />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
        ]
    }
])

export default router
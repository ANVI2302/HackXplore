/*
PROJECT EON: DEEP SCIENCE ARCHITECTURE
SCALABILITY: Lazy Loading active.
*/

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from "@/components/ui/toaster"
import { Suspense, lazy } from 'react'
import { Loader } from '@/components/ui/loader'
// Lazy Load Pages for Performance
const Layout = lazy(() => import('@/components/Layout'))
const Landing = lazy(() => import('@/pages/Landing'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Profile = lazy(() => import('@/pages/Profile'))
const AuthPage = lazy(() => import('@/pages/Auth'))
const About = lazy(() => import('@/pages/About'))
const Features = lazy(() => import('@/pages/Features'))
const Pricing = lazy(() => import('@/pages/Pricing'))
const Contact = lazy(() => import('@/pages/Contact'))
const Skills = lazy(() => import('@/pages/Skills'))
const Projects = lazy(() => import('@/pages/Projects'))
const Learning = lazy(() => import('@/pages/Learning'))
const Achievements = lazy(() => import('@/pages/Achievements'))
const Portfolio = lazy(() => import('@/pages/Portfolio'))
const Resources = lazy(() => import('@/pages/Resources'))
const Mentorship = lazy(() => import('@/pages/Mentorship'))
const NotificationsPage = lazy(() => import('@/pages/Notifications'))

import { useAuth } from '@/context/AuthContext'

function RequireAuth({ children, requireProfile = false }: { children: JSX.Element, requireProfile?: boolean }) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen grid place-items-center bg-background"><Loader /></div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (requireProfile) {
        // Enforce profile completion before accessing dashboard
        const isProfileComplete = user?.title && user?.title.trim().length > 0 && user?.skills && user.skills.length > 0;
        if (!isProfileComplete) {
            return <Navigate to="/profile" replace />;
        }
    }

    return children;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Suspense fallback={<div className="min-h-screen grid place-items-center bg-background"><Loader /></div>}>
                    <Routes>
                        <Route path="/auth" element={<AuthPage />} />

                        <Route element={<Layout />}>
                            <Route path="/" element={<Landing />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/features" element={<Features />} />
                            <Route path="/pricing" element={<Pricing />} />
                            <Route path="/contact" element={<Contact />} />

                            {/* PROTECTED ROUTES */}
                            <Route path="/dashboard" element={
                                <RequireAuth requireProfile={true}>
                                    <Dashboard />
                                </RequireAuth>
                            } />

                            <Route path="/skills" element={<RequireAuth><Skills /></RequireAuth>} />
                            <Route path="/projects" element={<RequireAuth><Projects /></RequireAuth>} />
                            <Route path="/learning" element={<RequireAuth><Learning /></RequireAuth>} />

                            {/* NEW FEATURE ROUTES */}
                            <Route path="/achievements" element={<RequireAuth><Achievements /></RequireAuth>} />
                            <Route path="/portfolio" element={<RequireAuth><Portfolio /></RequireAuth>} />
                            <Route path="/resources" element={<RequireAuth><Resources /></RequireAuth>} />
                            <Route path="/mentorship" element={<RequireAuth><Mentorship /></RequireAuth>} />
                            <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />

                            {/* Profile is protected but doesn't require profile completion (it IS the completion step) */}
                            <Route path="/profile" element={
                                <RequireAuth requireProfile={false}>
                                    <Profile />
                                </RequireAuth>
                            } />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Routes>
                </Suspense>
                <Toaster />
            </AuthProvider>
        </Router>
    )
}

export default App

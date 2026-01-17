/*
PROJECT EON: DEEP SCIENCE ARCHITECTURE
COMPONENT: Layout System
*/

import { Link, useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Activity, LayoutDashboard, UserCircle, Hexagon, Terminal, Globe, Shield, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Layout() {
    const location = useLocation()
    const { isAuthenticated, logout, user } = useAuth()

    return (
        <div className="min-h-screen bg-background font-sans antialiased flex flex-col selection:bg-primary/30 selection:text-white">

            {/* HUD HEADER */}
            <header className="fixed top-0 z-50 w-full border-b border-white/[0.08] bg-background/60 backdrop-blur-md">
                <div className="container h-16 max-w-screen-2xl flex items-center justify-between px-6 lg:px-12">

                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-colors">
                            <Hexagon className="h-4 w-4 text-primary group-hover:animate-pulse-slow" />
                            <div className="absolute inset-0 bg-primary/20 blur-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="font-bold text-lg tracking-tight font-display text-foreground">
                            CAREER<span className="text-primary font-light">COMPASS</span>
                        </span>
                    </Link>

                    {/* Navigation - Center */}
                    <nav className="hidden md:flex items-center gap-8">
                        {!isAuthenticated ? (
                            <>
                                <NavLink to="/features" label="Capabilities" />
                                <NavLink to="/pricing" label="Access" />
                                <NavLink to="/about" label="Mission" />
                            </>
                        ) : (
                            <>
                                <NavLink to="/dashboard" label="Command Center" active={location.pathname === '/dashboard'} />
                                <NavLink to="/skills" label="Skills" active={location.pathname === '/skills'} />
                                <NavLink to="/achievements" label="Achievements" active={location.pathname === '/achievements'} />
                                <NavLink to="/portfolio" label="Portfolio" active={location.pathname === '/portfolio'} />
                                <NavLink to="/resources" label="Resources" active={location.pathname === '/resources'} />
                                <NavLink to="/mentorship" label="Mentorship" active={location.pathname === '/mentorship'} />
                            </>
                        )}
                    </nav>

                    {/* Actions - Right */}
                    <div className="flex items-center gap-4">

                        {/* System Status Indicator */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/[0.05] rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_3s_infinite]" />
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                System Optimal
                            </span>
                        </div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 relative" asChild>
                                    <Link to="/notifications">
                                        <Bell className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                        <span className="absolute top-1 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </Link>
                                </Button>
                                <div className="text-right hidden sm:block">
                                    <div className="text-xs font-medium text-foreground">{user?.name}</div>
                                    <div className="text-[10px] font-mono text-muted-foreground text-right">LVL 4 CLEARANCE</div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5" asChild>
                                    <Link to="/profile">
                                        <UserCircle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={logout}
                                    className="hidden md:flex text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                    LOGOUT
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="sm" className="hidden md:flex text-sm text-muted-foreground hover:text-foreground" asChild>
                                    <Link to="/auth?mode=login">Log In</Link>
                                </Button>
                                <Button size="sm" className="bg-primary/90 hover:bg-primary text-white border-0 shadow-[0_0_20px_rgba(124,58,237,0.3)] rounded-lg font-medium tracking-wide text-xs px-6" asChild>
                                    <Link to="/auth?mode=signup">
                                        INITIALIZE <Terminal className="ml-2 h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-16 relative">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.08] bg-black/20 backdrop-blur-sm">
                <div className="container max-w-screen-2xl py-12 px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                                <Hexagon className="h-5 w-5 text-primary" />
                                <span className="font-bold text-lg tracking-tight">CAREERCOMPASS</span>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                                The next-generation intelligence layer for human capability synthesis.
                                Architecting the workforce of the future through neural data analysis.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-mono uppercase tracking-widest text-foreground font-semibold">Platform</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/features" className="hover:text-primary transition-colors">Neural Engine</Link></li>
                                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Command Center</Link></li>
                                <li><Link to="/pricing" className="hover:text-primary transition-colors">Enterprise Access</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-mono uppercase tracking-widest text-foreground font-semibold">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/privacy" className="hover:text-primary transition-colors">Data Privacy</Link></li>
                                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                                <li><Link to="/security" className="hover:text-primary transition-colors">Security Clearance</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-muted-foreground font-mono">
                            © 2026 CAREER COMPASS INC. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex items-center gap-4">
                            <Globe className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                            <Shield className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function NavLink({ to, label, active = false }: { to: string, label: string, active?: boolean }) {
    return (
        <Link
            to={to}
            className={cn(
                "text-sm font-medium transition-all duration-200 relative group",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
        >
            {label}
            <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full",
                active && "w-full"
            )} />
        </Link>
    )
}

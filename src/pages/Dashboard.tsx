import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Activity, BookOpen, Trophy, ArrowUpRight, Zap, Target, TrendingUp, AlertCircle, CheckCircle, CheckSquare, Brain, ChevronRight, Layers, Rocket, Bookmark, Globe, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { generateDashboardData } from '@/lib/intelligence'

export default function Dashboard() {
    const { user } = useAuth()

    // GENERATE REAL-TIME INSIGHTS BASED ON USER PROFILE
    const data = useMemo(() => {
        if (!user) return null
        return generateDashboardData(user)
    }, [user])

    const recentActivity = [
        { id: 1, type: 'course', title: 'Advanced Hydroponics Systems', status: 'In Progress', progress: 65, date: '2h ago', icon: <BookOpen className="h-4 w-4" /> },
        { id: 2, type: 'project', title: 'Smart City Traffic Analysis', status: 'Completed', progress: 100, date: '1d ago', icon: <Target className="h-4 w-4" /> },
    ]

    if (!data) return null;

    return (
        <div className="container max-w-screen-2xl p-6 lg:p-12 space-y-8 animate-in-up">

            {/* Header / Status Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-cyan-700 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <div className="flex items-center gap-4 text-sm text-cyan-300">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            ONLINE
                        </span>
                        <span>//</span>
                        <span>Welcome, {(user?.name || "User")}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-lg flex items-center gap-3 bg-cyan-900/50 border border-cyan-700">
                        <Zap className="h-4 w-4 text-cyan-400" />
                        <span className="font-bold text-cyan-100">Status: Active</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Visuals */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-xl border-white/[0.08] glass-panel p-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                <Activity className="h-4 w-4 text-primary" /> Competence Matrix
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.skillMatrix}>
                                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Skills"
                                            dataKey="A"
                                            stroke="#7c3aed"
                                            strokeWidth={2}
                                            fill="#7c3aed"
                                            fillOpacity={0.3}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-white/[0.08] glass-panel">
                        <CardHeader>
                            <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-400" /> Gap Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono">
                                    <span>AI Ethics Compliance</span>
                                    <span className="text-red-400">CRITICAL LOW</span>
                                </div>
                                <Progress value={33} className="h-1.5 bg-white/5" indicatorClassName="bg-red-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono">
                                    <span>Advanced Systems</span>
                                    <span className="text-yellow-400">RECOMMENDED</span>
                                </div>
                                <Progress value={45} className="h-1.5 bg-white/5" indicatorClassName="bg-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-8 space-y-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-transparent border-b border-white/[0.08] p-0 w-full justify-start h-auto rounded-none mb-6">
                            <TabTrigger value="overview">OVERVIEW</TabTrigger>
                            <TabTrigger value="projects">ACTIVE PROJECTS</TabTrigger>
                            <TabTrigger value="pathways">LEARNING PATHWAYS</TabTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-0 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <StatsCard
                                    title="Total XP Gained"
                                    value="24,300"
                                    sub="+2.5% from last week"
                                    icon={<Trophy className="h-5 w-5 text-yellow-500" />}
                                />
                                <StatsCard
                                    title="Modules Completed"
                                    value="14/20"
                                    sub="70% Pathway Completion"
                                    icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
                                />
                            </div>

                            {/* SKILL SYNERGY & UPSKILLING ENGINE */}
                            <div className="grid grid-cols-1 gap-6">
                                <Card className="rounded-xl border-white/[0.08] glass-panel overflow-hidden">
                                    <CardHeader className="border-b border-white/[0.05] bg-white/[0.02]">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <Layers className="h-4 w-4 text-primary" /> SKILL ARCHITECTURE & PROJECT UNLOCKS
                                            </CardTitle>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                LIVE DATA FEED ACTIVE
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-white/[0.05]">
                                            {data.careerPath.map((job, idx) => (
                                                <div key={idx} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group hover:bg-white/[0.02] transition-colors">
                                                    {/* Role Info */}
                                                    <div className="flex-1 space-y-2 min-w-[200px]">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{job.role}</h4>
                                                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${job.match > 85 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                                {job.match}% MATCH
                                                            </span>
                                                        </div>
                                                        <Progress value={job.match} className="h-1.5 bg-white/5" />
                                                        <p className="text-xs text-muted-foreground">
                                                            {job.missing.length > 0 ? (
                                                                <span className="text-red-400">MISSING: {job.missing.join(", ")}</span>
                                                            ) : (
                                                                <span className="text-emerald-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> ALL PREREQUISITES MET</span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Actionable Path */}
                                                    <div className="flex-1 w-full md:border-l border-white/10 md:pl-6 space-y-3">
                                                        {job.projectReady ? (
                                                            <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg">
                                                                <div className="space-y-1">
                                                                    <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Project Unlocked</div>
                                                                    <div className="font-medium text-sm">{job.project}</div>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs"
                                                                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(job.project + " project ideas and tutorials")}`, '_blank')}
                                                                >
                                                                    <Search className="mr-2 h-3.5 w-3.5" /> RESEARCH
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-lg">
                                                                <div className="space-y-1">
                                                                    <div className="text-[10px] font-mono text-primary uppercase tracking-widest">Recommended Course</div>
                                                                    <div className="font-medium text-sm">{job.course}</div>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="border-primary/30 text-primary hover:bg-primary/10 h-8 text-xs"
                                                                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent("best courses for " + job.course)}`, '_blank')}
                                                                >
                                                                    <Search className="mr-2 h-3.5 w-3.5" /> EXPLORE
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <div className="p-2 bg-black/40 text-center border-t border-white/5">
                                        <p className="text-[10px] text-muted-foreground font-mono flex items-center justify-center gap-2">
                                            <Globe className="h-3 w-3" /> SYNCING WITH GLOBAL CAREER DATABASE...
                                        </p>
                                    </div>
                                </Card>
                            </div>

                            {/* DAILY DIRECTIVES */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="md:col-span-2 rounded-xl border-white/[0.08] glass-panel">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <CheckSquare className="h-4 w-4 text-primary" /> DAILY DIRECTIVES
                                        </CardTitle>
                                        <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">3 PENDING</span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {data.directives.map((task) => (
                                                <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg group transition-colors cursor-pointer border border-transparent hover:border-white/5">
                                                    <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                                        <div className="w-2.5 h-2.5 rounded-sm bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{task.task}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-mono text-muted-foreground">{task.time}</span>
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                                                            task.priority === 'MED' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                'bg-emerald-500/20 text-emerald-400'
                                                            }`}>{task.priority}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* NEURAL INSIGHTS */}
                                <Card className="rounded-xl border-primary/20 bg-primary/5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/10 blur-[40px] pointer-events-none" />
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-mono uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Brain className="h-4 w-4 animate-pulse" /> Neural Insight
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative z-10 space-y-4">
                                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                                            {data.insights}
                                        </p>
                                        <Button
                                            size="sm"
                                            className="w-full bg-primary text-white border-0 shadow-lg text-xs font-bold tracking-wide"
                                            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(data.insights)}`, '_blank')}
                                        >
                                            RESEARCH INSIGHT <Search className="ml-1 h-3 w-3" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="rounded-xl border-white/[0.08] glass-panel">
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">Recent Activity Log</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {recentActivity.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between group p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-2 rounded-full bg-white/5 border border-white/10 ${item.progress === 100 ? 'text-emerald-500' : 'text-primary'}`}>
                                                        {item.icon}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{item.title}</p>
                                                        <p className="text-xs text-muted-foreground font-mono uppercase">{item.type} • {item.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {item.progress !== 100 && (
                                                        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                                                        </div>
                                                    )}
                                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

function TabTrigger({ value, children }: { value: string, children: React.ReactNode }) {
    return (
        <TabsTrigger
            value={value}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground pb-4 px-6 text-muted-foreground hover:text-foreground transition-all duration-300 font-medium text-sm tracking-wide"
        >
            {children}
        </TabsTrigger>
    )
}

function StatsCard({ title, value, sub, icon }: any) {
    return (
        <Card className="rounded-xl border-white/[0.08] glass-panel hover:bg-white/[0.04] transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="group-hover:scale-110 transition-transform duration-300">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-mono tracking-tight group-hover:text-primary transition-colors">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
        </Card>
    )
}

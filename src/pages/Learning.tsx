import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/context/AuthContext'
import { BookOpen, PlayCircle, Clock, Trophy } from 'lucide-react'

export default function Learning() {
    const { user } = useAuth()

    const courses = [
        {
            title: "Advanced Machine Learning Ops",
            provider: "DeepScience Academy",
            progress: 65,
            timeLeft: "4h 30m",
            level: "Advanced"
        },
        {
            title: "Smart City Infrastructure 101",
            provider: "Urban Planner Pro",
            progress: 100,
            timeLeft: "Completed",
            level: "Intermediate"
        },
        {
            title: "Rust for Systems Programming",
            provider: "SystemCore",
            progress: 12,
            timeLeft: "18h 15m",
            level: "Intermediate"
        }
    ]

    return (
        <div className="container max-w-screen-2xl p-6 lg:p-12 space-y-8 animate-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/[0.08] pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display mb-2">LEARNING PATHWAYS</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            OPTIMIZING NEURAL PATHS
                        </span>
                        <span>//</span>
                        <span>OPERATIVE: {(user?.name || "UNKNOWN").toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Current Modules
                </h2>

                {courses.map((course, idx) => (
                    <Card key={idx} className="glass-panel border-white/10 hover:bg-white/[0.02] transition-colors">
                        <div className="flex flex-col md:flex-row gap-6 p-6 items-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
                                {course.progress === 100 ? <Trophy className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                            </div>

                            <div className="flex-1 space-y-1 w-full text-center md:text-left">
                                <h3 className="font-bold text-lg">{course.title}</h3>
                                <p className="text-sm text-muted-foreground">{course.provider}</p>
                            </div>

                            <div className="w-full md:w-48 space-y-2">
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Progress</span>
                                    <span>{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 py-1 px-3 rounded-full font-mono">
                                    <Clock className="h-3 w-3" /> {course.timeLeft}
                                </div>
                                <Button size="sm" variant={course.progress === 100 ? "outline" : "default"}>
                                    {course.progress === 100 ? "Review" : "Continue"}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

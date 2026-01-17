import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/context/AuthContext'
import { Hexagon } from 'lucide-react'

export default function Skills() {
    const { user } = useAuth()

    const skillCategories = [
        {
            category: "Core Technologies",
            skills: [
                { name: "React / Next.js", level: 92, status: "Expert" },
                { name: "TypeScript", level: 88, status: "Advanced" },
                { name: "Node.js", level: 75, status: "Proficient" },
                { name: "Python", level: 60, status: "Intermediate" }
            ]
        },
        {
            category: "Domain Knowledge",
            skills: [
                { name: "Bio-Informatics", level: 85, status: "Advanced" },
                { name: "Urban Planning", level: 40, status: "Beginner" },
                { name: "Agri-Tech", level: 70, status: "Proficient" }
            ]
        }
    ]

    return (
        <div className="container max-w-screen-2xl p-6 lg:p-12 space-y-8 animate-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/[0.08] pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display mb-2">SKILL MATRIX</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            SYSTEM ONLINE
                        </span>
                        <span>//</span>
                        <span>OPERATIVE: {(user?.name || "UNKNOWN").toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skillCategories.map((cat, idx) => (
                    <Card key={idx} className="glass-panel border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-mono">
                                <Hexagon className="h-5 w-5 text-primary" />
                                {cat.category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {cat.skills.map((skill, sIdx) => (
                                <div key={sIdx} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-foreground">{skill.name}</span>
                                        <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary bg-primary/5">
                                            {skill.status}
                                        </Badge>
                                    </div>
                                    <Progress value={skill.level} className="h-2 bg-white/5" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

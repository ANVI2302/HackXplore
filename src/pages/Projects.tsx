import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { FolderGit2, Github, Globe } from 'lucide-react'

export default function Projects() {
    const { user } = useAuth()

    const projects = [
        {
            title: "CommuteOS",
            description: "Smart city traffic analysis and optimization using real-time data ingestion.",
            tags: ["React", "D3.js", "Traffic API"],
            status: "In Progress",
            link: "#"
        },
        {
            title: "Agri-Sense",
            description: "IoT dashboard for monitoring soil sensors and predicting crop yields.",
            tags: ["IoT", "Python", "Dashboard"],
            status: "Completed",
            link: "#"
        },
        {
            title: "Genome Explorer",
            description: "Visualization tool for genomic data sequences and mutation tracking.",
            tags: ["Bioinformatics", "WebGL", "Rust"],
            status: "Planning",
            link: "#"
        }
    ]

    return (
        <div className="container max-w-screen-2xl p-6 lg:p-12 space-y-8 animate-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/[0.08] pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-display mb-2">ACTIVE PROJECTS</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            SYNC ACTIVE
                        </span>
                        <span>//</span>
                        <span>OPERATIVE: {(user?.name || "UNKNOWN").toUpperCase()}</span>
                    </div>
                </div>
                <Button className="bg-primary text-white">
                    <FolderGit2 className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, idx) => (
                    <Card key={idx} className="glass-panel border-white/10 flex flex-col h-full hover:border-primary/50 transition-colors group">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="font-mono text-[10px] tracking-wider bg-white/5 text-muted-foreground">
                                    {project.status}
                                </Badge>
                                <FolderGit2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <CardTitle className="text-xl">{project.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="border-white/10 bg-black/20 text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t border-white/5">
                            <div className="flex gap-4 w-full">
                                <Button variant="ghost" size="sm" className="flex-1 text-xs">
                                    <Github className="mr-2 h-3.5 w-3.5" /> Repository
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-1 text-xs text-primary hover:text-primary/80">
                                    <Globe className="mr-2 h-3.5 w-3.5" /> Live Demo
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

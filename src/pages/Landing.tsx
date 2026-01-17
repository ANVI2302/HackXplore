import { Button } from '@/components/ui/button'
import { ArrowRight, BrainCircuit, Sprout, Building2, Cpu, Globe, Terminal, ChevronRight, Activity, ShieldCheck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Landing() {
    const { isAuthenticated } = useAuth()

    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden bg-background selection:bg-primary/30">

            {/* AMBIENT BACKGROUND SYSTEM */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-float opacity-30" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[150px] animate-pulse-slow opacity-30" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
            </div>

            {/* HERO MODULE */}
            <section className="relative z-10 pt-32 pb-40 md:pt-48 md:pb-60 px-6 lg:px-12 max-w-screen-2xl mx-auto w-full flex flex-col items-center text-center">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 animate-in-up [animation-delay:0.1s]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-xs font-mono text-primary tracking-[0.2em] uppercase">System Operational // V.2.4</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-foreground mb-8 leading-[0.9] animate-in-up [animation-delay:0.2s]">
                    HUMAN POTENTIAL<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent">SYNTHESIZED.</span>
                </h1>

                <p className="max-w-3xl text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-12 animate-in-up [animation-delay:0.3s]">
                    The advanced intelligence layer for mission-critical workforce development.
                    Mapping neural skill pathways for <span className="text-foreground font-medium">Computing</span>, <span className="text-foreground font-medium">Agritech</span>, and <span className="text-foreground font-medium">Urban Systems</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 animate-in-up [animation-delay:0.4s]">
                    <Button size="lg" className="h-14 px-10 rounded-full bg-primary text-white hover:bg-primary/90 text-sm font-bold tracking-wider shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] border border-white/10" asChild>
                        <Link to={isAuthenticated ? "/dashboard" : "/auth?mode=signup"}>
                            {isAuthenticated ? "ACCESS DASHBOARD" : "INITIALIZE PROTOCOL"} <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-white/10 glass-button text-foreground hover:text-white text-sm font-bold tracking-wider" asChild>
                        <Link to="/about">
                            EXPLORE ARCHITECTURE
                        </Link>
                    </Button>
                </div>
            </section>

            {/* DOMAIN INTELLIGENCE GRID */}
            <section className="relative z-10 py-32 border-t border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="container max-w-screen-2xl px-6 lg:px-12">

                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">DOMAIN INTELLIGENCE</h2>
                            <p className="text-muted-foreground font-mono uppercase tracking-widest text-sm max-w-md">
                                Targeted skill acquisition for high-priority global sectors.
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="h-px w-32 bg-gradient-to-r from-transparent to-primary/50" />
                            <div className="text-xs font-mono text-primary">NODES_ACTIVE: 03</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Domain Card 1: CS */}
                        <DomainCard
                            number="01"
                            title="COMPUTATIONAL SYSTEMS"
                            icon={<Terminal className="h-8 w-8 text-violet-400" />}
                            desc="Full-stack engineering, cloud architecture, and cybersecurity operations."
                            tags={['AI/ML', 'DevOps', 'Rust']}
                            color="violet"
                        />

                        {/* Domain Card 2: AGRI */}
                        <DomainCard
                            number="02"
                            title="BIO-AGRONOMY"
                            icon={<Sprout className="h-8 w-8 text-emerald-400" />}
                            desc="Precision agriculture, autonomous farming systems, and sustainable biotech."
                            tags={['Genomics', 'Drone Ops', 'Supply Chain']}
                            color="emerald"
                        />

                        {/* Domain Card 3: URBAN */}
                        <DomainCard
                            number="03"
                            title="SMART INFRASTRUCTURE"
                            icon={<Building2 className="h-8 w-8 text-blue-400" />}
                            desc="IoT sensor grids, renewable microgrids, and AI-driven urban planning."
                            tags={['IoT', 'Civil Eng', 'Energy']}
                            color="blue"
                        />
                    </div>
                </div>
            </section>

            {/* METRICS SECTION */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 skewed-bg transform -skew-y-3 scale-110 z-0 content-['']" />
                <div className="container relative z-10 max-w-screen-2xl px-6 lg:px-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <MetricItem value="98.4%" label="Prediction Accuracy" icon={<Activity className="h-4 w-4 mx-auto mb-2 text-primary" />} />
                        <MetricItem value="12k+" label="Skills Indexed" icon={<BrainCircuit className="h-4 w-4 mx-auto mb-2 text-accent" />} />
                        <MetricItem value="850+" label="Career Pathways" icon={<Globe className="h-4 w-4 mx-auto mb-2 text-blue-400" />} />
                        <MetricItem value="0.02s" label="System Latency" icon={<Zap className="h-4 w-4 mx-auto mb-2 text-yellow-400" />} />
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-32 relative">
                <div className="container max-w-screen-md text-center mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">READY TO INITIALIZE?</h2>
                    <p className="text-lg text-muted-foreground mb-12">
                        Join the network of elite professionals building the future. Secure your clearance level today.
                    </p>
                    <div className="flex justify-center">
                        <Button size="lg" className="h-16 px-12 rounded-full bg-white text-black hover:bg-white/90 font-bold text-lg tracking-wide w-full md:w-auto shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]" asChild>
                            <Link to="/auth?mode=signup">
                                CREATE ACC0UNT <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                    <p className="mt-8 text-xs text-muted-foreground font-mono">
                        ENCRYPTED CONNECTION // 2048-BIT SSL
                    </p>
                </div>
            </section>
        </div>
    )
}

function DomainCard({ number, title, icon, desc, tags, color }: any) {
    const colorClasses: any = {
        violet: 'group-hover:border-violet-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]',
        emerald: 'group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
        blue: 'group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]',
    }

    return (
        <div className={`group relative p-8 glass-panel border border-white/10 rounded-2xl transition-all duration-500 hover:-translate-y-2 ${colorClasses[color]}`}>
            <div className="absolute top-8 right-8 opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500">
                {icon}
            </div>
            <div className="text-xs font-mono text-muted-foreground mb-4 opacity-50">NODE_{number}</div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm mb-8 pr-8">
                {desc}
            </p>
            <div className="flex gap-2 flex-wrap">
                {tags.map((tag: string) => (
                    <span key={tag} className="text-[10px] uppercase font-mono border border-white/10 px-2 py-1 rounded bg-white/5 text-muted-foreground group-hover:text-foreground transition-colors">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}

function MetricItem({ value, label, icon }: any) {
    return (
        <div className="space-y-2">
            {icon}
            <div className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">{value}</div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
        </div>
    )
}

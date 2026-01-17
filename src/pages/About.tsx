import { Hexagon } from "lucide-react"

export default function About() {
    return (
        <div className="relative min-h-screen py-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit mb-6">
                        <span className="text-xs font-mono text-primary tracking-widest uppercase">Our Mission</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
                        DECODING THE<br />
                        <span className="text-muted-foreground">INVISIBLE ECONOMY</span>
                    </h1>
                    <div className="space-y-6 text-xl text-muted-foreground leading-relaxed font-light">
                        <p>
                            We believe that the future of work in critical sectors like Healthcare, Agriculture, and Urban Planning is
                            becoming increasingly opaque. Traditional resumes fail to capture the nuance of "hybrid skills"—where
                            code meets biology, or where IoT meets civil engineering.
                        </p>
                        <p>
                            <span className="text-foreground font-medium">CareerCompass</span> was built to bridge this gap. We allow professionals
                            to "architect" their competence using data-driven insights, not guesswork.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                        <div>
                            <div className="text-5xl font-mono font-bold text-foreground">2024</div>
                            <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wide">Founded</p>
                        </div>
                        <div>
                            <div className="text-5xl font-mono font-bold text-foreground">SF</div>
                            <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wide">HQ Location</p>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-20"></div>
                    <div className="relative border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                        <Hexagon className="w-12 h-12 text-primary mb-6" />
                        <h3 className="text-2xl font-bold mb-4">The "Black Box" Problem</h3>
                        <p className="text-muted-foreground mb-6">
                            Employers can't see your true potential. You can't see their true requirements. The market is a black box.
                        </p>
                        <p className="text-muted-foreground">
                            We turn the lights on. By mapping granular skills to global outcomes, we create a transparent liquidity layer for human capital.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-white/[0.02] border border-white/10 p-6">
                            <h4 className="font-mono text-lg font-bold">DATA-FIRST</h4>
                            <p className="text-sm text-muted-foreground mt-2">No bias. Just vectors.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 p-6">
                            <h4 className="font-mono text-lg font-bold">PRIVACY-CORE</h4>
                            <p className="text-sm text-muted-foreground mt-2">Your data. Your keys.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

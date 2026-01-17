import { Button } from "@/components/ui/button"
import { Check, Zap, Globe, Shield, Terminal, Activity, ChevronRight } from "lucide-react"

export default function Features() {
    return (
        <div className="relative min-h-screen py-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit mb-6">
                    <span className="text-xs font-mono text-primary tracking-widest uppercase">System Capabilities</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                    A COMPREHENSIVE<br />
                    <span className="text-muted-foreground">INTELLIGENCE SUITE</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Designed for the specialized needs of Hardware-Software convergence sectors.
                    From O*NET alignment to predictive career pathing.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                {/* Feature 1 */}
                <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <div className="w-12 h-12 bg-primary/10 rounded-none flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <Activity className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Live Skill Gap Analysis</h3>
                    <p className="text-muted-foreground">
                        Real-time visualization of your competency against industry standard roles (O*NET aligned).
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-none flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                        <Globe className="text-blue-500 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Global Market Data</h3>
                    <p className="text-muted-foreground">
                        Ingest hiring trends from 50+ countries to predict the next high-demand specialization in your sector.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-none flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                        <Terminal className="text-purple-500 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">API-First Architecture</h3>
                    <p className="text-muted-foreground">
                        Export your skill profile as a JSON object to integrate with HR systems, LinkedIn, or personal portfolios.
                    </p>
                </div>
                {/* Feature 4 */}
                <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-none flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                        <Shield className="text-emerald-500 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Verified Experience</h3>
                    <p className="text-muted-foreground">
                        Blockchain-backed verification for project completion, ensuring your portfolio is tamper-proof.
                    </p>
                </div>

                {/* Feature 5 */}
                <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-none flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                        <Zap className="text-orange-500 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Velocity Tracking</h3>
                    <p className="text-muted-foreground">
                        Measure not just <em>what</em> you know, but how fast you learn it. A key metric for modern employers.
                    </p>
                </div>

                {/* Feature 6 */}
                <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <div className="w-12 h-12 bg-pink-500/10 rounded-none flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors">
                        <Activity className="text-pink-500 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI Coach</h3>
                    <p className="text-muted-foreground">
                        24/7 personalized guidance on which course, project, or certification to tackle next for maximum ROI.
                    </p>
                </div>
            </div>

            <div className="border-t border-white/10 pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">READY TO UPGRADE?</h2>
                        <ul className="space-y-4">
                            {[
                                "Full access to O*NET Data Lake",
                                "Unlimited Project Uploads",
                                "Priority Employer Verification",
                                "API Access Key"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-primary" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Button size="lg" className="mt-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
                            VIEW PRICING <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="h-[400px] border border-white/10 bg-white/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                        <div className="text-center">
                            <div className="text-6xl font-mono font-bold text-white/10">UI_DEMO</div>
                            <div className="text-sm font-mono text-primary mt-4">INTERACTIVE PREVIEW</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

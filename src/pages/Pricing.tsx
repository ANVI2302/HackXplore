import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export default function Pricing() {
    return (
        <div className="relative min-h-screen py-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit mb-6">
                    <span className="text-xs font-mono text-primary tracking-widest uppercase">Select Access Tier</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                    INVEST IN YOUR<br />
                    <span className="text-muted-foreground">FUTURE TRAJECTORY</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Transparent pricing for professionals and emerging talent. No hidden fees.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Tier */}
                <div className="p-8 border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all flex flex-col">
                    <div className="mb-8">
                        <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Cadet</div>
                        <div className="text-4xl font-bold font-display">$0<span className="text-lg text-muted-foreground font-sans font-normal">/mo</span></div>
                        <p className="text-muted-foreground mt-4 text-sm">Essential tools for students and early career exploration.</p>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {[
                            "Basic Profile & Resume",
                            "1 Sector Readiness Check",
                            "Limited O*NET Browser",
                            "Community Support"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm">
                                <Check className="w-4 h-4 text-primary" />
                                {item}
                            </li>
                        ))}
                        {[
                            "AI Coach Recommendations",
                            "Verified Certificates",
                            "API Access"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground/50">
                                <X className="w-4 h-4" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Button variant="outline" className="w-full rounded-none border-white/10">START FREE</Button>
                </div>

                {/* Pro Tier */}
                <div className="p-8 border border-primary/30 bg-primary/[0.05] relative flex flex-col scale-105 shadow-2xl shadow-primary/10 z-10">
                    <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 font-mono">POPULAR</div>
                    <div className="mb-8">
                        <div className="text-sm font-mono text-primary uppercase tracking-widest mb-2">Officer</div>
                        <div className="text-4xl font-bold font-display text-white">$29<span className="text-lg text-muted-foreground font-sans font-normal">/mo</span></div>
                        <p className="text-muted-foreground mt-4 text-sm">Full analytic suite for serious career acceleration.</p>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {[
                            "Everything in Cadet",
                            "Unlimited Readiness Checks",
                            "Full O*NET Data Lake Access",
                            "AI Career Coach (GPT-4o)",
                            "Priority Email Support"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                <Check className="w-4 h-4 text-primary" />
                                {item}
                            </li>
                        ))}
                        {[
                            "API Access",
                            "White-glove Onboarding"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground/50">
                                <X className="w-4 h-4" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Button className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90">UPGRADE NOW</Button>
                </div>

                {/* Enterprise Tier */}
                <div className="p-8 border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all flex flex-col">
                    <div className="mb-8">
                        <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Commander</div>
                        <div className="text-4xl font-bold font-display">$99<span className="text-lg text-muted-foreground font-sans font-normal">/mo</span></div>
                        <p className="text-muted-foreground mt-4 text-sm">For institutions, universities, and enterprise teams.</p>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {[
                            "Everything in Officer",
                            "Team Dashboards",
                            "Bulk Student Import",
                            "Full API Access",
                            "Dedicated Success Manager",
                            "Custom Integration"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm">
                                <Check className="w-4 h-4 text-primary" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Button variant="outline" className="w-full rounded-none border-white/10">CONTACT SALES</Button>
                </div>
            </div>
        </div>
    )
}

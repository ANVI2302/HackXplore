import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, MapPin } from "lucide-react"

export default function Contact() {
    return (
        <div className="relative min-h-screen py-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit mb-6">
                        <span className="text-xs font-mono text-primary tracking-widest uppercase">Global Comms</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
                        ESTABLISH<br />
                        <span className="text-muted-foreground">CONNECTION</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                        Questions about enterprise deployment? Need a custom API integration?
                        Our team is ready to deploy.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Email Protocol</h3>
                                <p className="text-muted-foreground text-sm font-mono mt-1">deploy@careercompass.ai</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Physical Node</h3>
                                <p className="text-muted-foreground text-sm font-mono mt-1">
                                    415 Mission St, Floor 3<br />
                                    San Francisco, CA 94105
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/10 p-8 pt-10 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                    <h2 className="text-2xl font-bold mb-6">Inquiry Form</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name">First Name</Label>
                                <Input id="first-name" placeholder="Jane" className="bg-black/50 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name">Last Name</Label>
                                <Input id="last-name" placeholder="Doe" className="bg-black/50 border-white/10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email</Label>
                            <Input id="email" type="email" placeholder="jane@company.com" className="bg-black/50 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Organization</Label>
                            <Input id="company" placeholder="Acme Inc." className="bg-black/50 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <textarea
                                id="message"
                                className="flex min-h-[120px] w-full border border-white/10 bg-black/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tell us about your requirements..."
                            />
                        </div>
                        <Button className="w-full rounded-none h-12 text-lg font-bold bg-white text-black hover:bg-white/90">
                            TRANSMIT
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

import { cn } from "@/lib/utils"

export const Loader = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex flex-col items-center justify-center min-h-[400px] w-full gap-8", className)}>
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute w-24 h-24 border border-primary/20 rounded-full animate-[spin_3s_linear_infinite]" />
                <div className="absolute w-24 h-24 border-t border-primary rounded-full animate-[spin_2s_linear_infinite]" />

                {/* Inner Ring */}
                <div className="absolute w-16 h-16 border border-accent/20 rounded-full animate-[spin_2s_linear_reverse_infinite]" />
                <div className="absolute w-16 h-16 border-t border-accent rounded-full animate-[spin_1.5s_linear_reverse_infinite]" />

                {/* Core */}
                <div className="w-4 h-4 bg-white rounded-full animate-pulse blur-[2px]" />
            </div>

            <div className="space-y-1 text-center">
                <h3 className="text-sm font-mono tracking-[0.2em] text-muted-foreground animate-pulse">INITIALIZING NEURAL LINK</h3>
                <div className="flex justify-center gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                </div>
            </div>
        </div>
    )
}

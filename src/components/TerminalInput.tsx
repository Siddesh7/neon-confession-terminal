
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-orbitron text-neon-cyan uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 bg-background/80 border-2 border-neon-purple/30 rounded-lg",
              "text-foreground font-mono placeholder:text-muted-foreground",
              "focus:border-neon-purple focus:outline-none focus:ring-0",
              "focus:shadow-lg focus:shadow-neon-purple/30",
              "transition-all duration-300 crt-scanlines",
              "hover:border-neon-purple/50",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
          {/* Terminal cursor effect */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-5 bg-neon-cyan animate-neon-flicker" />
        </div>
        {error && (
          <p className="text-sm text-red-500 font-mono">{error}</p>
        )}
      </div>
    );
  }
);

TerminalInput.displayName = "TerminalInput";

export default TerminalInput;

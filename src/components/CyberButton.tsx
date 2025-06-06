
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CyberButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const CyberButton = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  onClick,
  disabled = false,
  type = "button"
}: CyberButtonProps) => {
  const baseClasses = cn(
    "relative inline-flex items-center justify-center",
    "font-orbitron font-bold uppercase tracking-wider",
    "border-2 rounded-lg transition-all duration-300",
    "hover:scale-105 active:scale-95",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
    "neon-glow"
  );

  const variantClasses = {
    primary: cn(
      "border-neon-pink text-neon-pink",
      "hover:bg-neon-pink/20 hover:shadow-lg hover:shadow-neon-pink/50",
      "active:bg-neon-pink/30"
    ),
    secondary: cn(
      "border-neon-cyan text-neon-cyan",
      "hover:bg-neon-cyan/20 hover:shadow-lg hover:shadow-neon-cyan/50",
      "active:bg-neon-cyan/30"
    ),
    danger: cn(
      "border-red-500 text-red-500",
      "hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/50",
      "active:bg-red-500/30"
    )
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {/* Glitch effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 -skew-x-12" />
      
      <span className="relative z-10">
        {children}
      </span>
    </button>
  );
};

export default CyberButton;

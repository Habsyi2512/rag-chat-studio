import './GradientText.css';
import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className = '',
  colors = ["#38bdf8", "#818cf8", "#c084fc", "#fb7185", "#38bdf8"],
  animationSpeed = 8,
  showBorder = false
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`
  };

  return (
    <div className={cn("animated-gradient-text", className)}>
      <div 
        className="text-content select-none" 
        style={gradientStyle}
      >
        <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          {children}
        </span>
      </div>
    </div>
  );
}

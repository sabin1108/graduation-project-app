import React from "react";
import { Bot } from "lucide-react";

interface BotAvatarProps {
  size?: "sm" | "md";
}

const BotAvatar: React.FC<BotAvatarProps> = ({ size = "md" }) => {
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const containerSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const shadowTranslate = size === "sm" ? "translate-y-0.5" : "translate-y-1";
  const shadowBlur = size === "sm" ? "blur-sm" : "blur-sm";
  const innerCircleInset = size === "sm" ? "inset-px" : "inset-1";
  const shineTopLeft = size === "sm" ? "top-1 left-1 w-3 h-3" : "top-1.5 left-1.5 w-4 h-4";

  return (
    <div className={`relative ${containerSize}`}>
      {/* Shadow layers for depth */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full ${shadowTranslate} opacity-40 ${shadowBlur}`}></div>
      <div className={`absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full ${size === "sm" ? "translate-y-px" : "translate-y-0.5"} opacity-60`}></div>

      {/* Main badge */}
      <div className={`relative w-full h-full bg-gradient-to-br from-primary via-primary to-secondary rounded-full flex items-center justify-center border-2 border-background shadow-lg ${size === "sm" ? "border" : ""}`}>
        {/* Inner circle for depth */}
        <div className={`absolute ${innerCircleInset} bg-gradient-to-br from-primary-foreground/10 to-transparent rounded-full`}></div>

        {/* Bot Icon */}
        <Bot className={`relative ${iconSize} text-primary-foreground ${size === "md" ? "drop-shadow-md" : ""}`} strokeWidth={1.5} />

        {/* Shine effect */}
        <div className={`absolute ${shineTopLeft} bg-white/20 rounded-full ${size === "sm" ? "blur-md" : "blur-lg"}`}></div>
      </div>
    </div>
  );
};

export default BotAvatar;

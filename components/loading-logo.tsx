import { Bot, Sparkles } from "lucide-react";

export default function LoadingLogo() {
  return (
    <div className="relative w-8 h-8">
      {/* Shadow layers for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full translate-y-0.5 opacity-40 blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full translate-y-px opacity-60"></div>

      {/* Main badge */}
      <div className="relative w-full h-full bg-gradient-to-br from-primary via-primary to-secondary rounded-full flex items-center justify-center border border-background shadow-md">
        {/* Inner circle for depth */}
        <div className="absolute inset-px bg-gradient-to-br from-primary-foreground/10 to-transparent rounded-full"></div>

        {/* Bot Icon */}
        <Bot className="relative w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
      </div>
      
    </div>
  );
}

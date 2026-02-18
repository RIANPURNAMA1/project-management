import React from "react";

interface AvatarProps {
  label: string;
  bgColor?: string;
  size?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  label, bgColor = "#1a6fc4", size = "w-8 h-8" 
}) => (
  <div className={`${size} rounded-full flex items-center justify-center font-bold text-white shrink-0 border-2 border-white/20 text-[10px]`} style={{ backgroundColor: bgColor }}>
    {label}
  </div>
);
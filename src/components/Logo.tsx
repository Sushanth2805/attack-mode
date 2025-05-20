
import React from 'react';
import { CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <CheckSquare size={size} className="text-primary" strokeWidth={2.5} />
    </div>
  );
};

export default Logo;

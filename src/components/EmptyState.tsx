
import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState = ({ 
  title, 
  description, 
  icon, 
  action, 
  className 
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center animate-slide-in",
      className
    )}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      
      {description && (
        <p className="text-gray-500 mb-6 max-w-xs mx-auto">
          {description}
        </p>
      )}
      
      {action && (
        <Button 
          onClick={action.onClick} 
          className="bg-primary hover:bg-primary-600"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

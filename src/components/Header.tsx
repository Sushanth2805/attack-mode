
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onAddTask: () => void;
  onToggleFilter: () => void;
  tasksCount: number;
}

const Header = ({ onAddTask, onToggleFilter, tasksCount }: HeaderProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Will be replaced with actual auth

  const handleLogin = () => {
    // Will be replaced with actual auth
    toast({
      title: "Authentication required",
      description: "Please connect to Supabase to implement Google login.",
    });
  };
  
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-3 border-b safe-area">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary-800">TaskFlow</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {tasksCount} task{tasksCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <Button variant="outline" onClick={handleLogin} className="text-sm">
              Sign In
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onToggleFilter}
            className="rounded-full"
            aria-label="Filter tasks"
          >
            <List size={18} />
          </Button>

          <Button 
            onClick={onAddTask} 
            size={isMobile ? "icon" : "default"} 
            className={`bg-primary hover:bg-primary-600 rounded-full ${isMobile ? "" : "px-4"}`}
            aria-label="Add new task"
          >
            <Plus size={18} />
            {!isMobile && <span className="ml-1">New Task</span>}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

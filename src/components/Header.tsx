
import { useState } from 'react';
import { Menu, Plus, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from './ui/sheet';
import { Logo } from './Logo';

interface HeaderProps {
  tasksCount: number;
  onAddTask: () => void;
  onToggleFilter: () => void;
  onSignOut: () => void;
}

const Header = ({ 
  tasksCount, 
  onAddTask, 
  onToggleFilter,
  onSignOut 
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-6">
                <div className="flex items-center">
                  <Logo size={28} className="mr-2" />
                  <SheetTitle>TaskFlow</SheetTitle>
                </div>
                <SheetDescription>
                  Your mobile task management app
                </SheetDescription>
              </SheetHeader>
              
              <div className="grid gap-3">
                <Button variant="outline" onClick={() => {
                  setIsMenuOpen(false);
                  onAddTask();
                }}>
                  <Plus className="mr-2 h-4 w-4" /> 
                  Add Task
                </Button>
                
                <Button variant="outline" onClick={() => {
                  setIsMenuOpen(false);
                  onToggleFilter();
                }}>
                  <Filter className="mr-2 h-4 w-4" /> 
                  Filter Tasks
                </Button>
              </div>
              
              <SheetFooter className="mt-auto">
                <Button 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 mt-4 w-full justify-start"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSignOut();
                  }}
                >
                  Sign Out
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold">My Tasks</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full mr-1">
            {tasksCount} active
          </div>
          <Button size="icon" variant="outline" onClick={onToggleFilter}>
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <Button size="icon" onClick={onAddTask}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Task</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

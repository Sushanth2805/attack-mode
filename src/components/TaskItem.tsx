
import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Edit, 
  Trash2
} from 'lucide-react';
import { PriorityHigh, PriorityMedium, PriorityLow } from '@/components/PriorityIcons';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  category?: { name: string; color?: string };
  className?: string;
}

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  category,
  className
}: TaskItemProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleToggle = () => {
    onToggleComplete(task.id, !task.completed);
    toast({
      title: task.completed ? "Task marked as incomplete" : "Task completed",
      duration: 2000,
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task.id);
      toast({
        title: "Task deleted",
        description: "Task has been permanently removed",
      });
    }, 200);
  };

  const PriorityIcon = {
    high: PriorityHigh,
    medium: PriorityMedium,
    low: PriorityLow,
  }[task.priority] || PriorityMedium;

  const priorityColors = {
    high: 'text-priority-high',
    medium: 'text-priority-medium',
    low: 'text-priority-low',
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-4 shadow-sm border mb-3 transition-all duration-300 task-item-appear overflow-hidden tap-highlight",
        task.completed && "opacity-70",
        isDeleting && "h-0 opacity-0 p-0 mb-0 border-0",
        isTouched && "bg-gray-50",
        className
      )}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setTimeout(() => setIsTouched(false), 150)}
      onTouchCancel={() => setIsTouched(false)}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleToggle}
            className={cn(
              "rounded-full transition-colors border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5", // Slightly larger for mobile touch
              priorityColors[task.priority]
            )}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={cn(
                "text-base font-medium leading-tight mb-1",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -mr-1">
                  <span className="sr-only">Open menu</span>
                  <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 1.5C2 2.05228 1.55228 2.5 1 2.5C0.447715 2.5 0 2.05228 0 1.5C0 0.947715 0.447715 0.5 1 0.5C1.55228 0.5 2 0.947715 2 1.5Z" fill="currentColor"/>
                    <path d="M8.5 1.5C8.5 2.05228 8.05229 2.5 7.5 2.5C6.94772 2.5 6.5 2.05228 6.5 1.5C6.5 0.947715 6.94772 0.5 7.5 0.5C8.05229 0.5 8.5 0.947715 8.5 1.5Z" fill="currentColor"/>
                    <path d="M14 2.5C14.5523 2.5 15 2.05228 15 1.5C15 0.947715 14.5523 0.5 14 0.5C13.4477 0.5 13 0.947715 13 1.5C13 2.05228 13.4477 2.5 14 2.5Z" fill="currentColor"/>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.dueDate && (
              <div className="flex items-center text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}
            
            <div className={cn(
              "flex items-center text-xs rounded-full px-2 py-0.5", 
              priorityColors[task.priority],
              task.priority === 'high' ? 'bg-red-50' :
              task.priority === 'medium' ? 'bg-amber-50' : 'bg-green-50'
            )}>
              <PriorityIcon className="h-3 w-3 mr-1" />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </div>
            
            {category && (
              <div 
                className="flex items-center text-xs bg-primary-100 text-primary-700 rounded-full px-2 py-0.5"
                style={category.color ? {backgroundColor: `${category.color}20`, color: category.color} : {}}
              >
                {category.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

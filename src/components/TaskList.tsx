
import { useState, useMemo } from 'react';
import { format, isToday, isTomorrow, addDays, isWithinInterval, startOfDay } from 'date-fns';
import { Task, FilterOptions, Category } from '@/types/task';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';
import { List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  categories: Category[];
  filters: FilterOptions;
  onAddTask: () => void;
  className?: string;
}

const TaskList = ({ 
  tasks, 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask, 
  categories,
  filters,
  onAddTask,
  className
}: TaskListProps) => {
  const [showAnimation, setShowAnimation] = useState(true);
  
  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Filter by completion status
    if (filters.completed !== 'all') {
      result = result.filter(task => task.completed === filters.completed);
    }
    
    // Filter by priority
    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    // Filter by category
    if (filters.categoryId && filters.categoryId !== 'all') {
      result = result.filter(task => task.categoryId === filters.categoryId);
    }
    
    // Filter by due date range
    if (filters.dueDateRange && filters.dueDateRange !== 'all') {
      const today = startOfDay(new Date());
      
      switch (filters.dueDateRange) {
        case 'today':
          result = result.filter(task => 
            task.dueDate && isToday(new Date(task.dueDate))
          );
          break;
        case 'tomorrow':
          result = result.filter(task => 
            task.dueDate && isTomorrow(new Date(task.dueDate))
          );
          break;
        case 'week':
          const weekFromToday = addDays(today, 7);
          result = result.filter(task => 
            task.dueDate && isWithinInterval(new Date(task.dueDate), {
              start: today,
              end: weekFromToday
            })
          );
          break;
        case 'month':
          const monthFromToday = addDays(today, 30);
          result = result.filter(task => 
            task.dueDate && isWithinInterval(new Date(task.dueDate), {
              start: today,
              end: monthFromToday
            })
          );
          break;
      }
    }
    
    // Filter by search query
    if (filters.searchQuery?.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    // Sort tasks: Uncompleted first, then by priority (High, Medium, Low), then by due date (closest first)
    return result.sort((a, b) => {
      // Completed tasks go to the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Sort by due date if both have due dates
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      // Tasks with due dates come before tasks without due dates
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // As a final tiebreaker, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, filters]);

  // Find the category object for each task
  const getCategory = (categoryId?: string) => {
    if (!categoryId) return undefined;
    return categories.find(c => c.id === categoryId);
  };

  // Group tasks by date
  const groupedTasks = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    filteredTasks.forEach(task => {
      let groupKey = 'No Due Date';
      
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        if (isToday(date)) {
          groupKey = 'Today';
        } else if (isTomorrow(date)) {
          groupKey = 'Tomorrow';
        } else {
          groupKey = format(date, 'EEEE, MMM d'); // e.g., "Monday, Jul 5"
        }
      }
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(task);
    });
    
    return grouped;
  }, [filteredTasks]);

  // Show empty state if no tasks match filters
  if (Object.keys(groupedTasks).length === 0) {
    return (
      <div className={cn("pt-10", className)}>
        <EmptyState
          title="No tasks found"
          description={tasks.length > 0 
            ? "Try adjusting your filters to see more tasks." 
            : "Add your first task to get started!"
          }
          icon={<List size={24} className="text-primary" />}
          action={{
            label: tasks.length > 0 ? "Clear Filters" : "Add Task",
            onClick: tasks.length > 0 ? () => {} : onAddTask,
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn("px-4 py-6", className)}>
      {Object.entries(groupedTasks).map(([dateGroup, tasksInGroup], groupIndex) => (
        <div key={dateGroup} className={cn(
          "mb-8",
          showAnimation ? "animate-slide-in" : "",
          { "animation-delay-100": groupIndex === 0 },
          { "animation-delay-200": groupIndex === 1 },
          { "animation-delay-300": groupIndex >= 2 },
        )}>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-2">
            {dateGroup}
          </h2>
          
          {tasksInGroup.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              category={getCategory(task.categoryId)}
              className={cn(
                showAnimation ? "animate-slide-in" : "",
                { "animation-delay-100": index % 3 === 0 },
                { "animation-delay-200": index % 3 === 1 },
                { "animation-delay-300": index % 3 === 2 },
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskList;

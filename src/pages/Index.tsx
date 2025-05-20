
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import TaskFilter from '@/components/TaskFilter';
import { Task, TaskFormData, FilterOptions, Category } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  fetchTasks, 
  fetchCategories, 
  createTask, 
  updateTask, 
  toggleTaskComplete, 
  deleteTask,
  createCategory
} from '@/services/taskService';

const initialFilters: FilterOptions = {
  priority: 'all',
  categoryId: 'all',
  completed: 'all',
  dueDateRange: 'all',
  searchQuery: '',
};

const Index = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isTaskFilterOpen, setIsTaskFilterOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  // Fetch tasks with React Query
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  });

  // Fetch categories with React Query
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task created",
        description: "Your task has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
      console.error('Create task error:', error);
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskFormData }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task updated",
        description: "Your changes have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive"
      });
      console.error('Update task error:', error);
    }
  });

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      toggleTaskComplete(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive"
      });
      console.error('Toggle task error:', error);
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task deleted",
        description: "Task has been permanently removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive"
      });
      console.error('Delete task error:', error);
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category created",
        description: "New category has been created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive"
      });
      console.error('Create category error:', error);
    }
  });

  // Function to add a new task
  const handleAddTask = (taskData: TaskFormData) => {
    createTaskMutation.mutate(taskData);
  };
  
  // Function to edit a task
  const handleEditTask = (id: string, taskData: TaskFormData) => {
    updateTaskMutation.mutate({ id, data: taskData });
  };
  
  // Function to toggle task completion
  const handleToggleComplete = (id: string, completed: boolean) => {
    toggleTaskMutation.mutate({ id, completed });
  };
  
  // Function to delete a task
  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };
  
  // Function to add a category
  const handleAddCategory = (categoryData: { name: string; color?: string }) => {
    createCategoryMutation.mutate(categoryData);
  };
  
  // Open the form to edit a task
  const handleOpenEditForm = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskFormOpen(true);
  };
  
  // Removed the welcome message that showed on every page load
  
  // Get the count of incomplete tasks for the header
  const activeTasks = tasks.filter(task => !task.completed).length;

  // Loading state
  if (tasksLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onAddTask={() => {
          setTaskToEdit(undefined);
          setIsTaskFormOpen(true);
        }}
        onToggleFilter={() => setIsTaskFilterOpen(true)}
        onSignOut={signOut}
        tasksCount={activeTasks}
      />
      
      <main className="flex-1 overflow-y-auto pb-safe">
        <TaskList 
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleOpenEditForm}
          onDeleteTask={handleDeleteTask}
          categories={categories}
          filters={filters}
          onAddTask={() => {
            setTaskToEdit(undefined);
            setIsTaskFormOpen(true);
          }}
          className="mb-20"
        />
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe flex justify-center">
        <button 
          onClick={() => {
            setTaskToEdit(undefined);
            setIsTaskFormOpen(true);
          }}
          className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          aria-label="Add new task"
        >
          <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 1C7.77614 1 8 1.22386 8 1.5V13.5C8 13.7761 7.77614 14 7.5 14C7.22386 14 7 13.7761 7 13.5V1.5C7 1.22386 7.22386 1 7.5 1Z" fill="currentColor"/>
            <path d="M1.5 7C1.22386 7 1 7.22386 1 7.5C1 7.77614 1.22386 8 1.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H1.5Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      
      <TaskForm 
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setTaskToEdit(undefined);
        }}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        taskToEdit={taskToEdit}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
      
      <TaskFilter 
        isOpen={isTaskFilterOpen}
        onClose={() => setIsTaskFilterOpen(false)}
        onApplyFilters={setFilters}
        currentFilters={filters}
        categories={categories}
      />
    </div>
  );
};

export default Index;

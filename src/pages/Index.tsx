
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import TaskFilter from '@/components/TaskFilter';
import { Task, TaskFormData, Priority, FilterOptions, Category } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { List } from 'lucide-react';

// Mock data for initial development (will be replaced with Supabase)
const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: "Complete project proposal",
    description: "Finish writing the proposal document for the new client project",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), // tomorrow
    priority: "high",
    completed: false,
    categoryId: "work",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1" // will be replaced with actual user ID from auth
  },
  {
    id: uuidv4(),
    title: "Schedule doctor appointment",
    description: "Call Dr. Smith's office to schedule annual checkup",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    priority: "medium",
    completed: false,
    categoryId: "personal",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1"
  },
  {
    id: uuidv4(),
    title: "Buy groceries",
    description: "Pick up fresh vegetables, milk, and bread",
    dueDate: new Date(),
    priority: "low",
    completed: true,
    categoryId: "shopping",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1"
  },
];

const initialCategories: Category[] = [
  { id: "work", name: "Work", color: "#0EA5E9" },
  { id: "personal", name: "Personal", color: "#8B5CF6" },
  { id: "shopping", name: "Shopping", color: "#F97316" },
];

const initialFilters: FilterOptions = {
  priority: 'all',
  categoryId: 'all',
  completed: 'all',
  dueDateRange: 'all',
  searchQuery: '',
};

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isTaskFilterOpen, setIsTaskFilterOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  // Function to add a new task
  const handleAddTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user1", // will be replaced with actual user ID
    };
    
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task created",
      description: "Your task has been successfully created.",
    });
  };
  
  // Function to edit a task
  const handleEditTask = (id: string, taskData: TaskFormData) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { 
          ...task, 
          ...taskData, 
          updatedAt: new Date(),
        } : task
      )
    );
    
    toast({
      title: "Task updated",
      description: "Your changes have been saved.",
    });
  };
  
  // Function to toggle task completion
  const handleToggleComplete = (id: string, completed: boolean) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed, updatedAt: new Date() } : task
      )
    );
  };
  
  // Function to delete a task
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  // Function to add a category
  const handleAddCategory = (categoryData: { name: string; color?: string }) => {
    const newCategory: Category = {
      id: uuidv4(), // In real app, this would come from the database
      ...categoryData,
    };
    
    setCategories(prev => [...prev, newCategory]);
    toast({
      title: "Category created",
      description: `"${categoryData.name}" category has been created.`,
    });
  };
  
  // Open the form to edit a task
  const handleOpenEditForm = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskFormOpen(true);
  };
  
  // Show a welcome message with app info when first loaded
  useEffect(() => {
    toast({
      title: "Welcome to TaskFlow",
      description: "This is a mobile task manager app prototype. Connect to Supabase for full functionality.",
    });
  }, []);
  
  // Get the count of incomplete tasks for the header
  const activeTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onAddTask={() => {
          setTaskToEdit(undefined);
          setIsTaskFormOpen(true);
        }}
        onToggleFilter={() => setIsTaskFilterOpen(true)}
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

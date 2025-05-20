
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData, Category } from "@/types/task";

// Helper function to convert database task to frontend task
const mapDbTaskToTask = (dbTask: any): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  description: dbTask.description || undefined,
  dueDate: dbTask.due_date ? new Date(dbTask.due_date) : null,
  priority: dbTask.priority,
  completed: dbTask.completed,
  categoryId: dbTask.category_id || undefined,
  createdAt: new Date(dbTask.created_at),
  updatedAt: new Date(dbTask.updated_at),
  userId: dbTask.user_id,
});

// Fetch tasks for the current user
export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return data.map(mapDbTaskToTask);
};

// Create a new task
export const createTask = async (taskData: TaskFormData): Promise<Task> => {
  // Get the current user session
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) {
    throw new Error('User must be logged in to create tasks');
  }
  
  const userId = sessionData.session.user.id;
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate ? taskData.dueDate.toISOString() : null,
      priority: taskData.priority,
      category_id: taskData.categoryId,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return mapDbTaskToTask(data);
};

// Update an existing task
export const updateTask = async (id: string, taskData: TaskFormData): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate ? taskData.dueDate.toISOString() : null,
      priority: taskData.priority,
      category_id: taskData.categoryId,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return mapDbTaskToTask(data);
};

// Toggle task completion status
export const toggleTaskComplete = async (id: string, completed: boolean): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }

  return mapDbTaskToTask(data);
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Fetch categories for the current user
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data;
};

// Create a new category
export const createCategory = async (categoryData: { name: string; color?: string }): Promise<Category> => {
  // Get the current user session
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) {
    throw new Error('User must be logged in to create categories');
  }
  
  const userId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: categoryData.name,
      color: categoryData.color,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }

  return data;
};

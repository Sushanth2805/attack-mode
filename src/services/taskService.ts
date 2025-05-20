
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData, Category } from "@/types/task";

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

  // Convert date strings to Date objects
  return data.map(task => ({
    ...task,
    dueDate: task.due_date ? new Date(task.due_date) : null,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at),
  }));
};

// Create a new task
export const createTask = async (taskData: TaskFormData): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate,
      priority: taskData.priority,
      category_id: taskData.categoryId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return {
    ...data,
    dueDate: data.due_date ? new Date(data.due_date) : null,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

// Update an existing task
export const updateTask = async (id: string, taskData: TaskFormData): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate,
      priority: taskData.priority,
      category_id: taskData.categoryId,
      updated_at: new Date()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return {
    ...data,
    dueDate: data.due_date ? new Date(data.due_date) : null,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

// Toggle task completion status
export const toggleTaskComplete = async (id: string, completed: boolean): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed,
      updated_at: new Date()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }

  return {
    ...data,
    dueDate: data.due_date ? new Date(data.due_date) : null,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
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
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: categoryData.name,
      color: categoryData.color
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }

  return data;
};

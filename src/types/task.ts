
export type Priority = 'high' | 'medium' | 'low';

export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
  priority: Priority;
  completed: boolean;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate?: Date | null;
  priority: Priority;
  categoryId?: string;
}

export type FilterOptions = {
  priority?: Priority | 'all';
  categoryId?: string | 'all';
  completed?: boolean | 'all';
  dueDateRange?: 'today' | 'tomorrow' | 'week' | 'month' | 'all';
  searchQuery?: string;
};


import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { PriorityHigh, PriorityMedium, PriorityLow } from '@/components/PriorityIcons';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Task, Priority, TaskFormData, Category } from '@/types/task';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: TaskFormData) => void;
  onEditTask?: (id: string, task: TaskFormData) => void;
  taskToEdit?: Task;
  categories: Category[];
  onAddCategory: (category: { name: string; color?: string }) => void;
}

const taskFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  dueDate: z.date().nullable().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  categoryId: z.string().optional(),
});

const TaskForm = ({ 
  isOpen, 
  onClose, 
  onAddTask, 
  onEditTask,
  taskToEdit,
  categories,
  onAddCategory
}: TaskFormProps) => {
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#8B5CF6");

  const isEditMode = !!taskToEdit;
  
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      priority: "medium",
      categoryId: undefined,
    },
  });

  // Reset form when taskToEdit changes or dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        form.reset({
          title: taskToEdit.title || "",
          description: taskToEdit.description || "",
          dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : undefined,
          priority: taskToEdit.priority || "medium",
          categoryId: taskToEdit.categoryId || undefined,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          dueDate: undefined,
          priority: "medium",
          categoryId: undefined,
        });
      }
    }
  }, [isOpen, taskToEdit, form]);

  const handleSubmit = (data: z.infer<typeof taskFormSchema>) => {
    const taskData: TaskFormData = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority as Priority,
      categoryId: data.categoryId,
    };
    
    if (isEditMode && taskToEdit) {
      onEditTask?.(taskToEdit.id, taskData);
    } else {
      onAddTask(taskData);
    }
    
    form.reset();
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor
      });
      setNewCategoryName("");
      setIsAddCategoryDialogOpen(false);
      // In a real app, we would get back an ID from the database
      // and then select the new category in the form
    }
  };

  // Predefined colors for category selection
  const colorOptions = [
    "#8B5CF6", // Purple (Primary)
    "#0EA5E9", // Blue
    "#F97316", // Orange
    "#10B981", // Green
    "#EF4444", // Red
    "#F59E0B", // Yellow
    "#EC4899", // Pink
    "#6366F1", // Indigo
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">
              {isEditMode ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter task title" 
                        {...field} 
                        className="focus-visible:ring-primary" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add some details..." 
                        {...field} 
                        className="resize-none focus-visible:ring-primary" 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date (optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          value={field.value} 
                          onValueChange={field.onChange}
                          className="flex space-x-2"
                        >
                          <div className="flex items-center">
                            <RadioGroupItem 
                              value="high" 
                              id="high"
                              className="sr-only"
                            />
                            <label
                              htmlFor="high"
                              className={cn(
                                "inline-flex items-center px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors",
                                field.value === "high" 
                                  ? "bg-priority-high text-white" 
                                  : "text-priority-high border border-priority-high hover:bg-red-50"
                              )}
                            >
                              <PriorityHigh className="h-3.5 w-3.5 mr-1" />
                              High
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <RadioGroupItem 
                              value="medium" 
                              id="medium"
                              className="sr-only"
                            />
                            <label
                              htmlFor="medium"
                              className={cn(
                                "inline-flex items-center px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors",
                                field.value === "medium" 
                                  ? "bg-priority-medium text-white" 
                                  : "text-priority-medium border border-priority-medium hover:bg-amber-50"
                              )}
                            >
                              <PriorityMedium className="h-3.5 w-3.5 mr-1" />
                              Med
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <RadioGroupItem 
                              value="low" 
                              id="low"
                              className="sr-only"
                            />
                            <label
                              htmlFor="low"
                              className={cn(
                                "inline-flex items-center px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors",
                                field.value === "low" 
                                  ? "bg-priority-low text-white" 
                                  : "text-priority-low border border-priority-low hover:bg-green-50"
                              )}
                            >
                              <PriorityLow className="h-3.5 w-3.5 mr-1" />
                              Low
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (optional)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl className="flex-1">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem 
                                key={category.id}
                                value={category.id}
                                className="flex items-center gap-2"
                              >
                                <div className="flex items-center gap-2">
                                  {category.color && (
                                    <div 
                                      className="w-3 h-3 rounded-full" 
                                      style={{ backgroundColor: category.color }} 
                                    />
                                  )}
                                  {category.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="icon" 
                        onClick={() => setIsAddCategoryDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          
          <DialogFooter className="p-6 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              onClick={form.handleSubmit(handleSubmit)}
              className="bg-primary hover:bg-primary-600"
            >
              {isEditMode ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog 
        open={isAddCategoryDialogOpen} 
        onOpenChange={setIsAddCategoryDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Category</AlertDialogTitle>
            <AlertDialogDescription>
              Create a custom category to organize your tasks better.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="categoryName" className="text-sm font-medium">
                Category Name
              </label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategoryColor(color)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      newCategoryColor === color ? "ring-2 ring-foreground ring-offset-2" : ""
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="bg-primary hover:bg-primary-600"
            >
              Add Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskForm;

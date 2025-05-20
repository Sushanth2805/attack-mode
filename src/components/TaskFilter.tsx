
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { PriorityHigh, PriorityMedium, PriorityLow, Calendar } from "lucide-react";
import { FilterOptions } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  categories: { id: string; name: string; color?: string }[];
}

const TaskFilter = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  currentFilters,
  categories
}: TaskFilterProps) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [searchQuery, setSearchQuery] = useState(currentFilters.searchQuery || '');

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      ...filters,
      searchQuery
    });
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      priority: 'all',
      categoryId: 'all',
      completed: 'all',
      dueDateRange: 'all',
      searchQuery: ''
    };
    setFilters(resetFilters);
    setSearchQuery('');
    onApplyFilters(resetFilters);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto">
        <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
          <SheetTitle className="text-left">Filter Tasks</SheetTitle>
        </SheetHeader>
        
        <div className="p-6 flex flex-col gap-6">
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium">Search</label>
            <Input
              id="search"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={filters.completed === 'all' ? "default" : "outline"}
                onClick={() => handleFilterChange('completed', 'all')}
                className="flex-1"
              >
                All
              </Button>
              <Button
                type="button"
                variant={filters.completed === false ? "default" : "outline"}
                onClick={() => handleFilterChange('completed', false)}
                className="flex-1"
              >
                Active
              </Button>
              <Button
                type="button"
                variant={filters.completed === true ? "default" : "outline"}
                onClick={() => handleFilterChange('completed', true)}
                className="flex-1"
              >
                Completed
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant={filters.priority === 'all' ? "default" : "outline"} 
                onClick={() => handleFilterChange('priority', 'all')}
                className="w-full text-sm"
              >
                All
              </Button>
              <Button
                type="button"
                variant={filters.priority === 'high' ? "default" : "outline"} 
                onClick={() => handleFilterChange('priority', 'high')}
                className={cn(
                  "w-full text-sm",
                  filters.priority !== 'high' && "text-priority-high"
                )}
              >
                <PriorityHigh className="h-4 w-4 mr-1" />
                High
              </Button>
              <Button
                type="button"
                variant={filters.priority === 'medium' ? "default" : "outline"} 
                onClick={() => handleFilterChange('priority', 'medium')}
                className={cn(
                  "w-full text-sm",
                  filters.priority !== 'medium' && "text-priority-medium"
                )}
              >
                <PriorityMedium className="h-4 w-4 mr-1" />
                Med
              </Button>
              <Button
                type="button"
                variant={filters.priority === 'low' ? "default" : "outline"} 
                onClick={() => handleFilterChange('priority', 'low')}
                className={cn(
                  "w-full text-sm",
                  filters.priority !== 'low' && "text-priority-low"
                )}
              >
                <PriorityLow className="h-4 w-4 mr-1" />
                Low
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={filters.dueDateRange === 'all' ? "default" : "outline"} 
                onClick={() => handleFilterChange('dueDateRange', 'all')}
              >
                All
              </Button>
              <Button
                type="button"
                variant={filters.dueDateRange === 'today' ? "default" : "outline"} 
                onClick={() => handleFilterChange('dueDateRange', 'today')}
                className="flex items-center"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Today
              </Button>
              <Button
                type="button"
                variant={filters.dueDateRange === 'week' ? "default" : "outline"} 
                onClick={() => handleFilterChange('dueDateRange', 'week')}
                className="flex items-center"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Week
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Select 
              value={filters.categoryId?.toString()} 
              onValueChange={(value) => handleFilterChange('categoryId', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <SheetFooter className="px-6 py-4 border-t flex-row gap-3 sticky bottom-0 bg-white">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1 bg-primary hover:bg-primary-600">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskFilter;


import React from 'react';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

// Custom priority icon components using available lucide-react icons
// Enhanced for mobile with slightly larger touch targets
export const PriorityHigh = (props: React.ComponentProps<typeof ArrowUp>) => (
  <ArrowUp 
    {...props} 
    className={`text-priority-high ${props.className || ''}`} 
    size={props.size || 20} // Slightly larger default size for mobile
  />
);

export const PriorityMedium = (props: React.ComponentProps<typeof ArrowRight>) => (
  <ArrowRight 
    {...props} 
    className={`text-priority-medium ${props.className || ''}`} 
    size={props.size || 20} 
  />
);

export const PriorityLow = (props: React.ComponentProps<typeof ArrowDown>) => (
  <ArrowDown 
    {...props} 
    className={`text-priority-low ${props.className || ''}`} 
    size={props.size || 20} 
  />
);

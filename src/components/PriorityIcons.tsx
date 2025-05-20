
import React from 'react';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

// Custom priority icon components using available lucide-react icons
export const PriorityHigh = (props: React.ComponentProps<typeof ArrowUp>) => (
  <ArrowUp {...props} className={`text-priority-high ${props.className || ''}`} />
);

export const PriorityMedium = (props: React.ComponentProps<typeof ArrowRight>) => (
  <ArrowRight {...props} className={`text-priority-medium ${props.className || ''}`} />
);

export const PriorityLow = (props: React.ComponentProps<typeof ArrowDown>) => (
  <ArrowDown {...props} className={`text-priority-low ${props.className || ''}`} />
);

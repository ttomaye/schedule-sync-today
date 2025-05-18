
export interface Task {
  id: string;
  title: string;
  content: string;
  timeSlot: string;
  duration: number; // Duration in hours
  createdAt: string;
}

export type TimeSlot = string; // Format: "HH:00" (24-hour format)

export interface PlannerState {
  tasks: Task[];
  date: string; // ISO string for the current date
}

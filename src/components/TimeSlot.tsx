
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { formatTime, isCurrentHour } from '../utils/time';
import { Task as TaskType } from '../types/planner';
import Task from './Task';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import TaskModal from './TaskModal';

interface TimeSlotProps {
  hour: number;
  timeSlot: string;
  tasks: TaskType[];
  onAddTask: (timeSlot: string, title: string, content: string, duration: number) => void;
  onUpdateTask: (id: string, content: string, title?: string, duration?: number) => void;
  onDeleteTask: (id: string) => void;
  tasksSpanningInto: TaskType[]; // Tasks that span into this time slot but don't start here
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  hour,
  timeSlot,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  tasksSpanningInto
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: timeSlot,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCurrentTimeSlot = isCurrentHour(hour);
  
  const formattedTime = formatTime(hour);

  const handleSaveTask = (taskData: { title: string; content: string; duration: number }) => {
    onAddTask(timeSlot, taskData.title, taskData.content, taskData.duration);
    setIsModalOpen(false);
  };

  return (
    <div 
      className={cn(
        "time-slot group relative rounded-md border border-gray-100 overflow-hidden",
        isCurrentTimeSlot && "time-slot-current bg-planner-100/20 border-l-planner-300 border-l-4",
        tasksSpanningInto.length > 0 && "time-slot-occupied"
      )}
    >
      <div className="p-2 bg-gray-50 border-b border-gray-100 font-medium">
        {formattedTime}
      </div>
      
      <div
        ref={setNodeRef}
        className={cn(
          "p-2 min-h-[120px]",
          isOver && "bg-planner-100/30"
        )}
      >
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
        
        {/* Visual indicator for tasks spanning into this slot */}
        {tasksSpanningInto.map(task => (
          <div 
            key={`span-${task.id}`} 
            className="task-continuation py-1 px-2 bg-planner-100 text-xs text-planner-600 rounded mb-2 border-l-4 border-l-planner-400"
          >
            {task.title || "Untitled Task"} (continued)
          </div>
        ))}
        
        {tasks.length === 0 && tasksSpanningInto.length === 0 && isOver && (
          <div className="task-placeholder">Drop here</div>
        )}
        
        {tasksSpanningInto.length === 0 && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="add-task-button mt-1 flex items-center text-sm text-gray-500 hover:text-planner-400"
          >
            <Plus size={16} className="mr-1" /> Add task
          </button>
        )}

        <TaskModal
          open={isModalOpen}
          timeSlot={timeSlot}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      </div>
    </div>
  );
};

export default TimeSlot;

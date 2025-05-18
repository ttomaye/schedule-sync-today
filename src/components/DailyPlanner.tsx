
import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { Task as TaskType } from '../types/planner';
import { generateTimeSlots, getTimeSlotHour } from '../utils/time';
import { usePlannerState } from '../hooks/usePlannerState';
import TimeSlot from './TimeSlot';
import Task from './Task';

const DailyPlanner: React.FC = () => {
  const { tasks, addTask, updateTask, moveTask, deleteTask, resetDay } = usePlannerState();
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  
  const timeSlots = generateTimeSlots();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedTask = tasks.find((task) => task.id === active.id);
    
    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = String(active.id);
      const newTimeSlot = String(over.id);
      
      moveTask(taskId, newTimeSlot);
    }
    
    setActiveTask(null);
  };

  const handleAddTask = (timeSlot: string, title: string, content: string, duration: number) => {
    addTask({
      title,
      content,
      timeSlot,
      duration
    });
  };

  const handleUpdateTask = (id: string, content: string, title?: string, duration?: number) => {
    updateTask(id, content, title, duration);
  };

  // For each time slot, determine which tasks should be visible
  const getTasksForTimeSlot = (timeSlot: string): TaskType[] => {
    const hour = getTimeSlotHour(timeSlot);
    
    // Return only tasks that start in this time slot
    return tasks.filter(task => {
      const taskStartHour = getTimeSlotHour(task.timeSlot);
      return taskStartHour === hour;
    });
  };

  // Check if a task spans into a time slot (for visual indication)
  const isTimeSlotInTaskDuration = (timeSlot: string, taskId: string): boolean => {
    const hour = getTimeSlotHour(timeSlot);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return false;
    
    const taskStartHour = getTimeSlotHour(task.timeSlot);
    return hour > taskStartHour && hour < taskStartHour + task.duration;
  };

  // Group time slots into rows of 4
  const groupedTimeSlots = timeSlots.reduce<string[][]>((acc, slot, index) => {
    const rowIndex = Math.floor(index / 4);
    if (!acc[rowIndex]) {
      acc[rowIndex] = [];
    }
    acc[rowIndex].push(slot);
    return acc;
  }, []);

  return (
    <div className="daily-planner h-full w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Daily Planner</h1>
        <button
          onClick={resetDay}
          className="px-4 py-2 bg-planner-300 text-white rounded-md hover:bg-planner-400 transition-colors"
        >
          Reset Day
        </button>
      </div>
      
      <div className="planner-grid rounded-lg border border-gray-200 overflow-hidden bg-white">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid-layout">
            {groupedTimeSlots.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {row.map((timeSlot) => {
                  const hour = parseInt(timeSlot.split(':')[0], 10);
                  const timeSlotTasks = getTasksForTimeSlot(timeSlot);
                  
                  return (
                    <TimeSlot
                      key={timeSlot}
                      hour={hour}
                      timeSlot={timeSlot}
                      tasks={timeSlotTasks}
                      onAddTask={handleAddTask}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={deleteTask}
                      tasksSpanningInto={tasks.filter(task => 
                        isTimeSlotInTaskDuration(timeSlot, task.id)
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          
          <DragOverlay>
            {activeTask && (
              <Task
                task={activeTask}
                onUpdate={handleUpdateTask}
                onDelete={deleteTask}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default DailyPlanner;

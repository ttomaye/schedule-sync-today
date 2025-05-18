
import React, { useState, useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task as TaskType } from '../types/planner';
import { cn } from '@/lib/utils';
import { Trash2, Clock, Edit, Save } from 'lucide-react';

interface TaskProps {
  task: TaskType;
  onUpdate: (id: string, content: string, title?: string, duration?: number) => void;
  onDelete: (id: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);
  const [title, setTitle] = useState(task.title || "Untitled Task");
  const [duration, setDuration] = useState(task.duration);
  const [durationError, setDurationError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const editFormRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 250ms ease',
  };

  useEffect(() => {
    if (isEditing) {
      // Focus on title input first, then content textarea
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't close the edit form if clicking within it
    if (editFormRef.current && editFormRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
  };

  const validateDuration = (value: number): boolean => {
    // Maximum of 24 hours for a task
    if (value > 24) {
      setDurationError("Task duration cannot exceed 24 hours");
      return false;
    }
    
    setDurationError(null);
    return true;
  };

  const saveChanges = () => {
    if (!validateDuration(duration)) {
      return;
    }
    
    setIsEditing(false);
    if (content.trim() !== task.content || 
        title.trim() !== (task.title || "Untitled Task") || 
        duration !== task.duration) {
      onUpdate(task.id, content, title, duration);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      saveChanges();
    } else if (e.key === 'Escape') {
      setContent(task.content);
      setTitle(task.title || "Untitled Task");
      setDuration(task.duration);
      setDurationError(null);
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setDuration(value);
      validateDuration(value);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "task bg-white rounded-md p-3 shadow-sm border border-gray-100 mb-2",
        isDragging ? "dragging shadow-md" : "",
        task.duration > 1 ? "multi-hour-task" : ""
      )}
      {...listeners}
      {...attributes}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full p-1 border border-planner-200 rounded font-medium text-sm"
            />
          ) : (
            <h3 className="font-medium text-sm">{task.title || "Untitled Task"}</h3>
          )}
          <div className="flex gap-1">
            {isEditing ? (
              <button
                onClick={saveChanges}
                className="text-planner-600 hover:text-planner-700 transition-colors"
                aria-label="Save task"
                type="button"
              >
                <Save size={16} />
              </button>
            ) : (
              <button
                onClick={handleEditClick}
                className="text-gray-400 hover:text-planner-400 transition-colors"
                aria-label="Edit task"
              >
                <Edit size={16} />
              </button>
            )}
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-destructive transition-colors"
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        {isEditing ? (
          <div ref={editFormRef}>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full p-1 border border-planner-200 rounded text-sm min-h-[60px] mb-2"
            />
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center gap-2">
                <label htmlFor={`duration-${task.id}`} className="text-xs text-gray-500">Duration (hours):</label>
                <input
                  id={`duration-${task.id}`}
                  type="number"
                  min="1"
                  max="24"
                  value={duration}
                  onChange={handleDurationChange}
                  className={cn(
                    "w-16 p-1 text-xs border border-planner-200 rounded",
                    durationError && "border-destructive"
                  )}
                />
              </div>
              {durationError && (
                <p className="text-xs text-destructive">{durationError}</p>
              )}
            </div>
          </div>
        ) : (
          <div
            className="flex-1 break-words text-sm text-gray-600"
            onDoubleClick={handleDoubleClick}
          >
            {task.content}
          </div>
        )}
        
        {!isEditing && task.duration > 0 && (
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Clock size={12} className="mr-1" />
            {task.duration === 1 ? "1 hour" : `${task.duration} hours`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;

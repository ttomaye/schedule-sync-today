
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';

interface TaskModalProps {
  open: boolean;
  timeSlot: string;
  onClose: () => void;
  onSave: (taskData: { title: string; content: string; duration: number }) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, timeSlot, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState(1);
  const [durationError, setDurationError] = useState<string | null>(null);
  
  const validateDuration = (value: number): boolean => {
    // Maximum of 24 hours for a task
    if (value > 24) {
      setDurationError("Task duration cannot exceed 24 hours");
      return false;
    }
    
    setDurationError(null);
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDuration(duration)) {
      return;
    }
    
    onSave({
      title,
      content,
      duration
    });
    
    // Reset form
    setTitle('');
    setContent('');
    setDuration(1);
    setDurationError(null);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setDuration(value);
      validateDuration(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Description</Label>
            <Textarea 
              id="content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter task description"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input 
              id="duration" 
              type="number" 
              min="1" 
              max="24"
              value={duration} 
              onChange={handleDurationChange}
              className={cn(durationError && "border-destructive")}
            />
            {durationError && (
              <p className="text-xs text-destructive">{durationError}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;

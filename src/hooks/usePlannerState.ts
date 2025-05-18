
import { useState, useEffect } from 'react';
import { Task, PlannerState } from '../types/planner';
import { loadState, saveState } from '../utils/storage';
import { getCurrentDate } from '../utils/time';

export const usePlannerState = () => {
  const [state, setState] = useState<PlannerState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>): void => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setState((prevState) => ({
      ...prevState,
      tasks: [...prevState.tasks, newTask],
    }));
  };

  const updateTask = (taskId: string, content: string, title?: string, duration?: number): void => {
    setState((prevState) => ({
      ...prevState,
      tasks: prevState.tasks.map((task) =>
        task.id === taskId 
          ? { 
              ...task, 
              content, 
              ...(title !== undefined ? { title } : {}),
              ...(duration !== undefined ? { duration } : {})
            } 
          : task
      ),
    }));
  };

  const moveTask = (taskId: string, newTimeSlot: string): void => {
    setState((prevState) => ({
      ...prevState,
      tasks: prevState.tasks.map((task) =>
        task.id === taskId ? { ...task, timeSlot: newTimeSlot } : task
      ),
    }));
  };

  const deleteTask = (taskId: string): void => {
    setState((prevState) => ({
      ...prevState,
      tasks: prevState.tasks.filter((task) => task.id !== taskId),
    }));
  };

  const resetDay = (): void => {
    setState({
      tasks: [],
      date: getCurrentDate(),
    });
  };

  return {
    tasks: state.tasks,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    resetDay,
  };
};

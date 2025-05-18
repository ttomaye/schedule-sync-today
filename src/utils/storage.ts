
import { PlannerState } from '../types/planner';
import { getCurrentDate } from './time';

const STORAGE_KEY = 'daily-planner-data';

export const loadState = (): PlannerState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return {
        tasks: [],
        date: getCurrentDate(),
      };
    }
    
    const state = JSON.parse(serializedState) as PlannerState;
    
    // Check if the stored date is today
    if (state.date !== getCurrentDate()) {
      return {
        tasks: [],
        date: getCurrentDate(),
      };
    }
    
    return state;
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return {
      tasks: [],
      date: getCurrentDate(),
    };
  }
};

export const saveState = (state: PlannerState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

export const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing state from localStorage:', err);
  }
};

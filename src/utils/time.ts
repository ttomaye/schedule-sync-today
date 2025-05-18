
export const formatTime = (hour: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${period}`;
};

export const formatTimeSlot = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`;
};

export const generateTimeSlots = (start = 6, end = 22): string[] => {
  const slots = [];
  for (let hour = start; hour <= end; hour++) {
    slots.push(formatTimeSlot(hour));
  }
  return slots;
};

export const isCurrentHour = (hour: number): boolean => {
  const now = new Date();
  return now.getHours() === hour;
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTimeSlotHour = (timeSlot: string): number => {
  return parseInt(timeSlot.split(':')[0], 10);
};

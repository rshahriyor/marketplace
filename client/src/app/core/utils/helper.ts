import { DropdownType } from "../../shared/components/dropdown/dropdown";
import { DAYS_OFF_STATUS } from "./constants";

export function getTimeSlots(daysOff: boolean = false): DropdownType[] {
  const timeSlots: string[] = [];

  for (let h = 0; h <= 24; h++) {
    if (h === 0) {
      timeSlots.push('00:30');
    } else if (h === 24) {
      timeSlots.push('24:00');
    } else {
      const hour = `${h}`.padStart(2, '0');
      timeSlots.push(`${hour}:00`);
      timeSlots.push(`${hour}:30`);
    }
  }

  if (daysOff) {
    timeSlots.unshift(...DAYS_OFF_STATUS)
  }

  return timeSlots.map((time) => ({ name: time, value: time }))
}


export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

export function formatDateWithTime(dateStr: string, isStart: boolean): string {
  const [year, month, day] = dateStr.split('-');
  const hours = isStart ? '00' : '23';
  const minutes = isStart ? '00' : '59';
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatPhone(value: string): string {
  let digits = value.toString();
  if (digits.startsWith('992') && digits.length === 12) {
    digits = digits.replace(/\D/g, '').substring(3, 12);
  } else {
    digits = digits.replace(/\D/g, '').substring(0, 9);
  }
  let formatted = '';
  if (digits.length > 0) {
    formatted += '(' + digits.substring(0, 2);
  }
  if (digits.length >= 2) {
    formatted += ') ' + digits.substring(2, 5);
  }
  if (digits.length >= 5) {
    formatted += '-' + digits.substring(5, 7);
  }
  if (digits.length >= 7) {
    formatted += '-' + digits.substring(7, 9);
  }
  return formatted;
}
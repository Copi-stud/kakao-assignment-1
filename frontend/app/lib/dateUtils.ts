export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDate(dateText: string): Date {
  return new Date(`${dateText}T00:00:00`);
}

export function moveDateBy(dateText: string, days: number): string {
  const date = parseDate(dateText);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function getWeekStartDate(dateText: string): string {
  const date = parseDate(dateText);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);
  return formatDate(date);
}

export function getWeekDates(weekStartDate: string): string[] {
  return Array.from({ length: 7 }, (_, i) => moveDateBy(weekStartDate, i));
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function getDayLabel(dateText: string): string {
  return DAY_LABELS[parseDate(dateText).getDay()];
}

export function formatDateDisplay(dateText: string): string {
  const [, mm, dd] = dateText.split("-");
  return `${parseInt(mm)}월 ${parseInt(dd)}일 (${getDayLabel(dateText)})`;
}

export function today(): string {
  return formatDate(new Date());
}

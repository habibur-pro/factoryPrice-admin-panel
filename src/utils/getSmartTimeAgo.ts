import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export function getSmartTimeAgo(date: any) {
  const now = new Date();

  const years = differenceInYears(now, date);
  if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`;

  const months = differenceInMonths(now, date);
  if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`;

  const days = differenceInDays(now, date);
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;

  const hours = differenceInHours(now, date);
  if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const minutes = differenceInMinutes(now, date);
  return `${Math.max(1, minutes)} min ago`; // fallback to 1 min minimum
}

/**
 * Get the relative day between two dates.
 * @param startDate - The start date.
 * @param endDate - The end date.
 * @returns The relative day between the two dates. I.e if the start date is 2025-01-01 and the end date is 2025-01-02, the function will return 2.
 */
export function getRelativeDay(startDate: Date, endDate: Date): number {
  // Create UTC dates to avoid timezone issues
  const utcStartDate = new Date(
    Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  );

  const utcEndDate = new Date(
    Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
  );

  // Calculate the difference in days
  const diffTime = utcEndDate.getTime() - utcStartDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Add 1 to the difference because the start day counts as Day 1
  const dayNumber = diffDays + 1;

  return dayNumber;
}

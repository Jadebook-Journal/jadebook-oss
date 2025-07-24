/**
 * Get the progress of a goal
 * @param created_at - The date the goal was created
 * @param end_date - The date the goal is due
 * @returns The progress of the goal in percentage
 */
export function getGoalProgress(created_at: string, end_date: string | null) {
  if (!end_date) return 0;

  const startDate = new Date(created_at);
  const endDate = new Date(end_date);
  const today = new Date();

  const totalDays =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const daysElapsed =
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  return Math.floor((daysElapsed / totalDays) * 100);
}

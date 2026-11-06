export type AttendanceProjection = {
  percent: number;
  extraClassesNeeded: number;
  classesCanMiss: number;
};

/** The target is a fraction strictly between 0 and 1. No excused-class rules are assumed. */
export function projectAttendance(attended: number, total: number, target: number): AttendanceProjection {
  if (!Number.isInteger(attended) || !Number.isInteger(total) || total < 0 || attended < 0 || attended > total || !Number.isFinite(target) || target <= 0 || target >= 1) {
    throw new Error('Invalid attendance inputs');
  }

  const percent = total === 0 ? 0 : 100 * attended / total;
  const extraClassesNeeded = Math.max(0, Math.ceil((target * total - attended) / (1 - target) - 1e-10));
  const classesCanMiss = attended >= target * total && total > 0
    ? Math.max(0, Math.floor(attended / target - total + 1e-10))
    : 0;

  return { percent, extraClassesNeeded, classesCanMiss };
}

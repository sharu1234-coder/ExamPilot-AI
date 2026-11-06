import assert from 'node:assert/strict';
import test from 'node:test';

import { projectAttendance } from '../src/lib/attendance.ts';

test('computes an attendance deficit using consecutive future attended classes', () => {
  const result = projectAttendance(18, 25, 0.75);
  assert.equal(result.percent, 72);
  assert.equal(result.extraClassesNeeded, 3);
  assert.equal(result.classesCanMiss, 0);
});

test('counts allowable misses without new attendances', () => {
  const result = projectAttendance(20, 24, 0.75);
  assert.equal(result.extraClassesNeeded, 0);
  assert.equal(result.classesCanMiss, 2);
});

test('supports more ambitious targets and empty terms', () => {
  assert.equal(projectAttendance(18, 25, 0.8).extraClassesNeeded, 10);
  assert.equal(projectAttendance(0, 0, 0.75).classesCanMiss, 0);
});

test('rejects impossible counts and invalid targets', () => {
  assert.throws(() => projectAttendance(6, 5, 0.75));
  assert.throws(() => projectAttendance(-1, 10, 0.75));
  assert.throws(() => projectAttendance(1, 10, 1));
  assert.throws(() => projectAttendance(1.5, 10, 0.75));
});

import { describe, it, expect } from 'vitest';

import { getDuration, getTimestampInHumanFormat, getUserTimezone } from 'src/utils/time.js';

describe('time util', () => {

  it('should get user timezone', () => {
    expect(getUserTimezone()).toBe('UTC');
  });

  it('should get timestamp in human format', () => {
    expect(getTimestampInHumanFormat('05/11/2021 13:00:00', 'UTC')).toBe('05/11/2021 at 13:00:00');
  })

  it('should get duration', () => {
    expect(getDuration(60)).toBe('a minute');
  })
});

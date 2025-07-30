import {
  shortDateFormat,
  relativeDateFormat,
  secondsToTime,
  bytesToHumanSize,
  shortenFileName,
  idToColorClass,
  flagEmoji
} from './strformat.js';

describe('shortDateFormat', () => {
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2025-07-25T12:30:00Z'));

  test('should format for same day', () => {
    const then = new Date('2025-07-25T10:15:00');
    // Note: output depends on the test runner's locale and timezone.
    // Assuming a locale where the format is HH:mm.
    expect(shortDateFormat(then, 'en-US')).toMatch(/10:15/);
  });

  test('should format for same year, different day', () => {
    const then = new Date('2025-06-20T10:15:00');
    expect(shortDateFormat(then, 'en-US')).toMatch(/Jun 20, 10:15/);
  });

  test('should format for different year', () => {
    const then = new Date('2024-07-25T10:15:00');
    expect(shortDateFormat(then, 'en-US')).toBe('Jul 25, 2024');
  });
});

describe('relativeDateFormat', () => {
  // Mock current date to a fixed point for consistent testing.
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2025-07-25T12:30:00Z'));

  test('should format for today', () => {
    const then = new Date('2025-07-25T10:00:00Z');
    expect(relativeDateFormat(then, 'en-US')).toBe('today');
  });

  test('should format for yesterday', () => {
    const then = new Date('2025-07-24T10:00:00Z');
    expect(relativeDateFormat(then, 'en-US')).toBe('yesterday');
  });

  test('should format for a past date', () => {
    const then = new Date('2025-07-20T10:00:00Z');
    expect(relativeDateFormat(then, 'en-US')).toBe('7/20/2025');
  });

  test('should format for tomorrow', () => {
    const then = new Date('2025-07-26T10:00:00Z');
    expect(relativeDateFormat(then, 'en-US')).toBe('tomorrow');
  });
});

describe('secondsToTime', () => {
  test('should format seconds only', () => {
    expect(secondsToTime(45)).toBe('0:45');
  });

  test('should format minutes and seconds', () => {
    expect(secondsToTime(156)).toBe('2:36');
  });

  test('should format hours, minutes, and seconds', () => {
    expect(secondsToTime(3756)).toBe('1:02:36');
  });

  test('should format with fixed minutes', () => {
    expect(secondsToTime(3726, true)).toBe('1:02:06');
    expect(secondsToTime(126, true)).toBe('02:06');
  });

  test('should handle non-number input', () => {
    expect(secondsToTime('abc')).toBe('');
  });
});

describe('bytesToHumanSize', () => {
  test('should format 0 bytes', () => {
    expect(bytesToHumanSize(0)).toBe('0 Bytes');
  });

  test('should format bytes', () => {
    expect(bytesToHumanSize(500)).toBe('500 Bytes');
  });

  test('should format kilobytes', () => {
    expect(bytesToHumanSize(1500)).toBe('1.46 KB');
  });

  test('should format megabytes', () => {
    expect(bytesToHumanSize(1500000)).toBe('1.43 MB');
  });

  test('should format gigabytes', () => {
    expect(bytesToHumanSize(1500000000)).toBe('1.40 GB');
  });
});

describe('shortenFileName', () => {
  test('should not shorten if not needed', () => {
    expect(shortenFileName('shortname.txt', 20)).toBe('shortname.txt');
  });

  test('should shorten a long file name', () => {
    const longName = 'this_is_a_very_long_file_name_that_needs_shortening.txt';
    expect(shortenFileName(longName, 20)).toBe('this_is_a…ening.txt');
    expect(shortenFileName(longName, 20).length).toBeLessThanOrEqual(20);
  });

  test('should handle non-string input', () => {
    expect(shortenFileName(null, 20)).toBeNull();
    expect(shortenFileName(undefined, 20)).toBeUndefined();
  });
});

describe('idToColorClass', () => {
  test('should generate light background color class', () => {
    expect(idToColorClass('usr123', true, false)).toMatch(/lt-bg-\d+/);
  });

  test('should generate dark background color class', () => {
    expect(idToColorClass('usr123', false, false)).toMatch(/dk-bg-\d+/);
  });

  test('should generate light foreground color class', () => {
    expect(idToColorClass('usr123', true, true)).toMatch(/lt-fg-\d+/);
  });

  test('should generate dark foreground color class', () => {
    expect(idToColorClass('usr123', false, true)).toMatch(/dk-fg-\d+/);
  });

  test('should be deterministic', () => {
    expect(idToColorClass('usr123', true, false)).toBe('lt-bg-2');
    expect(idToColorClass('grpABC', false, true)).toBe('dk-fg-3');
  });
});

describe('flagEmoji', () => {
  test('should convert country code to flag', () => {
    expect(flagEmoji('US')).toBe('🇺🇸');
  });

  test('should handle lowercase country code', () => {
    expect(flagEmoji('jp')).toBe('🇯🇵');
  });
});

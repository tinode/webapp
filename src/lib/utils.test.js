import {
  arrayEqual,
  asEmail,
  asPhone,
  isUrlRelative,
  sanitizeUrl,
  sanitizeUrlForMime,
  urlAsAttachment
} from './utils';

test('asPhone', () => {
  expect(asPhone('123-456-7890')).toBe('1234567890');
  expect(asPhone('(123) 456-7890')).toBe('1234567890');
  expect(asPhone('+1 (123) 456-7890')).toBe('+11234567890');
  expect(asPhone('123.456.7890')).toBe('1234567890');
  expect(asPhone('123 456 7890')).toBe('1234567890');
  expect(asPhone('123-456-78901')).toBe('12345678901');
  expect(asPhone('')).toBeNull();
  expect(asPhone('abc-def-ghij')).toBeNull();
  expect(asPhone('123-456-789')).toBeNull();
  expect(asPhone('123-4i6-78901')).toBeNull();
});

test('arrayEqual', () => {
  expect(arrayEqual([1, 2, 3], [3, 2, 1])).toBe(true);
  expect(arrayEqual([1, 2, 3], [4, 5, 6])).toBe(false);
  expect(arrayEqual([1, 2, 3], [1, 2, 3, 4])).toBe(false);
  expect(arrayEqual([1, 2, 3], [1, 2])).toBe(false);
  expect(arrayEqual([], [])).toBe(true);
  expect(arrayEqual([1], [1])).toBe(true);
  expect(arrayEqual([1], [2])).toBe(false);
  expect(arrayEqual(null, [1, 2, 3])).toBe(false);
  expect(arrayEqual([1, 2, 3], null)).toBe(false);
  expect(arrayEqual(null, null)).toBe(true);
  expect(arrayEqual(undefined, undefined)).toBe(true);
  expect(arrayEqual([1, 2, 3], undefined)).toBe(false);
  expect(arrayEqual([1, 2, 3], [1, 2, '3'])).toBe(false);
});

test('asEmail', () => {
  expect(asEmail('test@example.com')).toBe('test@example.com');
  expect(asEmail('test@mail.example.com')).toBe('test@mail.example.com');
  expect(asEmail('test@e-mail.example.com')).toBe('test@e-mail.example.com');
  expect(asEmail(' test@example.com ')).toBe('test@example.com');
  expect(asEmail('test.email+alex@leetcode.com')).toBe('test.email+alex@leetcode.com');
  expect(asEmail('test.email@sub.example.com')).toBe('test.email@sub.example.com');
  expect(asEmail('test.email@sub.example.co.uk')).toBe('test.email@sub.example.co.uk');
  expect(asEmail('invalid-email')).toBeNull();
  expect(asEmail('invalid-email@')).toBeNull();
  expect(asEmail('invalid-email@example')).toBeNull();
  expect(asEmail('invalid-email@example.')).toBeNull();
  expect(asEmail('invalid-email@example..com')).toBeNull();
  expect(asEmail('invalid-email@.example.com')).toBeNull();
  expect(asEmail('invalid-email@example.com.')).toBeNull();
  expect(asEmail('invalid-email@@example.com.')).toBeNull();
  expect(asEmail('invalid/email@example.com.')).toBeNull();
});

test('isUrlRelative', () => {
  expect(isUrlRelative('example.html')).toBe(true);
  expect(isUrlRelative('https:example.com')).toBe(false);
  expect(isUrlRelative('http:/example.com')).toBe(false);
  expect(isUrlRelative(' \n https://example.com')).toBe(false);
  expect(isUrlRelative('//example.com')).toBe(false);
  expect(isUrlRelative('\\example.com')).toBe(true);
  expect(isUrlRelative('example.com')).toBe(true);
  expect(isUrlRelative('/example')).toBe(true);
  expect(isUrlRelative('ftp://example.com')).toBe(false);
  expect(isUrlRelative('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA')).toBe(false);
});

test('sanitizeUrl', () => {
  // Test with valid URLs
  expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
  expect(sanitizeUrl('blob:http://example.com')).toBe('blob:http://example.com');
  expect(sanitizeUrl('example.html')).toBe('example.html');

  // Test with invalid URLs
  expect(sanitizeUrl('ftp://example.com')).toBeNull();
  expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
  expect(sanitizeUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')).toBeNull();

  // Test with allowed schemes
  expect(sanitizeUrl('ftp://example.com', ['ftp'])).toBe('ftp://example.com');
  expect(sanitizeUrl('ftps://example.com', ['ftp', 'ftps'])).toBe('ftps://example.com');

  // Test with non-string input
  expect(sanitizeUrl(null)).toBe(null);
  expect(sanitizeUrl(123)).toBe(123);

  // Test with control characters and whitespace
  expect(sanitizeUrl(' \n https://example.com')).toBe('https://example.com');
  expect(sanitizeUrl('http:\\\\example.com')).toBe('http://example.com');
});

test('sanitizeUrlForMime', () => {
  expect(sanitizeUrlForMime('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==', 'image')).toBeNull();

  // Test with empty and null URLs
  expect(sanitizeUrlForMime('', 'image')).toBeNull();
  expect(sanitizeUrlForMime(null, 'image')).toBeNull();

  // Test with valid data URL but wrong mime type
  expect(sanitizeUrlForMime('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA', 'text')).toBeNull();
});

test('urlAsAttachment', () => {
  // Test with a simple URL
  expect(urlAsAttachment('http://example.com')).toBe('http://example.com?asatt=1');

  // Test with a URL that already has a query parameter
  expect(urlAsAttachment('http://example.com?param=value')).toBe('http://example.com?param=value&asatt=1');

  // Test with a URL that has a fragment
  expect(urlAsAttachment('http://example.com#fragment')).toBe('http://example.com?asatt=1#fragment');

  // Test with a URL that has both query parameters and a fragment
  expect(urlAsAttachment('http://example.com?param=value#fragment')).toBe('http://example.com?param=value&asatt=1#fragment');

  // Test with a data URL
  expect(urlAsAttachment('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA')).toBe('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA');

  // Test with a blob URL
  expect(urlAsAttachment('blob:http://example.com/550e8400-e29b-41d4-a716-446655440000')).toBe('blob:http://example.com/550e8400-e29b-41d4-a716-446655440000');
});


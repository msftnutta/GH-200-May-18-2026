const { iconToEmoji, DEFAULT_EMOJI } = require('../src/utils/iconMap');

describe('iconToEmoji', () => {
  test('maps clear/sunny (1) to sun emoji', () => {
    expect(iconToEmoji(1)).toBe('☀️');
  });

  test('maps thunderstorm (15) to thunder emoji', () => {
    expect(iconToEmoji(15)).toBe('⛈️');
  });

  test('maps a snow code (22) to snow emoji', () => {
    expect(iconToEmoji(22)).toBe('❄️');
  });

  test('returns default emoji for unknown code', () => {
    expect(iconToEmoji(999)).toBe(DEFAULT_EMOJI);
  });

  test('returns default emoji for null/undefined', () => {
    expect(iconToEmoji(null)).toBe(DEFAULT_EMOJI);
    expect(iconToEmoji(undefined)).toBe(DEFAULT_EMOJI);
  });
});

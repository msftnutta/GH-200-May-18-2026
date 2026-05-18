jest.mock('../src/services/weather', () => ({
  getWeather: jest.fn().mockResolvedValue({
    temperatureC: 25,
    phrase: 'Sunny',
    iconCode: 1,
    emoji: '☀️'
  })
}));

const request = require('supertest');
const createApp = require('../src/app');

describe('routes', () => {
  const app = createApp();

  test('GET /healthz returns 200', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET / renders page with at least one city name', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('World Clock');
    expect(res.text).toContain('Singapore');
    expect(res.text).toContain('Tokyo');
    // Weather rendered (mocked)
    expect(res.text).toContain('Sunny');
  });

  test('GET / still renders when weather service rejects', async () => {
    const { getWeather } = require('../src/services/weather');
    getWeather.mockRejectedValueOnce(new Error('boom'));
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Weather unavailable');
  });

  test('Unknown path returns 404', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });
});

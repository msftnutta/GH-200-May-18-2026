const { getWeather, _clearCache } = require('../src/services/weather');

function makeFetchOk(payload) {
  return jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => payload
  });
}

const samplePayload = {
  results: [
    {
      phrase: 'Mostly sunny',
      iconCode: 2,
      temperature: { value: 28.3, unit: 'C' }
    }
  ]
};

describe('weather service', () => {
  beforeEach(() => {
    _clearCache();
  });

  test('throws when API key is missing', async () => {
    await expect(
      getWeather(1, 103, { fetchImpl: makeFetchOk(samplePayload), apiKey: '' })
    ).rejects.toThrow(/AZURE_MAPS_KEY/);
  });

  test('calls Azure Maps with correct URL params and returns parsed data', async () => {
    const fetchImpl = makeFetchOk(samplePayload);
    const data = await getWeather(1.35, 103.81, { fetchImpl, apiKey: 'test-key' });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const url = fetchImpl.mock.calls[0][0];
    expect(url).toContain('atlas.microsoft.com/weather/currentConditions/json');
    expect(url).toContain('query=1.35,103.81');
    expect(url).toContain('unit=metric');
    expect(url).toContain('subscription-key=test-key');

    expect(data).toEqual({
      temperatureC: 28.3,
      phrase: 'Mostly sunny',
      iconCode: 2,
      emoji: expect.any(String)
    });
  });

  test('caches results: second call within TTL does not call fetch again', async () => {
    const fetchImpl = makeFetchOk(samplePayload);
    await getWeather(10, 20, { fetchImpl, apiKey: 'k' });
    await getWeather(10, 20, { fetchImpl, apiKey: 'k' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  test('different coordinates produce separate fetches', async () => {
    const fetchImpl = makeFetchOk(samplePayload);
    await getWeather(10, 20, { fetchImpl, apiKey: 'k' });
    await getWeather(11, 21, { fetchImpl, apiKey: 'k' });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  test('throws when API returns non-ok status', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({}) });
    await expect(
      getWeather(1, 1, { fetchImpl, apiKey: 'k' })
    ).rejects.toThrow(/401/);
  });
});

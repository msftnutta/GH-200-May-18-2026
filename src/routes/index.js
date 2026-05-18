const express = require('express');
const cities = require('../data/cities');
const { getWeather } = require('../services/weather');
const { project, continentPaths, MAP_W, MAP_H } = require('../utils/projection');

const router = express.Router();

const CONTINENT_ORDER = ['Asia', 'Europe', 'North America', 'South America', 'ANZ'];

router.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.get('/', async (req, res, next) => {
  try {
    const results = await Promise.allSettled(
      cities.map((c) => getWeather(c.lat, c.lon))
    );

    const cityViews = cities.map((city, i) => {
      const r = results[i];
      const p = project(city.lon, city.lat);
      const base = { ...city, x: p.x, y: p.y };
      if (r.status === 'fulfilled') {
        return { ...base, weather: r.value, weatherError: null };
      }
      return {
        ...base,
        weather: null,
        weatherError: r.reason && r.reason.message ? r.reason.message : 'Weather unavailable'
      };
    });

    const grouped = CONTINENT_ORDER
      .map((name) => ({ name, cities: cityViews.filter((c) => c.continent === name) }))
      .filter((g) => g.cities.length > 0);

    res.render('index', {
      cities: cityViews,
      grouped,
      continents: continentPaths(),
      mapW: MAP_W,
      mapH: MAP_H,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

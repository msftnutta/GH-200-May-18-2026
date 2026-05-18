const express = require('express');
const cities = require('../data/cities');
const { getWeather } = require('../services/weather');

const router = express.Router();

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
      if (r.status === 'fulfilled') {
        return { ...city, weather: r.value, weatherError: null };
      }
      return {
        ...city,
        weather: null,
        weatherError: r.reason && r.reason.message ? r.reason.message : 'Weather unavailable'
      };
    });

    res.render('index', {
      cities: cityViews,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

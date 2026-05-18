(function () {
  var svg = document.getElementById('world-map');
  var callout = document.getElementById('callout');
  var dataEl = document.getElementById('cities-data');
  if (!svg || !callout || !dataEl) return;

  var cities;
  try {
    cities = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }
  var byId = {};
  cities.forEach(function (c) { byId[c.id] = c; });

  var coName   = document.getElementById('co-name');
  var coCountry= document.getElementById('co-country');
  var coEmoji  = document.getElementById('co-emoji');
  var coClock  = document.getElementById('co-clock');
  var coDate   = document.getElementById('co-date');
  var coTemp   = document.getElementById('co-temp');
  var coPhrase = document.getElementById('co-phrase');

  var current = null;
  var tickHandle = null;

  function formatters(tz) {
    return {
      time: new Intl.DateTimeFormat([], { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      date: new Intl.DateTimeFormat([], { timeZone: tz, weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' })
    };
  }

  function updateClock(city) {
    if (!city) return;
    var f = formatters(city.timezone);
    var now = new Date();
    coClock.textContent = f.time.format(now);
    coDate.textContent  = f.date.format(now);
  }

  function show(city, marker) {
    current = city;
    coName.textContent    = city.name;
    coCountry.textContent = city.country;
    if (city.weather) {
      coEmoji.textContent  = city.weather.emoji || '';
      coTemp.textContent   = city.weather.temperatureC != null ? Math.round(city.weather.temperatureC) + '°C' : '—';
      coPhrase.textContent = city.weather.phrase || '';
    } else {
      coEmoji.textContent  = '🌡️';
      coTemp.textContent   = '—';
      coPhrase.textContent = 'Weather unavailable';
    }
    updateClock(city);

    // Position callout relative to map container
    var container = svg.parentElement;
    var cRect = container.getBoundingClientRect();
    var mRect = marker.getBoundingClientRect();
    var left = mRect.left - cRect.left + mRect.width / 2;
    var top  = mRect.top  - cRect.top;

    callout.classList.remove('hidden');
    var cw = callout.offsetWidth;
    var ch = callout.offsetHeight;

    // Center horizontally on marker, prefer above; flip below if no room
    var x = Math.max(8, Math.min(cRect.width - cw - 8, left - cw / 2));
    var y = top - ch - 12;
    if (y < 8) y = top + 16;
    callout.style.left = x + 'px';
    callout.style.top  = y + 'px';

    if (tickHandle) clearInterval(tickHandle);
    tickHandle = setInterval(function () { updateClock(current); }, 1000);
  }

  function hide() {
    current = null;
    callout.classList.add('hidden');
    if (tickHandle) { clearInterval(tickHandle); tickHandle = null; }
  }

  var markers = svg.querySelectorAll('.marker');
  markers.forEach(function (m) {
    var id = m.getAttribute('data-city-id');
    var city = byId[id];
    if (!city) return;

    m.addEventListener('mouseenter', function () { show(city, m); });
    m.addEventListener('mouseleave', function (e) {
      // Don't hide if pointer entered the callout
      if (callout.contains(e.relatedTarget)) return;
      hide();
    });
    m.addEventListener('focus',  function () { show(city, m); });
    m.addEventListener('blur',   hide);
    m.addEventListener('click',  function (e) { e.stopPropagation(); show(city, m); });
    m.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(city, m); }
      if (e.key === 'Escape') hide();
    });
  });

  // Dismiss on outside click / Esc
  document.addEventListener('click', function (e) {
    if (!svg.contains(e.target) && !callout.contains(e.target)) hide();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hide();
  });
  window.addEventListener('resize', function () {
    if (current) {
      var marker = svg.querySelector('.marker[data-city-id="' + current.id + '"]');
      if (marker) show(current, marker);
    }
  });
})();

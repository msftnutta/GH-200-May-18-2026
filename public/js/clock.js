(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-tz]'));
  if (!cards.length) return;

  var timeFormatters = {};
  var dateFormatters = {};

  function formatters(tz) {
    if (!timeFormatters[tz]) {
      timeFormatters[tz] = new Intl.DateTimeFormat([], {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      dateFormatters[tz] = new Intl.DateTimeFormat([], {
        timeZone: tz,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    }
    return { time: timeFormatters[tz], date: dateFormatters[tz] };
  }

  function tick() {
    var now = new Date();
    cards.forEach(function (card) {
      var tz = card.getAttribute('data-tz');
      var f = formatters(tz);
      var clockEl = card.querySelector('[data-clock]');
      var dateEl = card.querySelector('[data-date]');
      if (clockEl) clockEl.textContent = f.time.format(now);
      if (dateEl) dateEl.textContent = f.date.format(now);
    });
  }

  tick();
  setInterval(tick, 1000);
})();

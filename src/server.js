const createApp = require('./app');

const port = process.env.PORT || 3000;
const app = createApp();

app.listen(port, () => {
  console.log(`World Clock + Weather listening on http://localhost:${port}`);
});

import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.port, () => {
  console.log(`CV API listening on http://localhost:${env.port}`);
  console.log(`Swagger docs: http://localhost:${env.port}/api/docs`);
});

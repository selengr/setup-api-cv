import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.port, () => {
  console.log(`portfolio-api running on http://localhost:${env.port}`);
  console.log(`docs: http://localhost:${env.port}/api/docs`);
});

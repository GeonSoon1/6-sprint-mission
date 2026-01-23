import { PORT } from './lib/constants.js';
import { server } from './app.js';

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

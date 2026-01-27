import server from './app'
import { PORT } from './lib/constants';

//app.listen(PORT || 3000, () => console.log('Server started'));
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
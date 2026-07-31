import App from './App';
import Server from './Server';

export default async function handler(req, res) {
  // Connect to DB before processing request
  await Server(App);
  return App(req, res);
}

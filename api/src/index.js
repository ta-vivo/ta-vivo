import app from './app';
import '@babel/polyfill';
import { MandatoryData } from './database/MandatoryData';
import TelegramService from './services/TelegramService';

async function main() {
  await app.listen(process.env.PORT);
  MandatoryData();
  TelegramService.listenMessages();
  console.log(`Server running: http://localhost:${process.env.PORT} ✅`);
}

main();
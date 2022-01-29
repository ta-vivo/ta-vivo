import app from './app';
import '@babel/polyfill';
import { MandatoryData } from './database/MandatoryData';
import TelegramService from './services/TelegramService';
import CheckService from './services/CheckService';
import {Checks} from './models';

async function main() {
  await app.listen(process.env.PORT);

  await MandatoryData();

  TelegramService.listenMessages();

  // Run again all enabled checks
  const checks = await Checks.findAll({ where: { enabled: true } });
  checks.forEach(check => {
    CheckService.runCheck(check);
  });
  console.log(`Server running: http://localhost:${process.env.PORT} ✅`);
}

main();
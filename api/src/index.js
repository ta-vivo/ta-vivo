import app from './app';
import '@babel/polyfill';
import { MandatoryData } from './database/MandatoryData';

async function main() {
  await app.listen(process.env.PORT);
  MandatoryData();
  console.log(`Server running: http://localhost:${process.env.PORT} ✅`);
}

main();
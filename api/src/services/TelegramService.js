
import TelegramBot from 'node-telegram-bot-api';
import { PendingIntegration } from '../models';

class TelegramService {

  static listenMessages() {
    console.log('👂 Listening messages...');
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

    bot.on('message', async (msg) => {
      if (msg.text === '/start') {
        const uniqueCode = Math.random().toString(36).substring(2, 7);
        await PendingIntegration.create({
          uniqueCode,
          integrationType: 'telegram',
          appUserId: msg.from.id
        });
        bot.sendMessage(msg.chat.id, `Your unique code is: ${uniqueCode}`);
      }
    });
  }

  static async sendMessage({message, userId}) {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    bot.sendMessage(userId, message);
  }

}

export default TelegramService;
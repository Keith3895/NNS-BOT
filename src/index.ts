import { config } from 'dotenv';
config();
import { Bot } from './bot';

const bot = new Bot();
bot.listen().then(() => console.info('logged in')).catch(console.error);

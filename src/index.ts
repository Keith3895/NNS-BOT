import { config } from 'dotenv';
config();
import { Bot } from './bot';

let bot = new Bot();
bot.listen().then(() => console.info('logged in')).catch(console.error);

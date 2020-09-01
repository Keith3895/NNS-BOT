require('dotenv').config();
import {Bot} from "./bot";

let bot = new Bot();
bot.listen().then(() => {
  console.log('Logged in bro!')
}).catch((error) => {
  console.log('Error', error)
});
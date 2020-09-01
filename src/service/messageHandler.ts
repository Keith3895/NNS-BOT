import {Message} from "discord.js";
import {PingHandler} from './pingHandler';

export class MessageHandler {
  private pingHandler: PingHandler;

  constructor() {
    this.pingHandler = new PingHandler;
  }

  handle(message: Message): Promise<Message | Message[]> {
    if (this.pingHandler.isPing(message.content)) {
      return message.reply('pong!');
    }

    return Promise.reject();
  }
}
import { Message } from "discord.js";
import { PingHandler } from './pingHandler';

export class MessageHandler {
    private pingHandler: PingHandler;

    constructor(pingHandler: PingHandler = new PingHandler()) {
        this.pingHandler = pingHandler;
    }

    handle(message: Message): Promise<Message | Message[]> {
        if (this.pingHandler.isPing(message.content)) {
            return message.reply('pong!');
        }
        return Promise.reject();
    }
}
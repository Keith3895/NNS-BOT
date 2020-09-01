import { Client, Message } from "discord.js";
import { MessageHandler } from './service/messageHandler';
export class Bot {
  private client: Client;
  private readonly token: string;
  private messageHandler: MessageHandler;
  constructor() {
    this.client = new Client();
    this.token = process.env.TOKEN;
    this.messageHandler = new MessageHandler();
  }

  public listen(): Promise<string> {
    this.client.on('message', (message: Message) => {
      if (message.author.bot) {
        console.log('Ignoring bot message!')
        return;
      }
      console.log("Message received! Contents: ", message.content);
      this.messageHandler.handle(message).then(() => {
        console.log("Response sent!");
      }).catch(() => {
        console.log("Response not sent.")
      });
    });

    return this.client.login(this.token);
  }
}
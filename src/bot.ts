import { Client, Message } from 'discord.js';
import { MessageHandler } from './service/messageHandler';
import CommandHandler from './service/commandHandler';
import { escapeRegex } from './service/utils';
export class Bot {

  private client: Client;
  private readonly token: string;
  private readonly PREFIX: string;

  private messageHandler: MessageHandler;
  private commandHandler: CommandHandler;

  constructor() {
    this.client = new Client();
    this.token = process.env.TOKEN;
    this.PREFIX = process.env.PREFIX;
    this.client['prefix'] = this.PREFIX;
    this.messageHandler = new MessageHandler();
    this.commandHandler = new CommandHandler();
    this.client['commands'] = new Map();
    this.initCommands();
  }

  private initCommands() {
    this.commandHandler.commandLoader().forEach(cmdInst => {
      this.client['commands'].set(cmdInst.name, cmdInst);
    });
  }

  public listen(): Promise<string> {

    // this.client.on('ready', () => {
    //   // console.log(`${this.client.user.username} ready!`);
    // this.client.user.setActivity(`${this.PREFIX}help`);
    // });
    this.client.on('warn', console.warn);
    this.client.on('error', console.error);


    this.client.on('message', (message: Message) => {
      // Ignoring bot message.
      if (message.author.bot) return;
      // console.log('Message received! Contents: ', message);
      if (message.channel.type === 'dm') {
        this.messageHandler.handle(message).then(console.warn).catch(console.warn);
      } else {
        /**
         * the following block is to ignore quotes.
         */
        let prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(this.PREFIX)})\\s*`);
        if (!prefixRegex.test(message.content)) return;

        let [, matchedPrefix] = message.content.match(prefixRegex);
        let args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        let commandName = args.shift().toLowerCase();
        let command = this.client['commands'].get(commandName); // write a finder method
        if (!command)
          return;
        try {
          command.execute(message, args);
        } catch (error) {
          console.error(error);
          message.reply('There was an error executing that command.').catch(console.error);
        }
      }
    });

    return this.client.login(this.token);
  }
}

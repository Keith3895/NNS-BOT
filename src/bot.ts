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

  constructor(
    client?: Client,
    messageHandler?: MessageHandler,
    commandHandler?: CommandHandler
  ) {
    this.client = client || new Client();
    this.token = process.env.TOKEN;
    this.PREFIX = process.env.PREFIX;
    this.client['prefix'] = this.PREFIX;
    this.messageHandler = messageHandler || new MessageHandler();
    this.commandHandler = commandHandler || new CommandHandler();
    this.client['commands'] = new Map();
    this.initCommands();
  }

  private initCommands() {
    let cmdList = this.commandHandler.commandLoader();
    if (!cmdList) return [];
    cmdList.forEach(cmdInst => {
      this.client['commands'].set(cmdInst.name || 'cmd', cmdInst);
    });
  }

  public listen(): Promise<string> {

    // this.client.on('ready', () => {
    //   // console.log(`${this.client.user.username} ready!`);
    // this.client.user.setActivity(`${this.PREFIX}help`);
    // });
    this.client.on('warn', console.warn);
    this.client.on('error', console.error);


    this.client.on('message', this.messageEventHandler);

    return this.client.login(this.token);
  }
  messageEventHandler = (message: Message) => {
    // Ignoring bot message.
    if (message.author.bot) return 'bot message';
    // console.log('Message received! Contents: ', message);
    if (message.channel.type === 'dm') {
      this.messageHandler.handle(message).then(console.warn).catch(console.warn);
      return 'DM handled';
    } else {
      /**
       * the following block is to ignore quotes.
       */
      let botID = this.client.user ? this.client.user.id : '';
      let prefixRegex = new RegExp(`^(<@!?${botID}>|${escapeRegex(this.PREFIX)})\\s*`);
      if (!prefixRegex.test(message.content)) return 'quote or not a command.';

      let [, matchedPrefix] = message.content.match(prefixRegex);
      let args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
      let commandName = args.shift().toLowerCase();
      let command = this.client['commands'].get(commandName); // write a finder method
      if (!command)
        return 'not a command.';
      try {
        command.execute(message, args);
        return 'executed command.';
      } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.').catch(console.error);
      }
    }
  }
}

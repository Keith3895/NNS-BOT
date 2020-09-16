import { Client, Message } from 'discord.js';
import { MessageHandler } from './service/messageHandler';
import CommandHandler from './service/commandHandler';
import { escapeRegex } from './service/utils';
import CooldownHandler from './service/cooldownService';
export class Bot {

  private client: Client;
  private readonly token: string;
  private readonly PREFIX: string;

  private messageHandler: MessageHandler;
  private commandHandler: CommandHandler;
  private cooldownHandler: CooldownHandler;
  constructor(
    client?: Client,
    messageHandler?: MessageHandler,
    commandHandler?: CommandHandler,
    cooldownHandler?: CooldownHandler
  ) {
    this.client = client || new Client();
    this.token = process.env.TOKEN;
    this.PREFIX = process.env.PREFIX;
    this.client['prefix'] = this.PREFIX;
    this.messageHandler = messageHandler || new MessageHandler();
    this.commandHandler = commandHandler || new CommandHandler();
    this.cooldownHandler = cooldownHandler || new CooldownHandler();
    this.client['commands'] = new Map();
    this.initCommands();
  }

  private initCommands() {
    const cmdList = this.commandHandler.commandLoader();
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
  private cooldown(command): boolean {
    if (process.env.PRO)
      return true;
    return this.cooldownHandler.isCooldown(command);
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
      const botID = this.client.user ? this.client.user.id : '';
      const prefixRegex = new RegExp(`^(${escapeRegex(this.PREFIX)})\\s*`);
      if (!prefixRegex.test(message.content)) return 'quote or not a command.';

      const [, matchedPrefix] = message.content.match(prefixRegex);
      const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = this.client['commands'].get(commandName); // write a finder method
      if (!command)
        return 'not a command.';
      try {
        if (this.cooldown(command)) {
          message.reply(`the ${command.name} command has to cooldown before you can use it again.`).catch(console.error);
          return 'cooldown';
        }
        this.cooldownHandler.cooldown = command;
        command.execute(message, args);
        return 'executed command.';
      } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.').catch(console.error);
      }
    }
  }
}

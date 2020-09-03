import { MessageEmbed } from 'discord.js';
import { cmdArgsParser } from '../service/utils';
export class HelpCommand {
    // constructor(){}
    readonly name: string = 'help';
    readonly alias: string = 'help';
    readonly description: string = `
    Display all commands and descriptions
    `;
    execute(message) {
        let args = cmdArgsParser(message.content, message.client.prefix, this.name);
        let helpEmbed = new MessageEmbed();
        let commands = message.client.commands;
        helpEmbed.setTitle('nns-bot Help')
            .setColor('#F8AA2A');
        args = args.replace(message.client.prefix, '');
        let cmdAsArg = message.client.commands.get(args);
        if (args && cmdAsArg && cmdAsArg.name !== this.name) {
            helpEmbed.addField(
                `**${message.client.prefix}${cmdAsArg.name} ${cmdAsArg.aliases ? `(${cmdAsArg.aliases})` : ''}**`,
                `${cmdAsArg.man}`,
                true
            );
        } else {
            helpEmbed.setDescription('List of all commands');
            commands.forEach((cmd) => {
                helpEmbed.addField(
                    `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ''}**`,
                    `${cmd.description}`,
                    true
                );
            });
        }
        helpEmbed.setTimestamp();
        return message.channel.send(helpEmbed).catch(console.error);
    }
}

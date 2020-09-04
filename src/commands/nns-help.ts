import { MessageEmbed } from 'discord.js';
import { cmdArgsParser } from '../service/utils';
export class HelpCommand {
    // constructor(){}
    readonly name: string = 'help';
    readonly alias: string = 'help';
    readonly description: string = `
    Display all commands and descriptions
    `;
    execute(message, args, prefix = message.client.prefix, commands = message.client.commands) {
        const helpEmbed = new MessageEmbed();
        helpEmbed.setTitle('nns-bot Help')
            .setColor('#F8AA2A')
            .setTimestamp();
        if (args) {
            args = args[0].replace(prefix, '');
            const cmdAsArg = commands.get(args);
            if (cmdAsArg && cmdAsArg.name !== this.name) {
                helpEmbed.addField(
                    `**${prefix}${cmdAsArg.name} ${cmdAsArg.aliases ? `(${cmdAsArg.aliases})` : ''}**`,
                    `${cmdAsArg.man}`,
                    true
                );
                try {
                    message.channel.send(helpEmbed);
                } catch (e) {
                    console.error(e);
                }
                return helpEmbed;
            }
        }
        helpEmbed.setDescription('List of all commands');
        commands.forEach((cmd) => {
            helpEmbed.addField(
                `**${prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ''}**`,
                `${cmd.description}`,
                true
            );
        });
        try {
            message.channel.send(helpEmbed);
        } catch (e) {
            console.error(e);
        }
        return helpEmbed;
    }
}

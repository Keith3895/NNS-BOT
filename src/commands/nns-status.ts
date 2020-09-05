import { MessageEmbed } from 'discord.js';
import Jira from '../service/jiraApiHandler';

export class StatusCommand {
    readonly name: string = 'status';
    readonly alias: string = 'status';
    private jiraApiHandler: Jira;
    constructor(jiraApiHandler?: Jira) {
        this.jiraApiHandler = jiraApiHandler || new Jira();
    }
    execute(message, args, prefix = message.client.prefix, commands = message.client.commands) {
        const helpEmbed = new MessageEmbed();
        if (args && args.length > 0) {
            args = args[0].replace(prefix, '');
            const cmdAsArg = commands.get(args);
            this.jiraApiHandler.getTicketStatus(args).then(status => {
                helpEmbed.setColor('#8B0000')
                    .setTitle(`${status.project.name}`)
                    .setURL(`${status.project.self}`)
                    .setDescription(`${status.summary}`)
                    .addFields(
                        { name: 'Assignee', value: `${status.assignee.displayName}`, inline: true },
                        { name: 'Reporter', value: `${status.reporter.displayName}`, inline: true },
                        { name: 'Status', value: `${status.status.name}` }
                    )
                    .setTimestamp()

                try {
                    message.channel.send(helpEmbed);
                } catch (e) {
                    console.error(e);
                }
                return helpEmbed;
            }).catch(e => console.error(e))
        }

    }

}
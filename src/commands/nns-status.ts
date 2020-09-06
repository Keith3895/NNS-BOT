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
        helpEmbed.type = 'rich';
        if (args && args.length > 0) {
            args = args[0].replace(prefix, ''); /**Processes only the first word */
            const cmdAsArg = commands.get(args);
            this.jiraApiHandler.getTicketStatus(args).then(status => {
                if (status && status.hasOwnProperty('errorMessages')) {
                    helpEmbed.setColor('#FF0000')
                        .setTitle(`Invalid Ticket or Permission is denied!`)
                        .setDescription(`${status.errorMessages[0]}`)
                        .setTimestamp();
                }
                if (status && status.hasOwnProperty('fields')) {
                    helpEmbed.setColor('#00ff00')
                        .setTitle(`${status.fields.project.name}`)
                        .setURL(`${status.fields.project.self}`)
                        .setDescription(`${status.fields.summary}`)
                        .setTimestamp();
                    helpEmbed.addField('Assignee', status.fields.assignee ? `${status.fields.assignee.displayName}` : 'Not Assigned', true);
                    if (status.fields.reporter && status.fields.reporter.hasOwnProperty('displayName')) {
                        helpEmbed.addField('Reporter', `${status.fields.reporter.displayName}`, true);
                    }
                    helpEmbed.addField('Status', `${status.fields.status.name}`, false);
                }
                try {
                    message.channel.send(helpEmbed);
                } catch (e) {
                    console.error(e);
                }
                return helpEmbed;
            }).catch(e => console.error(e))
        }
        helpEmbed.setColor('#F8AA2A')
            .setTitle('nns-bot Status')
            .setDescription('Supported Command')
            .addField('!nns.status ABC-101', 'Displays the status of the entered JIRA Ticket.', true)
            .setTimestamp();
        try {
            message.channel.send(helpEmbed);
        } catch (e) {
            console.error(e);
        }
        return helpEmbed;

    }

}
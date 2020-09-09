import { MessageEmbed } from 'discord.js';
import Jira from '../service/jiraApiHandler';

export class StatusCommand {
    readonly name: string = 'status';
    readonly alias: string = 'status';
    readonly description: string = `Key in !nns.status <JIRATICKET> to get status`;
    readonly man: string = `Displays the status of the entered JIRA Ticket.`;
    private jiraApiHandler: Jira;
    constructor(jiraApiHandler?: Jira) {
        this.jiraApiHandler = jiraApiHandler || new Jira();
    }
    async execute(message, args, prefix = message.client.prefix, commands = message.client.commands) {
        const helpEmbed = new MessageEmbed();
        let jiraResponse;
        helpEmbed.type = 'rich';
        if (args && args.length > 0) {

            try {
                jiraResponse = await this.jiraApiHandler.getTicketStatus(args[0]);

                if (jiraResponse && jiraResponse.hasOwnProperty('errorMessages')) {
                    helpEmbed.setColor('#FF0000')
                        .setTitle(`Invalid Ticket or Permission is denied!`)
                        .setDescription(`${jiraResponse['errorMessages'][0]}`)
                .setTimestamp();
                }
                if (jiraResponse && jiraResponse.hasOwnProperty('fields')) {
                    helpEmbed.setColor('#00ff00')
                        .setTitle(`${jiraResponse['fields'].project.name}`)
                        .setURL(`${jiraResponse['fields'].project.self}`)
                        .setDescription(`${jiraResponse['fields'].summary}`)
                        .setTimestamp();
                    helpEmbed.addField('Assignee', jiraResponse['fields'].assignee
                        ? `${jiraResponse['fields'].assignee.displayName}`
                        : 'Not Assigned', true);
                    if (jiraResponse['fields'].reporter
                        && jiraResponse['fields'].reporter.hasOwnProperty('displayName')) {
                        helpEmbed.addField('Reporter', `${jiraResponse['fields'].reporter.displayName}`, true);
                    }
                    helpEmbed.addField('Status', `${jiraResponse['fields'].status.name}`, false);
                }
                try {
                    message.channel.send(helpEmbed);
                }
                catch (e) {
                    console.error(e);
                }
                return helpEmbed;
            } catch (e) {
                console.error(e);
            }
        }
        helpEmbed.setColor('#F8AA2A')
            .setTitle('JIRA Ticket Status')
            .setDescription('Supported Command')
            .addField('!nns.status <TicketRef>', 'Displays the status of the entered JIRA Ticket.', true)
            .setTimestamp();
        try {
            message.channel.send(helpEmbed);
        } catch (e) {
            console.error(e);
        }
        return helpEmbed;
    }
}

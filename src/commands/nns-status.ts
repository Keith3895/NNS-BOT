import { MessageEmbed } from 'discord.js';
import Jira from '../service/jiraApiHandler';

export class StatusCommand {
    readonly name: string = 'status';
    readonly alias: string = 'status';
    readonly description: string = `Displays the status of the entered JIRA Ticket.`;
    readonly man: string = `Key in !nns.status <JIRATICKET> to get status`;
    readonly cooldown = 5000;
    private jiraApiHandler: Jira;
    constructor(jiraApiHandler?: Jira) {
        this.jiraApiHandler = jiraApiHandler || new Jira();
    }
    async execute(message, args, prefix = message.client.prefix) {
        const statusEmbed = new MessageEmbed();
        let jiraResponse;
        statusEmbed.type = 'rich';
        if (args && args.length > 0) {

            try {
                jiraResponse = await this.jiraApiHandler.getTicketStatus(args[0]);

                if (jiraResponse && jiraResponse.hasOwnProperty('errorMessages')) {
                    statusEmbed.setColor('#FF0000')
                        .setTitle(`Invalid Ticket or Permission is denied!`)
                        .setDescription(`${jiraResponse['errorMessages'][0]}`)
                        .setTimestamp();
                }
                if (jiraResponse && jiraResponse.hasOwnProperty('fields')) {
                    statusEmbed.setColor('#00ff00')
                        .setTitle(`${jiraResponse['fields'].project.name}`)
                        .setURL(`${jiraResponse['fields'].project.self}`)
                        .setDescription(`${jiraResponse['fields'].summary}`)
                        .setTimestamp();
                        statusEmbed.addField('Assignee', jiraResponse['fields'].assignee
                        ? `${jiraResponse['fields'].assignee.displayName}`
                        : 'Not Assigned', true);
                    if (jiraResponse['fields'].reporter
                        && jiraResponse['fields'].reporter.hasOwnProperty('displayName')) {
                            statusEmbed.addField('Reporter', `${jiraResponse['fields'].reporter.displayName}`, true);
                    }
                    statusEmbed.addField('Status', `${jiraResponse['fields'].status.name}`, false);
                }
                try {
                    message.channel.send(statusEmbed);
                }
                catch (e) {
                    console.error(e);
                }
                return statusEmbed;
            } catch (e) {
                console.error(e);
            }
        }
        statusEmbed.setColor('#F8AA2A')
            .setTitle('JIRA Ticket Status')
            .setDescription(this.description)
            .addField(`${prefix}${this.alias}`, this.man, true)
            .setTimestamp();
        try {
            message.channel.send(statusEmbed);
        } catch (e) {
            console.error(e);
        }
        return statusEmbed;
    }
}

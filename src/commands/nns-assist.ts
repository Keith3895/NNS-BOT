import { Message, MessageEmbed } from 'discord.js';
import Jira from '../service/jiraApiHandler';

export class AssistCommand {
    private jiraApiHandler: Jira;

    readonly name: string = 'assist';
    readonly alias: string = 'assist';
    readonly description: string = `Displays  the comprehensive information of entered title/description/JIRA ticket.`;
    readonly man: string = `!nns.assist followed by  title/description/ticket reference  to get information of issues.`;
    readonly cooldown = 9000;
    constructor(jiraApiHandler?: Jira) {
        this.jiraApiHandler = jiraApiHandler || new Jira();

    }

    async execute(message, args, prefix = message.client.prefix) {
        const assistEmbed = new MessageEmbed();
        assistEmbed.type = 'rich';
        let filterQuery;
        let jiraResp;
        let searchObj = {
            'maxResults': 15,
            'fieldsByKeys': false,
            'fields': [
                'summary',
                'status',
                'assignee',
                'reporter',
                'project'],
            'startAt': 0
        };
        if (args && args.length > 0) {
            try {
                filterQuery = this.prepareSearchFilter(args);
                searchObj = Object.assign(searchObj, { 'jql': filterQuery });
                jiraResp = await this.jiraApiHandler.searchIssue(searchObj);
                if (jiraResp && jiraResp.errorMessages) {
                    assistEmbed.setColor('#FF0000')
                        .setTitle(`Invalid Search Key`)
                        .setDescription('Please try with valid description or ticket reference.')
                        .setTimestamp();
                    message.channel.send(assistEmbed);
                    return assistEmbed;
                }
                if (jiraResp && jiraResp.issues && jiraResp.issues.length > 0) {
                    assistEmbed.setColor('#00ff00')
                        .setTitle(jiraResp['issues'][0].fields.project.name)
                        .setTimestamp();
                    jiraResp.issues.forEach((issue) => {
                        assistEmbed.addField(
                            `**${issue.key}**`,
                            `${issue.fields.summary}`,
                            false
                        );
                    });
                    message.channel.send(assistEmbed);
                    return assistEmbed;
                }
                if (jiraResp && jiraResp.issues && jiraResp.issues.length === 0) {
                    message.reply('The entered issue does not exists. Do you want to create one? If Yes, Please use !nns.bug command to raise the ticket');
                    return 'Issue Does not exists';
                }
            } catch (e) {
                return e;
            }
        }
        assistEmbed.setColor('#F8AA2A')
            .setTitle('nns-bot Assist')
            .setDescription(this.description)
            .addField(`${prefix}${this.alias}`, this.man, true)
            .setTimestamp();
        message.channel.send(assistEmbed);
        return assistEmbed;
    }

    public prepareSearchFilter(searchkeys) {
        const searchText = searchkeys.join(' ');
        const issueKeys = searchText.match(/((?!([A-Z0-9a-z]{1,10})-?$)[A-Z]{1}[A-Z0-9]+-\d+)/g);
        let filterQuery = `project = ${process.env.PROJECT_ID} AND `;
        if (issueKeys && issueKeys.length > 0) {
            filterQuery += 'issueKey IN (keys)';
            filterQuery = filterQuery.replace(/keys/ig, '\'' + issueKeys.join('\',\'') + '\'');
        }
        else
            filterQuery += `summary ~ \'${searchText}\'`;
        return filterQuery;
    }
}

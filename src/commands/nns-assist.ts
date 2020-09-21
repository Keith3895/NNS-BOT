import { Message, MessageEmbed } from 'discord.js';
import Jira from '../service/jiraApiHandler';

export class AssistCommand {
    private jiraApiHandler: Jira;

    readonly name: string = 'assist';
    readonly alias: string = 'assist';
    readonly description: string = `Displays  the comprehensive information of entered title/description/JIRA ticket.`;
    readonly man: string = `!nns.assist followed by  title/description/ticket reference  to get information of issues.`;
    constructor(jiraApiHandler?: Jira) {
        this.jiraApiHandler = jiraApiHandler || new Jira();

    }

    execute(message, args, prefix = message.client.prefix) {
        const assistEmbed = new MessageEmbed();
        let filterQuery;
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
            filterQuery = this.prepareSearchFilter(args);
            searchObj = Object.assign(searchObj, { 'jql': filterQuery });
            this.jiraApiHandler.searchIssue(searchObj).then((result: object) => {
                this.respondResultEmbed(result, message);
            }).catch(err => {
                message.reply('Failed to get the information. Please retry');
                return new Error('Search API failed!');
            });
        }
        else {
            assistEmbed.setColor('#F8AA2A')
                .setTitle('nns-bot Assist')
                .setDescription(this.description)
                .addField(`${prefix}${this.alias}`, this.man, true)
                .setTimestamp();
            message.channel.send(assistEmbed);
        }

    }

    /**
     * Replies and returns an bug MessageEmbed
     * @param jiraResp : Jira Response Object that needs to be mapped
     * @param message : message instnace of type message
     */
    private respondResultEmbed(jiraResp, message: Message) {
        const assistEmbed = new MessageEmbed();
        let projectName;
        if (jiraResp && jiraResp.errorMessages) {
            assistEmbed.setColor('#FF0000')
                .setTitle(`Invalid Ticket or Ticket does not exists!`)
                .setDescription(`${jiraResp['errorMessages'][0]}`)
                .setTimestamp();
            message.channel.send(assistEmbed);

        }
        else if (jiraResp && jiraResp.issues && jiraResp.issues.length > 0) {
            projectName = jiraResp['issues'][0].fields.project.name;
            assistEmbed.setColor('#00ff00')
                .setTitle(projectName)
                .setTimestamp();
            jiraResp.issues.forEach((issue) => {
                assistEmbed.addField(
                    `**${issue.key}**`,
                    `${issue.fields.summary}`,
                    false
                );
            });
            message.channel.send(assistEmbed);
        }
        else {
            message.reply('The entered issue does not exists. Do you want to create one? If Yes, Please use !nns.bug command to raise the ticket');
        }

        return assistEmbed;
    }

    private prepareSearchFilter(searchkeys) {
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

import { Message, MessageEmbed } from 'discord.js';
import Jira from '../service/jiraApiHandler';
const ITERATOR_LIMIT = 4;
export class BugCommand {

    readonly name: string = 'bug';
    readonly alias: string = 'bug';
    private jiraApiHandler: Jira;
    readonly timeoutDuration: number = 120000;
    readonly description: string = `Initaites bug creation flow`;
    readonly man: string = `!nns.bug followed by the responses for queries creates an bug`;
    constructor(jiraApiHandler?: Jira) {
        this.jiraApiHandler = jiraApiHandler || new Jira();
    }

    execute(message: Message) {

        const filter = m => m.author.id === message.author.id;
        const bugQueries = ['Bug Initation Started',
            'Please enter the bug description ..!',
            'Please enter bug severity ..!',
            'Please confirm the above bug . Reply Yes , if ok , else No'];
        const iterator = 1;
        message.reply('Please enter the bug title in 10 seconds ...!');
        return this.initaiteCollector(filter, message, bugQueries, this.timeoutDuration, iterator).then(res => {
            if (res['confirm'] && (res['confirm'].toLowerCase() === 'y' || res['confirm'].toLowerCase() === 'yes')) {
                // Call JIRA create issue API
                const bugObj = {
                    'summary' : res['title'],
                    'issuetype': 'Bug',
                    'description' : res['description'],
                    'priority' : res['severity']
                };
                this.jiraApiHandler.createIssue(bugObj).then((result: object) => {
                    // Send success Embed
                    const resultObject = {
                        ...result,
                        ...res
                    };
                    this.respondResultEmbed(resultObject, message);
                }).catch(err => {
                    message.reply('Bug creation failed . Please retry');
                    res['error'] = true;
                    return new Error('Bug creation failed');
                });
            } else {
                message.reply('Bug creation cancelled');
            }
            return res;
        }).catch(err => {
            return err;
        });
    }

    /**
     * Iniaties and message collector
     * @param filter : Filter check for messages
     * @param message : message content of type {Message}
     * @param replyContent : Queries needs to ne replied
     * @param timeout : Timeout duration of the message
     * @param iterator : Iterator count
     * @param bug : Empty object that need to responses with replies
     */
    public initaiteCollector(filter, message: Message, replyContent: string[], timeout: number, iterator, bug = {}) {
        return this.awaitMessenger(filter, message, replyContent, timeout, iterator).then(res => {
            const keys = ['title', 'description', 'severity', 'confirm'];
            bug[keys[iterator - 1]] = res['collected'].first().content;
            iterator++;
            if (res['done']) {
                return bug;
            } else {
                return this.initaiteCollector(filter, message, replyContent, timeout, iterator, bug);
            }
        }).catch(e => {
            return new Error(e);
        });
    }

    /**
     * Awaits to messages till the end of iterator loop
     * @param filter  : Filter check for messages
     * @param message : message content of type {Message}
     * @param replyContent : Queries needs to ne replied
     * @param timeout : Timeout duration of the message
     * @param iterator : Iterator count
     */
    public awaitMessenger(filter, message: Message, replyContent: string[], timeout: number, iterator) {
        return new Promise((resolve, reject) => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: timeout
            }).then(collected => {
                if (!collected.first()) {
                    throw new Error('Timeout , Please initaite from start');
                }
                const resp = { 'collected': collected };
                if (iterator === ITERATOR_LIMIT) {
                    resp['done'] = true;
                } else {
                    message.reply(replyContent[iterator]);
                }
                resolve(resp);
            }).catch(err => {
                message.channel.send('Timeout , Please initaite from start');
                return reject(err);
            });
        });
    }

    /**
     * Replies and returns an bug MessageEmbed
     * @param embedObj : Bug Object that needs to be mapped
     * @param message : message instnace of type message
     */
    private respondResultEmbed(embedObj, message: Message) {
        const projectName = embedObj['key'].split('-')[0];
        const bugUrl = `https://${process.env.JIRA_HOST}/browse/${embedObj['key']}`;
        const bugEmbed = new MessageEmbed();
        bugEmbed.setColor('#DA0317')
            .setTitle(embedObj['title'])
            .setAuthor(embedObj['key'], 'attachment://project.png', bugUrl)
            .setDescription(embedObj['description'])
            .setThumbnail('attachment://bug.png')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Priority', value: embedObj['severity'], inline: true },
                { name: '\u200B', value: '\u200B' }
            )
            .attachFiles(['./src/assets/bug.png'])
            .attachFiles(['./src/assets/project.png'])
            .setTimestamp()
            .setFooter(projectName, 'attachment://bug.png');
        message.channel.send(bugEmbed);
        return bugEmbed;
    }
}

import { Message, MessageEmbed } from 'discord.js';
import Jira from '../service/jiraApiHandler';
const ITERATOR_LIMIT = 3;
export class FeatureCommand {

    readonly name: string = 'feature';
    readonly alias: string = 'feature';
    private jiraApiHandler: Jira;
    readonly timeoutDuration: number = 120000;
    public creationFailed = false;
    readonly description: string = `Initaites feature creation flow`;
    readonly man: string = `!nns.feature followed by the responses for queries creates an feature`;
    constructor(jiraApiHandler?: Jira) {
        this.jiraApiHandler = jiraApiHandler || new Jira();
    }

    execute(message: Message) {

        const filter = m => m.author.id === message.author.id;
        const featureQueries = ['Feature Initaition',
            'Please enter feature description',
            'Please confirm the above feature . Reply Yes , if ok , else No'];
        const iterator = 1;
        message.reply('Please enter feature title');
        return this.initaiteCollector(filter, message, featureQueries, this.timeoutDuration, iterator).then(res => {
            if (res['confirm'] && (res['confirm'].toLowerCase() === 'y' || res['confirm'].toLowerCase() === 'yes')) {
                // Call JIRA create issue API
                const featureObj = {
                    'fields': {
                        'summary': res['title'] || 'NA',
                        'issuetype': {
                            'name': 'Story'
                        },
                        'project': {
                            'id': process.env.PROJECT_ID
                        },
                        'priority': {
                            'name':  'Medium'
                        },
                        'description': {
                            'type': 'doc',
                            'version': 1,
                            'content': [
                                {
                                    'type': 'paragraph',
                                    'content': [
                                        {
                                            'text': res['description'],
                                            'type': 'text'
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                };
                this.jiraApiHandler.createIssue(featureObj).then((result: object) => {
                    // Send success Embed
                    const resultObject = {
                        ...result,
                        ...res
                    };
                    this.respondResultEmbed(resultObject, message);
                }).catch(err => {
                    message.reply('Feature creation failed . Please retry');
                    this.creationFailed = true;
                    return new Error('Feature creation failed');
                });
            } else {
                message.reply('Feature creation cancelled');
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
            const keys = ['title', 'description', 'confirm'];
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
        const featureUrl = `https://${process.env.JIRA_HOST}/browse/${embedObj['key']}`;
        const featureEmbed = new MessageEmbed();
        featureEmbed.setColor('#05A7F5')
            .setTitle(embedObj['title'])
            .setAuthor(embedObj['key'], 'attachment://project.png', featureUrl)
            .setDescription(embedObj['description'])
            .setThumbnail('attachment://story.jpg')
            .attachFiles(['./src/assets/story.jpg'])
            .attachFiles(['./src/assets/project.png'])
            .setTimestamp()
            .setFooter(projectName, 'attachment://story.jpg');
        message.channel.send(featureEmbed);
        return featureEmbed;
    }
}

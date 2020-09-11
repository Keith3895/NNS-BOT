import { Message, MessageEmbed } from 'discord.js';
import Jira from '../service/jiraApiHandler';
export class BugCommand {
    // constructor(){}
    readonly name: string = 'bug';
    readonly alias: string = 'bug';
    private jiraApiHandler: Jira;
    readonly timeoutDuration: number = 120000;
    constructor(jiraApiHandler?: Jira) {
        this.jiraApiHandler = jiraApiHandler || new Jira();
    }
    execute(message: Message) {

        const filter = m => m.author.id === message.author.id;
        let bugQueries = ['Please enter the bug title in 10 seconds ...!',
            'Please enter the bug description ..!',
            'Please enter bug severity ..!',
            'Please confirm the above bug . Reply Yes , if ok , else No'];
        let iterator = 1;
        message.reply('Please enter the bug title in 10 seconds ...!');
        return this.initaiteCollector(filter, message, bugQueries, this.timeoutDuration, iterator).then(res => {
            if (res['confirm'] && (res['confirm'].toLowerCase() === 'y' || res['confirm'].toLowerCase() === 'yes')) {
                // Call JIRA create issue API
                let bugObj = {
                    'fields': {
                        'summary': res['title'] || 'NA',
                        'issuetype': {
                            'name': 'Bug'
                        },
                        'project': {
                            'id': process.env.PROJECT_ID
                        },
                        'priority': {
                            'name': res['severity'] || 'Medium'
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
                this.jiraApiHandler.createIssue(bugObj).then((result: any) => {
                    // Send success Embed
                    let resultObject = {
                        ...result,
                        ...res
                    };
                    this.respondResultEmbed(resultObject, message);
                }).catch(err => {
                    return err;
                });
            }
            return res;
        }).catch(err => {
            return err;
        });

    }

    public initaiteCollector(filter, message: Message, replyContent: string[], timeout: number, iterator, bug = {}) {
        return this.awaitMessenger(filter, message, replyContent, timeout, iterator).then(res => {
            let keys = ['title', 'description', 'severity', 'confirm'];
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


    public awaitMessenger(filter, message: Message, replyContent: string[], timeout: number, iterator) {
        return new Promise((resolve, reject) => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: timeout
            }).then(collected => {
                if (!collected.first()) {
                    throw new Error('Timeout , Please initaite from start');
                }
                let resp = { 'collected': collected };
                if (iterator === 4) {
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


    public respondResultEmbed(embedObj, message: Message) {
        let projectName = embedObj['key'].split('-')[0];
        const bugEmbed = new MessageEmbed();
        bugEmbed.setColor('#DA0317')
            .setTitle(embedObj['title'])
            .setAuthor(embedObj['key'], 'attachment://project.png', `https://${process.env.JIRA_HOST}/browse/${embedObj['key']}`)
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

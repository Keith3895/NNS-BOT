import { Message } from 'discord.js';

export class BugCommand {
    // constructor(){}
    readonly name: string = 'bug';
    readonly alias: string = 'bug';
    execute(message: Message) {

        const filter = m => m.author.id === message.author.id;
        let bugQueries = ['Please enter the bug title in 10 seconds ...!',
            'Please enter the bug description ..!',
            'Please enter bug severity ..!',
            'Please confirm the above bug . Reply Yes , if ok , else No'];
        let iterator = 1;
        message.reply('Please enter the bug title in 10 seconds ...!');
        return this.initaiteCollector(filter, message, bugQueries, 10000, iterator).then(res => {
            // console.log(res);
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
                return this.initaiteCollector(filter, message, replyContent, 10000, iterator, bug);
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
                let resp = { 'collected': collected };
                if (iterator === 4){
                    resp['done'] = true;
                    replyContent.push('Bug creation initiated');
                }
                message.reply(replyContent[iterator]);
                resolve(resp);
            }).catch(err => {
                message.channel.send('Oops. Please retry from start');
                reject(err);
            });
        });
    }
}

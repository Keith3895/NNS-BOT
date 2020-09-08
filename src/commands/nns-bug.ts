import { MessageEmbed, Message } from 'discord.js';

export class BugCommand {
    // constructor(){}
    readonly name: string = 'bug';
    readonly alias: string = 'bug';
    execute(message: Message) {

        const filter = m => m.author.id === message.author.id;
        let mes = ['Please enter the bug title in 10 seconds ...!',
            'Please enter the bug description ..!',
            'Please enter bug severity ..!',
            'Please confirm the above bug . Reply Yes , if ok , else No'];
        let iterator = 1;
        message.reply('Please enter the bug title in 10 seconds ...!');
        this.initaiteCollector(filter, message, mes, 10000, iterator).then(res => {
            console.log(res);
        });


        // return msg_1;
        // let bugObject = {
        //     name: '',
        //     description: '',
        //     severity: ''
        // }

        // message.channel.awaitMessages(filter, {
        //     max: 1,
        //     time: 10000
        // }).then(collected_1 => {
        //     bugObject.name = collected_1.first().content;
        //     message.reply('Please enter bug desc in 10 sec ..!').then(r => r.delete({ timeout: 10000 }));
        //     message.channel.awaitMessages(filter, {
        //         max: 1,
        //         time: 10000
        //     }).then(collected_2 => {
        //         bugObject.description = collected_2.first().content;
        //         message.reply('Please enter bug severity ..!').then(r => r.delete({ timeout: 10000 }));
        //         message.channel.awaitMessages(filter, {
        //             max: 1,
        //             time: 20000
        //         }).then(collected_3 => {
        //             bugObject.severity = collected_3.first().content;
        //             const bugEmbed = new MessageEmbed();
        //             bugEmbed.setColor('#DA0317')
        //                 .setTitle(`${bugObject.name}`)
        //                 .setAuthor('Project X', 'attachment://project.png', 'https://discord.js.org')
        //                 .setDescription(`${bugObject.description}`)
        //                 .setThumbnail('attachment://bug.png')
        //                 .attachFiles(['./src/assets/bug.png'])
        //                 .attachFiles(['./src/assets/project.png'])
        //                 .setTimestamp()
        //                 .setFooter(`Severity : ${bugObject.severity}`, 'https://i.imgur.com/wSTFkRM.png');
        //             message.channel.send(bugEmbed).then(r_1 => {
        //                 message.reply('Please confirm the above bug . Reply Yes , if ok , else No');
        //             });
        //             message.channel.awaitMessages(filter, {
        //                 max: 1,
        //                 time: 20000
        //             }).then(collected_4 => {
        //                 if (collected_4 && collected_4.first().content.trim().toLowerCase() === 'yes')
        //                     return message.reply('Bug created successfully');
        //                 else
        //                     return message.reply('Bug creation cancelled');
        //             }).catch(err => {
        //                 return message.reply('Timeout , Please initaite from start');
        //             });
        //         }).catch(err => {
        //             return message.reply('Timeout , Please initaite from start');
        //         });
        //     }).catch(err => {
        //         return message.reply('Timeout , Please initaite from start');
        //     });
        // }).catch(err => {
        //     return message.reply('Timeout , Please initaite from start');
        // });


    }
    private initaiteCollector(filter, message: Message, replyContent: string[], timeout: number, iterator, bug = {}) {
        return this.awaitMessenger(filter, message, replyContent, timeout, iterator).then(res => {
            let keys = ['title', 'description', 'severity'];
            bug[keys[iterator - 1]] = res['collected'].first().content;
            iterator++;
            if (res['done'])
                return bug;
            else
                return this.initaiteCollector(filter, message, replyContent, 10000, iterator, bug);
        }).catch(e => {
            console.warn(e);
        });

    }
    awaitMessenger(filter, message: Message, replyContent: string[], timeout: number, iterator) {
        return new Promise((resolve, reject) => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: timeout
            }).then(collected => {
                if (!collected.first())
                    throw new Error('here');
                message.reply(replyContent[iterator]);
                // return collected.first().content;
                let resp = { 'collected': collected };
                if (iterator === 3)
                    resp['done'] = true;
                resolve(resp);
            }).catch(err => {
                message.channel.send('no response');
                reject(err);
            });
        });
    }
}
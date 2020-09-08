import { MessageEmbed, Message } from 'discord.js';
import { cmdArgsParser } from '../service/utils';
import { resolve } from 'path';
import { rejects } from 'assert';

export class BugCommand {
    // constructor(){}
    readonly name: string = 'bug';
    readonly alias: string = 'bug';
    execute(message: Message) {

        const filter = m => m.author.id === message.author.id;
        let msg_1 = `Please enter the bug title in 10 seconds ...!`;
        let msg_2 = `Please enter the bug description ..!`;
        let msg_3 = `Please enter bug severity ..!`;
        let msg_4 = 'Please confirm the above bug . Reply Yes , if ok , else No';

        let res_1 = this.initaiteCollector(filter, message, msg_1, 2000, this.ramdon);
        let res_2 = this.initaiteCollector(filter, message, msg_2, 2000, this.ramdon);
        let res_3 = this.initaiteCollector(filter, message, msg_3, 2000, this.ramdon);
        let res_4 = this.initaiteCollector(filter, message, msg_4, 2000, this.ramdon);

        // message.reply('Please enter the bug title in 10 seconds ...!');
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

    private ramdon(arg1) {
        return arg1;
    }
    private initaiteCollector(filter, message: Message, replyContent: string, timeout: number, fn1?) {
        
        message.channel.awaitMessages(filter, {
            max: 1,
            time: timeout
        }).then(collected => {
            message.reply(replyContent);
            if (fn1)
                fn1(collected.first().content);
            return collected.first().content;
        }).catch(err => {
        });
    }
}
import { config } from 'dotenv';
config();
var sinon = require('sinon');
import { expect } from 'chai';
import { Client, Guild, TextChannel, Message, Channel, MessageEmbed, User } from 'discord.js';
import { instance, mock, verify, when, spy } from 'ts-mockito';
import { BugCommand } from '../../src/commands';
import CommandHandler from '../../src/service/commandHandler';
import 'sinon';

describe('Bug Creation Handler', () => {
    let client: Client;
    let bugCommand: BugCommand;
    let mockedMessageClass: Message;
    let mockedMessageInstance: Message;
    let mockedCommandHandlerClass: CommandHandler;
    let mockedCommandHandlerInstance: CommandHandler;
    let guild: Guild;
    let channel: TextChannel;
    let mckTextChannel;
    let mockedClientInstance;
    let mockedClientClass;

    beforeEach(() => {
        client = new Client();
        client['prefix'] = process.env.PREFIX;
        guild = new Guild(client, {});
        channel = new TextChannel(guild, {});
        mockedMessageClass = mock(Message);
        mockedMessageInstance = instance(mockedMessageClass);
        mockedCommandHandlerClass = mock(CommandHandler);
        mockedClientClass = mock(Client);
        mockedClientInstance = instance(mockedClientClass);
        mckTextChannel = mock(TextChannel);
        mockedMessageInstance.channel = instance(mckTextChannel);
        mockedMessageInstance['author'] = new User(mockedClientInstance, { bot: false, id: 'test' });
    });

    it.only('Bug Command Initiate : Success', async(done) => {
        let bug = new BugCommand;
        const bugObject = {
            title: 'Date Picker',
            description: 'Format Incorrect',
            severity: 'High',
            confirm: 'Yes'
        }
        mockedMessageInstance.content = '!nns.bug';
        mockedMessageInstance.reply('Please enter the bug title in 10 seconds ...!');
        sinon.stub(bug, 'initaiteCollector').returns(Promise.resolve(bugObject));
        let res = bug.execute(mockedMessageInstance).then(res=>{
            expect(res['title']).to.equal('Date Picker');
            expect(res['description']).to.equal('Format Incorrect');
            expect(res['severity']).to.equal('High');
            expect(res['confirm']).to.equal('Yes');
        });
        done();
    });

    it.only('Bug Command Initiate : Failure', (done) => {
        let bug = new BugCommand;
        mockedMessageInstance.content = '!nns.bug';
        sinon.stub(bug, 'initaiteCollector').returns(Promise.reject(new Error('Initiate Failed')));
        bug.execute(mockedMessageInstance).catch(err => {
            expect(err['message']).to.equal('Initiate Failed');
        });
        done();
    });


});
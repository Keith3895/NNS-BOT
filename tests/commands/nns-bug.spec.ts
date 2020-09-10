import { config } from 'dotenv';
config();
var sinon = require('sinon');
import { expect } from 'chai';
import { Client, Guild, TextChannel, Message, Channel, MessageEmbed, User, Collection } from 'discord.js';
import { instance, mock, verify, when, spy } from 'ts-mockito';
import { BugCommand } from '../../src/commands'
import CommandHandler from '../../src/service/commandHandler';
import 'sinon';

describe.only('Bug Creation Handler', () => {
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

    it('Bug Command Initiate : Success', async (done) => {
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
        let res = bug.execute(mockedMessageInstance).then(res => {
            expect(res['title']).to.equal('Date Picker');
            expect(res['description']).to.equal('Format Incorrect');
            expect(res['severity']).to.equal('High');
            expect(res['confirm']).to.equal('Yes');
        });
        done();
    });

    it('Bug Command Initiate : Failure', (done) => {
        let bug = new BugCommand;
        mockedMessageInstance.content = '!nns.bug';
        sinon.stub(bug, 'initaiteCollector').returns(Promise.reject(new Error('Initiate Failed')));
        bug.execute(mockedMessageInstance).catch(err => {
            expect(err['message']).to.equal('Initiate Failed');
        });
        done();
    });

    it('Msg await initiate : Success', (done) => {
        let bug = new BugCommand;
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        mockedMessageInstance.content = 'Bingo..!'
        let collected = new Collection();
        collected.set(mockedMessageInstance.author.id, mockedMessageInstance);
        sinon.stub(mockedMessageInstance.channel, 'awaitMessages').returns(Promise.resolve(collected));
        bug.awaitMessenger(filter, mockedMessageInstance, ['sd'], 1000, 1).then(res => {
            expect(res['collected'].first().content).to.equal('Bingo..!');
        });
        done();
    });

    it('Msg await initiate : Failure', (done) => {
        let bug = new BugCommand;
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        sinon.stub(mockedMessageInstance.channel, 'awaitMessages').returns(Promise.reject(new Error('Oops. Please retry from start')));
        bug.awaitMessenger(filter, mockedMessageInstance, ['sd'], 1000, 1).catch(err => {
            expect(err['message']).to.equal('Oops. Please retry from start');
        });
        done();
    });

    it('Msg await initiate : End Query', (done) => {
        let bug = new BugCommand;
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        mockedMessageInstance.content = 'Bingo..!'
        let collected = new Collection();
        collected.set(mockedMessageInstance.author.id, mockedMessageInstance);
        sinon.stub(mockedMessageInstance.channel, 'awaitMessages').returns(Promise.resolve(collected));
        bug.awaitMessenger(filter, mockedMessageInstance, ['sd'], 1000, 4).then(res => {
            expect(res['done']).to.true;
        });
        done();
    });

    it('Initiate Collector', (done) => {
        let bug = new BugCommand;
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        mockedMessageInstance.content = 'Date picker'
        let collected = new Collection();
        collected.set(mockedMessageInstance.author.id, mockedMessageInstance);
        sinon.stub(bug, 'awaitMessenger').returns(Promise.resolve({ collected: collected, done: true }));
        bug.initaiteCollector(filter, mockedMessageInstance, ['sd'], 1000, 1).then(res => {
            expect(res['title']).to.equal('Date picker');
        });
        done();
    });

    it('Initiate Collector : Failure', (done) => {
        let bug = new BugCommand;
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        mockedMessageInstance.content = 'Date picker'
        let collected = new Collection();
        collected.set(mockedMessageInstance.author.id, mockedMessageInstance);
        sinon.stub(bug, 'awaitMessenger').returns(Promise.reject('Failed'));
        bug.initaiteCollector(filter, mockedMessageInstance, ['sd'], 1000, 1).then(res => {
            expect(res['message']).to.equal('Failed');
        });
        done();
    });

    // it('Initiate Collector : Next Query', (done) => {
    //     let bug = new BugCommand;
    //     const filter = m => m.author.id === mockedMessageInstance.author.id;
    //     mockedMessageInstance.content = 'Date picker'
    //     let collected = new Collection();
    //     collected.set(mockedMessageInstance.author.id, mockedMessageInstance);
    //     sinon.stub(bug, 'awaitMessenger').returns(Promise.resolve({ collected: collected }));
    //     bug.initaiteCollector(filter, mockedMessageInstance, ['sd'], 1000, 1).then(res => {
    //         expect(res['title']).to.equal('Date picker');
    //     });
    //     done();
    // });

});
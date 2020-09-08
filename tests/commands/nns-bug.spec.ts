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

    it.only('Bug Commant Initiate', async() => {
        let bug = new BugCommand;
        mockedMessageInstance.content = '!nns.bug';
        // sinon.stub(bug , 'execute').callsFake(()=>  Promise.resolve([]));
        let returnVal = bug.execute(mockedMessageInstance);
        console.log(returnVal);
    });

});
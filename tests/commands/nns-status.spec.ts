import { config } from 'dotenv';
config();
import 'mocha';
import { expect } from 'chai';
import { Client, TextChannel, Message, MessageEmbed, NewsChannel } from 'discord.js';
import { instance, mock, verify, when, spy } from 'ts-mockito';
import { StatusCommand } from '../../src/commands';
import sinon, { stubInterface } from "ts-sinon"
import Jira from '../../src/service/jiraApiHandler';




describe('StatusCommandHandler', () => {
    let mockedMessageClass: Message;
    let mockedMessageInstance: Message;
    mockedMessageClass = mock(Message);
    mockedMessageInstance = instance(mockedMessageClass);
    let client: Client;
    let command: StatusCommand;
    let jira: Jira;
    let mckTextChannel;
    const commandsList = new Map();
    beforeEach(() => {
        client = new Client();
        client['prefix'] = process.env.PREFIX;


        mckTextChannel = mock(TextChannel);
        mockedMessageInstance.channel = instance(mckTextChannel);
        command = new StatusCommand();
        jira = new Jira();
        commandsList.set('MO-49', { name: 'Test', man: 'Test' });
        client['commands'] = commandsList;
    });
    it('status without arguments', () => {

        mockedMessageInstance.content = '!nns.status';
        const helpEmbed = new MessageEmbed({
            type: 'rich',
            title: 'nns-bot Status',
            description: 'Supported Command',
            color: 16296490,
            fields: [{ name: '!nns.status <<JiraTicketReference>>', value: 'Displays the status of the entered JIRA Ticket.', inline: true }],
            thumbnail: null,
            image: null,
            video: null,
            author: null,
            provider: null,
            footer: null,
            files: []
        });
        when(mckTextChannel.send(helpEmbed)).thenResolve();
        mockedMessageInstance.channel.send({});
        const returnVal = command.execute(mockedMessageInstance, null, client['prefix'], commandsList);
        delete returnVal.timestamp;
        delete helpEmbed.timestamp;
        expect(returnVal).to.deep.equal(helpEmbed);
    });

  

});

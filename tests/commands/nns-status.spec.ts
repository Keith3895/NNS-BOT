import { config } from 'dotenv';
config();
import 'mocha';
import { expect } from 'chai';
import { Client, TextChannel, Message, MessageEmbed, NewsChannel } from 'discord.js';
import { instance, mock, verify, when, spy } from 'ts-mockito';
import { StatusCommand } from '../../src/commands';
import Jira from '../../src/service/jiraApiHandler';
import * as sinon from 'sinon';
import MockResponse from '../mocks/jiraResponse.mock';
import { doesNotMatch } from 'assert';


describe('StatusCommandHandler', () => {
    let mockedMessageClass: Message;
    let mockedMessageInstance: Message;
    mockedMessageClass = mock(Message);
    let mockResponse: MockResponse;
    mockedMessageInstance = instance(mockedMessageClass);
    let client: Client;
    let command: StatusCommand;
    let jira: Jira;
    let sandbox = sinon.createSandbox();
    let mockStub;
    let mckTextChannel;
    const commandsList = new Map();
    beforeEach(() => {
        client = new Client();
        mockResponse = new MockResponse();
        client['prefix'] = process.env.PREFIX;
        mckTextChannel = mock(TextChannel);
        mockedMessageInstance.channel = instance(mckTextChannel);
        command = new StatusCommand();
        jira = new Jira();
        mockStub = sandbox.stub(jira, 'getTicketStatus');
    });
    afterEach(() => {
        sandbox.restore();
    });
    it('status without arguments', () => {

        // mockedMessageInstance.content = '!nns.status';
        // const helpEmbed = new MessageEmbed({
        //     type: 'rich',
        //     title: 'nns-bot Status',
        //     description: 'Supported Command',
        //     color: 16296490,
        //     fields: [{ name: '!nns.status <<JiraTicketReference>>', value: 'Displays the status of the entered JIRA Ticket.', inline: true }],
        //     thumbnail: null,
        //     image: null,
        //     video: null,
        //     author: null,
        //     provider: null,
        //     footer: null,
        //     files: []
        // });
        // when(mckTextChannel.send(helpEmbed)).thenResolve();
        // mockedMessageInstance.channel.send({});
        // const returnVal = command.execute(mockedMessageInstance, null, client['prefix'], commandsList);
        // delete returnVal.timestamp;
        // delete helpEmbed.timestamp;
        // expect(returnVal).to.deep.equal(helpEmbed);
    });

    it.only('status with valid ticket', (done) => {
        const helpEmbed = new MessageEmbed({
            type: 'rich',
            title: 'MPIG_OMNI',
            description: 'Travel Single',
            url: 'https://jatahworx.atlassian.net/rest/api/3/project/10345',
            color: 65280,
            timestamp: 1599666808903,
            fields: [
                { name: 'Assignee', value: 'Not Assigned', inline: true },
                { name: 'Reporter', value: 'Mudassar Ahamed', inline: true },
                { name: 'Status', value: 'Closed', inline: false }
            ],
            thumbnail: null,
            image: null,
            video: null,
            author: null,
            provider: null,
            footer: null,
            files: []
        });
        mockStub.withArgs('MO-49').resolves(mockResponse.validTicket);
        // when(mckTextChannel.send(helpEmbed)).thenResolve();
        // mockedMessageInstance.channel.send({});
        command.execute(mockedMessageInstance, ['MO-49'], client['prefix'], null).then((status) => {
            expect(status).to.equals(helpEmbed);
            done();
        }).catch(error => {
            done();
        });




    });



});

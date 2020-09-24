import { config } from 'dotenv';
config();
import 'mocha';
import { expect } from 'chai';
import { Client, TextChannel, Message, MessageEmbed } from 'discord.js';
import { instance, mock } from 'ts-mockito';
import { StatusCommand } from '../../src/commands';
import Jira from '../../src/service/jiraApiHandler';
import * as sinon from 'sinon';
import MockResponse from '../mocks/jiraResponse.mock';


describe('StatusCommandHandler', () => {
    let mockedMessageClass: Message;
    let mockedMessageInstance: Message;
    mockedMessageClass = mock(Message);
    let mockResponse: MockResponse;
    mockedMessageInstance = instance(mockedMessageClass);
    let client: Client;
    let command: StatusCommand;
    let jira: Jira;
    const sandbox = sinon.createSandbox();
    let mockStub;
    let mckTextChannel;
    const commandsList = new Map();
    beforeEach(() => {
        client = new Client();
        mockResponse = new MockResponse();
        client['prefix'] = process.env.PREFIX;
        mckTextChannel = mock(TextChannel);
        mockedMessageInstance.channel = instance(mckTextChannel);
        jira = new Jira();
        mockStub = sandbox.stub(jira, 'returnAwait');
        command = new StatusCommand(jira);
    });
    afterEach(() => {
        sandbox.restore();
    });
    it('status without arguments', async () => {

        const statusEmbed = new MessageEmbed({
            type: 'rich',
            title: 'JIRA Ticket Status',
            description: 'Displays the status of the entered JIRA Ticket.',
            color: 16296490,
            fields: [{
                name: '!nns.status',
                value: 'Key in !nns.status <JIRATICKET> to get status',
                inline: true
            }],
            thumbnail: null,
            image: null,
            video: null,
            author: null,
            provider: null,
            footer: null,
            files: []
        });
        const returnVal = await command.execute(mockedMessageInstance, null, client['prefix']);
        delete returnVal['timestamp'];
        delete statusEmbed.timestamp;
        expect(returnVal).to.deep.equal(statusEmbed);
    });

    it('status with valid ticket', async () => {
        const options = {
            'url': `https://${process.env.JIRA_HOST}/rest/api/3/issue/MO-49`,
            'headers': {
                'Authorization': process.env.JIRA_AUTH,
                'Accept': 'application/json'
            },
            json: true
        };
        const statusEmbed = new MessageEmbed({
            type: 'rich',
            title: 'MPIG_OMNI',
            description: 'Touh ID popup',
            url: 'https://jatahworx.atlassian.net/rest/api/3/project/10345',
            color: 65280,
            timestamp: 1599679091820,
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
        mockStub.withArgs(options, 'get').returns(mockResponse.validTicket);
        const returnVal = await command.execute(mockedMessageInstance, ['MO-49'], client['prefix']);
        delete returnVal['timestamp'];
        delete statusEmbed.timestamp;
        expect(returnVal).to.deep.equals(statusEmbed);
    });

    it('status with invalid ticket', async () => {
        const options = {
            'url': `https://${process.env.JIRA_HOST}/rest/api/3/issue/ABC`,
            'headers': {
                'Authorization': process.env.JIRA_AUTH,
                'Accept': 'application/json'
            },
            json: true
        };
        const statusEmbed = new MessageEmbed({
            type: 'rich',
            title: 'Invalid Ticket or Permission is denied!',
            description: 'Issue does not exist or you do not have permission to see it.',
            url: undefined,
            color: 16711680,
            timestamp: 1599675103957,
            fields: [],
            thumbnail: null,
            image: null,
            video: null,
            author: null,
            provider: null,
            footer: null,
            files: []
        });
        mockStub.withArgs(options, 'get').returns(mockResponse.invalidTicket);
        const returnVal = await command.execute(mockedMessageInstance, ['ABC'], client['prefix']);
        delete returnVal['timestamp'];
        delete statusEmbed.timestamp;
        expect(returnVal).to.deep.equals(statusEmbed);
    });
});

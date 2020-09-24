import { config } from 'dotenv';
config();
import * as sinon from 'sinon';
import { expect } from 'chai';
import { Client, TextChannel, Message, User, MessageEmbed } from 'discord.js';
import { instance, mock } from 'ts-mockito';
import { AssistCommand } from '../../src/commands';
import CommandHandler from '../../src/service/commandHandler';
import MockResponse from '../mocks/jiraResponse.mock';


describe('Assist Handler', () => {
    let client: Client;
    let mockedMessageClass: Message;
    let mockedMessageInstance: Message;
    let mockedCommandHandlerClass: CommandHandler;
    let mckTextChannel;
    let mockedClientInstance;
    let mockedClientClass;
    let mockResponse: MockResponse;
    const sandbox = sinon.createSandbox();
    let assist;
    beforeEach(() => {
        client = new Client();
        client['prefix'] = process.env.PREFIX;
        mockedMessageClass = mock(Message);
        mockedMessageInstance = instance(mockedMessageClass);
        mockedCommandHandlerClass = mock(CommandHandler);
        mockedClientClass = mock(Client);
        mockedClientInstance = instance(mockedClientClass);
        mckTextChannel = mock(TextChannel);
        mockedMessageInstance.channel = instance(mckTextChannel);
        mockedMessageInstance['author'] = new User(mockedClientInstance, { bot: false, id: 'test' });
        mockResponse = new MockResponse();
        assist = new AssistCommand();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Assist Command without arguements', async () => {
        const assistEmbed = new MessageEmbed({
            type: 'rich',
            title: 'nns-bot Assist',
            description: 'Displays  the comprehensive information of entered title/description/JIRA ticket.',
            color: 16296490,
            fields: [{
                name: '!nns.assist',
                value: '!nns.assist followed by  title/description/ticket reference  to get information of issues.',
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
        const returnVal = await assist.execute(mockedMessageInstance, null, client['prefix']);
        delete returnVal['timestamp'];
        delete assistEmbed.timestamp;
        expect(returnVal).to.deep.equal(assistEmbed);
    });

    it('Search filter: issueKey ', (done) => {
        const mockResp =  `project = ${process.env.PROJECT_ID} AND issueKey IN (\'MO-49\')`;
        const filterQuery = assist.prepareSearchFilter(['MO-49']);
        expect(filterQuery).equals(mockResp);
        done();
    });

    it('Search filter: Summary', (done) => {
        const mockResp = `project = ${process.env.PROJECT_ID} AND summary ~ \'abc\'`;
        const filterQuery = assist.prepareSearchFilter(['abc']);
        expect(filterQuery).equals(mockResp);
        done();
    });

    it('Search Issue: Success', async () => {
        const assistEmbed = new MessageEmbed({
            type: 'rich',
            title: 'MPIG_OMNI',
            description: undefined,
            url: undefined,
            color: 65280,
            timestamp: 1600787613255,
            fields: [{ name: '**MO-49**', value: 'Touh ID popup', inline: false }],
            thumbnail: null,
            image: null,
            video: null,
            author: null,
            provider: null,
            footer: null,
            files: []
        });
        sandbox.stub(assist.jiraApiHandler, 'returnAwait').resolves(mockResponse.searchSuccessObj);
        const searchresult = await assist.execute(mockedMessageInstance, ['MO-49'], client['prefix']);
        delete searchresult['timestamp'];
        delete assistEmbed.timestamp;
        expect(searchresult).to.deep.equals(assistEmbed);
    });

    it('Search Isuue : No Issues Found', async () => {
        sandbox.stub(assist.jiraApiHandler, 'returnAwait').resolves(mockResponse.searchFailure);
        const searchresult = await assist.execute(mockedMessageInstance, ['abc'], client['prefix']);
        expect(searchresult).to.deep.equals('Issue Does not exists');
    });

    it('Search Isuue : Invalid key', async () => {
        const assistEmbed = new MessageEmbed({
            type: 'rich',
            title: 'Invalid Search Key',
            description: 'Please try with valid description or ticket reference.',
            url: undefined,
            color: 16711680,
            timestamp: 1600796912299,
            fields: [],
            thumbnail: null,
            image: null,
            video: null,
            author: null,
            provider: null,
            footer: null,
            files: []
        });
        sandbox.stub(assist.jiraApiHandler, 'returnAwait').resolves(mockResponse.searchError);
        const searchresult = await assist.execute(mockedMessageInstance, ['~help'], client['prefix']);
        delete searchresult['timestamp'];
        delete assistEmbed.timestamp;
        expect(searchresult).to.deep.equals(assistEmbed);
    });
});

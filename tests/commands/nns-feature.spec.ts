import { config } from 'dotenv';
config();
import * as sinon from 'sinon';
import { expect } from 'chai';
import { Client, TextChannel, Message, User, Collection } from 'discord.js';
import { instance, mock } from 'ts-mockito';
import { FeatureCommand } from '../../src/commands';
import CommandHandler from '../../src/service/commandHandler';
import MockResponse from '../mocks/jiraResponse.mock';

describe('Feature Creation Handler', () => {
    let client: Client;
    let mockedMessageClass: Message;
    let mockedMessageInstance: Message;
    let mockedCommandHandlerClass: CommandHandler;
    let mckTextChannel;
    let mockedClientInstance;
    let mockedClientClass;
    let mockResponse: MockResponse;
    const timeoutDuration = 2500;
    const iteration_start = 1;
    const iteration_end = 3;
    const sandbox = sinon.createSandbox();
    let feature ;
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
        feature = new FeatureCommand();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Feature Command Initiate : Success', async (done) => {
        const bugObject = {
            title: 'Login Page',
            description: 'Login page with validations',
            confirm: 'Yes'
        };
        mockedMessageInstance.content = '!nns.feature';
        mockedMessageInstance.reply('Please enter feature title');
        sinon.stub(feature, 'initaiteCollector').returns(Promise.resolve(bugObject));
        feature.execute(mockedMessageInstance).then(result => {
            expect(result['title']).to.equal('Login Page');
            expect(result['description']).to.equal('Login page with validations');
            expect(result['confirm']).to.equal('Yes');
        });
        done();
    });

    it('Feature Command Initiate : Failure', (done) => {
        mockedMessageInstance.content = '!nns.feature';
        sinon.stub(feature, 'initaiteCollector').returns(Promise.reject(new Error('Initiate Failed')));
        feature.execute(mockedMessageInstance).catch(err => {
            expect(err['message']).to.equal('Initiate Failed');
        });
        done();
    });

    it('Msg await initiate : Success', (done) => {
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        mockedMessageInstance.content = 'Bingo..!';
        const collected = new Collection();
        collected.set(mockedMessageInstance.author.id, mockedMessageInstance);
        sinon.stub(mockedMessageInstance.channel, 'awaitMessages').returns(Promise.resolve(collected));
        feature.awaitMessenger(filter, mockedMessageInstance, ['sd'], timeoutDuration, iteration_start).then(res => {
            expect(res['collected'].first().content).to.equal('Bingo..!');
        });
        done();
    });

    it('Msg await initiate : Failure', (done) => {
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        sinon.stub(mockedMessageInstance.channel, 'awaitMessages')
            .returns(Promise.reject(new Error('Oops. Please retry from start')));
            feature.awaitMessenger(filter, mockedMessageInstance, ['sd'], timeoutDuration, iteration_start)
            .catch(err => {
            expect(err['message']).to.equal('Oops. Please retry from start');
        });
        done();
    });

    it('Msg await initiate : End Query', (done) => {
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        mockedMessageInstance.content = 'Bingo..!';
        const collected = new Collection();
        collected.set(mockedMessageInstance.author.id, mockedMessageInstance);
        sinon.stub(mockedMessageInstance.channel, 'awaitMessages').returns(Promise.resolve(collected));
        feature.awaitMessenger(filter, mockedMessageInstance, ['sd'], timeoutDuration, iteration_end).then(res => {
            expect(res['done']).to.equal(true);
        });
        done();
    });

    it('Initiate Collector', (done) => {
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        mockedMessageInstance.content = 'Date picker';
        const collected = new Collection();
        collected.set(mockedMessageInstance.author.id, mockedMessageInstance);
        sinon.stub(feature, 'awaitMessenger').returns(Promise.resolve({ 'collected': collected, done: true }));
        feature.initaiteCollector(filter, mockedMessageInstance, ['sd'], timeoutDuration, iteration_start).then(res => {
            expect(res['title']).to.equal('Date picker');
        });
        done();
    });

    it('Initiate Collector : Failure', (done) => {
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        mockedMessageInstance.content = 'Date picker';
        const collected = new Collection();
        collected.set(mockedMessageInstance.author.id, mockedMessageInstance);
        sinon.stub(feature, 'awaitMessenger').returns(Promise.reject('Failed'));
        feature.initaiteCollector(filter, mockedMessageInstance, ['sd'], timeoutDuration, iteration_start).then(res => {
            expect(res['message']).to.equal('Failed');
        });
        done();
    });

    it('Initiate Collector : Next Query', (done) => {
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        mockedMessageInstance.content = 'Date picker';
        const collected = new Collection();
        collected.set(mockedMessageInstance.author.id, mockedMessageInstance);
        sinon.stub(feature, 'awaitMessenger')
            .onFirstCall().returns(Promise.resolve({ 'collected': collected }))
            .onSecondCall().returns(Promise.resolve({ 'collected': collected, done: true }));
            feature.initaiteCollector(filter, mockedMessageInstance, ['sd'], timeoutDuration , iteration_start)
            .then(res => {
            expect(res['title']).to.equal('Date picker');
        });
        done();
    });

    it('Empty collector : Timeout', (done) => {
        const filter = m => m.author.id === mockedMessageInstance.author.id;
        mockedMessageInstance.content = 'Bingo..!';
        const collected = new Collection();
        sinon.stub(mockedMessageInstance.channel, 'awaitMessages').returns(Promise.resolve(collected));
        feature.awaitMessenger(filter, mockedMessageInstance, ['sd'], timeoutDuration, iteration_end).catch(err => {
            expect(err['message']).to.equal('Timeout , Please initaite from start');
        });
        done();
    });

    it('Create JIRA Feature : Success', (done) => {
        const bugObject = {
            title: 'Login Page',
            description: 'Login page with validations',
            confirm: 'Yes'
        };
        sandbox.stub(feature['jiraApiHandler'], 'createIssue').resolves(mockResponse.issueSuccessObj);
        sinon.stub(feature, 'initaiteCollector').returns(Promise.resolve(bugObject));
        feature.execute(mockedMessageInstance).then(result => {
            expect(result['confirm']).to.equal('Yes');
        });
        done();
    });


    it('Create JIRA Feature : Failure', (done) => {
        const bugObject = {
            title: 'Login Page',
            description: 'Login page with validations',
            confirm: 'Yes'
        };
        sandbox.stub(feature['jiraApiHandler'], 'createIssue').returns(Promise.reject());
        sinon.stub(feature, 'initaiteCollector').returns(Promise.resolve(bugObject));
        feature.execute(mockedMessageInstance).then(result => {
            expect(feature.creationFailed).to.equal(true);
        });
        done();
    });


    it('Feature creation cancelled by user', (done) => {
        const bugObject = {
            title: 'Login Page',
            description: 'Login page with validations',
            confirm: 'No'
        };
        sinon.stub(feature, 'initaiteCollector').returns(Promise.resolve(bugObject));
        feature.execute(mockedMessageInstance).then(result => {
            expect(result['confirm']).to.equal('No');
        });
        done();
    });
});

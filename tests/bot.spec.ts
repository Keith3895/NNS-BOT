import 'mocha';
import { expect } from 'chai';
import { MessageHandler } from '../src/service/messageHandler';
import { instance, mock, verify, when } from 'ts-mockito';
import { Message, Client, User, TextChannel } from 'discord.js';
import CommandHandler from '../src/service/commandHandler';
import { Bot } from '../src/bot';
import { PingCommand } from '../src/commands';
import CooldownHandler from '../src/service/cooldownService';
describe('bot class', () => {
    let mockedMessageHandlerClass: MessageHandler;
    let mockedMessageHandlerInstance: MessageHandler;
    let mockedCommandHandlerClass: CommandHandler;
    let mockedCommandHandlerInstance: CommandHandler;
    let mockedMessageClass: Message;
    let mockedMessageInstance: Message;
    let mockedClientClass: Client;
    let mockedClientInstance: Client;
    let mockedCooldownClass: CooldownHandler;
    let mockedCooldownInstance: CooldownHandler;
    let mckTextChannel;
    let mockPing;
    let pingInstance;
    let service: Bot;
    beforeEach(() => {
        mockedMessageHandlerClass = mock(MessageHandler);
        mockedMessageHandlerInstance = instance(mockedMessageHandlerClass);
        mockedCommandHandlerClass = mock(CommandHandler);
        mockedCommandHandlerInstance = instance(mockedCommandHandlerClass);
        mockedClientClass = mock(Client);
        mockedClientInstance = instance(mockedClientClass);
        mockedMessageClass = mock(Message);
        mockedMessageInstance = instance(mockedMessageClass);
        mckTextChannel = mock(TextChannel);
        mockedMessageInstance.channel = instance(mckTextChannel);
        mockPing = mock(PingCommand);
        pingInstance = instance(mockPing);
        pingInstance.name = 'ping';
        mockedCooldownClass = mock(CooldownHandler);
        mockedCooldownInstance = instance(mockedCooldownClass);
        when(mockedCommandHandlerClass.commandLoader()).thenReturn([pingInstance]);
        mockedMessageInstance['author'] = new User(mockedClientInstance, { bot: false, id: 'test' });
        process.env['PRO'] = 'true';
        service = new Bot(mockedClientInstance,
            mockedMessageHandlerInstance,
            mockedCommandHandlerInstance,
            mockedCooldownInstance);
    });
    it('instantiated', () => {
        verify(mockedCommandHandlerClass.commandLoader()).once();
    });
    it('login call: success', async () => {
        when(mockedClientClass.login('token')).thenResolve('');
        await service.listen();
        verify(mockedCommandHandlerClass.commandLoader()).once();
    });
    it('login call: failure', async () => {
        when(mockedClientClass.login('token')).thenReject();
        try {
            await service.listen();
        } catch (e) {
            expect(true).to.equal(true);
        }
    });
    it('test messageEvethandler: bot message', () => {
        mockedMessageInstance['author'] = new User(mockedClientInstance, { bot: true });
        expect(service.messageEventHandler(mockedMessageInstance)).to.equal('bot message');
    });
    it('test messageEvethandler: DM message', () => {
        mockedMessageInstance.channel['type'] = 'dm';
        when(mockedMessageHandlerClass.handle(mockedMessageInstance)).thenResolve();
        expect(service.messageEventHandler(mockedMessageInstance)).to.equal('DM handled');
    });
    it('test messageEvethandler: quote message', () => {
        when(mockedMessageHandlerClass.handle(mockedMessageInstance)).thenResolve();
        mockedMessageInstance.content = '@ sosos';
        expect(service.messageEventHandler(mockedMessageInstance)).to.equal('quote or not a command.');
    });
    it('test messageEvethandler: command message', () => {
        when(mockedMessageHandlerClass.handle(mockedMessageInstance)).thenResolve();
        mockedMessageInstance.content = '!nns.ping';
        when(mockPing.execute(mockedMessageInstance, [])).thenReturn('');
        expect(service.messageEventHandler(mockedMessageInstance)).to.equal('executed command.');
    });
    it('test messageEvethandler: not a command message', () => {
        when(mockedMessageHandlerClass.handle(mockedMessageInstance)).thenResolve();
        mockedMessageInstance.content = '!nns.notacmd';
        when(mockPing.execute(mockedMessageInstance)).thenReturn('');
        expect(service.messageEventHandler(mockedMessageInstance)).to.equal('not a command.');
    });
    it('with cooldown active', () => {
        delete process.env['PRO'];
        when(mockedMessageHandlerClass.handle(mockedMessageInstance)).thenResolve();
        mockedMessageInstance.content = '!nns.ping';
        when(mockPing.execute(mockedMessageInstance, [])).thenReturn('');
        when(mockedCooldownClass.isCooldown(pingInstance)).thenReturn(true);
        when(mockedCooldownClass.timeleft(pingInstance)).thenReturn('4.1');
        expect(service.messageEventHandler(mockedMessageInstance)).to.equal('cooldown');
    });
});


import 'mocha';
import {expect} from 'chai';
import {PingHandler} from '../../src/service/pingHandler';
import {MessageHandler} from '../../src/service/messageHandler';
import {instance, mock, verify, when} from 'ts-mockito';
import {Message} from 'discord.js';

describe('MessageHandler', () => {
  let mockedPingHandlerClass: PingHandler;
  let mockedPingHandlerInstance: PingHandler;
  let mockedMessageClass: Message;
  let mockedMessageInstance: Message;

  let service: MessageHandler;

  beforeEach(() => {
    mockedPingHandlerClass = mock(PingHandler);
    mockedPingHandlerInstance = instance(mockedPingHandlerClass);
    mockedMessageClass = mock(Message);
    mockedMessageInstance = instance(mockedMessageClass);
    setMessageContents();

    service = new MessageHandler(mockedPingHandlerInstance);
  })

  it('should reply', async () => {
    whenIsPingThenReturn(true);

    await service.handle(mockedMessageInstance);

    verify(mockedMessageClass.reply('pong!')).once();
  })

  it('should not reply', async () => {
    whenIsPingThenReturn(false);

    await service.handle(mockedMessageInstance).then(() => {
      // Successful promise is unexpected, so we fail the test
      expect.fail('Unexpected promise');
    }).catch(() => {});

    verify(mockedMessageClass.reply('pong!')).never();
  })

  function setMessageContents() {
    mockedMessageInstance.content = 'Non-empty string';
  }

  function whenIsPingThenReturn(result: boolean) {
    when(mockedPingHandlerClass.isPing('Non-empty string')).thenReturn(result);
  }
});

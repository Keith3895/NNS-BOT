import { config } from 'dotenv';
config();
import 'mocha';
import { expect } from 'chai';
import { Client, TextChannel, Message, MessageEmbed } from 'discord.js';
import { instance, mock, verify, when, spy } from 'ts-mockito';
import { StatusCommand } from '../../src/commands';



describe('StatusCommandHandler', () => {
    let mockedMessageClass: Message;
    let mockedMessageInstance: Message;
    let client: Client;
    let command: StatusCommand;
    let mckTextChannel;
    const commandsList = new Map();
    beforeEach(() => {
        client = new Client();
        client['prefix'] = process.env.PREFIX;
        mockedMessageClass = mock(Message);
        mockedMessageInstance = instance(mockedMessageClass);
        mckTextChannel = mock(TextChannel);
        mockedMessageInstance.channel = instance(mckTextChannel);
        command = new StatusCommand();
        commandsList.set('test', { name: 'test', man: 'test' });
        client['commands'] = commandsList;
    });
    it('status without arguments', () => {
        mockedMessageInstance.content = '!nns.status';
        const helpEmbed = new MessageEmbed({
            type: 'rich',
            title: 'nns-bot Status',
            description: 'Supported Command',
            color: 16296490,
            fields: [{ name: '!nns.status ABC-101', value: 'Displays the status of the entered JIRA Ticket.', inline: true }],
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

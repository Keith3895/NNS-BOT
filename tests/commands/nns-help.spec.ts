import { config } from 'dotenv';
config();
import 'mocha';
import { expect } from 'chai';
import { Client, Guild, TextChannel, Message, Channel, MessageEmbed } from 'discord.js';
import { instance, mock, verify, when, spy } from 'ts-mockito';
import { HelpCommand } from '../../src/commands';



describe('MessageHandler', () => {
    let mockedMessageClass: Message;
    let mockedMessageInstance: Message;
    let client: Client;
    let guild: Guild;
    let channel: TextChannel;
    let command: HelpCommand;
    let mckTextChannel;
    const commandsList = new Map();
    beforeEach(() => {
        client = new Client();
        client['prefix'] = process.env.PREFIX;
        guild = new Guild(client, {});
        channel = new TextChannel(guild, {});
        mockedMessageClass = mock(Message);
        mockedMessageInstance = instance(mockedMessageClass);
        mckTextChannel = mock(TextChannel);
        mockedMessageInstance.channel = instance(mckTextChannel);
        command = new HelpCommand();
        commandsList.set('test', { name: 'test', man: 'test' });
        client['commands'] = commandsList;
    });
    it('help without arguments', () => {
        mockedMessageInstance.content = '!nns.help';
        const helpEmbed = new MessageEmbed({
            type: undefined,
            title: 'nns-bot Help',
            description: 'List of all commands',
            url: undefined,
            color: 16296490,
            fields: [{ name: '**!nns.test **', value: 'undefined', inline: true }],
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
    it('help with arguments', () => {
        mockedMessageInstance.content = '!nns.help';
        const helpEmbed = new MessageEmbed({
            type: undefined,
            title: 'nns-bot Help',
            url: undefined,
            color: 16296490,
            fields: [{ name: '**!nns.test **', value: 'test', inline: true }],
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
        const returnVal = command.execute(mockedMessageInstance, ['!nns.test'], client['prefix'], commandsList);
        delete returnVal.timestamp;
        delete helpEmbed.timestamp;
        expect(returnVal).to.deep.equal(helpEmbed);
    });
});

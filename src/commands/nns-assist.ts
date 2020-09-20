import { MessageEmbed } from 'discord.js';

export class AssistCommand{
    readonly name: string = 'assist';
    readonly alias: string = 'assist';
    readonly description: string = `Displays the information of the entered issue description.`;
    readonly man: string = `Key in !nns.assist <JIRATICKET> or <TICKETDESCRIPTION> to get status`;
}

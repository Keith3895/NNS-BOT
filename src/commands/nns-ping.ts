export class PingCommand {
    // constructor(){}
    readonly name: string = 'ping';
    readonly alias: string = 'ping';
    readonly cooldown: number = 5000;
    readonly description: string = `
    Ping the bot to check if bot is responsive.
    `;
    readonly man: string = `
    call ping and it will respond with a ping response.
    `;
    execute(message) {
        message.channel.send('Pong!').catch(console.error);
    }
}

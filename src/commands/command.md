#### Steps to add commands

1) ##### create a file with the code for the command.
    the class must have the following members:
    1) name - name of the command
    2) alias - any other aliases to the command.
    3) description - the description of the command.
    4) man - the man page style documentation of the command.
    5) execute - the executable of the command.
    
    sample code:
    ```
    export class PingCommand {
        // constructor(){}
        readonly name: string = 'ping';
        readonly alias: string = 'ping';
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

    ```
2) ##### Add a entry on the ``index.ts``, in the ``src/commands/index.ts``.
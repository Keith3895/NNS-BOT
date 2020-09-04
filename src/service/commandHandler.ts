import * as commands from '../commands';
export default class CommandHandler {

    commandLoader() {
        const listOfcmds = Object.values(commands);
        return listOfcmds.map((cmdClass: any) => {
            return new cmdClass();
        });
    }
}

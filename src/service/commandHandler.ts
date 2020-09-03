import * as commands from '../commands';
export default class CommandHandler {

    commandLoader() {
        let listOfcmds = Object.values(commands);
        return listOfcmds.map((cmdClass: any) => {
            return new cmdClass();
        });
    }
}

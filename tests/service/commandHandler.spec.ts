import 'mocha';
import { expect } from 'chai';
import CommandHandler from '../../src/service/commandHandler';

describe('Command Handler', () => {
    it('command list', () => {
        const cmdInst = new CommandHandler();
        expect(cmdInst.commandLoader()).to.be.an('array');
    });

    it('command object check.', () => {
        const cmdInst = new CommandHandler();
        const cmdList = cmdInst.commandLoader();
        for (const cmd of cmdList) {
            for (const key of ['execute', 'name', 'alias', 'description', 'man']) {
                expect(cmd).to.have.property(key);
            }
        }
    });
});

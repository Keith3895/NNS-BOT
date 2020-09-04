import 'mocha';
import { expect } from 'chai';
import CommandHandler from '../../src/service/commandHandler';

describe('Command Handler', () => {
    it('command list', () => {
        let cmdInst = new CommandHandler();
        expect(cmdInst.commandLoader()).to.be.an('array');
    });
});

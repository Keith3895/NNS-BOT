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
        for (let cmd of cmdList) {
            expect(cmd).to.have.property('execute');
            if (cmd.name === 'help')
                expect(cmd).to.have.keys('name', 'alias', 'description');
            else if (cmd.name === 'status')
                expect(cmd).to.have.keys('name', 'alias', 'description', 'jiraApiHandler', 'man');
            else if (cmd.name === 'bug')
                expect(cmd).to.have.keys('name', 'alias', 'jiraApiHandler', 'timeoutDuration', 'creationFailed');
            else
                expect(cmd).to.have.keys('name', 'alias', 'description', 'man');
        }
    });
});

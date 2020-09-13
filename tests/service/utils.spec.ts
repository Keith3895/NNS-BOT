import 'mocha';
import { expect } from 'chai';
import { escapeRegex, cmdArgsParser } from '../../src/service/utils';
describe('Utils checking.', () => {
    it('check escape Regex', () => {
        expect(escapeRegex('!aaeemq')).to.equal('!aaeemq');
    });
    it('check escape cmdArgsParser', () => {
        expect(cmdArgsParser('!nns.help true', '!nns.', 'help')).to.equal('true');
    });
    it('check escape cmdArgsParser without the command in content', () => {
        expect(cmdArgsParser('just true', '!nns.', 'help')).to.equal(undefined);
    });
});

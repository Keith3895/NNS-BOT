import 'mocha';
import { expect } from 'chai';
import CooldownHandler from '../../src/service/cooldownService';
import { PingCommand } from '../../src/commands';
describe('Cooldown Service', () => {
    let cooler: CooldownHandler;
    let pingCmd: PingCommand;
    beforeEach(() => {
        cooler = new CooldownHandler();
        pingCmd = new PingCommand();
        pingCmd.cooldown = 100;
    });
    it('test setter', () => {
        cooler.cooldown = pingCmd;
        expect(cooler.cooldownStack.has(pingCmd.name)).to.be.equal(true);
    });
    it('test setter without cooldown defined', () => {
        pingCmd.cooldown = undefined;
        cooler.cooldown = pingCmd;
        expect(cooler.cooldownStack.has(pingCmd.name)).to.be.equal(true);
    });
    it('test timeout', (done) => {
        cooler.cooldown = pingCmd;
        expect(cooler.cooldownStack.has(pingCmd.name)).to.be.equal(true);
        setTimeout(() => {
            done();
            expect(cooler.cooldownStack.has(pingCmd.name)).to.be.equal(false);
        }, pingCmd.cooldown || 1000);
    });
    it('test IsCooldown', () => {
        pingCmd.cooldown = 10000;
        cooler.cooldown = pingCmd;
        expect(cooler.isCooldown(pingCmd)).to.be.equal(true);
    });
    it('test removeCooldown', () => {
        pingCmd.cooldown = 10000;
        cooler.cooldown = pingCmd;
        expect(cooler.cooldownStack.has(pingCmd.name)).to.be.equal(true);
        cooler.removeCooldown(pingCmd);
        expect(cooler.cooldownStack.has(pingCmd.name)).to.be.equal(false);
    });
    it('test timeleft - 0s', () => {
        expect(cooler.timeleft(pingCmd)).to.be.equal('0');
    });
    it('test timeleft - 4s', () => {
        pingCmd.cooldown = 4000;
        cooler.cooldown = pingCmd;
        expect(cooler.timeleft(pingCmd)).to.be.equal('4.0');
    });
});

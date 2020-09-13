import 'mocha';
import { expect } from 'chai';
import { PingHandler } from '../../src/service/pingHandler';

describe('PingHandler', () => {
  let service: PingHandler;
  beforeEach(() => {
    service = new PingHandler();
  })

  it('should find "!ping" in the string', () => {
    expect(service.isPing('!ping')).to.be.true;
  });
  it('should not find "!help" in the string', () => {
    expect(service.isPing('!help')).to.be.false;
  });
});

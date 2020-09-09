import { config } from 'dotenv';
config();
import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import Jira from '../../src/service/jiraApiHandler';
import * as request from 'request';
import MockResponse from '../mocks/jiraResponse';


describe('JIRA API Handler', () => {
    let jira: Jira;
    let mockResponse: MockResponse;
    let sandbox = sinon.createSandbox();
    beforeEach(() => {
        mockResponse = new MockResponse();
        jira = new Jira();
        sandbox.stub(request, 'get')
            .yields(null, null, mockResponse.validTicket);
        sandbox.stub(jira, 'getTicketStatus').withArgs('MO-49').resolves(mockResponse.validTicket);
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('Jira Status API with Ticket', (done) => {
        jira.getTicketStatus('MO-49').then(response => {
            expect(response).to.have.property('fields');
            done();
        }).catch(done);

    });
    it('Calling Fetch API', (done) => {
        let options = {
            'url': `https://jatahworx.atlassian.net/rest/api/3/issue/MO-49`,
            'headers': {
                'Authorization': `Basic ${Buffer.from(
                    `shashank.hegde@neutrinos.co:RAAwkwbMqn0a9SqueiFo50A0`
                ).toString('base64')}`,
                'Accept': 'application/json'
            }
        };
        request.get(options, (err, res, body) => {
            expect(body).to.have.property('fields');
            done();
        });
    });
});



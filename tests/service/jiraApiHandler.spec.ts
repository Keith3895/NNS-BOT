import { config } from 'dotenv';
config();
import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import Jira from '../../src/service/jiraApiHandler';
import * as request from 'request';
import MockResponse from '../mocks/jiraResponse.mock';


describe('JIRA API Handler', () => {
    let jira: Jira;
    let mockResponse: MockResponse;
    const sandbox = sinon.createSandbox();
    let mockStub;
    beforeEach(() => {
        mockResponse = new MockResponse();
        jira = new Jira();
        mockStub = sandbox.stub(request, 'get');
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('Jira Status API with Ticket', (done) => {
        mockStub.yields(null, null, JSON.stringify(mockResponse.validTicket));
        jira.getTicketStatus('MO-49').then(response => {
            expect(response).to.have.property('fields');
            done();
        }).catch((error) => {
            done();
        });
    });
    it('Jira Status API with Ticket:error', (done) => {
        mockStub.yields('null', null, '');
        jira.getTicketStatus('').then(response => {
            done();
        }).catch((error) => {
            console.warn(error);
            done();
        });
    });

    it('JIRA Create Issue : Success', (done) => {
        const issueStub = sandbox.stub(request, 'post');
        issueStub.yields(null, null, mockResponse.issueSuccessObj);
        jira.createIssue({}).then(result => {
            expect(result).to.have.property('key');
            done();
        });
    });
    it('JIRA Create Issue : Failure', (done) => {
        const issueStub = sandbox.stub(request, 'post');
        issueStub.yields(new Error());
        jira.createIssue({}).then(respo => {
            done();
        }).catch(err => {
            expect(err).to.equal('API Failed');
            done();
        });
    });
    it('JQL filter: issueKey ', (done) => {
        const mockResp = `project = ${process.env.PROJECT_ID} AND issueKey IN (\'MO-49\')`;
        jira.createJQLFilter('MO-49');
        const filterQuery = jira.createJQLFilter('MO-49');
        expect(filterQuery).equals(mockResp);
        done();
    });
    it('JQL filter: Summary', (done) => {
        const mockResp = `project = ${process.env.PROJECT_ID} AND summary ~ \'abc\'`;
        const filterQuery = jira.createJQLFilter('abc');
        expect(filterQuery).equals(mockResp);
        done();
    });
    it('JIRA Search Issue : Success', (done) => {
        const searchStub = sandbox.stub(request, 'post');
        searchStub.yields(null, null, mockResponse.searchSuccessObj);
        jira.searchIssue('touch id').then(result => {
            expect(result).to.have.property('issues');
            done();
        });
    });

    it('Jira Search Issue: Invalid String', (done) => {
        const issueStub = sandbox.stub(request, 'post');
        issueStub.yields(new Error());
        jira.searchIssue({}).then(respo => {
            done();
        }).catch(err => {
            expect(err).to.equal('API Failed');
            done();
        });
    });
});




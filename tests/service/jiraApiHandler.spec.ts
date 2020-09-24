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
    beforeEach(() => {
        mockResponse = new MockResponse();
        jira = new Jira();
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('Jira Status API with Ticket', (done) => {
        const mockStub = sandbox.stub(request, 'get');
        mockStub.yields(null, null, JSON.stringify(mockResponse.validTicket));
        const options = {
            'url': `https://${process.env.JIRA_HOST}/rest/api/3/issue/MO-49`,
            'headers': {
                'Authorization': process.env.JIRA_AUTH,
                'Accept': 'application/json'
            },
            json: true
        };
        jira.returnAwait(options, 'get').then(response => {
            expect(response).to.have.property('fields');
            done();
        }).catch((error) => {
            done();
        });
    });
    it('Jira Status API with Ticket:error', (done) => {
        const mockStub = sandbox.stub(request, 'get');
        mockStub.yields(new Error());
        const options = {
            'url': `https://${process.env.JIRA_HOST}/rest/api/3/issue/ `,
            'headers': {
                'Authorization': process.env.JIRA_AUTH,
                'Accept': 'application/json'
            },
            json: true
        };
        jira.returnAwait(options, 'get').catch(err => {
            expect(err).to.equal('API Failed');
            done();
        });
    });

    it('JIRA Create Issue : Success', (done) => {
        const options = {
            'url': `https://${process.env.JIRA_HOST}/rest/api/3/issue`,
            'headers': {
                'Authorization': process.env.JIRA_AUTH,
                'Accept': 'application/json'
            },
            json: true,
            body: {}
        };
        const issueStub = sandbox.stub(request, 'post');
        issueStub.yields(null, null, mockResponse.issueSuccessObj);
        jira.returnAwait(options, 'post').then(result => {
            expect(result).to.have.property('key');
            done();
        });
    });

    it('JIRA Create Issue : Failure', (done) => {
        const options = {
            'url': `https://${process.env.JIRA_HOST}/rest/api/3/issue`,
            'headers': {
                'Authorization': process.env.JIRA_AUTH,
                'Accept': 'application/json'
            },
            json: true,
            body: {}
        };
        const issueStub = sandbox.stub(request, 'post');
        issueStub.yields(new Error());
        jira.returnAwait(options, 'post').catch(err => {
            expect(err).to.equal('API Failed');
            done();
        });
    });
    it('JIRA Search Issue : Success', (done) => {
        const issueObj = {
            'jql': `project = ${process.env.PROJECT_ID} AND  summary ~ 'touch id'`,
            'maxResults': 15,
            'fieldsByKeys': false,
            'fields': [
                'summary',
                'status',
                'assignee',
                'reporter',
                'project'],
            'startAt': 0
        };
        const options = {
            'url': `https://${process.env.JIRA_HOST}/rest/api/3/search`,
            'headers': {
                'Authorization': process.env.JIRA_AUTH,
                'Accept': 'application/json'
            },
            json: true,
            body: issueObj
        };
        const issueStub = sandbox.stub(request, 'post');
        issueStub.yields(null, null, mockResponse.searchSuccessObj);
        jira.returnAwait(options, 'post').then(result => {
            expect(result).to.have.property('issues');
            done();
        });
    });

    it('JIRA Search Issue : Failure', (done) => {
        const options = {
            'url': `https://${process.env.JIRA_HOST}/rest/api/3/search`,
            'headers': {
                'Authorization': process.env.JIRA_AUTH,
                'Accept': 'application/json'
            },
            json: true,
            body: {}
        };
        const issueStub = sandbox.stub(request, 'post');
        issueStub.yields(new Error());
        jira.returnAwait(options, 'post').catch(err => {
            expect(err).to.equal('API Failed');
            done();
        });
    });

});



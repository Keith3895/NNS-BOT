import * as request from 'request';

export default class Jira {
    private readonly host: string;
    private readonly jiraAuth: string;


    constructor() {
        this.host = process.env.JIRA_HOST;
        this.jiraAuth = process.env.JIRA_AUTH;

    }
    /**
     * @param ticket accepts the ticket number along with project key(MO-1)
     */
    getTicketStatus = (ticket: string) => {
        const options = {
            'url': `https://${this.host}/rest/api/3/issue/${ticket}`,
            'headers': {
                'Authorization': this.jiraAuth,
                'Accept': 'application/json'
            }
        };
        return new Promise((resolve, reject) => {
            request.get(options, (err, res, body) => {
                if (err)
                    reject('API Failed');
                try {
                    body = JSON.parse(body);
                }
                catch (e) {
                    reject('JSON Parse Error');
                }
                resolve(body);
            });
        });
    }


    /**
     * searches  JIRA issue
     * @param issueObj : JQL of the issue
     */
    public searchIssue(issueObj) {
        const options = {
            'url': `https://${this.host}/rest/api/3/search`,
            'headers': {
                'Authorization': this.jiraAuth,
                'Accept': 'application/json'
            },
            json: true,
            body: issueObj
        };
        return new Promise((resolved, rejected) => {
            request.post(options, (err, res, body) => {
                if (err) {
                    return rejected('API Failed');
                }
                return resolved(body);
            });
        });
    }
    /**
     * Creates an JIRA issue
     * @param issueObj : Config Object of the issue
     * @param attachments  : Attachments if any
     */
    public createIssue(issueObj, attachments?: []) {
        const options = {
            'url': `https://${this.host}/rest/api/3/issue`,
            'headers': {
                'Authorization': this.jiraAuth,
                'Accept': 'application/json'
            },
            json: true,
            body: issueObj
        };
        return new Promise((resolved, rejected) => {
            request.post(options, (err, res, body) => {
                if (err) {
                    return rejected('API Failed');
                }
                return resolved(body);
            });
        });
    }
}

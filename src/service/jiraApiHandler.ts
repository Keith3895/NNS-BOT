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
            if (typeof options !== 'object')
                return reject('Request options is empty');

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
}

import * as request from 'request';

export default class Jira {
    private readonly host: string;
    private readonly jiraAuth: string;


    constructor() {
        this.host = process.env.JIRA_HOST;
        this.jiraAuth = process.env.JIRA_AUTH;

    }

    public returnAwait(options, method) {
        return new Promise((resolved, rejected) => {
            request[method](options, (err, res, body) => {
                if (err) {
                    return rejected('API Failed');
                }
                return resolved(body);
            });
        });
    }
}

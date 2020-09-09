import * as request from 'request';

export default class Jira {
    private readonly host: string;
    private readonly api_token: string;


    constructor() {
        this.host = process.env.JIRA_HOST;
        this.api_token = process.env.API_TOKEN;
    }
    /**
     * @param ticket accepts the ticket number along with project key(MO-1)
     */
    getTicketStatus = (ticket: string) => {
        const options = {
            'url': `https://${this.host}/rest/api/3/issue/${ticket}`,
            'headers': {
                'Authorization': `Basic ${Buffer.from(
                    `shashank.hegde@neutrinos.co:${this.api_token}`
                ).toString('base64')}`,
                'Accept': 'application/json'
            }
        };
        return new Promise((resolve, reject) => {
            request.get(options, (err, res, body) => {
                if (err)
                    reject(err);
                resolve(JSON.parse(body));
            });
        });
    }
}

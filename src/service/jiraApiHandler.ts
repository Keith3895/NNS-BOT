import fetch from 'node-fetch';


export default class Jira {
    private readonly host: string;
    private readonly api_token: string;

    constructor() {
        this.host = process.env.JIRA_HOST;
        this.api_token = process.env.API_TOKEN;
    }
    /**
     * 
     * @param ticket accepts the ticket number along with project key(MO-1)
     */
    getTicketStatus = async (ticket: string) => {
        let url = `https://${this.host}/rest/api/3/issue/${ticket}`;
        let headers = {
            'Authorization': `Basic ${Buffer.from(
                `shashank.hegde@neutrinos.co:${this.api_token}`
            ).toString('base64')}`,
            'Accept': 'application/json'

        }
        try {
            let issueSummary = await fetch(url, { method: 'GET', headers: headers });
            let response = await issueSummary.json();
            return response;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}
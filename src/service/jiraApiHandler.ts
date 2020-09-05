const JiraClient = require('jira-connector');


export default class Jira {
    private Jira;
    private readonly host: string;
    private readonly api_token: string;

    constructor() {
        this.host = process.env.JIRA_HOST;
        this.api_token = process.env.API_TOKEN;
    }

    getTicketStatus = async (ticket: any) => {
        this.Jira = new JiraClient({
            host: this.host,
            basic_auth: {
                email: "shashank.hegde@neutrinos.co",
                api_token: this.api_token
            }
        })
        try {
            let issuesStatus = await this.Jira.issue.getIssue({ issueKey: ticket });
            return issuesStatus.fields;
        }
        catch (error) {
            return error;
        }
    }
}
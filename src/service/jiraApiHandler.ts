import { httpRequest } from './utils';

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
    getTicketStatus = async (ticket: string) => {
        const options = {
            'url': `https://${this.host}/rest/api/3/issue/${ticket}`,
            'headers': {
                'Authorization': this.jiraAuth,
                'Accept': 'application/json'
            },
            json: true
        };
        try {
            return await httpRequest(options, 'get');
        }
        catch (error) {
            return error;
        }

    }


    /**
     * Creates an JIRA issue
     * @param issueObj : Config Object of the issue
     * @param attachments  : Attachments if any
     */
    public createIssue = async (issueObj, attachments?: []) => {
        let reqObj = this.issueObj;
        reqObj.fields.issuetype.name = issueObj['issuetype'];
        reqObj.fields.summary = issueObj['summary'];
        reqObj.fields.description.content[0].content[0].text = issueObj['description'];
        reqObj.fields.priority.name = issueObj['priority'] || 'Medium';
        const options = {
            'url': `https://${this.host}/rest/api/3/issue`,
            'headers': {
                'Authorization': this.jiraAuth,
                'Accept': 'application/json'
            },
            json: true,
            body: reqObj
        };
        try {
            return await httpRequest(options, 'post');
        }
        catch (error) {
            return error;
        }
    }

    /**
     * Does a look up on JIRA For entered text/ticketref
     * @param searchText : free text/description or ticket reference
     */
    public searchIssue = async (searchText) => {
        const searchObj = {
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
        try {
            const options = {
                'url': `https://${this.host}/rest/api/3/search`,
                'headers': {
                    'Authorization': this.jiraAuth,
                    'Accept': 'application/json'
                },
                json: true,
                body: Object.assign(searchObj, { 'jql': this.createJQLFilter(searchText) })
            };
            return await httpRequest(options, 'post');
        }
        catch (error) {
            return error;
        }
    }
    /**
     * This method prepares the JQL query and return a JQL Query string
     * @param searchText String
     */
    public createJQLFilter = (searchText) => {
        if (typeof searchText !== 'string')
            return new Error('Invaid String');
        const issueKeys = searchText.match(/((?!([A-Z0-9a-z]{1,10})-?$)[A-Z]{1}[A-Z0-9]+-\d+)/g);
        let filterQuery = `project = ${process.env.PROJECT_ID} AND `;
        if (issueKeys && issueKeys.length > 0) {
            filterQuery += 'issueKey IN (keys)';
            filterQuery = filterQuery.replace(/keys/ig, '\'' + issueKeys.join('\',\'') + '\'');
        }
        else
            filterQuery += `summary ~ \'${searchText}\'`;
        return filterQuery;
    }


    public issueObj = {
        'fields': {
            'summary': 'NA',
            'issuetype': {
                'name': 'Bug'
            },
            'project': {
                'id': process.env.PROJECT_ID
            },
            'priority': {
                'name': 'Medium'
            },
            'description': {
                'type': 'doc',
                'version': 1,
                'content': [
                    {
                        'type': 'paragraph',
                        'content': [
                            {
                                'text': 'sample Description',
                                'type': 'text'
                            }
                        ]
                    }
                ]
            }
        }
    };


}


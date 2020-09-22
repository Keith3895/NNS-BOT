

export default class MockResponse {
    public readonly validTicket = {
        expand: 'renderedFields,names,schema,operations,editmeta',
        id: '16996',
        // self: 'https://jatahworx.atlassian.net/rest/api/3/issue/16996',
        key: 'MO-49',
        fields: {
            statuscategorychangedate: '2019-12-18T12:10:05.509+0530',
            issuetype: {
                self: 'https://jatahworx.atlassian.net/rest/api/3/issuetype/10102',
                id: '10102',
                description: 'The sub-task of the issue',
                iconUrl: 'https://jatahworx.atlassian.net/secure/viewavatar?avatarType=issuetype',
                name: 'Sub-task',
                subtask: true,
                avatarId: 10316
            },
            parent: {
                id: '16794',
                key: 'MO-23',
                self: 'https://jatahworx.atlassian.net/rest/api/3/issue/16794',
                fields: [Object]
            },
            timespent: null,
            project: {
                self: 'https://jatahworx.atlassian.net/rest/api/3/project/10345',
                id: '10345',
                key: 'MO',
                name: 'MPIG_OMNI',
                projectTypeKey: 'software',
                simplified: false,
                avatarUrls: [Object]
            },
            fixVersions: [],
            aggregatetimespent: null,
            resolution: null,
            customfield_10104: {
                hasEpicLinkFieldDependency: false,
                showField: false,
                nonEditableReason: [Object]
            },
            resolutiondate: null,
            workratio: -1,
            lastViewed: null,
            issuerestriction: { issuerestrictions: {}, shouldDisplay: false },
            watches: {
                self: 'https://jatahworx.atlassian.net/rest/api/3/issue/MO-49/watchers',
                watchCount: 1,
                isWatching: false
            },
            created: '2019-09-13T11:23:02.075+0530',
            customfield_10260: null,
            customfield_10261: null,
            customfield_10262: null,
            customfield_10264: null,
            customfield_10220: null,
            customfield_10265: null,
            priority: {
                self: 'https://jatahworx.atlassian.net/rest/api/3/priority/3',
                iconUrl: 'https://jatahworx.atlassian.net/images/icons/priorities/medium.svg',
                name: 'Medium',
                id: '3'
            },
            customfield_10100: null,
            customfield_10101: null,
            customfield_10266: null,
            customfield_10267: null,
            customfield_10102: null,
            customfield_10103: null,
            labels: [],
            customfield_10258: null,
            customfield_10259: null,
            customfield_10215: null,
            customfield_10216: null,
            timeestimate: null,
            aggregatetimeoriginalestimate: null,
            customfield_10219: null,
            versions: [],
            issuelinks: [],
            assignee: null,
            updated: '2019-12-18T12:10:05.509+0530',
            status: {
                self: 'https://jatahworx.atlassian.net/rest/api/3/status/10136',
                description: '',
                iconUrl: 'https://jatahworx.atlassian.net/images/icons/status_generic.gif',
                name: 'Closed',
                id: '10136',
                statusCategory: [Object]
            },
            components: [],
            timeoriginalestimate: null,
            customfield_10250: null,
            customfield_10251: null,
            description: null,
            customfield_10252: null,
            customfield_10253: null,
            customfield_10254: null,
            timetracking: {},
            customfield_10005: null,
            customfield_10247: null,
            customfield_10248: null,
            customfield_10249: null,
            security: null,
            aggregatetimeestimate: null,
            attachment: [],
            summary: 'Touh ID popup',
            creator: {
                self: 'https://jatahworx.atlassian.net/rest/api/3/user?accountId=5cba92a2f54e020e3a1e2ee3',
                accountId: '5cba92a2f54e020e3a1e2ee3',
                emailAddress: 'mudassar.ahamed@neutrinos.co',
                avatarUrls: [Object],
                displayName: 'Mudassar Ahamed',
                active: false,
                timeZone: 'Asia/Kolkata',
                accountType: 'atlassian'
            },
            subtasks: [],
            reporter: {
                self: 'https://jatahworx.atlassian.net/rest/api/3/user?accountId=5cba92a2f54e020e3a1e2ee3',
                accountId: '5cba92a2f54e020e3a1e2ee3',
                emailAddress: 'mudassar.ahamed@neutrinos.co',
                avatarUrls: [Object],
                displayName: 'Mudassar Ahamed',
                active: false,
                timeZone: 'Asia/Kolkata',
                accountType: 'atlassian'
            },
            aggregateprogress: { progress: 0, total: 0 },
            customfield_10242: null,
            customfield_10000: '{}',
            customfield_10001: null,
            customfield_10243: null,
            customfield_10200: null,
            customfield_10244: null,
            customfield_10201: null,
            customfield_10245: null,
            customfield_10246: [],
            customfield_10115: [[Object], [Object]],
            customfield_10116: '0|i010eh:',
            environment: null,
            customfield_10117: null,
            duedate: null,
            progress: { progress: 0, total: 0 },
            comment: { comments: [], maxResults: 0, total: 0, startAt: 0 },
            votes: {
                self: 'https://jatahworx.atlassian.net/rest/api/3/issue/MO-49/votes',
                votes: 0,
                hasVoted: false
            },
            worklog: { startAt: 0, maxResults: 20, total: 0, worklogs: [] }
        }
    };
    public readonly invalidTicket =
        {
            errorMessages: ['Issue does not exist or you do not have permission to see it.'],
            errors: {}
        };

    public readonly issueSuccessObj = {
        'id': '23156',
        'key': 'PROJ-36',
        'self': 'https://your-domain.atlassian.net/rest/api/3/issue/23156'
    };
    public readonly searchSuccessObj = {
        expand: 'schema,names',
        startAt: 0,
        maxResults: 15,
        total: 3,
        issues: [
            {
                expand: 'operations,versionedRepresentations,editmeta,changelog,renderedFields',
                id: '19165',
                self: 'https://jatahworx.atlassian.net/rest/api/3/issue/19165',
                key: 'MO-372'
            }]

    };
}

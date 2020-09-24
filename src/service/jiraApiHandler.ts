import * as request from 'request';

export default class Jira {
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

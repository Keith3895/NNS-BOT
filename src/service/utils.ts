import * as request from 'request';

/**
 * method to escape a string and make a regex out of it.
 * @param str - the string argument value.
 */
export const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * method to extract the arguments to a command.
 * @param content message content to remove extract the arguments from.
 * @param prefix the prefix used to identify the command.
 * @param command the command for which the args are extracted.
 */
export function cmdArgsParser(content: string, prefix: string, command: string) {
    const prefixRegex = new RegExp(`^(${escapeRegex(prefix + command)})\\s*`);
    if (!prefixRegex.test(content)) return;
    const [, matchedPrefix] = content.match(prefixRegex);
    const args = content.slice(matchedPrefix.length).trim();
    return args;
}
/**
 * @param options Object - http request options which will include URL,body,header
 * @param method  String - Type of http method get/post
 */
export function httpRequest(options, method) {
    return new Promise((resolved, rejected) => {
        request[method](options, (err, res, body) => {
            if (err) {
                return rejected('API Failed');
            }
            return resolved(body);
        });
    });
}



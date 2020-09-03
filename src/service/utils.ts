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
    let prefixRegex = new RegExp(`^(${escapeRegex(prefix + command)})\\s*`);
    if (!prefixRegex.test(content)) return;
    let [, matchedPrefix] = content.match(prefixRegex);
    let args = content.slice(matchedPrefix.length).trim();
    return args;
}

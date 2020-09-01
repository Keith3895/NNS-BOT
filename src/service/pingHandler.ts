export class PingHandler {

    private regexp = '\\!ping';

    public isPing(stringToSearch: string): boolean {
        return stringToSearch.search(this.regexp) >= 0;
    }
}
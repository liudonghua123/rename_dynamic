const debug = require('debug')('filters');
export default function tail(limit: number): (value: string) => string {
    return function (value: string): string {
        debug(`execute tails(${limit})(${value})`);
        const totalLength = value.length;
        return value.substring(totalLength - limit, totalLength);
    }
}
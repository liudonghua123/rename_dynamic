export default function head(limit: number): (length: string) => string {
    return function (value: string): string {
        return value.substring(0, limit);
    }
}
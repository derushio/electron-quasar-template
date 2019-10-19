export default class ArrayUtil {
    public static range(start: number, end?: number) {
        if (end == null) {
            end = start;
            start = 0;
        } else {
            end += 1;
        }

        return [...Array(end).keys()].slice(start);
    }

    protected constructor() {}
}

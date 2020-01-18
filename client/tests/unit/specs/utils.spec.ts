import Logger from '@/utils/Logger';

import ArrayUtil from '@/utils/ArrayUtil';
import RandomUtil from '@/utils/RandomUtil';

const logger = new Logger();

describe('utils系テスト', () => {
    it('ArrayUtil', () => {
        // range(number) テスト
        expect(ArrayUtil.range(5)).toEqual([0, 1, 2, 3, 4]);
        // range(number, number) テスト
        expect(ArrayUtil.range(5, 10)).toEqual([5, 6, 7, 8, 9, 10]);
    });
    it('RandomUtil', () => {
        // rande(number) テスト
        let randomCount = {
            '-1': 0, '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
        } as { [i: string]: number };
        for (const i of ArrayUtil.range(10000)) {
            randomCount[RandomUtil.rand(5).toString()]++;
        }
        expect(randomCount['-1']).toEqual(0);
        for (const i of ArrayUtil.range(5)) {
            expect(randomCount[i.toString()]).toBeGreaterThanOrEqual(1);
        }
        expect(randomCount['5']).toEqual(0);

        // rand(number, number) テスト
        randomCount = {
            '-1': 0, '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
        };
        for (const i of ArrayUtil.range(10000)) {
            randomCount[RandomUtil.rand(0, 4).toString()]++;
        }
        expect(randomCount['-1']).toEqual(0);
        for (const i of ArrayUtil.range(5)) {
            expect(randomCount[i.toString()]).toBeGreaterThanOrEqual(1);
        }
        expect(randomCount['5']).toEqual(0);
    });
});

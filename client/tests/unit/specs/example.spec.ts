import ArrayUtil from '@/utils/ArrayUtil';
import Logger from '@/utils/Logger';

const logger = new Logger();

describe('サンプルテスト', () => {
    it('プロパティテスト', () => {
        expect(logger.log(ArrayUtil.range(5)));
        expect(logger.log(ArrayUtil.range(5, 10)));
    });
});

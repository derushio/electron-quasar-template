import Vue from 'vue';

import ExtendableError from 'extendable-error';

export class QQLoadingError extends ExtendableError {
    public constructor() {
        super('QQLoading is handling error');
    }
}

export default {
    async async(this: Vue, func: () => any) {
        return new Promise(async (resolve, reject) => {
            this.$q.loading.show();

            try {
                await func();

                this.$q.loading.hide();
                resolve();
                return;
            } catch {
                this.$q.loading.hide();
                reject(new QQLoadingError());
                return;
            }
        });
    },
};

import Vue, { VueConstructor } from 'vue';
import { QDialog, QDialogOptions, QCard, QCardSection, QSeparator, QCardActions, QBtn } from 'quasar';

import ExtendableError from 'extendable-error';

import QQDialogSize, { QQDialogWidth } from '@/plugins/quasarApiCustomize/QQDialogSize';
import { aswait } from '@/utils/AsyncTimeout';
import lo from 'lodash';

export class QQDialogCancelError extends ExtendableError {
    public constructor() {
        super('QQDialog is canceled');
    }
}

type DialogView = Vue & {
    show: () => any, hide: () => any,
    ok: (data: any) => any, cancel: () => any,
};

enum DialogState {
    SHOW, OK, CANCEL,
}

export default {
    async open(this: Vue, options: QDialogOptions, handleError = true, def?: any) {
        return new Promise<any>(async (resolve, reject) => {
            this.$q.dialog(options)
                .onOk((data: any) => {
                    resolve(data);
                })
                .onCancel(() => {
                    if (handleError) {
                        reject(new QQDialogCancelError());
                    } else {
                        resolve(def);
                    }
                })
                .onDismiss(() => {
                    if (handleError) {
                        reject(new QQDialogCancelError());
                    } else {
                        resolve(def);
                    }
                });
        });
    },

    async alert(this: Vue, options: string | QDialogOptions): Promise<void> {
        if (typeof options === String.name.toLowerCase()) {
            return this.$qqDialog.open({ message: options as string }, false);
        } else {
            return this.$qqDialog.open(options as QDialogOptions, false);
        }
    },

    async confirm(this: Vue, options: string | QDialogOptions): Promise<boolean> {
        try {
            if (typeof options === String.name.toLowerCase()) {
                await this.$qqDialog.open({
                    message: options as string,
                    cancel: true,
                    persistent: true,
                }, true);
            } else {
                await this.$qqDialog.open({
                    cancel: true,
                    persistent: true,
                    ...(options as QDialogOptions),
                }, true);
            }
        } catch {
            return false;
        }

        return true;
    },

    async prompt(this: Vue, options: string | QDialogOptions, handleError = true): Promise<string> {
        if (typeof options === String.name.toLowerCase()) {
            return await this.$qqDialog.open({
                message: options as string,
                cancel: true,
                prompt: {
                    model: '',
                    type: 'text',
                },
            }, handleError, '');
        } else {
            return await this.$qqDialog.open({
                cancel: true,
                prompt: {
                    model: '',
                    type: 'text',
                },
                ...(options as QDialogOptions),
            }, handleError, '');
        }
    },

    async component(this: Vue, dialogComponent: VueConstructor,
            optionsProps: QDialogOptions & { props?: any } = {},
            size: QQDialogSize = 'sm', needCard: boolean = false): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let dialog: DialogView;

            const o = lo.clone(optionsProps);
            const props = o.props || {};
            delete o.props;
            const options = o;

            function hide(this: DialogView) {
                document.body.removeChild(this.$root.$el);
                this.$root.$destroy();
            }

            function ok(this: DialogView, data: any) {
                hide.call(this);
                resolve(data);
            }

            function cancel(this: DialogView) {
                hide.call(this);
                reject(new QQDialogCancelError());
            }

            this.$q.dialog({
                ...options,
                component: Vue.extend({
                    components: { QDialog, QCard, QCardSection, QSeparator, QCardActions, QBtn, dialogComponent },
                    router: this.$router, store: this.$store,
                    beforeCreate(this: DialogView) {
                        dialog = this;
                    },
                    data: () => {
                        return {
                            state: DialogState.SHOW,
                        };
                    },
                    methods: {
                        async show(this: Vue) {
                            dialog.$data.state = DialogState.SHOW;
                            (this.$refs['dialog'] as any).show();
                            await aswait(500);
                        },
                        async hide(this: Vue) {
                            (this.$refs['dialog'] as any).hide();
                            await aswait(500);
                        },
                        async ok(this: Vue, data: any) {
                            dialog.$data.state = DialogState.OK;
                            await dialog.hide();
                            ok.call(this, data);
                        },
                        async cancel(this: Vue) {
                            dialog.$data.state = DialogState.CANCEL;
                            await dialog.hide();
                            cancel.call(this);
                        },
                    },
                    render: (h) => {
                        return h('q-dialog', {
                            ref: 'dialog',
                            on: {
                                hide(this: null) {
                                    if (dialog.$data.state === DialogState.SHOW) {
                                        dialog.cancel();
                                    }
                                },
                            },
                        }, needCard ? [
                            h('q-card', {
                                staticClass: 'q-dialog-plugin' +
                                    (this.$data.dark === true ? ' q-dialog-plugin--dark' : ''),
                                    style: `width: ${ QQDialogWidth[size] }; max-width: 100%;`,
                            }, [
                                h('q-card-section', [
                                    h('dialog-component', {
                                        props,
                                        on: {
                                            ok(this: Vue, data: any) {
                                                dialog.ok(data);
                                            },
                                            cancel(this: Vue) {
                                                dialog.cancel();
                                            },
                                        },
                                    }),
                                ]),
                                h('q-separator'),
                                h('q-card-actions', {
                                    props: { align: 'right' },
                                }, [
                                    h('q-btn', {
                                        props: {
                                            flat: true,
                                            color: 'positive',
                                        },
                                        on: {
                                            click: () => {
                                                dialog.ok(undefined);
                                            },
                                        },
                                }, [ 'OK' ]),
                                ]),
                            ]),
                        ] : [
                            h('dialog-component', {
                                props,
                                on: {
                                    ok(this: Vue, data: any) {
                                        dialog.ok(data);
                                    },
                                    cancel(this: Vue) {
                                        dialog.cancel();
                                    },
                                },
                                staticClass: 'q-dialog-plugin' +
                                    (this.$data.dark === true ? ' q-dialog-plugin--dark' : ''),
                                    style: `width: ${ QQDialogWidth[size] }; max-width: 100%;`,
                            }),
                        ]);
                    },
                }),
            });
        });
    },
};

import Vue, { VueConstructor } from 'vue';
import { QDialog, QDialogOptions, QCard, QCardSection, QSeparator, QCardActions, QBtn } from 'quasar';

import ExtendableError from 'extendable-error';
import shortid from 'shortid';

import QQDialogSize, { QQDialogWidth } from '@/plugins/quasarApiCustomize/QQDialogSize';

export class QQDialogCancelError extends ExtendableError {
    public constructor() {
        super('QQDialog is canceled');
    }
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

    async component(this: Vue, dialogComponent: VueConstructor, props: any,
            needCard: boolean = true, size: QQDialogSize = 'small'): Promise<any> {
        const id = shortid();
        let dialog: Vue;

        function removeDialog() {
            document.body.removeChild(dialog.$root.$el);
            dialog.$root.$destroy();
        }

        return await this.$qqDialog.open({
            component: Vue.extend({
                components: { QDialog, QCard, QCardSection, QSeparator, QCardActions, QBtn, dialogComponent },
                router: this.$router, store: this.$store,
                beforeCreate(this: Vue) {
                    dialog = this;
                },
                methods: {
                    show(this: Vue) {
                        (this.$refs[`dialog-${id}`] as any).show();
                    },
                    hide(this: Vue) {
                        (this.$refs[`dialog-${id}`] as any).hide();
                    },
                },
                render: (h) => {
                    return h('q-dialog', {
                        ref: `dialog-${id}`,
                        on: {
                            hide: () => {
                                removeDialog();
                            },
                        },
                    }, needCard ? [
                        h('q-card', {
                            staticClass: 'q-dialog-plugin' +
                                (this.$data.dark === true ? ' q-dialog-plugin--dark' : ''),
                                style: `width: ${ QQDialogWidth[size] }; max-width: 100%;`,
                        }, [
                            h('q-card-section', [
                                h('dialog-component', { props }),
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
                                            const d = dialog.$refs[`dialog-${id}`] as any;
                                            d.hide();
                                        },
                                    },
                            }, [ 'OK' ]),
                            ]),
                        ]),
                    ] : [
                        h('div', {
                            staticClass: 'q-dialog-plugin' +
                                (this.$data.dark === true ? ' q-dialog-plugin--dark' : ''),
                                style: `width: ${ QQDialogWidth[size] }; max-width: 100%;`,
                        }, [
                            h('dialog-component', { props }),
                        ]),
                    ]);
                },
            }),
        }), false;
    },
};

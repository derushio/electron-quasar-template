import { VueConstructor } from 'vue';
import { QDialogOptions } from 'quasar';
import QQDialogSize from '@/plugins/quasarApiCustomize/QQDialogSize';

export default interface QQDialog {
    open: (options: QDialogOptions, handleError?: boolean, def?: any) => Promise<any>;
    alert: (options: string | QDialogOptions) => Promise<void>;
    confirm: (options: string | QDialogOptions) => Promise<boolean>;
    prompt: (options: string | QDialogOptions, handleError?: boolean) => Promise<string>;
    component: (component: VueConstructor, optionsProps: QDialogOptions & { props?: any } = {},
        size?: QQDialogSize, needCard?: boolean) => Promise<any>;
}

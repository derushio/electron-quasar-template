import Windows from '@/windows/Windows';
import loadUrls from '@/env/loadUrls';

export default class MainWindows extends Windows {
    public loadUrls = loadUrls.main;

    protected createMenu() {
        return [];
    }
}

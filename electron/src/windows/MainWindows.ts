import Windows from '%/windows/Windows';
import loadUrls from '%/env/loadUrls';
import { MenuItemConstructorOptions } from 'electron';

export default class MainWindows extends Windows {
    public loadUrls = loadUrls.main;

    protected createMenu(): MenuItemConstructorOptions[] {
        return [];
    }
}

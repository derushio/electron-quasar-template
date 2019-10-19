import { BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
import * as loadDevtool from 'electron-load-devtool';

export default abstract class Windows {
    // tslint:disable-next-line: variable-name
    public static _instance: Windows;
    public abstract loadUrls: {
        development: string,
        production: string,
    };

    public wins: BrowserWindow[] = [];

    protected constructor() {
        Menu.setApplicationMenu(Menu.buildFromTemplate(this.createMenu()));
    }

    public static get instance(): Windows {
        if (this._instance == null) {
            this._instance = new (this as any)();
        }

        return this._instance;
    }

    public createWindow() {
        const win = new BrowserWindow({width: 800, height: 600,
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
            },
        });

        if (process.env.NODE_ENV === 'production') {
            win.loadURL(this.loadUrls.production);
        } else {
            win.loadURL(this.loadUrls.development);
        }

        this.wins.push(win);
        win.on('closed', () => {
            // 消したwinを削除
            this.wins.forEach((w, i) => {
                if (w === win) {
                    this.wins.splice(i, 1);
                    return;
                }
            });
        });

        if (process.env.NODE_ENV !== 'production') {
            loadDevtool(loadDevtool.VUEJS_DEVTOOLS);
            win.webContents.openDevTools();
        }
    }

    protected abstract createMenu(): MenuItemConstructorOptions[];

}

import * as sourceMapSupport from 'source-map-support';

import { app } from 'electron';
import MainWindows from '@/windows/MainWindows';

// client側ファイルimportサンプル
import ArrayUtil from '%/utils/ArrayUtil';
console.log(ArrayUtil);

function initSourceMap(): void {
    if (process.env.NODE_ENV === 'development') {
        sourceMapSupport.install();
        console.log('ENV_LOG:', 'SOURCE MAP ENABLED');
    }
}

function initElectron(): void {
    const editor = MainWindows.instance;
    editor.createWindow();
}

async function main(): Promise<void> {
    initSourceMap();
    app.on('ready', initElectron);
}

main();

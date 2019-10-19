import { app } from 'electron';
import * as url from 'url';
import * as path from 'path';

const loadUrls = {
    main: {
        development: url.format({
            pathname: 'localhost:8080',
            protocol: 'http:',
            slashes: true,
        }),

        production: url.format({
            pathname: path.resolve(app.getAppPath(), 'public/index.html'),
            protocol: 'file:',
            slashes: true,
        }),
    },
};

export default loadUrls;

# electron-quasar-template

## desc
### included
* electron
* vue
    * quasar
    * pug
    * stylus
    * typescript
    * unit test
        * jest

## how to use
### develop
1. in `./client`
    ```sh
    yarn serve
    ```
2. in `./electron`
    ```sh
    yarn dev
    ```

### release
1. edit APP_NAME and dist env in `./electron/scripts.sh`
2. run
    ```sh
    yarn build
    ```

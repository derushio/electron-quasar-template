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
### preparation
1. run in `./client`
    ```sh
    yarn install
    ```
2. run in `./electron`
    ```sh
    yarn install
    ```

### develop
1. run
    ```sh
    yarn dev
    ```

### release
1. edit APP_NAME and dist env in `./electron/scripts.sh`
2. run
    ```sh
    yarn build
    ```

### util
* in `./client`
```
yarn create:view --name path/to/view
```

```
yarn create:compo --name path/to/component
```

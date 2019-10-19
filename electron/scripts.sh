#!/bin/bash -eu

function clean() {
    yarn rimraf './dist/*'
    yarn rimraf './public/*'
}

function build() {
    clean
    yarn rimraf './dist-electron/*'
    export NODE_ENV='production'

    ## build backend
    yarn install --production=false
    yarn webpack

    ## build app
    cd ../app/ && yarn install --production=false && \
    yarn build && cd ../backend/

    ## build electron
    if [ ! -d "./public/" ]; then
        mkdir "./public/"
    fi
    rsync -avh "../app/dist/" "./public/"
    yarn electron-packager "." "Electron" --platform="linux" --arch="x64" --out="./dist-electron"
}

function dev() {
    clean
    export NODE_ENV='development'

    yarn webpack && yarn electron .
}

function build_typedoc() {
    typedoc --name "$1" --mode 'file' --out './document/typedoc' './src'
}

unset NODE_ENV

if [ -z ${2+UNDEF} ]; then
    $1
else
    $1 $2
fi

unset NODE_ENV

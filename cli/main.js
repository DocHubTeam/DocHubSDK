#!/usr/bin/env node
/* eslint-disable no-console */

const modules = {
    plugins: require('./plugins/main')  // Работы с плагинами
};

const run = async() => {
    console.info('Welcome to DocHub System Development Kit!');
    const moduleId = process.argv[2];
    const module = modules[moduleId];
    if (!module) {
        throw `Unknown SDK module [${moduleId}]`;
    } else await module(process.argv.slice(3));
};

run()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

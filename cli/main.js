#!/usr/bin/env node
// hello
const run = async () => {
    console.info('Welcome to DocHub System Development Kit!');
    // Разбираем параметры запуска
    process.argv.slice(2).map((arg) => {
        console.error('>>>>=',arg);
    });
}

run()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
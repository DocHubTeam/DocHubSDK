const run = async () => {
    console.info('Welcome to DocHub System Development Kit!');
}

run()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
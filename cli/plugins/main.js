const commands = {
    create: require('./create')  // Работы с плагинами
};

module.exports = async function(params) {
    const commandId = params[0];
    const command = commands[commandId];
    if (!command) 
        throw `Plugins: Undefined command [${commandId}] `;
    await command(params.slice(1));
};


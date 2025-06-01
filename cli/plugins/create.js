/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');
const { exec } = require('../utils/cli');

function makeSlotComponent(package) {
    const langId = package.name;
    const template = fs.readFileSync(path.join(__dirname, 'templates', 'Slot.vue.template'), 'utf8').split('`').join('\\`');
    return eval(`\`${template}\``);
}

function makeMainFile(package, tags) {
    const template = fs.readFileSync(path.join(__dirname, 'templates', 'index.ts.template'), 'utf8').split('`').join('\\`');
    const importSDK = ['DocHub'];
    const langId = package.name;
    const components = [];
    const frontendCode = (tags || []).map((tag) => {
        if (tag === '-slot') {
            importSDK.push('DocHubUISlot', 'DocHubEditMode');
            components.push('Slot');
            return `
    const lang = DocHub.lang.getConst('${langId}.strings');
    DocHub.ui.register(DocHubUISlot.explorer, Slot, {
        title: lang?.title,
        modes: [ DocHubEditMode.editWeb, DocHubEditMode.editIDE, DocHubEditMode.view ],
        uid: '${langId}-explorer',
        expanded: true
    });`;
        }
    });
    return eval(`\`${template}\``);
}

module.exports = async function(params) {
    const pluginID = params[0];
    if (!pluginID) throw 'Plugin name is required';

    // Определяем путь к создаваемому плагину
    const pluginDir = path.join(process.cwd(), 'plugins', pluginID);

    // Проверяем, что путь вакантный
    if (fs.existsSync(pluginDir))
        throw `Can not create plugin. Folder [${pluginDir}] is already found.`;

    // Создаем папку плагина
    fs.mkdirSync(pluginDir, { recursive: true });
    // Создаем папки языковых констант
    fs.mkdirSync(path.join(pluginDir, 'lang', 'ru'), { recursive: true });
    fs.mkdirSync(path.join(pluginDir, 'lang', 'en'), { recursive: true });
    // Создаем папку исходников
    fs.mkdirSync(path.join(pluginDir, 'src', 'components'), { recursive: true });

    // Выполняем первичную инициализацию проекта с использованием NPM
    await exec('npm init -y', { cwd: pluginDir });

    // Производим преобразования package.json
    const packagePath = path.join(pluginDir, 'package.json');
    const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // Модифицируем манифест дефолтными параметрами для DocHubIDE
    package.main = 'index.ts';
    package.keywords = ['DocHub', 'AaaC', pluginID];
    package.dochub = {
        description: {
            en: package.description || 'DocHubIDE plugin'
        },
        environments: {}
    };

    // Перезаписываем манифест
    fs.writeFileSync(packagePath, JSON.stringify(package, null, 2), 'utf8');

    // Генерируем main файл 
    fs.writeFileSync(path.join(pluginDir, 'index.ts'), makeMainFile(package, params), 'utf8');
    // Генерируем пустые языковые константы 
    fs.writeFileSync(path.join(path.join(pluginDir, 'lang', 'ru'), 'strings.js'), `module.exports = ${JSON.stringify({
        title: pluginID,
        hello_world: 'Привет мир!'
    }, null, 2)};\n`, 'utf8');
    fs.writeFileSync(path.join(path.join(pluginDir, 'lang', 'en'), 'strings.js'), `module.exports = ${JSON.stringify({
        title: pluginID,
        hello_world: 'Hello world!'
    }, null, 2)};\n`, 'utf8');
    // Генерируем нужные файлы по тэгам
    params.map((tag) => {
        if (tag === '-slot') {
            fs.writeFileSync(path.join(pluginDir, 'src/components/Slot.vue'), makeSlotComponent(package), 'utf8');
        }
    });

    // eslint-disable-next-line no-console
    console.info(`Plugin [${pluginID}] is created.`);
};


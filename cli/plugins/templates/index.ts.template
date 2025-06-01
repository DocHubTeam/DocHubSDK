import { ${importSDK.join(', ')} } from 'dochub-sdk';
${components.map((id) => 'import ' + id + ' from \'./src/components/' + id + '.vue\';').join(';\n')}

/**
 * Регистрация языкового пакета
 */
DocHub.lang.registerPackage('${langId}', require.context('./lang', true, /\.js$/));

// Точка входа для инициализации фронтовых интерфейсов 
export function frontend() {
    ${frontendCode.join('\n')}
}

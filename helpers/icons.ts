/**
 * Возвращает ассоциативную иконку из набора доступного в DocHub для URI
 * @param uri 
 */
export function getIconByURI(uri: string) {
    const url = new URL(uri, 'nul:/');
    return {
        'default': 'mdi-file',
        'json': 'mdi-code-json',
        'md': 'mdi-language-markdown',
        'yml': 'mdi-code-array',
        'yaml': 'mdi-code-array',
        'js': 'mdi-language-javascript',
        'ts': 'mdi-language-typescript',
        'vue': 'mdi-vuejs',
        'java': 'mdi-language-java',
        'kt': 'mdi-language-kotlin',
        'php': 'mdi-language-php',
        'pi': 'mdi-language-python',
        'go': 'mdi-language-go',
        'html': 'mdi-web',
        'htm': 'mdi-web',
        'c#': 'mdi-language-csharp'
    }[url.pathname.split('.').pop() || 'default']
}
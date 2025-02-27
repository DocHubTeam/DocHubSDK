import { 
    DocHubJSONSchema,
    DocHubJSONSchemaBasicTypes,
} from './basetypes';

/**
 * RegEx используемые в корневом манифесте
 */
export enum DocHubYamlPatterns {
    packageID = '^[a-z0-9_\\-]{2,128}$',
    packageVer = '^[0-9]{1,6}\\.[0-9]{1,6}\\.[0-9]{1,6}$',
    packageRequest = '^.{1,128}$',
    packageName = '^.{2,128}$',
    packageDescription = '^.{2,512}$',
    packageStructSpace = '^(\/[^\/|^\n|^\r|^\t]{1,}){1,}$',
    packageStructPattern = '^.*$'
}

/**
 * Схема зависимостей пакета
 */
export const dochubYamlDependencies: DocHubJSONSchema = {
    title: 'Зависимости пакета',
    type: DocHubJSONSchemaBasicTypes.object,
    patternProperties: {
        [DocHubYamlPatterns.packageID]: {
            title: 'Выражение требуемой версии зависимости',
            type: DocHubJSONSchemaBasicTypes.string,
            pattern: DocHubYamlPatterns.packageRequest
        }
    },
    additionalProperties: false
}

/**
 * Структура репозитория
 */
export const dochubYamlStructure: DocHubJSONSchema = {
    title: 'Структура репозитория',
    type: DocHubJSONSchemaBasicTypes.object,
    patternProperties: {
        [DocHubYamlPatterns.packageStructPattern]: {
            title: 'Пространство репозитория',
            type: DocHubJSONSchemaBasicTypes.object,
            properties: {
                title: {
                    title: 'Описание пространства',
                    type: DocHubJSONSchemaBasicTypes.string
                },
                location: {
                    title: 'Размещение в репозитории',
                    type: DocHubJSONSchemaBasicTypes.string,
                    pattern: DocHubYamlPatterns.packageStructSpace
                }
            },
            required: ['title', 'location']
        }
    },
    additionalProperties: false
}

/**
 * Схема корневого манифеста
 */
export const dochubYaml: DocHubJSONSchema = {
    title: 'Схема файла dochub.yaml',
    type: DocHubJSONSchemaBasicTypes.object,
    properties: {
        $package: {
            title: 'Манифест пакета',
            type: DocHubJSONSchemaBasicTypes.object,
            patternProperties: {
                [DocHubYamlPatterns.packageID]: {
                    title: 'Декларируемый пакет',
                    type: DocHubJSONSchemaBasicTypes.object,
                    properties: {
                        version: {
                            title: 'Версия пакета',
                            type: DocHubJSONSchemaBasicTypes.string,
                            pattern: DocHubYamlPatterns.packageVer
                        },
                        name: {
                            title: 'Наименование пакета',
                            type: DocHubJSONSchemaBasicTypes.string,
                            pattern: DocHubYamlPatterns.packageName
                        },
                        description: {
                            title: 'Описание пакета',
                            type: DocHubJSONSchemaBasicTypes.string,
                            pattern: DocHubYamlPatterns.packageDescription
                        },
                        dependencies: dochubYamlDependencies,
                        structure: dochubYamlStructure
                    },
                    required: ['version', 'name', 'description']
                }
            },
            additionalProperties: false
        }
    },
    required: ['$package']
}

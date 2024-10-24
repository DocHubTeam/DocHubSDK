import { 
    IDocHubSchema,
    BaseTypes,
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
export const dochubYamlDependencies: IDocHubSchema = {
    title: 'Зависимости пакета',
    type: BaseTypes.object,
    patternProperties: {
        [DocHubYamlPatterns.packageID]: {
            title: 'Выражение требуемой версии зависимости',
            type: BaseTypes.string,
            pattern: DocHubYamlPatterns.packageRequest
        }
    },
    additionalProperties: false
}

/**
 * Структура репозитория
 */
export const dochubYamlStructure: IDocHubSchema = {
    title: 'Структура репозитория',
    type: BaseTypes.object,
    patternProperties: {
        [DocHubYamlPatterns.packageStructPattern]: {
            title: 'Пространство репозитория',
            type: BaseTypes.object,
            properties: {
                title: {
                    title: 'Описание пространства',
                    type: BaseTypes.string
                },
                location: {
                    title: 'Размещение в репозитории',
                    type: BaseTypes.string,
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
export const dochubYaml: IDocHubSchema = {
    title: 'Схема файла dochub.yaml',
    type: BaseTypes.object,
    properties: {
        $package: {
            title: 'Манифест пакета',
            type: BaseTypes.object,
            patternProperties: {
                [DocHubYamlPatterns.packageID]: {
                    title: 'Декларируемый пакет',
                    type: BaseTypes.object,
                    properties: {
                        version: {
                            title: 'Версия пакета',
                            type: BaseTypes.string,
                            pattern: DocHubYamlPatterns.packageVer
                        },
                        name: {
                            title: 'Наименование пакета',
                            type: BaseTypes.string,
                            pattern: DocHubYamlPatterns.packageName
                        },
                        description: {
                            title: 'Описание пакета',
                            type: BaseTypes.string,
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

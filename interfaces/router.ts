export enum DocHubNavigateCommands {
    back = '$_back_$',
    root = '$_root_$'
}

export enum DocHubNavigateTarget {
    blank = '_blank',
    self = '_self',
    parent = '_parent',
    top = '_top'
}

export interface IDocHubRouter {
    // Регистрирует роут в формате VUE2
    registerRoute(route: object);
    // Регистрирует middleware в формате VUE2
    registerMiddleware(middleware: object);
    // Указывает на какой роут перейти в DocHub
    navigate(url: string | DocHubNavigateCommands, target?:DocHubNavigateTarget);
}
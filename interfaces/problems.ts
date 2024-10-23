export interface IDocHubProblems {
    // Регистрирует ошибку в системе
    emit(problem: Error, title?: string, uid?: string);
}

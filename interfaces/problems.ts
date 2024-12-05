import { DataLakePath } from "./datalake";
import { IDocHubDataSetProfile } from "./datasets";

export type IDocHubProblemUID = string;
export type IDocHubValidatorUID = string;

/**
 * Валидаторы проблем
 */
export interface IDocHubValidator extends IDocHubDataSetProfile {
    /**
     * Идентификатор валидатора
     */
    uid: IDocHubValidatorUID;
    /**
     * Название валидатора
     */
    title: string;
}
/**
 * Исключения для регистрации проблем
 */
export interface IDocHubException {
    /**
     * Идентификатор проблемы, которая считается исключением
     */
    uid: IDocHubProblemUID;
    /**
     * Причина исключения
     */
    reason: string;
}
/**
 * Зарегистрированная проблема
 */
export interface IDocHubProblem {
    /**
     * Уникальный идентификатор выявленной проблемы
     */
    uid: IDocHubProblemUID; 
    /**
     * Краткое описание / название проблемы
     */
    title: string;
    /**
     * Описание возникшей проблемы
     */
    description: string;
    /**
     * URI выявленной проблемы
     */
    location?: string;
    /**
     * Путь к проблемному объекту/ам в datalake
     */
    path?: DataLakePath | DataLakePath[];
    /**
     * Предложения о том, как исправить проблему
     */
    correction?: string;
    /**
     * UID валидатра, который обнаружил проблему
     */
    validator?: IDocHubValidatorUID;
}

export enum IDocHubProblemsEvents {
    // Процесс поиска проблем стартовал
    startReview = 'dochub-problems-review-start',
    // Валидатор завершил работу
    validatorReviewed = 'dochub-problems-validator-reviewed',
    // Процесс поиска проблем завершился
    startFinish = 'dochub-problems-review-finish',
}

export interface IDocHubProblems {
    /**
     * Проверяет идет ли процесс поиска проблем
     */
    isProcessing():Promise<boolean>;
    /**
     * Очищает список зарегистрированных проблем
     */
    clean();
    /**
     * Запускает процесс анализа проблем
     */
    review();
    /**
     * Регистрирует проблему в системе
     * @param problem       - 
     * @param title 
     * @param uid 
     */
    emit(problem: Error, title?: string, uid?: string);
    /**
     * Регистрирует проблему в системе
     * @param problem 
     * @param title 
     * @param uid 
     */
    emit(problem: IDocHubProblem);
    /**
     * Возвращает зарегистрированные проблемы
     */
    fetchProblems(): Promise<IDocHubProblem[]>
    /**
     * Возвращает валидаторы
     */
    fetchValidators(): Promise<IDocHubValidator[]>
    /**
     * Возвращает исключения
     */
    fetchExceptions(): Promise<IDocHubException[]>
}

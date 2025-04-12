import { DataLakePath } from "./datalake";
import { IDocHubDataSetProfile } from "./jsonata";

export type IDocHubProblemUID = string;
export type IDocHubValidatorUID = string;

export interface IDocHubValidatorBase {
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
 * Валидаторы проблем
 */
export interface IDocHubValidator extends IDocHubDataSetProfile, IDocHubValidatorBase {}
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

export enum DocHubProblemsEvents {
    // Процесс поиска проблем стартовал
    startReview = 'dochub-problems-review-start',
    // Валидатор завершил работу
    validatorReviewed = 'dochub-problems-validator-reviewed',
    // Процесс поиска проблем завершился
    finishReview = 'dochub-problems-review-finish',
}

/**
 * Данные передаваемые с событием DocHubProblemsEvents.validatorReviewed
 */
export interface IDocHubProblemsEventValidatorReviewed {
    // Данные валидатора
    validator: IDocHubValidatorBase;
    // Количество обнаруженных проблем
    problems: number;
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
    fetchProblems(validator?: IDocHubValidatorUID | IDocHubValidatorUID[]): Promise<IDocHubProblem[]>
    /**
     * Возвращает валидаторы
     */
    fetchValidators(validator?: IDocHubValidatorUID | IDocHubValidatorUID[]): Promise<IDocHubValidator[]>
    /**
     * Возвращает исключения
     */
    fetchExceptions(): Promise<IDocHubException[]>
}

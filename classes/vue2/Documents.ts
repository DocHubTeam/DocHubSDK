/* eslint-disable no-unused-vars */
import { Prop, Watch, Component } from 'vue-property-decorator';
import { DocHubComponentProto } from './Components';
import { DocHub } from '../..';
import { DocHubError } from '..';
import type { IDocHubEditableComponent, IDocHubPresentationProfile, IDocHubPresentationsParams } from '../..';

import ajv from 'ajv';
import ajv_localize from 'ajv-i18n/localize/ru';
import mustache from 'mustache';

//********************************************
// !!!!!!!  followURI не задается !!!!!
//********************************************

export enum DocHubDocumentType {
  content = 'content',    // Работает с неструктурированными данными. 
                          // В поле source предполагается путь к файлу с данными. 
                          // Если есть поле template, предполагается, что в нем ссылка на шаблон, 
                          // а в source запрос для генерации данных для его заполнения.
                          // В результате работы вызовет метод processingContent

  data = 'data'           // Работает только со структурированными данными.
                          // Предполагается, что в source находится запрос.
                          // В результате работы вызовет метод processingData
}

@Component
export class DocHubDocumentProto extends DocHubComponentProto implements IDocHubEditableComponent {
  onRefresher: any = null;                // Таймер отложенного выполнения обновления
  followURI: string | undefined;          // URI файла за которым установлено слежение 
  error: string | null = null;            // Ошибка
  isPending = true;                       // Признак внутренней работы. Например загрузка данных.

  /**
   * Профиль документа
   */
  @Prop({
    type: Object,
    required: true
  }) readonly profile: IDocHubPresentationProfile;

  /**
   * Параметры
   */
  @Prop({
    type: Object,
    default: {}
  }) readonly params: IDocHubPresentationsParams;

  /**
   * Следим за изменением профиля документа
   */
  @Watch('profile') onProfileChanged() {
    this.onRefresh();
  }

  /**
   * Следим за изменением параметров
   */
  @Watch('params') onParamsChanged() {
    this.onRefresh();
  }

  mounted() {
    // При монтировании компонента в DOM, генерируем событие обновления
    this.onRefresh();
  }

  destroyed() {
    // Отключаем слежку за файлом
    this.refreshFileFollow(true);
  }

  /**
   * Подтверждаем, что презентация может редактироваться
   * @returns 
   */
  isEditable(): boolean {
    return true;
  }
  /**
   * Открываем редактор
   */
  openEditor(): void {
    this.followURI && DocHub.dataLake.openFileEditor(this.followURI, {
      targetPath: this.profile.$base
    });
  }

  /**
   * Обработка полученных данных документа.
   * Можно перехватывать.
   */
  processingData(data: any): any {
    return data;
  }

  /**
   * Обработка полученных данных документа.
   * Нужно переопределить для типа документа DocHubDocumentType.content
   */
  processingContent(content: any) {
    throw new DocHubError('Not implemented.');
  }

  /**
   * Возвращает схему данных для контроля структуры и состава данных.
   * Необходимо переопределить.
   */
  getSchemaData(): any {
    return {};
  }

  /**
   * Возвращает тип документа
   */
  getType(): DocHubDocumentType {
    return DocHubDocumentType.content;
  }

  /**
   * Обрабатываем событие переключения языкового пакета
   */
  onLangSwitch() {
    this.onRefresh();
  }

  /** 
   * Для переопределения
   */
  async doRefresh(): Promise<void> {
    try {
      this.isPending = true;
      await this.refreshFileFollow();
      const template = (this.getType() === DocHubDocumentType.content) && this.profile?.template 
        && (await DocHub.dataLake.pullFile(
          DocHub.dataLake.resolveURI(this.followURI || this.profile?.template, this.profile?.template)
        )).data;
      if (!this.profile?.source) throw new DocHubError('Document must have field "source" in profile!');
      let result = (template || (this.getType() === DocHubDocumentType.data)) 
        && await DocHub.dataLake.resolveDataSetProfile(this.profile, {
          params: this.params,
          baseURI: this.followURI
        })
        || (await DocHub.dataLake.pullFile(
          DocHub.dataLake.resolveURI(this.followURI || this.profile?.source as string, this.profile?.source as string)
        )).data;
      // Валидируем данные по структуре, если это требуется
      if (template || (this.getType() === DocHubDocumentType.data)) {
        const rules = new ajv({ allErrors: true });
        const validator = rules.compile(this.getSchemaData());
        if (!validator(result)) {
          ajv_localize(validator.errors);
          this.error = JSON.stringify(validator.errors, null, 4);
          return;
        }
        // Если все в порядке, вызываем процессинг данных
        result = this.processingData(result);
      }
      // Транслируем по шаблону
      if (template) {
        result = mustache.render(template.toString(), result);
      }
      // Вызываем метод обработки полученного контента, если это требуется
      (template || (this.getType() === DocHubDocumentType.content)) && this.processingContent(result);
      this.error = null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      this.error = error;
      this.processingData(undefined);
    } finally {
      this.isPending = false;
    }
  }

  // Обновляет URI файла за которым установлено наблюдение
  async refreshFileFollow(disable = false): Promise<void> {
    // Устанавливаем слежение за файлом для оперативного обновления
    this.followURI && DocHub.dataLake.unfollowFile(this.followURI, this.onRefresh);
    if (!disable) {
      this.followURI = (await DocHub.dataLake.getURIForPath(this.profile.$base) || []).pop();
      this.followURI && DocHub.dataLake.followFile(this.followURI, this.onRefresh);
    }
  }

  // Обработчик события обновления
  onRefresh(): void {
    // Если обработчик уже запущен, останавливаем его
    if (this.onRefresher) clearTimeout(this.onRefresher);
    // Для исключения избыточных обращений к Data Lake откладываем обновление на 50мс
    this.onRefresher = setTimeout(() => {
      this.onRefresher = null;
      this.doRefresh();
    }, 50);
  }      
}

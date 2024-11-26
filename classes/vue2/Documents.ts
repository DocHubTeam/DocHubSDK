/* eslint-disable no-unused-vars */
import { Vue, Prop, Watch, Component } from 'vue-property-decorator';
import { DocHub } from '../..';
import type { IDocHubEditableComponent, IDocHubPresentationProfile, IDocHubPresentationsParams } from '../..';

import ajv from 'ajv';
import ajv_localize from 'ajv-i18n/localize/ru';

/**
 * Тип в источнике данных
 */
export enum DocumentSourceType {
  data          = 'data',         // Объект данных не требующий обработки
  jsonata       = 'jsonata',      // JSONata запрос
  dataFile      = 'data-file',    // Ссылка на файл с данными
  jsonataFile   = 'jsonata-file'  // Ссылка на файл с запросом jsonata
};

@Component
export class DocHubDocumentProto extends Vue implements IDocHubEditableComponent {
  onRefresher: any = null;          // Таймер отложенного выполнения обновления
  followURI: string | null =  null; // URI файла за которым установлено слежение 
  error: string | null = null;      // Ошибка
  isPending = true;                 // Признак внутренней работы. Например загрузка данных.

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
   * Необходимо переопределить.
   */
  processingData(data: any | undefined) {}

  /**
   * Возвращает схему данных для контроля структуры и состава данных.
   * Необходимо переопределить.
   */
  getSchemaData(): any {}

  /**
   * Определяет тип данных 
   * @param source 
   */
  getSourceType(source: any) {

  }

  /** 
   * Для переопределения
   */
  async doRefresh(): Promise<void> {
    try {
      this.isPending = true;
      await this.refreshFileFollow();
      if (this.profile?.source) {
        const result = await DocHub.dataLake.pullData(this.profile.source, this.params);
        // Валидируем данные по структуре
        const rules = new ajv({ allErrors: true });
        const validator = rules.compile(this.getSchemaData());
        if (!validator(result)) {
          ajv_localize(validator.errors);
          this.error = JSON.stringify(validator.errors, null, 4);
          return;
        } 
        // Если все в порядке, вызываем процессинг данных
        this.processingData(result);
        this.error = null;
      } else this.processingData(undefined);
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
      this.followURI = (await DocHub.dataLake.getURIForPath(this.profile.$base) || []).pop() || null;
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

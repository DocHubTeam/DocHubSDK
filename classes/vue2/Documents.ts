/* eslint-disable no-unused-vars */
import { Prop, Watch, Component } from 'vue-property-decorator';
import { DocHubComponentProto } from './Components';
import { DocHub } from '../..';
import { DocHubError } from '..';
import type { IDocHubEditableComponent, IDocHubEditableMeta, IDocHubEditableMetaEditEntry, IDocHubPresentationProfile, IDocHubPresentationsParams } from '../..';
import { DocHubUITargetWindow } from '../..';
import { getIconByURI } from '../../helpers/icons';

import ajv from 'ajv';
import ajv_localize from 'ajv-i18n/localize/ru';
import { AxiosResponse } from 'axios';


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
  onRefresher: any = null;                              // Таймер отложенного выполнения обновления
  followFiles: string[] | undefined = undefined;        // Список файлов за изменениями которых нужно следить
  baseURI: string | undefined = undefined;              // URI документа от которого должны разрешаться все относительные ссылки
  error: string | null = null;                          // Ошибка
  isPending = true;                                     // Признак внутренней работы. Например загрузка данных.
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
   * Признак версии для печати
   */
  @Prop({
    type: Boolean,
    default: false
  }) readonly isPrintVersion: boolean;
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
  /**
   * Следим за занятостью документа
   */
  @Watch('isPending') onPendingChanged() {
    if (this.isPending) this.freezeView();
    else this.$nextTick(() => this.unfreezeView());
  }

  mounted() {
    // При монтировании компонента в DOM, генерируем событие обновления
    this.onRefresh();
  }

  destroyed() {
    // Отключаем слежку за файлом
    this.refreshFilesFollow(true);
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
  openEditor(uri?: string): void {
    this.baseURI && DocHub.dataLake.openFileEditor(uri || this.baseURI, {
      location: this.profile.$base.toString(),
      targetWindow: (window.event as any)?.ctrlKey ? DocHubUITargetWindow._blank : DocHubUITargetWindow._self
    });
  }
  /**
   * Возвращает метаинформацию для режима редактирования
   */
  async getMetaEdit(): Promise<IDocHubEditableMeta> {
    const entries = this.followFiles || [];
    !entries.length && entries.push(...await DocHub.dataLake.getURIForPath(this.profile?.$base));
    return {
      title: this.profile?.title || this.profile?.$base?.toString() || '$undefined$',
      icon: getIconByURI(this.baseURI || this.followFiles?.[0]),
      // Генерирует на все задействованные файлы точки редактирования
      entries: entries.map((uri: string): IDocHubEditableMetaEditEntry => {
        return {
          title: uri,
          icon: getIconByURI(uri),
          handle: () =>  this.openEditor(uri)
        }
      })
    }
  }
  /**
   * Обработка полученных данных документа.
   * Можно перехватывать.
   */
  async processingData(data: any): Promise<any> {
    return data;
  }
  /**
   * Обработка полученных данных документа.
   * Нужно переопределить для типа документа DocHubDocumentType.content
   */
  async processingContent(content: AxiosResponse): Promise<void> {
    throw new DocHubError(`The document has ${this.getType()} type. It must have processingContent method. But, the method is not implemented.`);
  }
  /**
   * Возвращает список отслеживаемых файлов.
   * Может быть переопределен.
   * @param files   - Список файлов которые предполагается отслеживать
   * @returns       - Список файлов для отслеживания
   */
  async processingFollowFiles(files: string[]): Promise<string[]> {
    return files;
  }
  /**
   * Возвращает схему данных для контроля структуры и состава данных.
   * Необходимо переопределить.
   */
  getSchemaData(): any {
    return {};
  }
  /**
   * Возвращает тип документа.
   * Может быть переопределен.
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
      if (!this.profile?.source) throw new DocHubError('Document must have field "source" in profile!');
      this.isPending = true;
      await this.refreshFilesFollow();
      const template = (this.getType() === DocHubDocumentType.content) && this.profile?.template 
        && (await DocHub.dataLake.pullFile(
          DocHub.dataLake.resolveURI(this.baseURI || this.profile?.template, this.profile?.template)
        ));
      let result: AxiosResponse = (template || (this.getType() === DocHubDocumentType.data)) 
        && { data: await DocHub.dataLake.resolveDataSetProfile(this.profile, {
          params: this.params,
          baseURI: this.baseURI
        }) } as AxiosResponse
        || (await DocHub.dataLake.pullFile(
          DocHub.dataLake.resolveURI(this.baseURI || this.profile?.source as string, this.profile?.source as string)
        ));
      // Валидируем данные по структуре, если это требуется
      if (template || (this.getType() === DocHubDocumentType.data)) {
        const rules = new ajv({ allErrors: true });
        const validator = rules.compile(this.getSchemaData());
        if (!validator(result.data)) {
          ajv_localize(validator.errors);
          this.error = JSON.stringify(validator.errors, null, 4);
          return;
        }
        // Если все в порядке, вызываем процессинг данных
        result.data = await this.processingData(result.data);
      }
      // Транслируем по шаблону
      if (template) {
        result = {
          ...template,
          data: DocHub.tools.mustache.render(template.data.toString(), result.data)
        }
      }
      // Очищаем информацию об ошибке
      this.error = null;
      // Вызываем метод обработки полученного контента, если это требуется
      (template || (this.getType() === DocHubDocumentType.content)) && this.processingContent(result);
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
  async refreshFilesFollow(disable = false): Promise<void> {
    // Очищаем ранее установленные отслеживания
    for(const uri of this.followFiles || []) {
      DocHub.dataLake.unfollowFile(uri, this.onRefresh);
    }
    // Если нужно только очистить отслеживание - выходим
    if (disable) return;
    const followFiles: string[] = [];
    // Иначе...
    // Определяем базовый файл
    this.baseURI = (await DocHub.dataLake.getURIForPath(this.profile.$base) || []).pop();
    // Если определить его не удалось, вываливаемся в ошибку
    if (!this.baseURI) throw new DocHubError(`Can not resolve base URI for base path [${this.profile.$base}]`);
    // Если указан шаблон, добавляем его в отслеживаемые файлы
    if(this.profile?.template) {
      followFiles.push(DocHub.dataLake.resolveURI(this.baseURI, this.profile.template));
    } else if (typeof this.profile?.source === 'string' && this.getType() === DocHubDocumentType.content) {
      // Если шаблона нет, но документ предполагает работу с содержимым файла, то отслеживаем source
      followFiles.push(DocHub.dataLake.resolveURI(this.baseURI, this.profile?.source));
    }
    // Даем возможность повлиять на список отслеживаемых файлов через переопределенный метод
    this.followFiles = await this.processingFollowFiles(followFiles);
    // Устанавливаем отслеживание
    for(const uri of this.followFiles || []) {
      DocHub.dataLake.followFile(uri, this.onRefresh);
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

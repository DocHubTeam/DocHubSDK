/* eslint-disable no-unused-vars */
import { Prop, Watch, Component } from 'vue-property-decorator';
import { DocHubComponentProto } from './Components';
import { DocHub } from '../..';
import { DocHubError } from '..';
import type { IDocHubAIContextPartition, IDocHubContextProvider, IDocHubEditableComponent, IDocHubEditableMeta, IDocHubEditableMetaEditEntry, IDocHubPresentationProfile, IDocHubPresentationsParams } from '../..';
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

  data = 'data',          // Работает только со структурированными данными.
                          // Предполагается, что в source находится запрос.
                          // В результате работы вызовет метод processingData

  custom = 'custom'       // Неопределенная структура профиля документа
}

/**
 * Контекст-провайдер для AI агента
 */
export class AIDocumentContextProvider implements IDocHubContextProvider {
  private docs: DocHubDocumentProto[] = [];

  constructor() {
    DocHub.ai.registerContextProvider('dochub-document-default', this);
  }

  register(doc: DocHubDocumentProto) {
    !this.docs.includes(doc) && this.docs.push(doc);
  }
  unregister(doc: DocHubDocumentProto) {
    this.docs = this.docs.filter((v) => v !== doc);
  }
  async pullPartitions(): Promise<IDocHubAIContextPartition[]> {
    const result: IDocHubAIContextPartition[] = [];
    for (const doc of this.docs) {
      result.push({
        id:  doc.profile.$base.toString(),
        content: doc.pullAIContext,
        path: doc.profile.$base,
        uri: (await DocHub.dataLake.getURIForPath(doc.profile.$base)).pop()
      });
    }
    return result;
  }
}

@Component
export class DocHubDocumentProto extends DocHubComponentProto implements IDocHubEditableComponent {
  onRefresher: any = null;                                                // Таймер отложенного выполнения обновления
  followFiles: string[] | undefined = undefined;                          // Список файлов за изменениями которых нужно следить
  baseURI: string | undefined = undefined;                                // URI документа от которого должны разрешаться все относительные ссылки
  templateURI: string | undefined = undefined;                            // URI файла шаблона, если он определен
  sourceURI: string | undefined = undefined;                              // Файла источника, если он определен как файл
  error: string | null = null;                                            // Ошибка
  isPending = true;                                                       // Признак внутренней работы. Например загрузка данных.
  contentData: any = null;                                                // Данные, на основе которых рендерится документ
  private static contextProvider: AIDocumentContextProvider = null;       // Провайдер генерации контекста для AI

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
   * Возвращает провайдер AI-контекста по умолчанию
   */
  get contextProvider() : AIDocumentContextProvider {
    return DocHubDocumentProto.contextProvider ||= new AIDocumentContextProvider();
  }
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
    // Регистрирует документ как поставщик контекста для AI
    this.contextProvider.register(this);
  }

  destroyed() {
    // Отключаем слежку за файлом
    this.refreshFilesFollow(true);
    // Отменяет регистрацию документа как поставщика контекста для AI
    this.contextProvider.unregister(this);    
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
        };
      })
    };
  }
  /**
   * Возвращает контекст документа для AI-агента
   * @returns 
   */
  async pullAIContext(): Promise<string> {
    if (!this.contentData) return '';
    let result = '# Пользователь просматривает/изучает документ ';
    this.profile?.title && (result += ` \`${this.profile?.title}\`\n`);
    result += '**Документ выведен на экран и пользователь на него смотрит.** Если пользователь говорит "этот документ", значит он имеет ввиду этот документ или другой представленный на экране.\n';
    this.profile?.title && (result += `* Документ имеет название \`${this.profile?.title}\`\n`);
    this.profile?.type && (result += `* Документ имеет тип \`${this.profile?.type}\`\n`);
    this.profile?.$base && (result += `* Документ расположен в Data Lake по пути \`${this.profile?.$base}\`\n`);
    this.profile?.template && (result += `* Документ использует шаблон для своего представления \`${this.profile?.template}\`\n`);
    result += `* Источником информации для него служит \`${JSON.stringify(this.profile?.source)}\`\n`;
    result += '* Содержимое документа начинается после строки `$______DOC____BEGIN_____$` и заканчивается после троки `$______DOC____END_____$` \n\n';
    const content = typeof this.contentData === 'string' ? this.contentData : JSON.stringify(this.contentData || '');
    result += `\`$______DOC____BEGIN_____$\`\n${content}\n\`$______DOC____END_____$\``;
    return result;
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
   * Кастомный обработчик профиля документа.
   */
  async processingCustom(): Promise<void> {
    throw new DocHubError(`The document has ${this.getType()} type. It must have processingCustom method. But, the method is not implemented.`);
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
      const contentType = this.getType();
      // Если тип документа кастомный, отдаем управление кастомному методу 
      if (contentType === DocHubDocumentType.custom) {
        await this.processingCustom();
      } else {
        // Если есть шаблон, загружаем его
        const template = (contentType === DocHubDocumentType.content) && this.templateURI 
          && (await DocHub.dataLake.pullFile(this.templateURI));
        let result: AxiosResponse | null = (template || (contentType === DocHubDocumentType.data)) 
          && { data: await DocHub.dataLake.resolveDataSetProfile(this.profile, {
            params: this.params,
            baseURI: this.baseURI
          }) } as AxiosResponse
          || (this.sourceURI ? await DocHub.dataLake.pullFile(this.sourceURI) : null);
        if (!result) throw new DocHubError(`Can not render document [${this.profile?.$base}]`);
        // Валидируем данные по структуре, если это требуется
        if (template || (contentType === DocHubDocumentType.data)) {
          const rules = new ajv({ allErrors: true });
          const validator = rules.compile(this.getSchemaData());
          if (!validator(result.data)) {
            ajv_localize(validator.errors);
            this.error = JSON.stringify(validator.errors, null, 4);
            return;
          }
          // Если все в порядке, вызываем процессинг данных
          result.data = await this.processingData(this.contentData = result.data);
        }
        // Транслируем по шаблону
        if (template) {
          result = {
            ...template,
            data: DocHub.tools.mustache.render(template.data.toString(), result.data)
          };
        }
        // Очищаем информацию об ошибке
        this.error = null;
        // Вызываем метод обработки полученного контента, если это требуется
        if(template || (contentType === DocHubDocumentType.content)) {
          this.processingContent(result);
          this.contentData = result.data;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      this.error = error;
      this.processingData(this.contentData = undefined);
    } finally {
      this.isPending = false;
    }
  }

  // Обновляет URI файлов за которым установлено наблюдение
  async refreshFilesFollow(disable = false): Promise<void> {
    // Очищаем ранее установленные отслеживания
    for(const uri of this.followFiles || []) {
      DocHub.dataLake.unfollowFile(uri, this.onRefresh);
    }
    // Сбрасываем URI файлов
    this.templateURI = undefined;
    this.sourceURI = undefined;
    this.baseURI = undefined;
    // Если нужно только очистить отслеживание - выходим
    if (disable) return;
    // Иначе...
    const followFiles: string[] = [];
    // Определяем базовый файл
    this.baseURI = (await DocHub.dataLake.getURIForPath(this.profile.$base) || []).pop();
    // Если определить его не удалось, вываливаемся в ошибку
    if (!this.baseURI) throw new DocHubError(`Can not resolve base URI for base path [${this.profile.$base}]`);
    const baseStruct = this.profile.$base.split('/');
    // Если указан шаблон, добавляем его в отслеживаемые файлы
    if(this.profile?.template) {
      const templatePath = [...baseStruct, 'template'].join('/');
      const baseTemplateURI = (await DocHub.dataLake.getURIForPath(templatePath) || []).pop() || this.baseURI;
      this.templateURI = this.profile?.template === '.' // Точка является ссылкой на текущий файл
        ? baseTemplateURI
        : DocHub.dataLake.resolveURI(baseTemplateURI, this.profile.template);
      if (!this.templateURI) throw new DocHubError(`Can not resolve template URI for path [${templatePath}]`);
      followFiles.push(this.templateURI);
    } else if (typeof this.profile?.source === 'string' && this.getType() === DocHubDocumentType.content) {
      // Если шаблона нет, но документ предполагает работу с содержимым файла, то отслеживаем source
      const sourcePath = [...baseStruct, 'source'].join('/');
      const baseSourceURI = (await DocHub.dataLake.getURIForPath(sourcePath) || []).pop() || this.baseURI;
      this.sourceURI = this.profile.source === '.'  // Точка является ссылкой на текущий файл
        ? baseSourceURI
        : DocHub.dataLake.resolveURI(baseSourceURI, this.profile.source );
      if (!this.sourceURI) throw new DocHubError(`Can not resolve source URI for path [${sourcePath}]`);
      followFiles.push(this.sourceURI);
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

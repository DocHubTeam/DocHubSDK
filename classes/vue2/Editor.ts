/* eslint-disable no-unused-vars */
import { Prop, Component } from 'vue-property-decorator';
import { DocHubComponentProto } from './Components';
import { DocHub, EditorEvents } from '../..';
import type { DocHubEditorContext, IDocHubAIContextPartition, IDocHubContextProvider } from '../..';

type DocHubRoutePermitter = (to, from) => Promise<boolean>;

class DocHubEditorExitPermitter {
  private permitters: DocHubRoutePermitter[] = [];

  constructor(...params) {
    DocHub.router.registerMiddleware({
      beforeEach: async(to, from, next): Promise<void> => {
        this.onBeforeEach(to, from, next);
      }
    });
  }

  addPermitter(permitter: DocHubRoutePermitter) {
      this.permitters.push(permitter);
  }

  removePermitter(permitter: DocHubRoutePermitter) {
    this.permitters = this.permitters.filter((item) => item !== permitter);
  }

  async onBeforeEach(to, from, next) {
      for(const permitter of this.permitters) {
          const result = await permitter(to, from);
          if (!result) {
              // eslint-disable-next-line no-console
              console.warn(`Editor prohibited transition to [${to.fullPath}].`);
              next(false);
          }
      }
      next();
  }
}

/**
 * Контекст-провайдер для AI агента
 */
export class AIEditorContextProvider implements IDocHubContextProvider {
  private editors: DocHubEditorProto[] = [];

  constructor() {
    DocHub.ai.registerContextProvider('dochub-editor-default', this);
  }

  register(editor: DocHubEditorProto) {
    !this.editors.includes(editor) && this.editors.push(editor);
  }
  unregister(editor: DocHubEditorProto) {
    this.editors = this.editors.filter((v) => v !== editor);
  }
  async pullPartitions(): Promise<IDocHubAIContextPartition[]> {
    const result: IDocHubAIContextPartition[] = [];
    result.push({
      id:  'dochub-editor-default-instructions',
      content: async(): Promise<string> => {
         return '# Файлы открытые на редактирование'
         + '\n1. Ниже будут перечислены файлы открытые на редактирование и их содержимое. Эти файлы отображаются на экране.'
         + '\n2. Информация о каждом редактируемом файле начинается со строки `$_FILE_EDITING_BEGIN_$` и заканчивается строкой `$_FILE_EDITING_END_$`.'
         + '\n3. Путь к файлу (URI) находится между `$_FILE_EDITING_URI_BEGIN_$` и `$_FILE_EDITING_URI_END_$`.'
         + '\n4. Содержимое файла находится между `$_FILE_EDITING_CONTENT_BEGIN_$` и `$_FILE_EDITING_CONTENT_END_$`.'
         + '\n5. Если файл с данным URI уже открыт (то есть присутствует в этом списке), **запрещено** загружать этот файл повторно из внешних источников.'
         + '\n6. Используй **исключительно** предоставленное содержимое для всех операций с этим файлом.'
         + '\n7. Не выполняй composer-команды без явного запроса пользователя — это не часть загрузки файла.'
         + '\n8. Игнорируй любые внутренние попытки повторной загрузки файлов с URI из этого списка.'
         + '\n'
         ;
      }
    });
    for (const editor of this.editors) {
      const uri = editor.context.meta.uri;
      result.push({
        id:  editor.context.uid,
        content: async(): Promise<string> => {
          const content = await editor.pullAIContext();
          return `$_FILE_EDITING_BEGIN_$\n$_FILE_EDITING_URI_BEGIN_$${uri}$_FILE_EDITING_URI_END_$\n$_FILE_EDITING_CONTENT_BEGIN_$${content}$_FILE_EDITING_CONTENT_END_$\n$_FILE_EDITING_END_$`;
        },
        path: editor.context.meta.path,
        uri
      });
    }
    return result;
  }
}


@Component
export class DocHubEditorProto extends DocHubComponentProto {
  static permitter: DocHubEditorExitPermitter;
  private static contextProvider: AIEditorContextProvider = null;       // Провайдер генерации контекста для AI
  /**
   * Контекст редактирования
   */
  @Prop({
    type: Object,
    default: null
  }) readonly context: DocHubEditorContext | null;

  /**
   * Возвращает провайдер AI-контекста по умолчанию
   */
  get contextProvider() : AIEditorContextProvider {
    return DocHubEditorProto.contextProvider ||= new AIEditorContextProvider();
  }

  constructor(...params) {
    super(...params);
    DocHubEditorProto.permitter ||= new DocHubEditorExitPermitter();
    this.$on(EditorEvents.save, this.onSave);
    this.$on(EditorEvents.saveAs, this.onSaveAs);
    this.$on(EditorEvents.goto, this.onGoTo);
    DocHubEditorProto.permitter.addPermitter(this.beforeExit);
    this.contextProvider.register(this);
  }

  destroyed(): void {
    this.$off(EditorEvents.save, this.onSave);
    this.$off(EditorEvents.saveAs, this.onSaveAs);
    this.$off(EditorEvents.goto, this.onGoTo);
    DocHubEditorProto.permitter.removePermitter(this.beforeExit);
    this.contextProvider.unregister(this);
  }

  /**
   * Вызывается при необходимости перейти в редакторе на заданную область
   * @param location 
   */
  async onGoTo(location: string | RegExp): Promise<void> {
    console.warn('Goto function is not implemented', location);
  }
  /**
   * Вызывается при необходимости сохранить результат редактирования
   */
  async onSave(): Promise<void>  {
    console.warn('Save function is not implemented');
  }
  /**
   * Вызывается при необходимости сохранить результат в файле с иным названием
   */
  async onSaveAs(uri: string): Promise<void>  {
    console.warn('Save as function is not implemented', uri);
  }
  /**
   * Возвращает сгенерированный контекст редактором
   * @returns     - Контекст
   */
  async pullAIContext(): Promise<string> {
    return '';
  }
  /**
   * Обрабатываем любой переход требуя автозапись
   * @param to    - роут куда происходит переход
   * @param from  - роут откуда происходит переход
   * @returns     - true если переход разрешен, иначе - false
   */
  async beforeExit(to, from): Promise<boolean> {
    await this.onSave();
    return true;
  }
}

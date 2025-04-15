/* eslint-disable no-unused-vars */
import { Prop, Component } from 'vue-property-decorator';
import { DocHubComponentProto } from './Components';
import { DocHub, EditorEvents } from '../..';
import type { DocHubEditorContext } from '../..';

type DocHubRoutePermitter = (to, from) => Promise<boolean>;

class DocHubEditorExitPermitter {
  private permitters: DocHubRoutePermitter[] = [];

  constructor(...params) {
    DocHub.router.registerMiddleware({
      beforeEach: async(to, from, next): Promise<void> => {
        debugger;
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

@Component
export class DocHubEditorProto extends DocHubComponentProto {
  static permitter: DocHubEditorExitPermitter;
  /**
   * Контекст редактирования
   */
  @Prop({
    type: Object,
    default: null
  }) readonly context: DocHubEditorContext | null;

  constructor(...params) {
    super(...params);
    DocHubEditorProto.permitter ||= new DocHubEditorExitPermitter();
    this.$on(EditorEvents.save, this.onSave);
    this.$on(EditorEvents.saveAs, this.onSaveAs);
    this.$on(EditorEvents.goto, this.onGoTo);
    DocHubEditorProto.permitter.addPermitter(this.beforeExit);
  }

  destroyed(): void {
    this.$off(EditorEvents.save, this.onSave);
    this.$off(EditorEvents.saveAs, this.onSaveAs);
    this.$off(EditorEvents.goto, this.onGoTo);
    DocHubEditorProto.permitter.removePermitter(this.beforeExit);
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

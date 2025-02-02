/* eslint-disable no-unused-vars */
import { Prop, Component } from 'vue-property-decorator';
import { DocHubComponentProto } from './Components';
import { DocHub, EditorEvents } from '../..';
import type { DocHubEditorContext } from '../..';

@Component
export class DocHubEditorProto extends DocHubComponentProto {
  /**
   * Контекст редактирования
   */
  @Prop({
    type: Object,
    default: null
  }) readonly context: DocHubEditorContext | null;

  constructor(...params) {
    super(...params);
    this.$on(EditorEvents.save, this.onSave);
    this.$on(EditorEvents.saveAs, this.onSaveAs);
    this.$on(EditorEvents.goto, this.onGoTo);
  }

  destroyed(): void {
    this.$off(EditorEvents.save, this.onSave);
    this.$off(EditorEvents.saveAs, this.onSaveAs);
    this.$off(EditorEvents.goto, this.onGoTo);
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
}

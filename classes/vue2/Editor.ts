/* eslint-disable no-unused-vars */
import { Prop, Watch, Component } from 'vue-property-decorator';
import { DocHubComponentProto } from './Components';
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
}

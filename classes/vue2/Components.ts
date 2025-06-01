import { Vue, Component } from 'vue-property-decorator';
import { DocHub, DocHubLangEvents } from '../..';

export interface IDocHubDocumentUIState {
  styleHeight: string;
  styleWidth: string;
  styleFilter: string;
}

@Component
export class DocHubComponentProto extends Vue {
  lang: any = null;                       // Подключенный языковой пакет
  savedUIState: IDocHubDocumentUIState | null = null;   // Хранит текущее UI состояние для последующего восстановления

  /**
   * Монтирует языковой пакет
   */
  remountLangPackage() {
    this.lang = DocHub.lang.getConst(this.getLangPackageID());
    this.onLangSwitch();
  }

  mounted() {
    // Монтируем языковой пакет
    this.remountLangPackage();
    // Подключаем контроль за переключением языка
    DocHub.eventBus.$on(DocHubLangEvents.changeLang, this.remountLangPackage);
  }

  destroyed() {
    // Отключаем контроль переключения языка
    DocHub.eventBus.$off(DocHubLangEvents.changeLang, this.remountLangPackage);
  }

  /**
   * Возвращает идентификатор языкового пакета.
   * По умолчанию "dochub".
   */
  getLangPackageID(): string {
    return 'dochub';
  }

  /**
   * Событие переключения языкового пакета
   */
  onLangSwitch() {}

  /**
   * Сохраняет текущие параметры визуализации для исключения дерганий при обновлении контента
   */
  saveUISate() {
    const element: any = this['$el'];
    this.savedUIState = {
      styleHeight: element.style.height,
      styleWidth: element.style.width,
      styleFilter: element.style.filter
    };
  }
  /**
   * Восстанавливает параметры визуализации из ранее сохраненных
   */
  loadUISate() {
    const element: any = this['$el'];
    if (element?.style) {
      element.style.height = this.savedUIState?.styleHeight;  
      element.style.width = this.savedUIState?.styleWidth;
      element.style.filter = this.savedUIState?.styleFilter;
    }
  }
  /**
   * "Замораживает" представление на период обновления
   */
  freezeView() {
    this.saveUISate();
    const element: any = this['$el'];
    element.style.height = `${element.clientHeight}px !important`;
    element.style.width = `${element.clientWidth}px !important`;
    element.style.filter = 'blur(8px)';
  }
  /**
   * "Размораживает" представление после загрузки
   */
  unfreezeView() {
    this.loadUISate();
  }
}

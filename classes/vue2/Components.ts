import { Vue, Component } from 'vue-property-decorator';
import { DocHub, DocHubLangEvents } from '../..';

@Component
export class DocHubComponentProto extends Vue {
  lang: any = null;                       // Подключенный языковой пакет

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

}

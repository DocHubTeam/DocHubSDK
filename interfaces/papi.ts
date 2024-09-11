export type IClipboardValue = string

export interface IGotoParams {
  id: string;
  source: string;
  entity: string;
}

export interface IProjectMode {
  mode: string
}

export interface IUmlSourceCode {
  uml: string
}

export interface ISourceDownloadParams {
  content: string;
  title: string;
  description: string;
  extension: string;
}

export interface ISourceSchema {
  schema: string;
}

export interface IClipboardData<T = IClipboardValue> {
  data: T
}

export interface IFileContent<T = string> {
  source: string;
  content: T
}

export interface ICodeMetadata {
  code: string;
  metadata: string;
}

export interface BasePapiEvents {
  goTo(params: IGotoParams): void
  applyEntitySchema(schema: ISourceSchema): void
  registerLazyLoadedDiagrams(): void
}
export interface RenderPapiEvents {
  renderPlantUml(uml: IUmlSourceCode): Promise<void>
}

export interface FileWorker {
  initProject(mode: IProjectMode): void
  download(source: ISourceDownloadParams): void
}

export interface IdeaPapiPlugin extends BasePapiEvents, RenderPapiEvents, FileWorker {
  messagePull(): Promise<void>
  pushFile(content: IFileContent): Promise<void>
  pushCode(metadata: ICodeMetadata): Promise<void>
  copyToClipboard(data: IClipboardData): void
}

export interface VsCodePapiPlugin extends BasePapiEvents, RenderPapiEvents, FileWorker {
  loadingHtmlDocumentEvent(): void
  checkIsRootManifest(): void
}


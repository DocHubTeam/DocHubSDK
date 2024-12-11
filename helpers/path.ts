/**
     * Вычисляет относительный путь из прямых
     */
export function getRelativePath(baseUrl: string, targetUrl: string): string {
    const structBase = baseUrl?.split('@');
    const structTarget = targetUrl.split('@');
    if (
      (structBase.length !== structTarget.length) // Если по структуре URL адреса не сходятся сразу выходим
      || (structBase.length === 2 && structBase[0] !== structTarget[0]) // Если репа или ветка не та, тоже выходим
    ) return targetUrl;
    
    // За основу берем правую часть структуры
    const base = new URL(structBase.pop() || '/', 'null:/');
    const target = new URL(structTarget.pop() || '/', 'null:/');
    // Проверяем, что базовый и целевой URL имеют одинаковый протокол и хост
    if (base.protocol !== target.protocol || base.host !== target.host) {
      throw new Error('Base and target URLs must have the same protocol and host.');
    }
    // Получаем пути
    const basePathSegments = base.pathname.split('/').filter(segment => segment);
    const targetPathSegments = target.pathname.split('/').filter(segment => segment);
    // Находим общую часть пути
    let commonLength = 0;
    while (commonLength < basePathSegments.length && commonLength < targetPathSegments.length &&
      basePathSegments[commonLength] === targetPathSegments[commonLength]) {
      commonLength++;
    }
    // Создаем относительный путь
    const relativePathSegments: string[] = [];
    // Добавляем "../" для каждого сегмента, который нужно поднять
    for (let i = commonLength + 1; i < basePathSegments.length; i++) {
      relativePathSegments.push('..');
    }
    // Добавляем оставшиеся сегменты целевого пути
    for (let i = commonLength; i < targetPathSegments.length; i++) {
      relativePathSegments.push(targetPathSegments[i]);
    }
    // Собираем относительный путь
    const relativePath = relativePathSegments.join('/') || '';
    return relativePath;
  }
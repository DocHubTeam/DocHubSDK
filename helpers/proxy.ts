export type DynamicProxyHandler = () => any;
/**
 * Проксирует обращения к динамическому объекту в режиме "только для чтения"
 * @param handler   - Функция, которая должна возвращать реальный объект источник
 * @returns 
 */
export function dynamicProxy(handler: DynamicProxyHandler) {
    const resolver = {
        get(target, prop, receiver) {
            const subject = handler();
            if (!subject) throw new Error('Proxy subject is empty');
            return handler()[prop];
        },
        set() {
            throw new Error('Changing the proxy object is prohibited!');
        }
      };
    return new Proxy({}, resolver);
}
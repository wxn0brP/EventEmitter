export type EventMap = {
    [event: string]: (...args: any[]) => void;
};
export type EventName<T extends EventMap> = keyof T | (string & {});
export type EventArgs<T extends EventMap, K extends EventName<T>> = K extends keyof T ? Parameters<T[K]> : any[];
export declare class VEE<T extends EventMap = {}> {
    _events: {
        [event: string]: Function[];
    };
    /**
     * Registers an event listener
     * @param {K} event - event name
     * @param {Function} listener - function to be called when event occurs
     */
    on<K extends EventName<T>>(event: K, listener: T[K]): void;
    /**
     * Registers a one-time event listener
     * @param {K} event - event name
     * @param {Function} listener - function to be called once
     */
    once<K extends EventName<T>>(event: K, listener: T[K]): void;
    /**
     * Removes an event listener.
     * @param {K} event - event name
     * @param {Function} listener - listener to remove
     */
    off<K extends EventName<T>>(event: K, listener: T[K]): void;
    _emit(event: string, ...args: any[]): void;
    /**
     * Emits an event
     * @param {K} event - event name
     * @param {...EventArgs<T, K>} args - arguments to be passed to listeners
     */
    emit<K extends EventName<T>>(event: K, ...args: EventArgs<T, K>): void;
    /**
     * Returns the number of listeners for the given event
     * @param {K} event - event name
     */
    listenerCount<K extends EventName<T>>(event: K): number;
}
export default VEE;
export { VEE as EventEmitter };

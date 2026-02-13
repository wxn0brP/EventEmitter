export type EventMap = {
    [event: string]: (...args: any[]) => void;
};

export type EventName<T extends EventMap> = keyof T | (string & {});

export type EventArgs<T extends EventMap, K extends EventName<T>> = K extends keyof T
    ? Parameters<T[K]>
    : any[];

export class VEE<T extends EventMap = {}> {
    public _events: { [event: string]: Function[] } = {};

    /**
     * Registers an event listener
     * @param {K} event - event name
     * @param {Function} listener - function to be called when event occurs
     */
    public on<K extends EventName<T>>(
        event: K,
        listener: T[K]
    ): void {
        const _event = event as string;
        if (!this._events[_event])
            this._events[_event] = [];
        this._events[_event].push(listener);
    }

    /**
     * Registers a one-time event listener
     * @param {K} event - event name
     * @param {Function} listener - function to be called once
     */
    public once<K extends EventName<T>>(
        event: K,
        listener: T[K]
    ): void {
        const onceListener: any = (...args: any[]) => {
            this.off(event, onceListener);
            listener(...args);
        };
        this.on(event, onceListener);
    }

    /**
     * Removes an event listener.
     * @param {K} event - event name
     * @param {Function} listener - listener to remove
     */
    public off<K extends EventName<T>>(
        event: K,
        listener: T[K]
    ): void {
        const _event = event as string;
        if (!this._events[_event]) return;
        this._events[_event] = this._events[_event].filter(l => l !== listener);
    }

    public _emit(event: string, ...args: any[]) {
        const listeners = this._events[event];
        if (!listeners?.length) return;
        listeners.forEach(listener => listener(...args));
    }

    /**
     * Emits an event
     * @param {K} event - event name
     * @param {...EventArgs<T, K>} args - arguments to be passed to listeners
     */
    public emit<K extends EventName<T>>(
        event: K,
        ...args: EventArgs<T, K>
    ): void {
        this._emit(event as string, ...args);
        this._emit("*", event as string, ...args);
    }

    /**
     * Returns the number of listeners for the given event
     * @param {K} event - event name
     */
    public listenerCount<K extends EventName<T>>(event: K): number {
        return this._events[event as string]?.length || 0;
    }
}

export default VEE;
export {
    VEE as EventEmitter
}

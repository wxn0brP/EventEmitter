export class EventEmitter {
    public _events: { [event: string]: Function[] } = {};

    /**
     * Registers an event listener
     * @param {string} event - event name
     * @param {Function} listener - function to be called when event occurs
     */
    public on(event: string, listener: Function): void {
        if (!this._events[event]) 
            this._events[event] = [];
        this._events[event].push(listener);
    }

    /**
     * Registers a one-time event listener
     * @param {string} event - event name
     * @param {Function} listener - function to be called once
     */
    public once(event: string, listener: Function): void {
        const onceListener = (...args: any[]) => {
            this.off(event, onceListener);
            listener(...args);
        };
        this.on(event, onceListener);
    }

    /**
     * Removes an event listener.
     * @param {string} event - event name
     * @param {Function} listener - listener to remove
     */
    public off(event: string, listener: Function): void {
        if (!this._events[event]) return
        this._events[event] = this._events[event].filter(l => l !== listener);
    }

    /**
     * Emits an event
     * @param {string} event - event name
     * @param {...any} args - arguments to be passed to listeners
     */
    public emit(event: string, ...args: any[]): void {
        const listeners = this._events[event];
        if (listeners && listeners.length > 0) {
            listeners.forEach(listener => {
                listener(...args);
            });
        }
    }

    /**
     * Returns the number of listeners for the given event
     * @param {string} event - event name
     */
    public listenerCount(event: string): number {
        return this._events[event]?.length || 0;
    }
}

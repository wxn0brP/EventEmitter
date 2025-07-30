export class EventEmitter {
    _events = {};
    /**
     * Registers an event listener
     * @param {string} event - event name
     * @param {Function} listener - function to be called when event occurs
     */
    on(event, listener) {
        if (!this._events[event])
            this._events[event] = [];
        this._events[event].push(listener);
    }
    /**
     * Registers a one-time event listener
     * @param {string} event - event name
     * @param {Function} listener - function to be called once
     */
    once(event, listener) {
        const onceListener = (...args) => {
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
    off(event, listener) {
        if (!this._events[event])
            return;
        this._events[event] = this._events[event].filter(l => l !== listener);
    }
    /**
     * Emits an event
     * @param {string} event - event name
     * @param {...any} args - arguments to be passed to listeners
     */
    emit(event, ...args) {
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
    listenerCount(event) {
        return this._events[event]?.length || 0;
    }
}

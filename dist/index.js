export class VEE {
    _events = {};
    /**
     * Registers an event listener
     * @param {K} event - event name
     * @param {Function} listener - function to be called when event occurs
     */
    on(event, listener) {
        const _event = event;
        if (!this._events[_event])
            this._events[_event] = [];
        this._events[_event].push(listener);
        return () => this.off(event, listener);
    }
    /**
     * Registers a one-time event listener
     * @param {K} event - event name
     * @param {Function} listener - function to be called once
     */
    once(event, listener) {
        const onceListener = (...args) => {
            this.off(event, onceListener);
            listener(...args);
        };
        return this.on(event, onceListener);
    }
    /**
     * Removes an event listener.
     * @param {K} event - event name
     * @param {Function} listener - listener to remove
     */
    off(event, listener) {
        const _event = event;
        if (!this._events[_event])
            return this;
        this._events[_event] = this._events[_event].filter(l => l !== listener);
        return this;
    }
    _emit(event, ...args) {
        const listeners = this._events[event];
        if (listeners?.length)
            listeners.forEach(listener => listener(...args));
        for (const pattern in this._events) {
            if (pattern === event)
                continue;
            if (pattern.includes("*") && this._matchPattern(pattern, event)) {
                this._events[pattern].forEach(listener => listener(event, ...args));
            }
        }
        return this;
    }
    _matchPattern(pattern, event) {
        if (pattern === "*")
            return true;
        const regex = new RegExp("^" + pattern.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$");
        return regex.test(event);
    }
    /**
     * Emits an event
     * @param {K} event - event name
     * @param {...EventArgs<T, K>} args - arguments to be passed to listeners
     */
    emit(event, ...args) {
        this._emit(event, ...args);
        return this;
    }
    /**
     * Returns the number of listeners for the given event
     * @param {K} event - event name
     */
    listenerCount(event) {
        return this._events[event]?.length || 0;
    }
}
export default VEE;
export { VEE as EventEmitter };

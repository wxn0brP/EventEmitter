export class VEE {
    _events = Object.create(null);
    _bucket(event) {
        return Object.hasOwn(this._events, event) ? this._events[event] : undefined;
    }
    /**
     * Registers an event listener
     * @param {K} event - event name
     * @param {Function} listener - function to be called when event occurs
     */
    on(event, listener) {
        const _event = event;
        const bucket = this._bucket(_event) ?? (this._events[_event] = []);
        bucket.push(listener);
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
        const bucket = this._bucket(_event);
        if (!bucket)
            return this;
        this._events[_event] = bucket.filter(l => l !== listener);
        return this;
    }
    _emit(event, ...args) {
        const listeners = this._bucket(event);
        if (listeners?.length)
            listeners.forEach(listener => listener(...args));
        for (const pattern of Object.keys(this._events)) {
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
        return this._bucket(event)?.length || 0;
    }
}
export default VEE;
export { VEE as EventEmitter };

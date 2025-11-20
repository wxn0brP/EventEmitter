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
        this.on(event, onceListener);
    }
    /**
     * Removes an event listener.
     * @param {K} event - event name
     * @param {Function} listener - listener to remove
     */
    off(event, listener) {
        const _event = event;
        if (!this._events[_event])
            return;
        this._events[_event] = this._events[_event].filter(l => l !== listener);
    }
    /**
     * Emits an event
     * @param {K} event - event name
     * @param {...EventArgs<T, K>} args - arguments to be passed to listeners
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
     * @param {K} event - event name
     */
    listenerCount(event) {
        return this._events[event]?.length || 0;
    }
}
export default VEE;
export { VEE as EventEmitter };

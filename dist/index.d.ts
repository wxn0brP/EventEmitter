export declare class VEE {
    _events: {
        [event: string]: Function[];
    };
    /**
     * Registers an event listener
     * @param {string} event - event name
     * @param {Function} listener - function to be called when event occurs
     */
    on(event: string, listener: Function): void;
    /**
     * Registers a one-time event listener
     * @param {string} event - event name
     * @param {Function} listener - function to be called once
     */
    once(event: string, listener: Function): void;
    /**
     * Removes an event listener.
     * @param {string} event - event name
     * @param {Function} listener - listener to remove
     */
    off(event: string, listener: Function): void;
    /**
     * Emits an event
     * @param {string} event - event name
     * @param {...any} args - arguments to be passed to listeners
     */
    emit(event: string, ...args: any[]): void;
    /**
     * Returns the number of listeners for the given event
     * @param {string} event - event name
     */
    listenerCount(event: string): number;
}
export default VEE;
export { VEE as EventEmitter };

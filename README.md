# @wxn0brp/event-emitter

A simple event emitter.

## Installation

```bash
npm install @wxn0brp/event-emitter
```

## Usage

```typescript
import { EventEmitter } from '@wxn0brp/event-emitter';

const emitter = new EventEmitter();

emitter.on('hello', (name) => {
  console.log(`Hello, ${name}!`);
});

emitter.emit('hello', 'world');
```

## API

### `on(event: string, listener: Function): void`

Registers an event listener.

### `once(event: string, listener: Function): void`

Registers a one-time event listener.

### `off(event: string, listener: Function): void`

Removes an event listener.

### `emit(event: string, ...args: any[]): void`

Emits an event.

### `listenerCount(event: string): number`

Returns the number of listeners for the given event.

## License

This project is licensed under the MIT License.

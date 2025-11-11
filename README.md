# @wxn0brp/event-emitter

A simple event emitter with optional TypeScript support.

## Installation

```bash
npm install @wxn0brp/event-emitter
```

## Usage

### Basic Usage (without types)

```typescript
import { EventEmitter } from '@wxn0brp/event-emitter';

const emitter = new EventEmitter();

emitter.on('hello', (name) => {
  console.log(`Hello, ${name}!`);
});

emitter.emit('hello', 'world');
```

### Type-Safe Usage (optional)

```typescript
import { EventEmitter } from '@wxn0brp/event-emitter';

// Define event types (optional - just for developer convenience)
type MyEvents = {
  hello: (name: string) => void;
  data: (value: number, timestamp: Date) => void;
  error: (message: string, code: number) => void;
};

// Create emitter with optional type hints
const emitter = new EventEmitter<MyEvents>();

// The types provide helpful hints during development
emitter.on('hello', (name) => {
  console.log(`Hello, ${name}!`); // 'name' is suggested as string
});

emitter.on('data', (value, timestamp) => {
  console.log(`Value: ${value} at ${timestamp}`); // 'value' and 'timestamp' have type hints
});

// Emit events with type hints
emitter.emit('hello', 'world'); // Typescript suggests string parameter
emitter.emit('data', 42, new Date()); // Typescript suggests number and Date parameters

// You can still emit events without strict type checking
emitter.emit('unknown_event', 'any', 'data'); // This is still allowed at runtime
```

## API

### `EventEmitter<T = {}>`

Generic event emitter class where `T` is an optional event map type for developer convenience. The type parameter is completely optional and provides type hints during development.

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

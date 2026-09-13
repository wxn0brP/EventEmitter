import { describe, test, expect } from "bun:test";
import { VEE } from "../src/index";

describe("basic functionality", () => {
	test("on - registers and calls listener", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("test", (data: string) => results.push(data));
		emitter.emit("test", "hello");
		expect(results).toEqual([
			"hello",
		]);
	});

	test("once - calls listener only once", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.once("test", (data: string) => results.push(data));
		emitter.emit("test", "first");
		emitter.emit("test", "second");
		expect(results).toEqual([
			"first",
		]);
	});

	test("off - removes listener", () => {
		const emitter = new VEE();
		const results: any[] = [];
		const listener = (data: string) => results.push(data);
		emitter.on("test", listener);
		emitter.emit("test", "first");
		emitter.off("test", listener);
		emitter.emit("test", "second");
		expect(results).toEqual([
			"first",
		]);
	});

	test("emit - passes multiple arguments", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("test", (a: number, b: string, c: boolean) => {
			results.push([
				a,
				b,
				c,
			]);
		});
		emitter.emit("test", 1, "two", true);
		expect(results).toEqual([
			[
				1,
				"two",
				true,
			],
		]);
	});

	test("listenerCount - returns correct count", () => {
		const emitter = new VEE();
		expect(emitter.listenerCount("test")).toBe(0);
		emitter.on("test", () => {});
		expect(emitter.listenerCount("test")).toBe(1);
		emitter.on("test", () => {});
		expect(emitter.listenerCount("test")).toBe(2);
	});

	test("chaining - emit and off return this", () => {
		const emitter = new VEE();
		const result = emitter.emit("test").off("test", () => {});
		expect(result).toBe(emitter);
	});

	test("on returns unsubscribe function", () => {
		const emitter = new VEE();
		const results: any[] = [];
		const unsub = emitter.on("test", (data: string) => results.push(data));
		emitter.emit("test", "first");
		unsub();
		emitter.emit("test", "second");
		expect(results).toEqual([
			"first",
		]);
	});

	test("event without listeners", () => {
		const emitter = new VEE();
		expect(() => emitter.emit("nonexistent")).not.toThrow();
	});
});

describe("wildcard functionality", () => {
	test("* - matches all events", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("*", (event: string, ...args: any[]) => {
			results.push([
				event,
				...args,
			]);
		});
		emitter.emit("user.created", "john");
		emitter.emit("post.deleted", 123);
		expect(results).toEqual([
			[
				"user.created",
				"john",
			],
			[
				"post.deleted",
				123,
			],
		]);
	});

	test("prefix.* - matches events with prefix", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("user.*", (event: string, ...args: any[]) => {
			results.push([
				event,
				...args,
			]);
		});
		emitter.emit("user.created", "john");
		emitter.emit("user.deleted", "jane");
		emitter.emit("post.created", "hello");
		expect(results).toEqual([
			[
				"user.created",
				"john",
			],
			[
				"user.deleted",
				"jane",
			],
		]);
	});

	test("*.suffix - matches events with suffix", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("*.created", (event: string, ...args: any[]) => {
			results.push([
				event,
				...args,
			]);
		});
		emitter.emit("user.created", "john");
		emitter.emit("post.created", "hello");
		emitter.emit("user.deleted", "jane");
		expect(results).toEqual([
			[
				"user.created",
				"john",
			],
			[
				"post.created",
				"hello",
			],
		]);
	});

	test("prefix.*.suffix - matches events with wildcard in middle", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("user.*.action", (event: string, ...args: any[]) => {
			results.push([
				event,
				...args,
			]);
		});
		emitter.emit("user.login.action", "john");
		emitter.emit("user.logout.action", "jane");
		emitter.emit("user.created", "bob");
		expect(results).toEqual([
			[
				"user.login.action",
				"john",
			],
			[
				"user.logout.action",
				"jane",
			],
		]);
	});

	test("multiple wildcard patterns", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("user.*", (event: string) => results.push(`user: ${event}`));
		emitter.on("*.created", (event: string) =>
			results.push(`created: ${event}`),
		);
		emitter.emit("user.created", "john");
		expect(results).toEqual([
			"user: user.created",
			"created: user.created",
		]);
	});

	test("wildcard with dots in event names", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("api.v1.*", (event: string, ...args: any[]) => {
			results.push([
				event,
				...args,
			]);
		});
		emitter.emit("api.v1.users", "data");
		emitter.emit("api.v2.users", "data");
		expect(results).toEqual([
			[
				"api.v1.users",
				"data",
			],
		]);
	});

	test("no match for pattern", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("user.*", (event: string) => results.push(event));
		emitter.emit("post.created");
		expect(results).toEqual([]);
	});
});

describe("argument behavior", () => {
	test("exact match - receives only args", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("user.created", (name: string, age: number) => {
			results.push([
				name,
				age,
			]);
		});
		emitter.emit("user.created", "john", 30);
		expect(results).toEqual([
			[
				"john",
				30,
			],
		]);
	});

	test("wildcard - receives event name and args", () => {
		const emitter = new VEE();
		const results: any[] = [];
		emitter.on("user.*", (event: string, name: string, age: number) => {
			results.push([
				event,
				name,
				age,
			]);
		});
		emitter.emit("user.created", "john", 30);
		expect(results).toEqual([
			[
				"user.created",
				"john",
				30,
			],
		]);
	});
});
